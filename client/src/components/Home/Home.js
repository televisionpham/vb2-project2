import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../store/slice/accountSlice';
import { Redirect } from "react-router-dom";

const Home = (props) => {

    //JSON.parse(decodeURIComponent(escape(window.atob(localStorage.getItem('skill_sheet_cache')))))

    const dispatch = useDispatch();
    const token = useSelector(state => state.authReducer.token)  
    const [username, setUsername] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [address, setAddress] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [use2fa, setUse2fa] = useState();
    const [qrCodeImage, setQrCodeImage] = useState();

    useEffect(() => {
        if (!token) {
            return;
        }
        (async function fetchUserInfo() {
            try {
                const response = await dispatch(getUserInfo(token));
                if (response.payload.id) {
                    setUsername(response.payload.userName);
                }
            } catch (error) {
                console.log(error);
            }
        })();  
    }, [dispatch, token])

    return (
        <div className="container" id="home">
            <div className="row">
            <div className="col-sm-12 col-md-1"></div>
                <div className="col-sm-12 col-md-2">Tên tài khoản:</div>
                <div className="col-sm-12 col-md-4"><span className="font-weight-bold">{username}</span></div>
            </div>
        </div>
    );
}

export default Home;