import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Start from './Start';
import Lobby from './Lobby';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'start'
    }
  }
  startLobby = () => {
    this.setState({
      view: 'lobby'
    })
  }
  renderView = () => {
    if (this.state.view === 'start') {
      return (<Start view={this.startLobby} />);
    }
    if (this.state.view === 'lobby') {
      return (<Lobby />)
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
