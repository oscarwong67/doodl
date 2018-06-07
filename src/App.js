import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Start from './Start';
import Lobby from './Lobby';
import Game from './Game';
import openSocket from 'socket.io-client';
const socket = openSocket('localhost:8000'); //https://doodl.herokuapp.com

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'start',
      host: true,
      drawing: false,
      id: '',
      name: '',
      gameKey: '',
      players: [],
      rounds: 2,
      invalidKey: false,
      ableToJoin: false,
      seconds: 5,
      currentDrawing: '',
      roundLength: 80000,
      timeLeft: 80,
      currentRound: 0,
      enabled: true,
      word: '',
      messages: [],
      guessed: false
    }
  }
  componentDidMount() {
    window.addEventListener("beforeunload", this.selfLeave);
  }
  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.selfLeave);
    (function (w) { w = w || window; var i = w.setInterval(function () { }, 100000); while (i >= 0) { w.clearInterval(i--); } })(/*window*/); //clear all intervals
    socket.removeAllListeners();
  }
  handleError = (error) => {
    console.log("whoa, an error! error: " + error);
    if (error.toString() === "invalid key" || error.toString() === "full game" || error.toString === "game in progress") { //temporarily give the same error for both
      this.setState({
        invalidKey: true
      })
    }
  }
  createLobby = (name, rounds) => {
    this.setState({
      rounds: rounds,
    })
    //listen for players joining, and errors
    console.log("creating a lobby...");
    socket.on('selfJoin', this.selfJoin); //called when you successfully join
    socket.on('err', this.handleError);
    socket.emit('create', name, rounds);    //send call to server to create room
  }

  joinLobby = (name, key) => { //call this function when a user clicks the "join game" button
    console.log("attempting to join lobby " + key);
    //listen for players joining, and errors
    socket.on('selfJoin', this.selfJoin); //called when you successfully join
    socket.on('err', this.handleError);
    socket.emit('join', name, key); //send call to server to join room    
  }
  selfJoin = (clientID, name, key, playerArray, rounds, host, drawing) => {  //called when the client themselves joins a room
    this.setState({
      host: host,
      drawing: drawing,
      id: clientID,
      name: name,
      gameKey: key,
      players: playerArray,
      invalidKey: false,
      ableToJoin: true,
      starting: false,
      rounds: rounds
    }, () => {

    })
    console.log("You, " + name + " have joined room " + key);
    socket.on('join', this.handleJoin);  //listen for other people joining
    socket.on('leave', this.handleLeave); //listen for other people leaving
    socket.on('ready', this.handleReady); //listen for other people readying
    socket.on('start', this.startTimer);
    socket.on('draw', this.handleReceiveDrawing); //listen for other people drawing

    socket.on('startRound', this.startRound);
    socket.on('endGame', this.endGame);
    socket.on('startPlayer', this.startPlayer);
    socket.on('interval', this.receiveInterval);
    socket.on('receiveMessage', this.receiveMessage);
    socket.on('serverMessage', this.handleServerMessage);
    socket.on('guessed', this.handleGuessed);
  }
  handleJoin = (name, key, playerArray) => {    //called when anyone successfully joins your current room
    //onPlayerJoin - update react stuff so a player "visually" joins    
    console.log(name + " has joined room " + key);
    this.setState({
      players: playerArray
    });
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
  startLobby = () => {
    this.setState({
      view: 'lobby'
    })
  }
  startTimer = () => {
    this.setState({
      starting: true
    });
    let interval = window.setInterval(() => {
      this.setState({
        seconds: this.state.seconds - 1,
      });
    }, 1000);
    window.setTimeout(() => {
      clearInterval(interval);
      this.setState({
        view: 'game'
      });
      this.startGame();
    }, 5000);
  }
  startGame = () => {
    if (this.state.host) {
      socket.emit('startGame', this.state.gameKey);
    }
  }
  startRound = (round) => {
    console.log("starting round " + round);
    this.setState({
      currentRound: round
    })
    if (this.state.host) {      
      socket.emit('startRound', round, this.state.gameKey);
    }
  }
  startPlayer = (i, playerArray, word) => {
    console.log("currently starting player " + i + "'s turn");
    let index = this.state.players.map((player) => {
      return player.name;
    }).indexOf(this.state.name);

    this.setState({
      players: playerArray,
      drawing: playerArray[index].drawing,
      timeLeft: 80,
      enabled: true,
      word: word,
      guessed: false
    });
    socket.on('skip', () => {
      this.setState({
        timeLeft: 0,
        enabled: false
      });    
    });

  }
  receiveInterval = (serverTimeLeft) => {
    this.setState({
      timeLeft: serverTimeLeft - 5,
    }, () => {
      if (serverTimeLeft <= 5) {
        this.setState({
          enabled: false
        });
      }
    });
  }
  endGame = () => {
    console.log("game over");
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
  sendMessage = (message) => {
    if (! this.state.guessed) {
      console.log(message);
      socket.emit('message', message, this.state.gameKey, this.state.timeLeft, this.state.id);
    }
  }
  receiveMessage = (message, sender) => {
    let messageObj = {
      message: message,
      sender: sender
    }
    this.setState({
      messages: [...this.state.messages, messageObj]
    })
  }
  handleServerMessage = (guesser, playerArray) => {
    this.setState({
      players: playerArray
    }, () => {

    })
    let message = guesser + " has guessed the word!";
    this.receiveMessage(message, "Server");
  }
  handleGuessed = () => {
    this.setState({
      guessed: true
    })
  }
  renderView = () => {
    if (this.state.view === 'start') {
      return (<Start view={this.startLobby} invalidKey={this.state.invalidKey} ableToJoin={this.state.ableToJoin} createLobby={this.createLobby} joinLobby={this.joinLobby} />);
    }
    if (this.state.view === 'lobby') {
      return (<Lobby players={this.state.players} toggleReady={this.toggleReady} id={this.state.id} gameKey={this.state.gameKey} rounds={this.state.rounds} seconds={this.state.seconds} starting={this.state.starting} />)
    }
    if (this.state.view === 'game') {
      return (<Game players={this.state.players} messages={this.state.messages} sendGuess={this.sendMessage} word={this.state.word} enabled={this.state.enabled} timeLeft={this.state.timeLeft} rounds={this.state.rounds} currentRound={this.state.currentRound} drawing={this.state.drawing} updateDrawing={this.updateDrawing} currentDrawing={this.state.currentDrawing} />); //toDo:update this based on who's drawing
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
