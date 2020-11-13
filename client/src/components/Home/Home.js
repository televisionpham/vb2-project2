import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getUserInfo } from '../../store/slice/accountSlice';

const Home = (props) => {

    //JSON.parse(decodeURIComponent(escape(window.atob(localStorage.getItem('skill_sheet_cache')))))

    const dispatch = useDispatch();
    const token = useSelector(state => state.authReducer.token)

    if (!token) {
        <Redirect to="/login" />
    }

    useEffect(() => {
        const fetchUserInfo = async(token) => {
            const response = await dispatch(getUserInfo(token));
            console.log(response);
        }    
        console.log(token);
        fetchUserInfo(token);
    }, [token, dispatch])

    return (
        <div className="container" id="home">
            <div className="row">
                <div className="col-sm-12 col-md-4">Tên tài khoản</div>
                <div className="col-sm-12 col-md-4"><span className="font-weight-bold">username</span></div>
            </div>
        </div>
    );
}

export default Home;