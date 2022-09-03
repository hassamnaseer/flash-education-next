import React from 'react';
import { Modal } from 'antd';

const DeleteQuestionModal = ({showModal, setShowModal, onDelete, data}) => {
    return (
        <Modal
            title="Delete Question"
            centered
            visible={showModal}
            onCancel={() => setShowModal(false)}
            footer={
                <div>
                  <button
                    type="button"
                    className="btn btn-outline-danger px-4 mr-4"
                    onClick={() => setShowModal(false)}
                  >
                    CANCEL
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-success px-4"
                    onClick={(e) => onDelete(data)}
                  >
                    PROCEED
                  </button>
                </div>
              }
        >
            <p>Are you sure you want to delete.</p>
        </Modal>
    );
}

export default DeleteQuestionModal;