import React from 'react';
import styles from './style.module.scss';

const Modal = ({ children }) => {
    return (
        <div className={styles.modal}>
            <div className={styles['modal-content']}>{children}</div>
        </div>
    );
};

export default Modal;
