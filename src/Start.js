import React, { Component } from 'react';
import { createLobby, joinLobby } from './api';
import { Button, Col, Container, Input, InputGroup, Row } from 'reactstrap';
const styles = {
    containerStyle: {
        marginTop: '10vh'
    },
    inputStyle: {
        marginTop: 5,
        marginBottom: 5
    }
}

class Start extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            name: '',
            invalidName: false
        }
    }    
    handleNameChange = (e) => {
        if (this.state.name !== '') {
            this.setState({
                invalidName: false
            })
        }
        this.setState({
            name: e.target.value
        });
    }
    handleChange = (e) => {
        this.setState({
            input: e.target.value
        });
    }
    createGame = () => {
        if (this.state.name === '') {
            this.setState({
                invalidName: true
            })
        } else {
            createLobby(this.state.name);
            this.props.view();
        }
    }
    joinGame = () => {
        joinLobby(this.state.name, this.state.input);
        this.props.view();
    }
    render() {
        return (
            <Container className="container" style={styles.containerStyle}>                
                <Input onChange={this.handleNameChange} invalid={this.state.invalidName} placeholder="Enter a Name" style={styles.inputStyle} />
                <Button id="create" onClick={this.createGame} color="primary" style={styles.inputStyle} block>Create New Private Game</Button>
                <Row>
                    <InputGroup>
                        <Col xs="12" sm="6"><Input onSubmit={this.joinGame} onChange={this.handleChange} placeholder="Enter a Game Key" style={styles.inputStyle} /></Col>
                        <Col xs="12" sm="6"><Button onClick={this.joinGame} color="secondary" style={styles.inputStyle} block>Join a Game</Button></Col>                     
                    </InputGroup>
                </Row>
            </Container>
        );
    }
}

export default Start;