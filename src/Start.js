import React, { Component } from 'react';
import { Button, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup, Row } from 'reactstrap';
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
            invalidName: false,
            dropdownOpen: false,
            dropDownValue: 'Rounds',
            rounds: 2
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.ableToJoin) {
            this.props.view();
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
            this.props.createLobby(this.state.name, this.state.rounds);
            this.props.view();
        }
    }
    joinGame = () => {
        if (this.state.name === '') {
            this.setState({
                invalidName: true
            })
        } else {
            this.props.joinLobby(this.state.name, this.state.input);
            if (this.props.ableToJoin) {
                this.props.view();
            }
        }
    }
    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }
    setRounds = (e) => {    //this gets passed to createLobby but not joinLobby, so only the "host" gets to decide
        this.setState({
            rounds: e.target.value,
            dropDownValue: e.target.value + ' rounds'
        });
    }
    render() {
        return (
            <Container className="container" style={styles.containerStyle}>
                <Input onChange={this.handleNameChange} invalid={this.state.invalidName} placeholder="Enter a Name" style={styles.inputStyle} />
                <Row>
                    <Col xs="10"><Button id="create" onClick={this.createGame} color="primary" style={styles.inputStyle} block>Create New Private Game</Button></Col>
                    <Col xs="2">
                        <Dropdown style={{ paddingTop: '0.5vh', marginLeft: -2.5 }} isOpen={this.state.dropdownOpen} toggle={this.toggle} setActiveFromChild={true}>
                            <DropdownToggle caret>
                                {this.state.dropDownValue}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem value={2} onClick={this.setRounds}>2</DropdownItem>
                                <DropdownItem value={3} onClick={this.setRounds}>3</DropdownItem>
                                <DropdownItem value={4} onClick={this.setRounds}>4</DropdownItem>
                                <DropdownItem value={5} onClick={this.setRounds}>5</DropdownItem>
                                <DropdownItem value={6} onClick={this.setRounds}>6</DropdownItem>
                                <DropdownItem value={7} onClick={this.setRounds}>7</DropdownItem>
                                <DropdownItem value={8} onClick={this.setRounds}>8</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                </Row>
                <Row>
                    <InputGroup>
                        <Col xs="12" sm="6"><Input onSubmit={this.joinGame} invalid={this.props.invalidKey} onChange={this.handleChange} placeholder="Enter a Game Key" style={styles.inputStyle} /></Col>
                        <Col xs="12" sm="6"><Button onClick={this.joinGame} color="secondary" style={styles.inputStyle} block>Join a Game</Button></Col>
                    </InputGroup>
                </Row>
            </Container>
        );
    }
}

export default Start;