import React, { Component } from 'react';
import { Button, Col, Container, Input, InputGroup, ListGroup, ListGroupItem, Row } from 'reactstrap';
import { handleJoin } from './api';

const styles = {
    containerStyle: {
        marginTop: '5vh'
    }
}

class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: []
        }
    }
    componentDidMount() {
    }
    renderPlayers = () => {
        let playerElements = [];
        for (let i = 0; i < this.state.players.length; i++) {
            playerElements.push("<ListGroupItem key='" + i + "'>" + this.state.players[i] + "</ListGroupItem>");
        }
        return (
            <ListGroup>
                {playerElements}
            </ListGroup>
        );
    }
    render() {
        return (
            <Container style={styles.containerStyle}>
                <h2 style={styles.headingStyle}>Waiting for players...</h2>
                {this.renderPlayers()}
            </Container>
        );
    }
}

export default Lobby;