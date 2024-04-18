import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classNames from 'classnames/bind';
import styles from './CQSidebarItem.module.scss';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function CQSidebarItem({ question, index, questions, setQuestions, selectedQuestion, setSelectedQuestion }) {
    const handleDeleteClick = () => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const handleChangeQuestion = () => {
        setSelectedQuestion(question);
    };

    return (
        <div className={cx('wrapper')}>
            {question.type === 'exp' ? (
                <>
                    <div className={cx('question-header')}>
                        <p className={cx('question-title')}>Explanation</p>
                        <button onClick={handleDeleteClick} className={cx('delete-button')}>
                            <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                    </div>
                    <div className={cx('question-summary')} onClick={handleChangeQuestion}>
                        {question.content ? (
                            <p className={cx('question-summary__content')}>{question.content}</p>
                        ) : (
                            <p className={cx('question-summary__content')}>Explanation</p>
                        )}

                        {question.imageUrl ? (
                            <img src={question.imageUrl} className={cx('question-summary__img')} alt="" />
                        ) : (
                            <div className={cx('question-summary__img-background')}>No chosen image</div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className={cx('question-header')}>
                        <p className={cx('question-title')}>
                            {`${question.order}`} {`${question.type}`}
                        </p>
                        <button onClick={handleDeleteClick} className={cx('delete-button')}>
                            <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                    </div>
                    <div className={cx('question-summary')} onClick={handleChangeQuestion}>
                        {question.content ? (
                            <p className={cx('question-summary__content')}>{question.content}</p>
                        ) : (
                            <p className={cx('question-summary__content')}>Untitled question </p>
                        )}

                        {question.imageUrl ? (
                            <img src={question.imageUrl} className={cx('question-summary__img')} alt="" />
                        ) : (
                            <div className={cx('question-summary__img-background')}>No chosen image</div>
                        )}

                        {question.type == 'tf' ? (
                            <div className={cx('answer-container')}>
                                <div className={cx('answer-item')}></div>
                                <div className={cx('answer-item')}></div>
                            </div>
                        ) : (
                            <div className={cx('answer-container')}>
                                <div className={cx('answer-item')}></div>
                                <div className={cx('answer-item')}></div>
                                <div className={cx('answer-item')}></div>
                                <div className={cx('answer-item')}></div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default CQSidebarItem;
