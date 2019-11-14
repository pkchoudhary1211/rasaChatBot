import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Link } from "react-router-dom";
import ChatBot from './chatBot.js'
class App extends React.Component {
  render(){
    return (
      <div className="">
        <header className="">
        <BrowserRouter>
          <switch>
            <Route path="/chat" component={ChatBot}/>
          </switch>
        </BrowserRouter>
        </header>
      </div>
    );
  }    
}


export default App;
