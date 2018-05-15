import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {createLobby, joinLobby} from './api';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ''
    }
  }
  createGame = () => {
    createLobby("user1");
  }
  handleChange = (e) => {
    this.setState({
      input: e.target.value
    });
  }
  joinGame = () => {
    joinLobby("user1", this.state.input);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Doodl</h1>
        </header>
        <p className="App-intro">
          <button id="create" onClick={this.createGame}>Create New Private Game</button>
          <input onSubmit={this.joinGame} onChange={this.handleChange} placeholder="Join a Game"/>
          <button onClick={this.joinGame}>join!</button>
        </p>
      </div>
    );
  }
}

export default App;
