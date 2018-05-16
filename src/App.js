import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Start from './Start';
import Lobby from './Lobby';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'start',
      id: '',
      name: '',
      gameKey: '',
      players: []
    }
  }
  componentDidMount() {
    window.addEventListener("beforeunload", this.selfLeave);
  }
  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.selfLeave);
  }
  handleError = (error) => {
    console.log("whoa, an error! error: " + error);
  }
  createLobby = (name) => {
    //listen for players joining, and errors
    console.log("creating a lobby...");
    socket.on('selfJoin', this.selfJoin);
    socket.on('err', this.handleError);
    socket.emit('create', name);    //send call to server to create room
  }

  joinLobby = (name, key) => { //call this function when a user clicks the "join game" button
    console.log("attempting to join lobby " + key);
    //listen for players joining, and errors
    socket.on('selfJoin', this.selfJoin);
    socket.on('err', this.handleError);
    socket.emit('join', name, key); //send call to server to join room    
  }

  selfJoin = (clientID, name, key, playerNames) => {  //called when the client themselves joins a room
    this.setState({
      id: clientID,
      name: name,
      gameKey: key,
      players: playerNames
    })
    console.log("You, " + name + " have joined room " + key);
    socket.on('join', this.handleJoin);  //listen for other people joining
    socket.on('leave', this.handleLeave); //listen for other people leaving
  }

  handleJoin = (name, key, playerNames) => {    //called when anyone successfully joins your current room
    //onPlayerJoin - update react stuff so a player "visually" joins    
    console.log(name + " has joined room " + key);
    this.setState({
      players: playerNames
    })
  }

  selfLeave = () => {
    socket.emit('leave', this.state.id, this.state.name, this.state.gameKey);    
  }

  handleLeave = (name, key, playerNames) => {
    console.log(name + " has left room " + key);
    this.setState({
      players: playerNames
    })
  }
  startLobby = () => {
    this.setState({
      view: 'lobby'
    })
  }
  renderView = () => {
    if (this.state.view === 'start') {
      return (<Start view={this.startLobby} createLobby={this.createLobby} joinLobby={this.joinLobby} />);
    }
    if (this.state.view === 'lobby') {
      return (<Lobby players={this.state.players} />)
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Doodl</h1>
        </header>
        {this.renderView()}
      </div>
    );
  }
}

export default App;
