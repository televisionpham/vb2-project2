import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register } from '../../store/slice/authSlice';


const SignUp = (props) => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMsg("Mật khẩu không khớp.");
            return;
        }
        setErrorMsg('');
        const user = {
            username,
            password            
        }  

        try {
            const response = await dispatch(register(user));            
            if (!response.payload.error) {
                console.log(response.payload.token);                
                props.history.push('/');
            } else {
                if (response.payload.error.response) {
                    setErrorMsg(response.payload.error.response.data);
                }
                else {
                    setErrorMsg(response.payload.error.message);
                }
            }
        } catch (error) {
            console.log(error);
            setErrorMsg("Có lỗi xảy ra");
        }          
    }

    return (
        <div className="container" style={{ marginTop: "100px" }}>
            <h3 className="text-center">Đăng ký</h3>
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
                        <div className="text-center" style={{marginBottom: "10px"}}>
                            { errorMsg ? <span className="text-danger">{errorMsg}</span>
                                       : null }
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary">Đăng ký</button>
                        </div>
                    </form>
                    <div className="text-center">
                        <span>Đã có tài khoản? <Link to="/login" id="login">Đăng nhập</Link></span>
                    </div>                    
                </div>                
            </div>
        </div>
    );
}
 
export default SignUp;