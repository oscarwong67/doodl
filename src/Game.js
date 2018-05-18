import React, { Component } from 'react';
import { Button, ButtonGroup, Col, Container, ListGroup, ListGroupItem, Row } from 'reactstrap';
import CanvasDraw from "react-canvas-draw"; //awesome package tbh
import FontAwesome from 'react-fontawesome';

const styles = {
    containerStyle: {
        backgroundColor: 'white',
        width: '85vw',
        height: '60vh',
        display: 'block',
        overflow: 'auto',
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
    }
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canvasHeight: 500,
            canvasWidth: 650,
            color: '#9242f4',
            size: 6
        }
    }
    componentWillReceiveProps() {
        if (! this.props.drawing) {
            if (this.props.currentDrawing) {
                this.canvas.loadSaveData(this.props.currentDrawing, true);
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
                let data = this.canvas.getSaveData();
                this.props.updateDrawing(data);
            }, 16.6667);
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
    renderPlayers = () => {
        let playerElements = [];
        if (this.props.players) {
            for (let i = 0; i < this.props.players.length; i++) {
                playerElements.push(
                    <Row key={this.props.players[i].id}>
                        <Col xs="12">
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
                <Row>
                    <Col id="players" xs="2" style={styles.colStyle}>
                        {this.renderPlayers()}
                    </Col>
                    <Col id="canvas-col" xs="7" style={styles.colStyle}>
                        <CanvasDraw disabled={! this.props.drawing} ref={canvasDraw => (this.canvas = canvasDraw)} style={styles.canvasStyle} brushColor={this.state.color} brushSize={this.state.size} canvasWidth={this.state.canvasWidth} canvasHeight={this.state.canvasHeight} />
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
                    <Col id="chat" xs="3" style={styles.colStyle}>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Game;