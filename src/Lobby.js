import React, { Component } from 'react';
import { Button, Col, Container, Input, InputGroup, ListGroup, ListGroupItem, Row } from 'reactstrap';

const styles = {
    containerStyle: {
        marginTop: '5vh'
    }
}

class Lobby extends Component {
    constructor(props) {
        super(props);
    }
    renderPlayers = () => {
        let playerElements = [];
        if (this.props.players) {
            for (let i = 0; i < this.props.players.length; i++) {
                playerElements.push(<ListGroupItem key={i}>{this.props.players[i]}</ListGroupItem>);
            }
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