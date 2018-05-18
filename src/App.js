import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Start from './Start';
import Lobby from './Lobby';
import Game from './Game';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'game',
      id: '',
      name: '',
      gameKey: '',
      players: [],
      invalidKey: false,
      ableToJoin: false,
      seconds: 6,
      currentDrawing: ''
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
    if (error.toString() === "invalid key") {
      this.setState({
        invalidKey: true
      })
    }
  }
  createLobby = (name) => {
    //listen for players joining, and errors
    console.log("creating a lobby...");
    socket.on('selfJoin', this.selfJoin); //called when you successfully join
    socket.on('err', this.handleError);
    socket.emit('create', name);    //send call to server to create room
  }

  joinLobby = (name, key) => { //call this function when a user clicks the "join game" button
    console.log("attempting to join lobby " + key);
    //listen for players joining, and errors
    socket.on('selfJoin', this.selfJoin); //called when you successfully join
    socket.on('err', this.handleError);
    socket.emit('join', name, key); //send call to server to join room    
  }
  selfJoin = (clientID, name, key, playerArray) => {  //called when the client themselves joins a room
    this.setState({
      id: clientID,
      name: name,
      gameKey: key,
      players: playerArray,
      invalidKey: false,
      ableToJoin: true,
      starting: false
    })
    console.log("You, " + name + " have joined room " + key);
    socket.on('join', this.handleJoin);  //listen for other people joining
    socket.on('leave', this.handleLeave); //listen for other people leaving
    socket.on('ready', this.handleReady); //listen for other people readying
    socket.on('start', this.startTimer);
    socket.on('draw', this.handleReceiveDrawing); //listen for other people drawing
  }
  handleJoin = (name, key, playerArray) => {    //called when anyone successfully joins your current room
    //onPlayerJoin - update react stuff so a player "visually" joins    
    console.log(name + " has joined room " + key);
    this.setState({
      players: playerArray
    })
  }
  selfLeave = () => {
    socket.emit('leave', this.state.id, this.state.name, this.state.gameKey);    
  }
  handleLeave = (name, key, playerArray) => {
    console.log(name + " has left room " + key);
    this.setState({
      players: playerArray
    })
  }
  toggleReady = () => {
    socket.emit('ready', this.state.id, this.state.name, this.state.gameKey);
  }
  handleReady = (playerArray) => {
    this.setState({
      players: playerArray
    })
  }
  startTimer = () => {    
    let interval = window.setInterval(() => {
      this.setState({
        seconds: this.state.seconds - 1,
        starting: true
      })
    }, 1000);
    window.setTimeout(() => {
      clearInterval(interval);
      this.setState({
        view: 'game'
      }) 
    }, 6000);
  }
  startLobby = () => {
    this.setState({
      view: 'lobby'
    })
  }
  updateDrawing = (drawing) => {    
    this.setState({
      currentDrawing: drawing
    }, () => {      
      socket.emit('draw', this.state.currentDrawing, this.state.gameKey);
    })
  }
  handleReceiveDrawing = (drawing) => {
    this.setState({
      currentDrawing: drawing
    });
  }
  renderView = () => {
    if (this.state.view === 'start') {
      return (<Start view={this.startLobby} invalidKey={this.state.invalidKey} ableToJoin={this.state.ableToJoin} createLobby={this.createLobby} joinLobby={this.joinLobby} />);
    }
    if (this.state.view === 'lobby') {
      return (<Lobby players={this.state.players} toggleReady={this.toggleReady} id={this.state.id} gameKey={this.state.gameKey} seconds={this.state.seconds} starting={this.state.starting}/>)
    }
    if (this.state.view === 'game') {
      return (<Game players={this.state.players} drawing={this.state.name === 'oscar'} updateDrawing={this.updateDrawing} currentDrawing={this.state.currentDrawing} />); //toDo:update this based on who's drawing
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Doodl</h1>
        </header>
        <div className="view-container">
          {this.renderView()}
        </div>        
      </div>
    );
  }
}

export default App;
