import React, { useState, useRef, useEffect } from 'react';

import classNames from 'classnames/bind';
import styles from './QuestionContent.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function QuestionContent({ selectedQuestion, setQuestions }) {
    const fileInputRef = useRef(null);

    const [content, setContent] = useState(selectedQuestion.content);
    const [answers, setAnswers] = useState(selectedQuestion.answers);
    const [correctAnswers, setCorrectAnswers] = useState(selectedQuestion.correctAnswers);

    const [image, setImage] = useState(selectedQuestion.imageUrl);

    const handleInputButtonClick = (event) => {
        event.preventDefault();
        fileInputRef.current.click();
    };

    const handleInputContentChange = (event) => {
        setContent(event.target.value);

        setQuestions((prevQuestions) => {
            const selectedQuestionIndex = prevQuestions.findIndex((question) => question.id === selectedQuestion.id);

            if (selectedQuestionIndex === -1) return prevQuestions;

            const newQuestions = [...prevQuestions];
            const updatedQuestion = { ...newQuestions[selectedQuestionIndex], content: event.target.value };
            newQuestions[selectedQuestionIndex] = updatedQuestion;

            return newQuestions;
        });
    };

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);

        setQuestions((prevQuestions) => {
            const selectedQuestionIndex = prevQuestions.findIndex((question) => question.id === selectedQuestion.id);

            if (selectedQuestionIndex === -1) return prevQuestions;

            const newQuestions = [...prevQuestions];
            const updatedQuestion = { ...newQuestions[selectedQuestionIndex], answers: newAnswers };
            newQuestions[selectedQuestionIndex] = updatedQuestion;

            return newQuestions;
        });
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(URL.createObjectURL(file));

        setQuestions((prevQuestions) => {
            const selectedQuestionIndex = prevQuestions.findIndex((question) => question.id === selectedQuestion.id);

            if (selectedQuestionIndex === -1) return prevQuestions;

            const newQuestions = [...prevQuestions];
            const updatedQuestion = { ...newQuestions[selectedQuestionIndex], imageUrl: URL.createObjectURL(file) };
            newQuestions[selectedQuestionIndex] = updatedQuestion;

            return newQuestions;
        });
    };

    const handleCheckboxChange = (index) => {
        const currentIndex = correctAnswers.indexOf(index);
        const newCorrectAnswers = [...correctAnswers];

        if (currentIndex === -1) {
            newCorrectAnswers.push(index);
        } else {
            newCorrectAnswers.splice(currentIndex, 1);
        }

        setCorrectAnswers(newCorrectAnswers);

        setQuestions((prevQuestions) => {
            const selectedQuestionIndex = prevQuestions.findIndex((question) => question.id === selectedQuestion.id);

            if (selectedQuestionIndex === -1) return prevQuestions;

            const newQuestions = [...prevQuestions];
            const updatedQuestion = { ...newQuestions[selectedQuestionIndex], correctAnswers: newCorrectAnswers };
            newQuestions[selectedQuestionIndex] = updatedQuestion;

            return newQuestions;
        });
    };

    useEffect(() => {
        setContent(selectedQuestion.content);
        setImage(selectedQuestion.imageUrl);
        setAnswers(selectedQuestion.answers);
        setCorrectAnswers(selectedQuestion.correctAnswers);
    }, [selectedQuestion]);

    return (
        <div className={cx('wrapper')}>
            {selectedQuestion.type === 'exp' ? (
                <div>
                    <div className={cx('question-title')}>
                        <textarea
                            type="text"
                            placeholder="Start typing your explanation"
                            onChange={handleInputContentChange}
                            value={content}
                            rows="4"
                            className={cx('question-title__input', 'question-title__input--large')}
                        />
                    </div>
                    <div className={cx('question-image-wrapper')}>
                        <input
                            id="image-uploader"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                        />
                        <button
                            className={cx('question-image__button')}
                            onClick={(event) => handleInputButtonClick(event)}
                        >
                            <FontAwesomeIcon icon={faPlus} className={cx('question-image__icon')} />
                        </button>
                        {image ? (
                            <img id="preview" className={cx('question-image__img')} src={image} alt="" />
                        ) : (
                            <div className={cx('question-image__img-background')}>No chosen image</div>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    <div className={cx('question-title')}>
                        <textarea
                            type="text"
                            placeholder="Start typing your question"
                            onChange={handleInputContentChange}
                            value={content}
                            rows="2"
                            className={cx('question-title__input')}
                        />
                    </div>
                    <div className={cx('question-image-wrapper')}>
                        <input
                            id="image-uploader"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                        />
                        <button
                            className={cx('question-image__button')}
                            onClick={(event) => handleInputButtonClick(event)}
                        >
                            <FontAwesomeIcon icon={faPlus} className={cx('question-image__icon')} />
                        </button>
                        {image ? (
                            <img id="preview" className={cx('question-image__img')} src={image} alt="" />
                        ) : (
                            <div className={cx('question-image__img-background')}>No chosen image</div>
                        )}
                    </div>
                    <div className={cx('answer-container')}>
                        {answers.map((answer, index) => (
                            <div key={index} className={cx('answer-item')}>
                                <textarea
                                    rows="2"
                                    value={answer}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    className={cx('answer-item__input')}
                                />
                                <div className={cx('checkbox-wrapper')}>
                                    <input
                                        id={`_checkbox-${index}`}
                                        type="checkbox"
                                        checked={correctAnswers.includes(index)}
                                        onChange={() => handleCheckboxChange(index)}
                                    />
                                    <label htmlFor={`_checkbox-${index}`}>
                                        <div className={cx('tick_mark')}></div>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuestionContent;
