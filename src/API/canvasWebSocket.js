import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";

const canvasWebSocket = (canvasRef, id) => {
    const socket = new WebSocket('ws://localhost:5000/')
    canvasState.setSocket(socket)
    canvasState.setSessionId(id)
    toolState.setTool(new Brush(canvasRef.current, socket, id))
    socket.onopen = () => {
        console.log(`Соедениние установлено пользователь ${canvasState.username}`);
        socket.send(JSON.stringify({
            method: 'connection',
            id: id,
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
                drawHandler(canvasRef, msg)
                break
            case 'undo':
                undoHandler(canvasRef, msg)
                break
            case 'redo':
                redoHandler(canvasRef, msg)
                break
            default:
                break

        }
    }
}

const drawHandler = (canvasRef, msg) => {
    const figure = msg.figure
    const ctx = canvasRef.current.getContext('2d')
    switch (figure.type) {
        case "brush":
            Brush.draw(ctx, figure.x, figure.y, figure.color, figure.lineWidth)
            break
        case 'rect':
            Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.strokeColor, figure.lineWidth)
            break
        case 'circle':
            Circle.staticDraw(ctx, figure.x, figure.y, figure.r, figure.color, figure.strokeColor, figure.lineWidth)
            break
        case "eraser":
            Eraser.draw(ctx, figure.x, figure.y, figure.color, figure.lineWidth)
            break
        case 'line':
            Line.staticDraw(ctx, figure.startX, figure.startY, figure.currentX, figure.currentY, figure.color, figure.lineWidth)
            break
        case "finish":
            ctx.beginPath();
            break;
        default:

            break;
    }
}

const undoHandler = (canvasRef, msg) => {
    console.log(msg)
    // const ctx = canvasRef.current.getContext('2d')
    // canvasState.setUndoList(msg.undoList)
    // canvasState.setRedoList(msg.redoList)
    // if(canvasState.undoList.length != 1) {
    //     const currentImg = new Image()
    //     currentImg.src = canvasState.undoList[canvasState.undoList.length - 2]
    //     currentImg.onload = () => {
    //         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    //         ctx.drawImage(currentImg, 0, 0, canvasRef.current.width, canvasRef.current.height)
    //         ctx.beginPath()
    //     }
    // }
    canvasState.undo()


}
const redoHandler = (canvasRef, msg) => {
    console.log(msg)
    // const ctx = canvasRef.current.getContext('2d')
    // canvasState.setUndoList(msg.undoList)
    // canvasState.setRedoList(msg.redoList)
    // if(canvasState.redoList.length != 1) {
    //     const currentImg = new Image()
    //     currentImg.src = canvasState.redoList[canvasState.redoList.length - 2]
    //     currentImg.onload = () => {
    //         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    //         ctx.drawImage(currentImg, 0, 0, canvasRef.current.width, canvasRef.current.height)
    //         ctx.beginPath()
    //     }
    // }
    canvasState.redo()
}

export default canvasWebSocket;