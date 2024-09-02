import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../Assets/Logo.png";
import "./ResetForm.css";
import { toast } from "react-toastify";

const ResetForm = () => {
  const [formState, setFormState] = useState({
    email: "",
    newPassword: "",
    currentPassword: "",
  });
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Extract the token from the URL
  const token = new URLSearchParams(location.search).get("token");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    setError(""); // Clear error message on input change
  };

  const handleEmailSent = async (e) => {
    e.preventDefault();

    if (formState.newPassword !== formState.currentPassword) {
      setError("That password and confirm password don’t match");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/reset/password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formState.email,
            password: formState.newPassword,
            token: token,
          }),
        }
      );
      const data = await response.json();
      if (data?.code === 200 || data?.code === 1000) {
        // console.log("Password reset successful", data);
        // Redirect to login page or show a success message
        toast.success("Password reset successfully!");
        navigate("/");
      } else {
        console.error("Error during password reset", data?.data);
      }
    } catch (error) {
      console.error("Error during password reset", error);
      toast.error(error?.message);
    }
  };

  return (
    <div className="reset-form">
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
            value={formState.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="newPassword">New Password*</label>
          <input
            type="password"
            id="newPassword"
            className="input"
            value={formState.newPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="currentPassword">Confirm Password*</label>
          <input
            type="password"
            id="currentPassword"
            className="input"
            value={formState.currentPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="reset-button">
          Reset
        </button>
        {error && <div className="error-message">{error}</div>}
      </form>
      <div className="copyright">
        <p>Copyright © 2024 Smart Message Pioneer | Privacy Policy</p>
      </div>
    </div>
  );
};

export default ResetForm;
