import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../Assets/Logo.png";
import "./ResetPw.css";
import { toast } from "react-toastify";

const ResetPw = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleEmailSent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/send/email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );
      const data = await response?.json();
      if (data?.code === 200 || data?.code === 1000) {
        // console.log("Login Up successful", data);
        navigate("/reset-pw/email-sent");
      } else {
        console.error("Error during Log in", data?.data);
      }
    } catch (error) {
      console.error("Error during Log in", error);
      toast.error(error?.message);
    }
  };

  return (
    <div className="reset-pw">
      <img src={logo} alt="Logo" className="logo" />
      <form className="form" onSubmit={handleEmailSent}>
        <h2>Reset Password</h2>
        <div className="text-1">
          <p>Please enter your email address to request a password reset.</p>
        </div>
        <div className="input-container">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="reset-button">
          Reset
        </button>
      </form>
      <div className="copyright">
        <p>Copyright © 2024 Smart Message Pioneer | Privacy Policy</p>
      </div>
    </div>
  );
};
export default ResetPw;
