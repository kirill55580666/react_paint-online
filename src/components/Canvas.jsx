import React, {useEffect, useRef, useState} from 'react';
import '../styles/canvas.scss'
import canvasState from "../store/canvasState";
import {observer} from "mobx-react-lite";
import {Button, Modal} from "react-bootstrap";
import {useParams} from "react-router-dom";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import toolState from "../store/toolState";
import axios from 'axios'
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";


const Canvas = observer(() => {
    const canvasRef = useRef()
    const usernameRef = useRef()
    const [modal, setModal] = useState(true)
    const params = useParams();

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        let ctx = canvasRef.current.getContext('2d')
        axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(response => {
                const img = new Image()
                img.src = response.data
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                }
            })
    }, [])


    useEffect(() => {
        if(canvasState.username) {
            const socket = new WebSocket('ws://localhost:5000/')
            canvasState.setSocket(socket)
            canvasState.setSessionId(params.id)
            toolState.setTool(new Brush(canvasRef.current, socket, params.id))
            socket.onopen = () => {
                console.log(`Соедениние установлено пользователь ${canvasState.username}`);
                socket.send(JSON.stringify({
                    method: 'connection',
                    id: params.id,
                    username: canvasState.username
                }))
            }
            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data)
                switch (msg.method) {
                    case 'connection':
                        console.log(`Пользователь присоединился ${canvasState.username}`);
                        break
                    case 'draw':
                        drawHandler(msg)
                        break

                    default:
                        break

                }
            }
        }

    }, [canvasState.username])

    const drawHandler = (msg) => {
        const figure = msg.figure
        const ctx = canvasRef.current.getContext('2d')
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y, figure.color)
                break
            case 'rect':
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color)
                break
            case 'circle':
                Circle.staticDraw(ctx, figure.x, figure.y, figure.r)
                break
            case "eraser":
                Eraser.draw(ctx, figure.x, figure.y, figure.color)
                break
            case 'line':
                Line.staticDraw(ctx, figure.x, figure.y, figure.color)
                break
            case "finish":
                ctx.beginPath();
                break;
            default:

                break;
        }
    }

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
    }

    const mouseUpHandler = () => {
        axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
            .then(res => console.log(res))
    }

    const connectHandler = () => {
        canvasState.setUsername(usernameRef.current.value)
        setModal(false)
    }

    return (
        <div className="canvas">
            <Modal show={modal} onHide={() => {}} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Введите ваше имя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input typ='text' ref={usernameRef}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={() => connectHandler()}>
                        Войти
                    </Button>
                </Modal.Footer>
            </Modal>

            <canvas
                onMouseDown={() => mouseDownHandler()}
                onMouseUp={() => mouseUpHandler()}
                ref={canvasRef}
                width={600}
                height={400}
            >

            </canvas>
        </div>
    );
});

export default Canvas;