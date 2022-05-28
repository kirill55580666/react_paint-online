import React from 'react';
import {Button, Modal} from "react-bootstrap";
import canvasState from "../../store/canvasState";

const MyModal = ({usernameRef, modal, setModal}) => {
    const connectHandler = () => {
        let currentName = usernameRef.current.value;
        if(currentName !== '') {
            canvasState.setUsername(usernameRef.current.value)
        } else {
            canvasState.setUsername('New User')
        }

        setModal(false)
    }
    return (
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
    );
};

export default MyModal;