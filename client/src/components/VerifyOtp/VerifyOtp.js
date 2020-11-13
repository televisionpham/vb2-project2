import React, { useState } from "react";
import { useSelector } from "react-redux";
import { requestVerifyOtp } from "../../api/account";

const VerifyOtp = (props) => {
  const token = useSelector((state) => state.authReducer.token);
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(otpCode, token);
      const response = await requestVerifyOtp(token, otpCode);
      console.log(response);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="otpCode">OTP Code</label>
          <input
            className="form-control"
            type="text"
            id="otpCode"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Xác thực
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
