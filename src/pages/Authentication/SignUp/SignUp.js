import classNames from 'classnames/bind';
import styles from './SignUp.module.scss';

import logo from '~/assets/img/logo.png';
import signIn from '~/assets/img/sign_up.png';

import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const cx = classNames.bind(styles);
function SignUp() {
    const navigate = useNavigate();

    const [isDisplayAuthForm, setIsDisplayAuthForm] = useState(false);

    const [visiblePassword, setVisiblePassword] = useState(false);
    const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('male');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isActiveNextButton, setIsActiveNextButton] = useState(false);
    const [isActiveSignUpButton, setIsActiveSignUpButton] = useState(false);

    const [errorMessageForFirstName, setErrorMessageForFirstName] = useState();
    const [errorMessageForLastName, setErrorMessageForLastName] = useState();
    const [errorMessageForBirthday, setErrorMessageForBirthday] = useState();
    const [errorMessageForEmail, setErrorMessageForEmail] = useState();
    const [errorMessageForPassword, setErrorMessageForPassword] = useState();
    const [errorMessageForConfirmPassword, setErrorMessageForConfirmPassword] = useState();

    const changeVisiblePassword = () => {
        setVisiblePassword(!visiblePassword);
    };

    const changeVisibleConfirmPassword = () => {
        setVisibleConfirmPassword(!visibleConfirmPassword);
    };

    const handleChangeFirstName = (e) => {
        const currentFirstName = e.target.value;

        setFirstName(currentFirstName);
        if (!currentFirstName) {
            setErrorMessageForFirstName('First name cannot be empty!');
        } else {
            setErrorMessageForFirstName('');
        }
    };

    const handleChangeLastName = (e) => {
        const currentLastName = e.target.value;

        setLastName(currentLastName);
        if (!currentLastName) {
            setErrorMessageForLastName('Last name cannot be empty!');
        } else {
            setErrorMessageForLastName('');
        }
    };

    const handleChangeDateOfBirth = (e) => {
        const currentDateOfBirth = e.target.value;

        setDateOfBirth(currentDateOfBirth);
        if (!currentDateOfBirth) {
            setErrorMessageForBirthday('Birthday cannot be empty!');
        } else {
            setErrorMessageForBirthday('');
        }
    };

    const handleChangeGender = (e) => {
        const currentGender = e.target.value;

        setGender(currentGender);
    };

    const handleChangeEmail = (e) => {
        const currentEmail = e.target.value;

        setEmail(currentEmail);
        if (!currentEmail) {
            setErrorMessageForEmail('Email cannot be empty!');
        } else {
            if (!validateEmail(currentEmail)) {
                setErrorMessageForEmail('Invalid email!');
            } else {
                setErrorMessageForEmail('');
            }
        }
    };

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            );
    };

    const handleChangePassword = (e) => {
        const currentPassword = e.target.value;

        setPassword(currentPassword);
        if (!currentPassword) {
            setErrorMessageForPassword('Password cannot be empty!');
        } else {
            if (currentPassword?.length < 8) {
                setErrorMessageForPassword('Password must be at least 8 characters!');
            } else {
                setErrorMessageForPassword('');
            }
        }
    };

    const handleChangeConfirmPassword = (e) => {
        const currentConfirmPassword = e.target.value;

        setConfirmPassword(currentConfirmPassword);
        if (!currentConfirmPassword) {
            setErrorMessageForConfirmPassword('Confirm password cannot be empty!');
        } else {
            if (currentConfirmPassword !== password) {
                setErrorMessageForConfirmPassword('Passwords do not match!');
            } else {
                setErrorMessageForConfirmPassword('');
            }
        }
    };

    const handleClickNextButton = () => {
        if (isActiveNextButton) {
            setIsDisplayAuthForm(true);
        }
    };

    useEffect(() => {
        if (errorMessageForFirstName === '' && errorMessageForLastName === '') {
            setIsActiveNextButton(true);
        } else {
            setIsActiveNextButton(false);
        }
    }, [errorMessageForFirstName, errorMessageForLastName]);

    useEffect(() => {
        if (
            errorMessageForEmail === '' &&
            errorMessageForPassword === '' &&
            errorMessageForConfirmPassword === '' &&
            errorMessageForBirthday === ''
        ) {
            setIsActiveSignUpButton(true);
        } else {
            setIsActiveSignUpButton(false);
        }
    }, [errorMessageForEmail, errorMessageForPassword, errorMessageForConfirmPassword, errorMessageForBirthday]);

    const handleSignUp = async () => {
        try {
            const res = await axios.post(`https://quiz-lab-server.onrender.com/api/auth/sign-up`, {
                email,
                password,
                firstName,
                lastName,
                gender,
                dateOfBirth,
            });

            if (res?.status === 201) {
                navigate('/sign-in');
                window.location.reload();
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('sign-up-content')}>
                <div className={cx('arrow-icon-wrapper')}>
                    <FontAwesomeIcon
                        className={cx('arrow-icon')}
                        onClick={() => setIsDisplayAuthForm(false)}
                        icon={isDisplayAuthForm ? faArrowAltCircleLeft : ''}
                    />
                </div>
                <div className={cx('sign-up-text')}>
                    <div className={cx('sign-up-title')}>Create a new Account for free</div>
                    <div className={cx('sign-up-desc')}>Welcome to QuizLab! We make your life simpler.</div>
                </div>
                {isDisplayAuthForm ? (
                    <div className={cx('sign-up-form')}>
                        <div className={cx('custom-input__wrapper')}>
                            <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                className={cx('custom-input')}
                                value={email}
                                onChange={(e) => handleChangeEmail(e)}
                            />
                        </div>
                        {errorMessageForEmail && (
                            <div className={cx('error-message-wrapper')}>
                                <span className={cx('error-message')}>{errorMessageForEmail}</span>
                            </div>
                        )}

                        <div className={cx('custom-input__wrapper')}>
                            <input
                                type={visiblePassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                className={cx('custom-input')}
                                value={password}
                                onChange={(e) => handleChangePassword(e)}
                            />
                            <FontAwesomeIcon
                                className={cx('eye-slash-icon')}
                                onClick={changeVisiblePassword}
                                icon={visiblePassword ? faEye : faEyeSlash}
                            />
                        </div>
                        {errorMessageForPassword && (
                            <div className={cx('error-message-wrapper')}>
                                <span className={cx('error-message')}>{errorMessageForPassword}</span>
                            </div>
                        )}

                        <div className={cx('custom-input__wrapper')}>
                            <input
                                type={visibleConfirmPassword ? 'text' : 'password'}
                                name="confirm-password"
                                placeholder="Confirm Password"
                                className={cx('custom-input')}
                                value={confirmPassword}
                                onChange={(e) => handleChangeConfirmPassword(e)}
                            />
                            <FontAwesomeIcon
                                className={cx('eye-slash-icon')}
                                onClick={changeVisibleConfirmPassword}
                                icon={visibleConfirmPassword ? faEye : faEyeSlash}
                            />
                        </div>
                        {errorMessageForConfirmPassword && (
                            <div className={cx('error-message-wrapper')}>
                                <span className={cx('error-message')}>{errorMessageForConfirmPassword}</span>
                            </div>
                        )}

                        <div className={cx('custom-input__wrapper')}>
                            <button
                                onClick={() => {
                                    if (isActiveSignUpButton) handleSignUp();
                                }}
                                className={cx(`custom-input__button${isActiveSignUpButton ? '-active' : ''}`)}
                            >
                                Sign Up
                            </button>
                        </div>
                        <div className={cx('sign-up-create_account')}>
                            Already have an account?
                            <a href="/sign-in" className={cx('create-acount-link')}>
                                Sign in here.
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className={cx('sign-up-form')}>
                        <div className={cx('custom-input__wrapper')}>
                            <input
                                type="text"
                                name="first-name"
                                placeholder="First Name"
                                className={cx('custom-input')}
                                value={firstName}
                                onChange={(e) => handleChangeFirstName(e)}
                            />
                        </div>
                        {errorMessageForFirstName && (
                            <div className={cx('error-message-wrapper')}>
                                <span className={cx('error-message')}>{errorMessageForFirstName}</span>
                            </div>
                        )}

                        <div className={cx('custom-input__wrapper')}>
                            <input
                                type="text"
                                name="last-name"
                                placeholder="Last Name"
                                className={cx('custom-input')}
                                value={lastName}
                                onChange={(e) => handleChangeLastName(e)}
                            />
                        </div>
                        {errorMessageForLastName && (
                            <div className={cx('error-message-wrapper')}>
                                <span className={cx('error-message')}>{errorMessageForLastName}</span>
                            </div>
                        )}

                        <div className={cx('custom-input__wrapper')}>
                            <select
                                value={gender}
                                onChange={(e) => handleChangeGender(e)}
                                className={cx('custom-input')}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className={cx('custom-input__wrapper')}>
                            <input
                                type="text"
                                onFocus={(e) => (e.target.type = 'date')}
                                name="date-of-birth"
                                placeholder="Birthday"
                                className={cx('custom-input')}
                                value={dateOfBirth}
                                onChange={(e) => handleChangeDateOfBirth(e)}
                            />
                        </div>
                        {errorMessageForBirthday && (
                            <div className={cx('error-message-wrapper')}>
                                <span className={cx('error-message')}>{errorMessageForBirthday}</span>
                            </div>
                        )}

                        <div className={cx('custom-input__wrapper')}>
                            <button
                                onClick={handleClickNextButton}
                                className={cx(`custom-input__button${isActiveNextButton ? '-active' : ''}`)}
                            >
                                Next
                            </button>
                        </div>
                        <div className={cx('sign-up-create_account')}>
                            Already have an account?
                            <a href="/sign-in" className={cx('create-acount-link')}>
                                Sign in here.
                            </a>
                        </div>
                    </div>
                )}
            </div>
            <div className={cx('sign-up-picture')}>
                <a href="/" className={cx('logo-link')}>
                    <img src={logo} alt="Logo" className={cx('logo')} />
                </a>
                <img src={signIn} alt="Sign in picture" className={cx('sign-up-piture')} />
            </div>
        </div>
    );
}

export default SignUp;
