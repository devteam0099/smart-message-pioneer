import React from "react";
import logo from "../../Assets/Logo.png";
import sent from "../../Assets/EmailSent.png";
import "./EmailSent.css";

const EmailSent = () => {
  return (
    <div className="email-sent">
      <img src={logo} alt="Logo" className="logo" />
      <form className="form">
        <h2>Email Sent</h2>
        <img src={sent} alt="email-sent-logo" className="email-sent-logo" />
        <p className="text-1">An email has been sent on your email address,</p>
        <p className="text-2">********mslm.io.</p>
        <p className="text-3">
          Follow the directions in the email to reset your password.
        </p>
      </form>
      <div className="copyright">
        <p>Copyright © 2024 Smart Message Pioneer | Privacy Policy</p>
      </div>
    </div>
  );
};
export default EmailSent;
