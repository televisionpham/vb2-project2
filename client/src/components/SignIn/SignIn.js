import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from '../../store/slice/authSlice'

const SignIn = (props) => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [errorMsg, setErrorMsg] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username,
            password
        }

        try {
            const response = await dispatch(login(user));
            console.log(response);
            if (!response.payload.error) {
                console.log(response.payload.token);                
                props.history.push('/');
            } else if (response.payload.error) {
                setErrorMsg(response.payload.error.reponse.data);
            }
        } catch (error) {
            console.log(error);
            setErrorMsg(error);
        }
    }

    return (
        <div className="container" style={{ marginTop: "100px" }}>
            <h3 className="text-center">Đăng nhập</h3>
            <div className="row">
                <div className="col-sm-1 col-md-4"></div>
                <div className="col-sm-10 col-md-4">
                    <form onSubmit={handleSubmit}>
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
                        <div className="text-center" style={{marginBottom: "10px"}}>
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

export default SignIn;