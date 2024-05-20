import classNames from 'classnames/bind';
import styles from './SignIn.module.scss';

import logo from '~/assets/img/logo.png';
import signIn from '~/assets/img/sign_in.png';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';

const cx = classNames.bind(styles);
function SignIn() {
    const navigate = useNavigate();

    const [visiblePassword, setVisiblePassword] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessageForEmail, setErrorMessageForEmail] = useState('');
    const [errorMessageForPassword, setErrorMessageForPassword] = useState('');

    const [isActiveSignInButton, setIsActiveSignInButton] = useState(false);

    const changeVisiblePassword = () => {
        setVisiblePassword(!visiblePassword);
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
            setErrorMessageForPassword('');
        }
    };

    const handleSignIn = async () => {
        try {
            const res = await axios.post(`https://quiz-lab-server.onrender.com/api/auth/login`, {
                email,
                password,
            });

            if (res?.status === 201) {
                localStorage.setItem('accessToken', res?.data?.accessToken);

                navigate('/');
                window.location.reload();
            }
        } catch (error) {
            alert('Email or password is not correct!');
        }
    };

    const handlePressKey = async (e) => {
        if (e.key === 'Enter') {
            await handleSignIn();
        }
    };

    useEffect(() => {
        if (errorMessageForEmail === '' && errorMessageForPassword === '') {
            setIsActiveSignInButton(true);
        } else {
            setIsActiveSignInButton(false);
        }
    }, [errorMessageForEmail, errorMessageForPassword]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('sign-in-content')}>
                <div className={cx('sign-in-text')}>
                    <div className={cx('sign-in-title')}>Sign in to your Account</div>
                    <div className={cx('sign-in-desc')}>Welcome back! Sign in here to access your account.</div>
                </div>
                <div className={cx('sign-in-form')}>
                    <div className={cx('custom-input__wrapper')}>
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            className={cx('custom-input')}
                            value={email}
                            onChange={(e) => handleChangeEmail(e)}
                            onKeyDown={handlePressKey}
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
                            onKeyDown={handlePressKey}
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
                        <button
                            onClick={() => {
                                if (isActiveSignInButton) handleSignIn();
                            }}
                            className={cx(`custom-input__button${isActiveSignInButton ? '-active' : ''}`)}
                        >
                            Sign In
                        </button>
                    </div>
                    <div className={cx('sign-in-create_account')}>
                        Don't have an account?
                        <a href="/sign-up" className={cx('create-acount-link')}>
                            Create an account.
                        </a>
                    </div>
                </div>
            </div>
            <div className={cx('sign-in-picture')}>
                <a href="/" className={cx('logo-link')}>
                    <img src={logo} alt="Logo" className={cx('logo')} />
                </a>
                <img src={signIn} alt="Sign in picture" className={cx('sign-in-piture')} />
            </div>
        </div>
    );
}

export default SignIn;
