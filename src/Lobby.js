import React, { Component } from 'react';
import { Button, Col, Container, Input, InputGroup, InputGroupAddon, ListGroup, ListGroupItem, Row } from 'reactstrap';

const styles = {
    containerStyle: {
        marginTop: '5vh'
    },
    inputGroupStyle: {
    },
    readyStyle: {
        marginTop: 15,
        marginRight: 5,
        marginLeft: 5
    },
    listGroupItemStyle: {
    }
}

class Lobby extends Component {
    checkBox = (e) => {
        if (e.target.id === this.props.id) {
            this.props.toggleReady();
        }
    }
    renderPlayers = () => {
        let playerElements = [];
        if (this.props.players) {
            for (let i = 0; i < this.props.players.length; i++) {
                playerElements.push(
                    <Row key={this.props.players[i].id}>
                        <Col xs="4">
                            <InputGroup style={styles.inputGroupStyle} size="lg">
                                <InputGroupAddon addonType="prepend">
                                    <Input addon type="checkbox" style={styles.readyStyle} checked={this.props.players[i].ready} id={this.props.players[i].id} onChange={this.checkBox}/>
                                </InputGroupAddon>
                                <InputGroupAddon addonType="append">
                                    Ready?
                            </InputGroupAddon>
                            </InputGroup>
                        </Col>
                        <Col xs="8">
                            <ListGroupItem key={i} style={styles.listGroupItemStyle}>
                                {this.props.players[i].name}
                            </ListGroupItem>
                        </Col>
                    </Row>
                );
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
                <h2 style={styles.headingStyle}>{this.props.starting ? "Game starting in:" : "Waiting for players..."}</h2>
                {this.props.starting ? this.props.seconds : ("Game Key: " + this.props.gameKey)}
                {this.renderPlayers()}
            </Container>
        );
    }
}

export default Lobby;