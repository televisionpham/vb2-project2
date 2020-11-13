import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../store/slice/accountSlice';
import { Redirect } from "react-router-dom";

const Home = (props) => {

    //JSON.parse(decodeURIComponent(escape(window.atob(localStorage.getItem('skill_sheet_cache')))))

    const dispatch = useDispatch();
    const token = useSelector(state => state.authReducer.token)  
    console.log(token);

    useEffect(() => {
        if (!token) {
            return;
        }
        (async function fetchUserInfo() {
            try {
                const response = await dispatch(getUserInfo(token));
                console.log(response);
                return response;
            } catch (error) {
                console.log(error);
            }
        })();  
    }, [dispatch, token])

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