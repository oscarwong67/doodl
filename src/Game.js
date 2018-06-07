import React, { Component } from 'react';
import { Button, ButtonGroup, Col, Container, Input, InputGroup, InputGroupAddon, ListGroup, ListGroupItem, Row } from 'reactstrap';
import CanvasDraw from "react-canvas-draw"; //awesome package tbh
import FontAwesome from 'react-fontawesome';
import StayScrolled from 'react-stay-scrolled';

const styles = {
    containerStyle: {
        backgroundColor: 'white',
        width: '85vw',
        height: '60vh',
        marginTop: '10vh'
    },
    colStyle: {
        border: '3px solid #9242f4',
        borderRadius: 12,
        height: '60vh',
        display: 'block',
        overflow: 'auto',
        paddingLeft: 5,
        paddingRight: 5
    },
    canvasStyle: {
        border: '2px solid black',
        width: '100%',
        height: '80%',
        marginTop: 10
    },
    optionsStyle: {
        marginTop: '0.5em',
        width: '100%',
        overflow: 'hidden',
    },
    innerColStyle: {
        paddingLeft: 0,
        paddingRight: 0,
        width: '100%'
    },
    listGroupItemStyle: {
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0
    },
    chatStyle: {
        border: '3px solid #9242f4',
        borderRadius: 12,
        height: '60vh',
        display: 'block',
        overflow: 'auto',
        paddingLeft: 5,
        paddingRight: 5,
        position: 'relative'
    },
    chatInputGroupStyle: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 'auto'

    },
    chatInputStyle: {
        fontSize: '0.8rem'
    }
}

function compare(a, b) {
    if (a.score <= b.score) {
        return -1;
    } else {
        return 1;
    }
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canvasHeight: 500,
            canvasWidth: 650,
            color: '#9242f4',
            size: 6,
            guess: ''
        }
    }
    componentWillReceiveProps(nextProps) {
        let interval;
        if (nextProps.drawing && !this.props.drawing) {
            //this.canvas.clear();
            interval = window.setInterval(() => {
                if (this.canvas) {
                    let data = this.canvas.getSaveData();
                    this.props.updateDrawing(data);
                    if (this.props.timeLeft === 0) {
                        this.canvas.clear();
                    }
                }
            }, 33.33333333333333);
        }
        if (this.props.drawing && !nextProps.drawing && this.canvas) {
            this.canvas.clear();
            if (interval) {
                clearInterval(interval);
            }
        }
        if (!this.props.drawing) {
            if (nextProps.currentDrawing) {
                if (this.canvas) {
                    this.canvas.loadSaveData(nextProps.currentDrawing, true);
                }
            }
            if (interval && !nextProps.drawing) {
                clearInterval(interval);
            }
        }
    }
    componentDidMount() {
        let canvasHTML = this.canvas;
        this.setState({ //maybe i should set this on every viewport change as well
            canvasHeight: canvasHTML.canvas.clientHeight,
            canvasWidth: canvasHTML.canvas.clientWidth
        });
        if (this.props.drawing) {
            let interval = window.setInterval(() => {
                if (this.canvas) {
                    let data = this.canvas.getSaveData();
                    this.props.updateDrawing(data);
                    if (this.props.timeLeft === 0) {
                        this.canvas.clear();
                    }
                }
            }, 33.33333333333333);
        }
    }
    handleColorPick = (e) => {
        let color = this.state.color;
        if (e.target.className.includes("color")) {
            color = e.target.style.backgroundColor;
        } else if (e.target.className.includes("eraser")) {
            color = "#FFFFFF";
        }
        this.setState({
            color: color
        });

    }
    setSize = (e) => {
        let size = this.state.size;
        if (e.target.className.includes("small")) {
            size = 3;
        } else if (e.target.className.includes("medium")) {
            size = 6;
        } else if (e.target.className.includes("large")) {
            size = 9;
        }
        this.setState({
            size: size
        });
    }
    getWord = () => {
        let word = '';
        if (this.props.drawing) {
            word = this.props.word;
        } else {
            if (this.props.word) {
                word = this.props.word.length + ' characters long.';
            }
        }
        return word;
    }
    renderPlayers = () => {
        let playerElements = [];
        if (this.props.players) {
            for (let i = 0; i < this.props.players.length; i++) {
                playerElements.push(
                    <Row key={this.props.players[i].id}>
                        <Col xs="12">
                            <ListGroupItem key={i} style={styles.listGroupItemStyle}>
                                <p style={{ margin: '0 0 0 0', border: 'none', padding: '0 0 0 0' }}>{this.props.players[i].name}</p>
                                <p style={{ margin: '0 0 0 0', border: 'none', padding: '0 0 0 0' }}>Score: {this.props.players[i].points}</p>
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
    handleInput = (e) => {
        this.setState({
            guess: e.target.value
        });
    }
    handleKeyPress = (e) => {
        if (e.key === "Enter" && this.props.timeLeft > 0 && this.props.enabled) {
            this.sendGuess();
        }
    }
    sendGuess = () => {
        //set guess back to blank, send message as guess first
        if (this.props.timeLeft > 0 && this.props.enabled) {
            this.props.sendGuess(this.state.guess);
            this.setState({
                guess: ''
            });
        }
    }
    getCanvas = () => {
        if (this.props.enabled) {
            return (
                <Col id="canvas-col" xs="7" style={styles.colStyle}>
                    <CanvasDraw disabled={!this.props.drawing} ref={canvasDraw => (this.canvas = canvasDraw)} style={styles.canvasStyle} brushColor={this.state.color} brushSize={this.state.size} canvasWidth={this.state.canvasWidth} canvasHeight={this.state.canvasHeight} />
                    <Row className="options" style={styles.optionsStyle}>
                        <Col xs="12" md="8" style={styles.innerColStyle}>
                            <ButtonGroup size="lg">
                                <Button className="color" id="white #FFFFFF" style={{ backgroundColor: '#FFFFFF', height: '4.5vh' }} onClick={this.handleColorPick}></Button>
                                <Button className="color" id="lightGrey #cecece" style={{ backgroundColor: '#cecece', height: '4.5vh' }} onClick={this.handleColorPick}></Button>
                                <Button className="color" id="lightRed #fc140c" style={{ backgroundColor: '#fc140c', height: '4.5vh' }} onClick={this.handleColorPick}></Button>
                                <Button className="color" id="yellow #ffe400" style={{ backgroundColor: '#ffe400', height: '4.5vh' }} onClick={this.handleColorPick}></Button>
                            </ButtonGroup>
                            <ButtonGroup size="lg">
                                <Button className="color" id="lightGreen #00fb00" style={{ backgroundColor: '#00fb00', height: '4.5vh' }} onClick={this.handleColorPick}></Button>
                                <Button className="color" id="lightBlue #14f3ff" style={{ backgroundColor: '#14f3ff', height: '4.5vh' }} onClick={this.handleColorPick}></Button>
                                <Button className="color" id="lightPurple #9242f4" style={{ backgroundColor: '#9242f4', height: '4.5vh' }} onClick={this.handleColorPick}></Button>
                                <Button className="color" id="lightBrown #8B4513" style={{ backgroundColor: '#8B4513', height: '4.5vh' }} onClick={this.handleColorPick}></Button>
                            </ButtonGroup>
                        </Col>
                        <Col xs="12" md="4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <ButtonGroup size="lg">
                                <Button className="utility eraser" id="eraser" style={{ backgroundColor: '#FFFFFF', height: '4.5vh', color: 'black' }} onClick={this.handleColorPick}><p className="text-center eraser"><FontAwesome className="eraser" name="eraser" /></p></Button>
                                <Button id="undo" style={{ backgroundColor: '#FFFFFF', height: '4.5vh', color: 'black' }} onClick={() => { this.canvas.undo(); }}><p className="text-center undo"><FontAwesome className="undo" name="undo" /></p></Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row className="options" style={styles.optionsStyle}>
                        <Col xs="12" md="8" style={styles.innerColStyle}>
                            <ButtonGroup size="lg">
                                <Button className="color" id="black #000000" style={{ backgroundColor: '#000000', height: '4.5vh' }} onClick={this.handleColorPick}></Button>
                                <Button className="color" id="darkGrey #4c4c4c" style={{ backgroundColor: '#4c4c4c', height: '4.5vh' }} onClick={this.handleColorPick}></Button>
                                <Button className="color" id="darkRed #740b07" style={{ backgroundColor: '#740b07', height: '4.5vh' }} onClick={this.handleColorPick}></Button>
                                <Button className="color" id="orange #ff9000" style={{ backgroundColor: '#ff9000', height: '4.5vh' }} onClick={this.handleColorPick}></Button>
                            </ButtonGroup>
                            <ButtonGroup size="lg">
                                <Button className="color" id="darkGreen #015e0b" style={{ backgroundColor: '#015e0b', height: '4.5vh' }} onClick={this.handleColorPick}></Button>
                                <Button className="color" id="darkBlue #000080" style={{ backgroundColor: '#000080', height: '4.5vh' }} onClick={this.handleColorPick}></Button>
                                <Button className="color" id="pink #ff4f9e" style={{ backgroundColor: '#ff4f9e', height: '4.5vh' }} onClick={this.handleColorPick}></Button>
                                <Button className="color" id="peach #ffddb7" style={{ backgroundColor: '#ffddb7', height: '4.5vh' }} onClick={this.handleColorPick}></Button>
                            </ButtonGroup>
                        </Col>
                        <Col xs="12" md="4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <ButtonGroup size="lg">
                                <Button className="small" id="small" style={{ backgroundColor: '#FFFFFF', height: '4.5vh', color: 'black' }} onClick={this.setSize}><p className="text-center small">&#9679;</p></Button>
                                <Button className="medium" id="medium" style={{ backgroundColor: '#FFFFFF', height: '4.5vh', color: 'black' }} onClick={this.setSize}><p className="text-center medium">&#11044;</p></Button>
                                <Button className="large" id="large" style={{ backgroundColor: '#FFFFFF', height: '4.5vh', color: 'black', fontSize: 24 }} onClick={this.setSize}><p className="text-center large">&#11044;</p></Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                </Col>
            );
        } else {
            let index = 0;
            this.props.players.map((player, i) => {
                if (player.drawing) {
                    index = i + 1;
                }
            });
            let drawer = this.props.players[index - 1];
            let nextDrawer = this.props.players[index];
            if (!nextDrawer) {
                nextDrawer = this.props.players[0];
            }

            //create list of players again
            let playerElements = [];
            let players = Array.from(this.props.players);
            players.sort(compare);
            if (this.props.players) {
                for (let i = 0; i < players.length; i++) {
                    playerElements.push(
                        <Row key={players[i].id}>
                            <Col xs="12">
                                <ListGroupItem key={i} style={styles.listGroupItemStyle}>
                                    <p>{players[i].name}</p>
                                    <p>Score: {players[i].points}</p>
                                </ListGroupItem>
                            </Col>
                        </Row>
                    );
                }
            }
            let headline = '';
            if (this.props.currentRound >= this.props.rounds && nextDrawer.id === this.props.players[0].id) {
                headline = (
                    <div>
                        <h4>Game Over!</h4>
                    </div>
                );
            } else {
                headline = (
                    <div>
                        <h4>{drawer.name} is finished drawing!</h4>
                        <h3>{nextDrawer.name} is next!</h3>
                    </div>
                );
            }
            return (
                <Col id="canvas-col" xs="7" style={styles.colStyle}>
                    {headline}
                    <h5>The word was: {this.props.word}</h5>
                    <h3>Scores: </h3>
                    <ListGroup>
                        {playerElements}
                    </ListGroup>
                </Col>
            );
        }
    }
    getChat = () => {
        let messages = [];
        for (let i = 0; i < this.props.messages.length; i++) {
            let key = "message " + i;
            messages.push(
                <Row key={key}>
                    <Col xs="12">
                        <ListGroupItem key={i} style={styles.listGroupItemStyle}>
                            <p style={{ fontSize: '0.75rem' }}>{this.props.messages[i].sender}: {this.props.messages[i].message}</p>
                        </ListGroupItem>
                    </Col>
                </Row>
            );
        }
        return (
            <StayScrolled component="div">
                <ListGroup>
                    {messages}
                </ListGroup>
            </StayScrolled>
        );
    }
    render() {
        return (
            <div>
                <h3 className="text-center textCenter" >Time left: {this.props.timeLeft} &nbsp; Round: {this.props.currentRound} of {this.props.rounds}</h3>
                <h4>The word is: {this.getWord()}</h4>
                <Container style={styles.containerStyle}>
                    <Row>
                        <Col id="players" xs="2" style={styles.colStyle}>
                            {this.renderPlayers()}
                        </Col>
                        {this.getCanvas()}
                        <Col id="chat" xs="3" style={styles.chatStyle}>
                            {this.getChat()}
                        </Col>
                    </Row>
                    <Row style={{height: '2em'}}>
                        <Col xs="9"></Col>
                        <Col xs="3" style={{padding: '0 0 0 0'}}>
                            <InputGroup style={styles.chatInputGroupStyle}>
                                <Input placeholder="Enter a guess" onKeyPress={this.handleKeyPress} onChange={this.handleInput} ref={Button => (this.sendButton = Button)} style={styles.chatInputStyle} disabled={this.props.drawing} />
                                <InputGroupAddon addonType="append"><Button color="secondary" size="sm" onClick={this.sendGuess}>Send</Button></InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Game;