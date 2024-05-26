import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classNames from 'classnames/bind';
import styles from './CQSidebarItem.module.scss';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { QuizzesContext } from '~/Context/QuizzesContext/QuizzesContext';

const cx = classNames.bind(styles);

function CQSidebarItem({ question, index, questions, setQuestions, selectedQuestion, setSelectedQuestion }) {
    const quizzesContext = useContext(QuizzesContext);
    const deletedQuestionIds = quizzesContext.deletedQuestionIds;
    const setDeletedQuestionIds = quizzesContext.setDeletedQuestionIds;

    const handleDeleteClick = () => {
        const warningMessage =
            question.type === 'exp'
                ? 'Are you sure you want to delete this explanation?'
                : 'Are you sure you want to delete this question?';
        if (window.confirm(warningMessage)) {
            const newQuestions = [...questions];
            newQuestions.splice(index, 1);

            // Recalculate sortOrder
            let order = 1;
            newQuestions.forEach((q) => {
                if (q.type !== 'exp') {
                    q.sortOrder = order++;
                }
            });

            setQuestions(newQuestions);
            if (!deletedQuestionIds.includes(question.id)) {
                setDeletedQuestionIds((oldArray) => [...oldArray, question.id]);
            }
        }
    };

    const handleChangeQuestion = () => {
        setSelectedQuestion(question);
    };

    function isHttpImage(str) {
        if (str) {
            return str.startsWith('http');
        }
        return;
    }

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
                        {question.explanationContent ? (
                            <p className={cx('question-summary__content')}>{question.explanationContent}</p>
                        ) : (
                            <p className={cx('question-summary__content')}>Explanation</p>
                        )}

                        {question.explanationMediaUrl ? (
                            <img src={question.explanationMediaUrl} className={cx('question-summary__img')} alt="" />
                        ) : (
                            <div className={cx('question-summary__img-background')}>No chosen image</div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className={cx('question-header')}>
                        <p className={cx('question-title')}>{`${question.sortOrder}`} quiz</p>
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

                        {question.mediaUrl && (
                            <img src={question.mediaUrl} className={cx('question-summary__img')} alt="" />
                        )}

                        {!question.mediaUrl && (
                            <div className={cx('question-summary__img-background')}>No chosen image</div>
                        )}

                        <div className={cx('answer-container')}>
                            <div className={cx('answer-item')}></div>
                            <div className={cx('answer-item')}></div>
                            <div className={cx('answer-item')}></div>
                            <div className={cx('answer-item')}></div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default CQSidebarItem;
