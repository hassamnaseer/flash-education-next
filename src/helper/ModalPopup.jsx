import React, { Component } from "react";

import { Modal } from "react-bootstrap";

export class ModalPopup extends Component {
  render() {
    const props = this.props;
    return (
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className={props.className}
        show={props.popupOpen}
        onHide={props.popupHide}
      >
          
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        {this.props.content && <Modal.Body>{this.props.content}</Modal.Body>}
        {this.props.footer && <Modal.Footer>{this.props.footer}</Modal.Footer>}
      </Modal>
    );
  }
}

export default ModalPopup;
