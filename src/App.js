import { useState, useEffect } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import img from './img.png'
import React from 'react';

const initialState = {
  a:1,
  b:0.1,
  c:1.5,
  d:0.075,
  x0:10,
  y0: 5,
  Tlim:10,
  ndt : 100,
  niter: 10,
  epsilon: 0.1,
  sol: 1,
  isRunning: false,
  t:0,
  X:[],
  Y:[],
};

function App() {
  const [state, setState] = useState(initialState);
  
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setState(values => ({...values, [name]: parseFloat(value)}))
  }

  const solve = ()=>{
    state.X[0] = state.x0
    state.Y[0] = state.y0
    let step = state.Tlim / state.ndt
    if (state.sol === 1){
      for (let i = 1; i < state.ndt; i++){
        state.X[i] = (state.X[i-1] + step*state.X[i-1]*(state.a - state.b*state.Y[i-1])) ;
        state.Y[i] = (state.Y[i-1] + step*state.Y[i-1]*(-state.c + state.d*state.X[i-1]));
      }
    } else if (state.sol === 2){
      for (let i = 1; i< state.ndt; i++){
        let xi = state.X[i-1];
        let yi = state.Y[i-1];
        for (let k=0; k < state.niter; k++){
          let xi_next = state.X[i-1] + step*xi*(state.a - state.b*yi);
          let yi_next = state.Y[i-1] + step*yi*(-state.c + state.d*xi);
          if (Math.sqrt(Math.pow(xi_next-xi,2)+Math.pow(yi_next-yi,2)) < state.epsilon){
            state.X[i] = xi_next;
            state.Y[i] = yi_next;
            break;
          }
          xi = xi_next;
          yi = yi_next;
        }
      }
    } else {
      for (let i = 1; i< state.ndt; i++){
        let xi = state.X[i-1];
        let yi = state.Y[i-1];
        for (let k=0; k < state.niter; k++){
          let xi_next = state.X[i-1] + 0.5*step*xi*(state.a - state.b*yi) + 0.5*step*state.X[i-1]*(state.a - state.b*state.Y[i-1]);
          let yi_next = state.Y[i-1] + 0.5*step*yi*(-state.c + state.d*xi) + 0.5*step*state.Y[i-1]*(-state.c + state.d*state.X[i-1]);
          if (Math.sqrt(Math.pow(xi_next-xi,2)+Math.pow(yi_next-yi,2)) < state.epsilon){
            state.X[i] = (xi_next);
            state.Y[i] = yi_next;
            break;
          }
          xi = xi_next;
          yi = yi_next;
        }
      }
    }
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    solve();
    console.log(state.X)
    console.log(state.Y)
    setState(values => ({...values, isRunning: ! state.isRunning}))
    setState(values => ({...values, t: 1}))
    
  }
  const xmax = Math.max.apply(null, state.X);
  const ymax = Math.max.apply(null, state.Y);

  useEffect(()=>{
    setTimeout(() => {
      if (state.t < state.ndt && state.isRunning ){
        setState(values => ({...values, t: state.t + 1}))
      }
    }, 300);
}, [state.t, state.ndt, state.isRunning, state.X])

  return (
    <section>
      <h1>Lotka-Volterra non linear system
        <span>
          <AiOutlineInfoCircle/>
          <div className="info"> 
          <p>The Lotka-Volterra equations, also known as the Lotka-Volterra predator-prey model, 
              are a pair of first-order nonlinear differential equations, frequently used to describe 
              the dynamics of biological systems in which two species interact, one as a predator and 
              the other as prey. The populations change through time according to the pair of equations:
          </p>
          <img src={img} alt="non linear system"/>
          <p>*This model was proposed independently by Alfred James Lotka in 1925 and Vito Volterra
          in 1926. </p>
          </div>
        </span>
      </h1>    
      <div className="cols">
        <div className="parameters">
          <article className="phase-portrait">
            <p>Phase Portrait</p>
            {
              state.isRunning ?               
              state.X.map((value,index)=>{
                if(index === state.t-1){
                  return <div className="point active" key={index} style={{left:Math.floor(value*250/xmax), bottom:Math.floor(state.Y[index]*240/ymax), "--height" : `${Math.floor((state.Y[index]*240/ymax)+3)}px`,"--width" : `${300-Math.floor(value*250/xmax)-4}px`}}></div>
                }else{
                  return <div className="point " key={index} style={{left:Math.floor(value*250/xmax), bottom:Math.floor(state.Y[index]*240/ymax)}}></div>
                }
                
              }) : <div></div>
            }          
          </article>

          <article>
            <p>Curves</p>
            {
              state.isRunning ?               
              state.X.map((value,index)=>{
                return (
                  <div key={index}>
                  <div className="point" style={{left:Math.floor((index+1)*250/state.ndt), bottom:Math.floor(value*240/xmax ), backgroundColor:'green'}}></div>
                  <div className="point"  style={{left:Math.floor((index+1)*250/state.ndt), bottom:Math.floor(state.Y[index]*240/xmax), backgroundColor:'red'}}></div> 
                  </div>

                )
              }): <div></div>
            } 
          </article>
        </div>
        <div className="environement">
          {state.isRunning ? <h4>Day {state.t} : {Math.ceil(state.X[state.t-1])} Preys & {Math.ceil(state.Y[state.t-1])} Predators</h4> : <h4>Run To Start Simulation</h4>}
          { 
          state.isRunning ?         
          [
            ...Array(state.X[state.t-1] >= 0 ? Math.ceil(state.X[state.t-1]) : 1),
          ].map((value, index) => (
            <div className="prey" key={index} style={{top:  Math.floor(Math.random()*500 + 90 ), left: Math.floor(Math.random()*590 + 5 )}}></div>
          )) : ""
          }
          {  
          state.isRunning ?        
          [
            ...Array(state.Y[state.t-1] >= 0 ? Math.ceil(state.Y[state.t-1]) : 1),
          ].map((value, index) => (
            <div className="predator" key={index} style={{top:Math.floor(Math.random()*500 + 90 ), left:Math.floor(Math.random()*590 + 5 )}}></div>
          )) : ""
          }

        </div>
        <div className="parameters">
          <div className="legend">
            <div className="prey-legend"> <p>A Prey</p></div>
            <div className="predator-legend"><p>A Predator</p></div>
          </div>
          <form onSubmit={handleSubmit}>
          <label>Initial Number Of Preys :
              <input 
                type="number" 
                name="x0" 
                value={state.x0 || ""} 
                onChange={handleChange}
              />
            </label><br></br>
            <label>Initial Number Of Predators :
              <input 
                type="number" 
                name="y0" 
                value={state.y0 || ""} 
                onChange={handleChange}
              />
            </label><br></br>
            <label>Reproduction Rate Of Preys :
              <input 
                type="number" 
                name="a" 
                value={state.a || ""} 
                onChange={handleChange}
              />
            </label><br></br>
              <label>Mortality Rate Of Preys :
                <input 
                  type="number" 
                  name="b" 
                  value={state.b || ""} 
                  onChange={handleChange}
                />
                </label><br></br>
                <label>Reproduction Rate Of Predators:
                <input 
                  type="number" 
                  name="c" 
                  value={state.c || ""} 
                  onChange={handleChange}
                />
                </label><br></br>
                <label>Mortality Rate Of Predators :
                <input 
                  type="number" 
                  name="d" 
                  value={state.d || ""} 
                  onChange={handleChange}
                />
                </label><br></br>
                <label>Number Of Days :
                  <input 
                    type="number" 
                    name="ndt" 
                    value={state.ndt || ""} 
                    onChange={handleChange}
                  />
                </label><br></br>
                <label> Solving Method :
                  <select name="sol" value={state.sol || ""} onChange={handleChange}>
                  <option value="1">Euler Explicite</option>
                  <option value="2">Euler Implicite</option>
                  <option value="3">Crank Nicolson</option>
                </select>
                </label><br></br>
                <button type="submit" value={state.isRunning ? "Restart" : "Run"} style={{color:"black", backgroundColor:`${state.isRunning?"yellow":"green"}`}}>{state.isRunning ? "Restart" : "Run"}</button>
          </form>

          <div className="histogram">
            <div className="bar">
              {state.isRunning? <p>{((state.X[state.t-1]/(state.X[state.t-1]+state.Y[state.t-1]))*100).toFixed(1)}% of population are preys </p> : <p>0% of population are preys </p>}
              <div className="prey-bar" style={{"--width" : `${ state.isRunning? Math.floor((state.X[state.t-1]/(state.X[state.t-1]+state.Y[state.t-1]))*100) : 0}px`,}}></div>              
            </div>
            <div className="bar">
              {state.isRunning ? <p>{((state.Y[state.t-1]/(state.X[state.t-1]+state.Y[state.t-1]))*100).toFixed(1)}% of population are predators </p> : <p>0% of population are predators </p>}
              <div className="predatore-bar" style={{"--width" : `${state.isRunning? Math.floor((state.Y[state.t-1]/(state.X[state.t-1]+state.Y[state.t-1]))*100) : 0}px `,}}></div>              
            </div>
          </div>

          <div className="evolution">
            <p>Number of preys : {state.isRunning ? Math.ceil(state.X[state.t-1]) : ""}</p>
            <p>Number of predators : {state.isRunning ? Math.ceil(state.Y[state.t-1]) : ""}</p>
            <p>Mortality rate of preys : {state.isRunning ?(state.a*state.Y[state.t-1] ).toFixed(1) : ""} </p>
            <p>Reproduction rate of predators : {state.isRunning ?(state.d*state.X[state.t-1]).toFixed(1) : ""} </p>
          </div>
        </div>

      </div>

    </section>


  );
}

export default App;
