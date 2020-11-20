import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, loginSuccess } from '../../store/slice/authSlice'
import { requestChallenge } from '../../api/auth';
import { HttpHeaders } from '../../constants';
import crypto from 'crypto';

const SignIn = (props) => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [errorMsg, setErrorMsg] = useState();
    const [otpCode, setOtpCode] = useState('');
    const [showVerifyOtpForm, setShowVerifyOtpForm] = useState(false);
    const [challengeHash, setChallengeHash] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const credentials = {
            username,
            password,
            otpCode
        }

        try {
            const response = await dispatch(login(credentials));
            if (response) {
                if (!response.payload.error) {
                    console.log(response.payload.token);
                    props.history.push('/');
                } else {
                    console.log();
                    if (response.payload.error.response.status === 401 &&
                        response.payload.error.response.headers[HttpHeaders.WWW_AUTHENTICATE] === "OTP") {
                        setShowVerifyOtpForm(true);
                    } else {
                        setErrorMsg(response.payload.error.response.data);
                    }
                }
            }
        } catch (error) {
            console.log(error);
            setErrorMsg(error.response);
        }
    }

    const handleChallenge = async (e) => {
        e.preventDefault();
        try {
            const response1 = await requestChallenge("c=" + username);
            console.log(response1);
        } catch (error1) {
            console.log(error1.response);
            if (error1.response) {
                if (error1.response.status === 401) {
                    let wwwAuth = error1.response.headers[HttpHeaders.WWW_AUTHENTICATE];
                    console.log(wwwAuth);
                    if (wwwAuth !== "OTP") {
                        const parts = wwwAuth.split('.');
                        const salt = parts[0];
                        const challenge = parts[1];
                        const sha1 = crypto.createHash('sha1');
                        const passwordHash = sha1.update(salt + password).digest('base64')
                        console.log('passwordHash', passwordHash);
                        const md5 = crypto.createHash('md5');
                        const answer = md5.update(passwordHash + challenge).digest('base64');
                        console.log('passwordHash + challenge', passwordHash + challenge)
                        console.log('hash(passwordHash + challenge)', answer)
                        setChallengeHash(answer);
                        try {
                            const response2 = await requestChallenge("r=" + answer + ",o=" + otpCode);
                            console.log(response2);
                        } catch (error2) {
                            console.log(error2);
                            if (error2.response && error2.response.status === 401) {
                                wwwAuth = error2.response.headers[HttpHeaders.WWW_AUTHENTICATE];
                                if (wwwAuth === 'OTP') {
                                    setShowVerifyOtpForm(true);
                                }
                            }
                        }

                    }
                } else {
                    setErrorMsg("ERROR: " + error1.status);
                }
            } else {
                setErrorMsg(error1.message)
            }
        }
    }

    const handleVerifyOtpCode = async (e) => {
        e.preventDefault();
        console.log(challengeHash);
        try {
            const response = await requestChallenge("r=" + challengeHash + ",o=" + otpCode);
            console.log(response);
            if (response && response.status === 200) {
                dispatch(loginSuccess(response.data));
                props.history.push('/');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const signInForm = () => {
        return (
            <div className="container" style={{ marginTop: "100px" }}>
                <h3 className="text-center">Đăng nhập</h3>
                <div className="row">
                    <div className="col-sm-1 col-md-4"></div>
                    <div className="col-sm-10 col-md-4">
                        <form onSubmit={handleChallenge}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input type="text" className="form-control" id="username" placeholder="Username"
                                    required
                                    onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Password"
                                    required
                                    onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="text-center" style={{ marginBottom: "10px" }}>
                                {errorMsg ? <span className="text-danger">{errorMsg}</span>
                                    : null}
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary">Đăng nhập</button>
                            </div>
                        </form>
                        <div className="text-center">
                            <span>Chưa có tài khoản? <Link to="/register" id="register">Đăng ký</Link></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const verifyOtpForm = () => {
        return (
            <div>
                <br />
                <div className="row">
                    <div className="col-sm-12 col-md-2"></div>
                    <div className="col-sm-12 col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Xác thực 2 yếu tố</h4>
                                <form onSubmit={handleVerifyOtpCode}>
                                    <div className="form-group">
                                        <label htmlFor="otpCode">Mã OTP</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="otpCode"
                                            value={otpCode}
                                            placeholder="Mã OTP"
                                            onChange={(e) => setOtpCode(e.target.value)}
                                        />
                                    </div>
                                    <div className="text-center" style={{ marginBottom: "10px" }}>
                                        {errorMsg ? <span className="text-danger">{errorMsg}</span>
                                            : null}
                                    </div>
                                    <button className="btn btn-primary" type="submit">
                                        Xác thực
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            { showVerifyOtpForm ? verifyOtpForm() : signInForm()}
        </div>
    );
}

export default SignIn;