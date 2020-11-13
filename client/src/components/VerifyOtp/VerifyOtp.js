import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestVerifyOtp } from "../../api/account";
import { verifyOtpSuccess } from "../../store/slice/authSlice";

const VerifyOtp = (props) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(otpCode, token);
      const response = await requestVerifyOtp(token, otpCode);
      console.log(response);
      if (response.status === 200) {
        dispatch(verifyOtpSuccess(true));
        props.history.push("/");
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <div>
      <br />
      <div className="row">
        <div className="col-sm-12 col-md-2"></div>
        <div className="col-sm-12 col-md-8">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Xác thực 2 yếu tố</h4>
              <form onSubmit={handleSubmit}>
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
};

export default VerifyOtp;
