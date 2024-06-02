import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '~/components/Toast/Toast';
import logo from '~/assets/img/logo.png';

import classNames from 'classnames/bind';
import styles from './CreateQuestionsHeader.module.scss';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { QuizzesContext } from '~/Context/QuizzesContext/QuizzesContext';

const cx = classNames.bind(styles);

function CreateQuestionsHeader({ questions, setQuestions, quizInfo, setQuizInfo }) {
    let { id } = useParams();

    const quizzesContext = useContext(QuizzesContext);
    const quizInfo1 = quizzesContext.quizInfo;
    const updatedQuestions = quizzesContext.updatedQuestions;
    const deletedQuestionIds = quizzesContext.deletedQuestionIds;

    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [name, setName] = useState(quizInfo.title);
    const [savedname, setSavedName] = useState(quizInfo.title);
    const [desc, setDesc] = useState(quizInfo.description);
    const [savedDesc, setSavedDesc] = useState(quizInfo.description);

    const [base64Image, setBase64Image] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showAddnewQuestionToast, setShowAddnewQuestionToast] = useState(false);

    const [isTitleChange, setIsTitleChange] = useState(false);
    const [isDescChange, setIsDescChange] = useState(false);
    const [isCoverImageChange, setIsCoverImageChange] = useState(false);

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
        setIsTitleChange(true);
        setName(event.target.value);
    };

    const handleInputDescChange = (event) => {
        setIsDescChange(true);
        setDesc(event.target.value);
    };

    const handleImageChange = (event) => {
        setIsCoverImageChange(true);
        const file = event.target.files[0];
        setCoverImage(file); // Update coverImage state with the file

        const reader = new FileReader();
        reader.onloadend = () => {
            setBase64Image(reader.result); // Update base64Image state with the base64 representation of the image
        };
        reader.readAsDataURL(file);
    };

    const handleSaveQuestionSetInfo = () => {
        if (name !== '') {
            setSavedName(name);
            setSavedDesc(desc);
            setShowModal(false);
            setQuizInfo({
                title: name,
                description: desc,
                coverPicture: base64Image,
            });
            // setShowToast(true);
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

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                // Call api delete here
                axios
                    .delete(`https://quiz-lab-server.onrender.com/api/quizzes/${id}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    })
                    .then((res) => {
                        navigate('/manage-quizzes');
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
        }
    };

    const prepareQuestionsForCreate = (questions) => {
        const preparedQuestions = [];
        let lastNonExpQuestion = null;

        for (let i = 0; i < questions.length; i++) {
            const { id, quizId, ...rest } = questions[i]; // Lấy tất cả các thuộc tính của question trừ id
            let questionWithoutId = { ...rest }; // Tạo một bản sao của đối tượng question chỉ chứa các thuộc tính khác trừ id

            const { options, ...res } = questions[i];
            const modifyOptions = options.map(({ questionId, id, ...option }) => option);
            questionWithoutId = { ...rest, options: modifyOptions };

            // Ép kiểu dữ liệu cho sortOrder và timer thành số nguyên
            questionWithoutId.sortOrder = parseInt(questionWithoutId.sortOrder);
            questionWithoutId.timer = parseInt(questionWithoutId.timer);

            if (questionWithoutId.type === 'exp' && lastNonExpQuestion !== null) {
                lastNonExpQuestion.explanationContent = questionWithoutId.explanationContent;
                lastNonExpQuestion.explanationMediaUrl = questionWithoutId.explanationMediaUrl;
            } else {
                lastNonExpQuestion = { ...questionWithoutId };
                preparedQuestions.push(lastNonExpQuestion);
            }
        }

        const preparedQuiz = {
            title: quizInfo.title,
            description: quizInfo.description,
            coverPicture: quizInfo.coverPicture,
            questions: preparedQuestions,
        };

        return preparedQuiz;
    };

    const prepareDataForUpdate = () => {
        const preparedData = {};
        if (isTitleChange) {
            preparedData.title = savedname;
        }
        if (isDescChange) {
            preparedData.description = savedDesc;
        }
        if (isCoverImageChange) {
            preparedData.coverPicture = base64Image;
            preparedData.isDeleteCoverPicture = true;
        } else {
            preparedData.isDeleteCoverPicture = false;
        }
        if (updatedQuestions.length > 0) {
            preparedData.updatedQuestions = updatedQuestions;
        }
        if (deletedQuestionIds.length > 0) {
            preparedData.deletedQuestionIds = deletedQuestionIds;
        }
        return preparedData;
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
                    if (question.content?.trim() === '') {
                        hasEmptyContent = true;
                        invalidQuestions.push(`Question ${index + 1}`);
                    }
                });
            }

            if (!hasEmptyContent) {
                questions.forEach((question, index) => {
                    if (question.type != 'exp') {
                        if (!question.options.some((option) => option.isCorrect)) {
                            hasCorrectAnswer = true;
                            invalidQuestions.push(`Question ${index + 1}`);
                        }
                        if (question.options.some((option) => option.content.trim() === '')) {
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
                if (id) {
                    console.log('updatedQuestions: ', updatedQuestions);
                    console.log('deletedQuestionIds: ', deletedQuestionIds);
                    const preparedData = prepareDataForUpdate();
                    console.log(preparedData);
                    // callAPIUpdate(preparedData);
                } else {
                    const preparedDataForCreate = prepareQuestionsForCreate(questions);
                    callAPICreate(preparedDataForCreate);
                }
                // setShowAddnewQuestionToast(true);
            }
        } else {
            window.alert('Please enter title of question set!');
        }
    };

    function callAPIUpdate(data) {
        axios
            .patch(`https://quiz-lab-server.onrender.com/api/quizzes/${id}`, data, {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMyIsImVtYWlsIjoidXNlcjNAZ21haWwuY29tIn0sImlhdCI6MTcxNDIwNTc0NywiZXhwIjoxNzE2Nzk3NzQ3fQ.LFFHvwQWuWokTwvJ3fKfSL1slCo48oyWvGxgkDkP-Fs`,
                },
            })
            .then((res) => {
                navigate('/manage-quizzes');
            })
            .catch((e) => {
                console.log(e);
            });
    }

    function callAPICreate(data) {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            axios
                .post(`https://quiz-lab-server.onrender.com/api/quizzes`, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    navigate('/manage-quizzes');
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }

    // useEffect(() => {
    //     if (coverImage) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setBase64Image(reader.result); // Update base64Image state when coverImage changes
    //         };
    //         reader.readAsDataURL(coverImage);
    //     }
    // }, [coverImage]);

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
                {id && (
                    <button className={cx('action__btn', 'action__btn-delete')} onClick={handleDelete}>
                        Delete
                    </button>
                )}
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
                        <h2 className={cx('modal__heading')}>Quiz Info</h2>
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
                                        {quizInfo.coverPicture && !coverImage && (
                                            <img
                                                id="preview"
                                                className={cx('cover-image__img')}
                                                src={quizInfo.coverPicture}
                                                alt=""
                                            />
                                        )}
                                        {coverImage && (
                                            <img
                                                id="preview"
                                                className={cx('cover-image__img')}
                                                src={URL.createObjectURL(coverImage)}
                                                alt=""
                                            />
                                        )}
                                        {!quizInfo.coverPicture && !coverImage && (
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
