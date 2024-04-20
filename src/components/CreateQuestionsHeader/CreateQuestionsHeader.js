import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '~/components/Toast/Toast';
import logo from '~/assets/img/logo.png';

import classNames from 'classnames/bind';
import styles from './CreateQuestionsHeader.module.scss';

const cx = classNames.bind(styles);

function CreateQuestionsHeader({ questions }) {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [name, setName] = useState('');
    const [savedname, setSavedName] = useState('');
    const [desc, setDesc] = useState('');
    const [savedDesc, setSavedDesc] = useState('');

    const [base64Image, setBase64Image] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showAddnewQuestionToast, setShowAddnewQuestionToast] = useState(false);

    const handleInputButtonClick = (event) => {
        event.preventDefault();
        fileInputRef.current.click();
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = (e) => {
        e.stopPropagation();
        if (savedDesc !== desc || savedname !== name) {
            if (window.confirm('Your changes have not been saved, are you sure you want to exit?')) {
                setCoverImage(null);
                setBase64Image(null);
                setName(savedname);
                setDesc(savedDesc);
                setShowModal(false);
            }
        } else {
            setShowModal(false);
        }
    };

    const handleInputNameChange = (event) => {
        setName(event.target.value);
    };

    const handleInputDescChange = (event) => {
        setDesc(event.target.value);
    };

    const handleImageChange = (event) => {
        setCoverImage(event.target.files);
    };

    const handleSaveQuestionSetInfo = () => {
        if (name !== '') {
            setSavedName(name);
            setSavedDesc(desc);
            setShowModal(false);
            setShowToast(true);
        } else {
            window.alert('Please fill in all required fields!');
        }
    };

    const handleGoHome = () => {
        if (window.confirm('Your changes have not been saved, are you sure you want to exit?')) {
            setCoverImage(null);
            setBase64Image(null);
            setName('');
            setShowModal(false);
            navigate('/');
        }
    };

    const prepareQuestionsForAPI = (questions) => {
        const preparedQuestions = [];
        let lastNonExpQuestion = null;

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            if (question.type === 'exp' && lastNonExpQuestion !== null) {
                lastNonExpQuestion.explanationContent = question.content;
                lastNonExpQuestion.explanationMediaUrl = question.imageUrl;
            } else {
                lastNonExpQuestion = { ...question }; // Tạo một bản sao của câu hỏi để tránh thay đổi trực tiếp vào mảng gốc
                preparedQuestions.push(lastNonExpQuestion);
            }
        }

        return preparedQuestions;
    };

    const handleSaveQuestionSet = () => {
        if (savedname !== '') {
            let hasNonExpQuestion = false;
            let hasConsecutiveExp = false;
            let hasEmptyContent = false;
            let hasCorrectAnswer = false;
            let hasEmptyAnswer = false;
            let invalidQuestions = []; // Mảng chứa các câu hỏi không tuân theo quy tắc

            questions.forEach((question, index) => {
                if (question.type !== 'exp') {
                    hasNonExpQuestion = true;
                    return;
                }
            });

            if (!hasNonExpQuestion) {
                questions.forEach((question, index) => {
                    if (question.content.trim() === '') {
                        hasEmptyContent = true;
                        invalidQuestions.push(`Question ${index + 1}`);
                    }
                });
            }

            if (!hasEmptyContent) {
                questions.forEach((question, index) => {
                    if (question.type !== 'exp') {
                        if (question.correctAnswers.length === 0) {
                            hasCorrectAnswer = true;
                            invalidQuestions.push(`Question ${index + 1}`);
                        }
                        if (question.answers.some((answer) => answer.trim() === '')) {
                            hasEmptyAnswer = true;
                            invalidQuestions.push(`Question ${index + 1}`);
                        }
                    }
                    if (index > 0 && question.type === 'exp' && questions[index - 1].type === 'exp') {
                        hasConsecutiveExp = true;
                    }
                });
            }

            if (!hasNonExpQuestion) {
                window.alert('There must be at least one question.');
            } else if (hasConsecutiveExp) {
                window.alert('Each question has a maximum of one explanation');
            } else if (hasEmptyContent) {
                window.alert('All questions must have content.\nInvalid questions: ' + invalidQuestions.join(', '));
            } else if (hasEmptyAnswer) {
                window.alert('All answers must not be empty.\nInvalid questions: ' + invalidQuestions.join(', '));
            } else if (hasCorrectAnswer) {
                window.alert(
                    'All questions must have at least one correct answer.\nInvalid questions: ' +
                        invalidQuestions.join(', '),
                );
            } else {
                const preparedQuestions = prepareQuestionsForAPI(questions);
                console.log(preparedQuestions);
                setShowAddnewQuestionToast(true);
            }
        } else {
            window.alert('Please enter title of question set!');
        }
    };

    useEffect(() => {
        if (coverImage) {
            const reader = new FileReader();
            const file = coverImage[0];

            reader.onloadend = () => {
                setBase64Image(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }, [coverImage]);

    return (
        <div className={cx('wrapper')}>
            <a href="/" className={cx('logo-link')}>
                <img src={logo} alt="Logo" className={cx('logo')} />
            </a>

            <div className={cx('custom-input__wrapper')} onClick={handleOpenModal}>
                <input
                    type="text"
                    readOnly
                    placeholder="Enter title..."
                    value={savedname}
                    className={cx('custom-input')}
                />
                <button className={cx('custom-input__button')}>Settings</button>
            </div>

            <div className={cx('action')}>
                <button className={cx('action__btn', 'action__btn-exit')} onClick={handleGoHome}>
                    Exit
                </button>
                <button className={cx('action__btn', 'action__btn-save')} onClick={handleSaveQuestionSet}>
                    Save
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className={cx('modal')}>
                    <div className={cx('modal__content', 'modal__content--medium')}>
                        <h2 className={cx('modal__heading')}>Question set summary</h2>
                        <div className={cx('modal__row')}>
                            <div className={cx('input-group')}>
                                <div className={cx('input-wrapper')}>
                                    <label htmlFor="input-title" className={cx('input-label')}>
                                        Title (required)
                                    </label>
                                    <input
                                        id="input-title"
                                        className={cx('input')}
                                        type="text"
                                        value={name}
                                        required
                                        onChange={handleInputNameChange}
                                        placeholder="Enter title of question set..."
                                    />
                                </div>

                                <div className={cx('input-wrapper')}>
                                    <label htmlFor="input-desc" className={cx('input-label')}>
                                        Description (optional)
                                    </label>
                                    <textarea
                                        id="input-desc"
                                        rows="4"
                                        className={cx('textarea')}
                                        type="text"
                                        value={desc}
                                        onChange={handleInputDescChange}
                                    />
                                </div>
                            </div>
                            <div className={cx('input-group')}>
                                <div className={cx('input-wrapper')}>
                                    <label className={cx('input-label')}>Cover image</label>
                                    <div className={cx('cover-image')}>
                                        <input
                                            id="image-uploader"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                            ref={fileInputRef}
                                        />
                                        <button
                                            className={cx('cover-image__button')}
                                            onClick={(event) => handleInputButtonClick(event)}
                                        >
                                            Change
                                        </button>
                                        {coverImage ? (
                                            <img
                                                id="preview"
                                                className={cx('cover-image__img')}
                                                src={URL.createObjectURL(coverImage[0])}
                                                alt=""
                                            />
                                        ) : (
                                            <div className={cx('cover-image__background')}></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('modal__bottom')}>
                            <button className={cx('action__btn', 'action__btn-exit')} onClick={handleCloseModal}>
                                Cancel
                            </button>
                            <button
                                className={cx('action__btn', 'action__btn-save')}
                                onClick={handleSaveQuestionSetInfo}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                    <div className={cx('modal__overlay')} onClick={handleCloseModal}></div>
                </div>
            )}

            {showToast && <Toast title="Success" desc="Your changes has been saved" />}
            {showAddnewQuestionToast && (
                <Toast
                    title="Success"
                    desc="You have successfully created a new set of questionsYour changes has been saved"
                />
            )}
        </div>
    );
}

export default CreateQuestionsHeader;
