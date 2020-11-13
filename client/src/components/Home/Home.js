import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  requestQrCode,
  requestActivate2fa,
  requestDeactivate2fa,
  requestUpdateInfo,
} from "../../api/account";
import { getUserInfo } from "../../store/slice/accountSlice";
import { updateUserInfo } from "../../store/slice/authSlice";

const Home = (props) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);
  const otpVerified = useSelector((state) => state.authReducer.otpVerified);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [use2fa, setUse2fa] = useState("");
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showQrCode, setShowQrCode] = useState(false);
  const [showHideQrCode, setShowHideQrCode] = useState("Hiển thị QR code");

  useEffect(() => {
    if (!token) {
      return (
        <div>
          <h1>Không lấy được thông tin người dùng</h1>
        </div>
      );
    }
    (async function fetchUserInfo() {
      try {
        const response = await dispatch(getUserInfo(token));
        console.log(response);

        if (!response.payload.error) {
          const user = response.payload;
          setUsername(user.userName);
          setFirstName(user.firstName);
          setLastName(user.lastName);
          setAddress(user.address);
          setEmail(user.email);
          setPhone(user.phone);
          setUse2fa(user.use2fa);
          dispatch(updateUserInfo(user));
          console.log("otpVerified", otpVerified);
          if (user.use2fa && !otpVerified) {
            props.history.push("/verifyotp");
          }
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [dispatch, otpVerified, props.history, token]);

  if (!token) {
    return <Redirect to="/login" />;
  }

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    try {
      const user = {
        userName: username,
        firstName,
        lastName,
        address,
        email,
        phone,
      };
      const response = await requestUpdateInfo(token, user);
      console.log(response);
      dispatch(updateUserInfo(user));
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleShowHideQrCode = async (e) => {
    e.preventDefault();

    if (!showQrCode) {
      try {
        const response = await requestQrCode(token);
        console.log(response);
        if (response.status === 200) {
          setShowQrCode(!showQrCode);
          setQrCodeImage(response.data);
          setShowHideQrCode("Ẩn QR code");
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowHideQrCode("Hiển thị QR code");
    }
  };

  const handleActivate2fa = async (e) => {
    e.preventDefault();

    try {
      const response = await requestActivate2fa(token);
      console.log(response);

      if (response.status === 200) {
        setUse2fa(true);
        setShowQrCode(false);
        setShowHideQrCode("Hiển thị QR code");
        setErrorMsg("");
      } else {
      }
    } catch (error) {
      console.log(error.message);
      alert(error);
    }
  };

  const handleDeactivate2fa = async (e) => {
    e.preventDefault();

    try {
      const response = await requestDeactivate2fa(token);
      console.log(response);

      if (response.status === 200) {
        setUse2fa(false);
        setShowQrCode(false);
        setShowHideQrCode("Hiển thị QR code");
      } else {
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <div className="container" id="home">
      {errorMsg ? (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      ) : null}
      <br />
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">
            Xác thực 2 yếu tố:{" "}
            {use2fa ? (
              <span className="text-success">Đã kích hoạt</span>
            ) : (
              <span className="text-warning">Chưa kích hoạt</span>
            )}
          </h4>
          {use2fa ? (
            <div className="text-center">
              <div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleDeactivate2fa}
                >
                  Vô hiệu 2FA
                </button>
              </div>
              <br />
              <div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleShowHideQrCode}
                >
                  {showHideQrCode}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleActivate2fa}
                >
                  Kích hoạt 2FA
                </button>
              </div>
            </div>
          )}

          {showQrCode && use2fa ? (
            <div className="text-center">
              <img
                src={"data:image/png;base64, " + qrCodeImage}
                alt="QR code"
              />
            </div>
          ) : null}
        </div>
      </div>
      <br />
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Thông tin cá nhân</h4>
          <form onSubmit={handleSubmitInfo}>
            <div className="form-group row">
              <label
                htmlFor="username"
                className="col-sm-12 col-md-2 col-form-label"
              >
                Tên tài khoản
              </label>
              <div className="col-sm-12 col-md-10">
                <span className="font-weight-bold text-center" id="username">
                  {username}
                </span>
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="lastName"
                className="col-sm-12 col-md-2 col-form-label"
              >
                Họ
              </label>
              <div className="col-sm-12 col-md-10">
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="firstName"
                className="col-sm-12 col-md-2 col-form-label"
              >
                Tên
              </label>
              <div className="col-sm-12 col-md-10">
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="address"
                className="col-sm-12 col-md-2 col-form-label"
              >
                Địa chỉ
              </label>
              <div className="col-sm-12 col-md-10">
                <textarea
                  rows="3"
                  className="form-control"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="email"
                className="col-sm-12 col-md-2 col-form-label"
              >
                Email
              </label>
              <div className="col-sm-12 col-md-10">
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="phone"
                className="col-sm-12 col-md-2 col-form-label"
              >
                Phone
              </label>
              <div className="col-sm-12 col-md-10">
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="text-center" style={{ marginBottom: "10px" }}>
              {errorMsg ? (
                <span className="text-danger">{errorMsg}</span>
              ) : null}
            </div>
            <button type="submit" className="btn btn-primary">
              Cập nhật
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
