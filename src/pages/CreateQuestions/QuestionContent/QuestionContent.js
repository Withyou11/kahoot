import React, { useState, useRef, useEffect, useContext } from 'react';

import classNames from 'classnames/bind';
import styles from './QuestionContent.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { useQuizContext, handleSetUpdatedQuestions } from '~/utils/quizUtils';

// import { QuizzesContext } from '~/Context/QuizzesContext/QuizzesContext';

import { useDebounce } from '~/hooks';

const cx = classNames.bind(styles);

function QuestionContent({ selectedQuestion, setQuestions }) {
    const { updatedQuestions, setUpdatedQuestions } = useQuizContext();

    const fileInputRef = useRef(null);
    const [content, setContent] = useState(selectedQuestion.content);
    const [answers, setAnswers] = useState(selectedQuestion.options);
    const [timer, setTimer] = useState(selectedQuestion.timer);

    const [explain, setExplain] = useState(selectedQuestion.explanationContent);

    const [image, setImage] = useState(selectedQuestion.mediaUrl);
    const [base64Image, setBase64Image] = useState(null);

    const isMounted = useRef(false);
    const debouncedContent = useDebounce(content, 600);

    useEffect(() => {
        if (isMounted.current) {
            // This effect will execute when debouncedContent changes after 600ms of user inactivity
            handleSetUpdatedQuestions(
                selectedQuestion,
                'content',
                debouncedContent,
                updatedQuestions,
                setUpdatedQuestions,
            );
        } else {
            isMounted.current = true; // Set isMounted to true after initial render
        }
    }, [debouncedContent]);

    // const handleSetUpdatedQuestions = (key, value) => {
    //     const updatingQuestionIndex = updatedQuestions.findIndex((question) => question.id === selectedQuestion.id);
    //     if (updatingQuestionIndex === -1) {
    //         const updatingQuestionData = {
    //             id: selectedQuestion.id,
    //             [key]: value,
    //         };

    //         setUpdatedQuestions((prev) => [...prev, updatingQuestionData]);
    //     } else {
    //         const tempUpdatedQuestions = [...updatedQuestions];
    //         tempUpdatedQuestions[updatingQuestionIndex] = {
    //             ...tempUpdatedQuestions[updatingQuestionIndex],
    //             [key]: value,
    //         };

    //         setUpdatedQuestions(tempUpdatedQuestions);
    //     }
    // };

    const handleInputContentChange = (event) => {
        setContent(event.target.value);

        // handleSetUpdatedQuestions('content', event.target.value);

        setQuestions((prevQuestions) => {
            const selectedQuestionIndex = prevQuestions.findIndex((question) => question.id === selectedQuestion.id);

            if (selectedQuestionIndex === -1) return prevQuestions;

            const newQuestions = [...prevQuestions];
            const updatedQuestion = { ...newQuestions[selectedQuestionIndex], content: event.target.value };
            newQuestions[selectedQuestionIndex] = updatedQuestion;

            return newQuestions;
        });
    };

    const handleInputButtonClick = (event) => {
        event.preventDefault();
        fileInputRef.current.click();
    };

    const handleInputExplainChange = (event) => {
        setExplain(event.target.value);

        setQuestions((prevQuestions) => {
            const selectedQuestionIndex = prevQuestions.findIndex((question) => question.id === selectedQuestion.id);

            if (selectedQuestionIndex === -1) return prevQuestions;

            const newQuestions = [...prevQuestions];
            const updatedQuestion = { ...newQuestions[selectedQuestionIndex], explanationContent: event.target.value };
            newQuestions[selectedQuestionIndex] = updatedQuestion;

            return newQuestions;
        });
    };

    const handleAnswerChange = (index, value) => {
        let answerTemp;
        setAnswers((prevAnswers) => {
            const newAnswers = [...prevAnswers];
            newAnswers[index] = { ...newAnswers[index], content: value };
            answerTemp = newAnswers;
            return newAnswers;
        });

        updateQuestions(answerTemp);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64String = reader.result;
            setImage(URL.createObjectURL(file)); // Keep track of image URL
            setBase64Image(base64String); // Update base64 image state\

            setQuestions((prevQuestions) => {
                const selectedQuestionIndex = prevQuestions.findIndex(
                    (question) => question.id === selectedQuestion.id,
                );

                if (selectedQuestionIndex === -1) return prevQuestions;

                const newQuestions = [...prevQuestions];
                const updatedQuestion = { ...newQuestions[selectedQuestionIndex], mediaUrl: base64String };
                newQuestions[selectedQuestionIndex] = updatedQuestion;

                return newQuestions;
            });
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleCheckboxChange = (index) => {
        let answerTemp;
        setAnswers((prevAnswers) => {
            const newAnswers = [...prevAnswers];
            newAnswers[index] = { ...newAnswers[index], isCorrect: !newAnswers[index].isCorrect };
            answerTemp = newAnswers;
            return newAnswers;
        });

        updateQuestions(answerTemp);
    };

    const handleTimerChange = (e) => {
        const newTimer = parseInt(e.target.value);
        handleSetUpdatedQuestions('timer', newTimer);
        setTimer(newTimer);

        updateQuestionsTimer({ timer: newTimer });
    };

    const updateQuestions = (answerTemp) => {
        setQuestions((prevQuestions) => {
            const selectedQuestionIndex = prevQuestions.findIndex((question) => question.id === selectedQuestion.id);

            if (selectedQuestionIndex === -1) return prevQuestions;

            const newQuestions = [...prevQuestions];
            const updatedQuestion = { ...newQuestions[selectedQuestionIndex], options: answerTemp };
            newQuestions[selectedQuestionIndex] = updatedQuestion;
            console.log(newQuestions[selectedQuestionIndex].options);
            return newQuestions;
        });
    };

    const updateQuestionsTimer = (updatedFields) => {
        setQuestions((prevQuestions) => {
            const selectedQuestionIndex = prevQuestions.findIndex((question) => question.id === selectedQuestion.id);

            if (selectedQuestionIndex === -1) return prevQuestions;

            const newQuestions = [...prevQuestions];
            const updatedQuestion = { ...newQuestions[selectedQuestionIndex], ...updatedFields };
            newQuestions[selectedQuestionIndex] = updatedQuestion;

            return newQuestions;
        });
    };

    useEffect(() => {
        setContent(selectedQuestion.content);
        setImage(selectedQuestion.imageUrl);
        setAnswers(selectedQuestion.options);
        setTimer(selectedQuestion.timer);
    }, [selectedQuestion]);

    return (
        <div className={cx('wrapper')}>
            {selectedQuestion.type === 'exp' ? (
                <div>
                    <div className={cx('question-title')}>
                        <textarea
                            type="text"
                            placeholder="Start typing your explanation"
                            onChange={handleInputExplainChange}
                            value={explain}
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
                    <div className={cx('question-body')}>
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
                            {selectedQuestion.mediaUrl && !image && (
                                <img
                                    id="preview"
                                    className={cx('question-image__img')}
                                    src={selectedQuestion.mediaUrl}
                                    alt=""
                                />
                            )}

                            {image && <img id="preview" className={cx('question-image__img')} src={image} alt="" />}

                            {!selectedQuestion.mediaUrl && !image && (
                                <div className={cx('question-image__img-background')}>No chosen image</div>
                            )}
                        </div>
                        <div className={cx('select')}>
                            <div className={cx('selected')}>
                                <p>
                                    {timer == '15'
                                        ? '15 seconds'
                                        : timer == '30'
                                        ? '30 seconds'
                                        : timer == '60'
                                        ? '1 minute'
                                        : '2 minutes'}
                                </p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="1em"
                                    viewBox="0 0 512 512"
                                    className={cx('arrow')}
                                >
                                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
                                </svg>
                            </div>
                            <div className={cx('options')}>
                                <div>
                                    <input
                                        id="option-1"
                                        type="radio"
                                        value="15"
                                        checked={timer == '15'}
                                        onChange={handleTimerChange}
                                    />
                                    <label className={cx('option')} htmlFor="option-1" data-txt="15 seconds"></label>
                                </div>
                                <div>
                                    <input
                                        id="option-2"
                                        type="radio"
                                        value="30"
                                        checked={timer == '30'}
                                        onChange={handleTimerChange}
                                    />
                                    <label className={cx('option')} htmlFor="option-2" data-txt="30 seconds"></label>
                                </div>
                                <div>
                                    <input
                                        id="option-3"
                                        type="radio"
                                        value="60"
                                        checked={timer == '60'}
                                        onChange={handleTimerChange}
                                    />
                                    <label className={cx('option')} htmlFor="option-3" data-txt="1 minute"></label>
                                </div>
                                <div>
                                    <input
                                        id="option-4"
                                        type="radio"
                                        value="120"
                                        checked={timer == '120'}
                                        onChange={handleTimerChange}
                                    />
                                    <label className={cx('option')} htmlFor="option-4" data-txt="2 minutes"></label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('answer-container')}>
                        {answers.map((answer, index) => (
                            <div key={index} className={cx('answer-item')}>
                                <textarea
                                    rows="2"
                                    value={answer.content}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    className={cx('answer-item__input')}
                                />
                                <div className={cx('checkbox-wrapper')}>
                                    <input
                                        id={`_checkbox-${index}`}
                                        type="checkbox"
                                        checked={answer.isCorrect}
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
