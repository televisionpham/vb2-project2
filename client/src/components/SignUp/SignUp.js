import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signup } from "../../store/slice/authSlice";

const SignUp = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMsg("Passwords are not matched.");
            return;
        }
        setErrorMsg('');
        const user = {
            username,
            password            
        }  

        try {
            const resp = await dispatch(signup(user));
            console.log(resp);
            setErrorMsg('');
        } catch (error) {
            console.log(error);
        }          
    }

    return (
        <div className="container" style={{ marginTop: "100px" }}>
            <h3 className="text-center">Sign up</h3>
            <div className="row">
                <div className="col-sm-1 col-md-4"></div>
                <div className="col-sm-10 col-md-4">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" className="form-control" id="username" placeholder="Username" 
                                required
                                onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="Password" 
                                required
                                onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm password</label>
                            <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm password" 
                                required
                                onChange={(e) => setConfirmPassword(e.target.value)}/>
                        </div>
                        <div className="text-center">
                            { errorMsg ? <span className="text-danger">{errorMsg}</span>
                                       : null }
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary">Sign up</button>
                        </div>
                    </form>
                    <div className="text-center">
                        <span>Already have an account? <Link to="/signin" id="signin">Sign in</Link></span>
                    </div>                    
                </div>                
            </div>
        </div>
    );
}
 
export default SignUp;