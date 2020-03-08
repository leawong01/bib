import React from 'react';
import './App.css';
import Restaurant from './Restaurants/Restaurants'
import logo from './img/bibxmaitres.png'


class App extends React.Component {

  

  render() {
    // Tells React what HTML code to render
    return (
      <div class="container">
        <div class="header">
        <div class="logo-container">
            <img class="logo" src={logo} alt="logo"/>
          </div>
          <h1>Bib x Maitre Restaurateur</h1> 
          
        </div>

        <div><Restaurant /></div>
      </div>
    )}
}


export default App;
