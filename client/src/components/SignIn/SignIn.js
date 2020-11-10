import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signin } from '../../store/slice/authSlice'

const SignIn = () => {
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
            const resp = await dispatch(signin(user));
            console.log(resp);
            setErrorMsg('');
        } catch (error) {
            console.log(error);
        }   
    }

    return (
        <div className="container" style={{ marginTop: "100px" }}>
            <h3 className="text-center">Sign in</h3>
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
                        <div className="text-center">
                            {errorMsg ? <span className="text-danger">{errorMsg}</span>
                                : null}
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary">Sign in</button>
                        </div>
                    </form>
                    <div className="text-center">
                        <span>Don't have an account? <Link to="/signup" id="signup">Sign up</Link></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;