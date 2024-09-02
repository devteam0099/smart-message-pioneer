import React, { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import overlay from "../../Assets/SignUp.png";
import logo from "../../Assets/Logo.png";
import "./SignUp.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const handlePwReset = (e) => {
    e.preventDefault();
    navigate("/reset-pw");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/user/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullname: name,
            email: email,
            password: password,
            role: "USER",
          }),
        }
      );

      const data = await response?.json();
      if (data?.code === 200 || data?.code === 1000) {
        toast.success("Sign Up successful");
        navigate("/");
      } else {
        console.error("Error during sign up", data?.data);
        toast.error(data?.data || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error during sign up", error);
      toast.error(error?.message);
    }
  };

  return (
    <div className="container signup-page">
      <div className="left-side">
        <img src={logo} alt="Logo" className="overlay-logo" />
        <div className="overlay-text">
          Elevate Your CRM with Smart Message Pioneer for WhatsApp!
        </div>
        <img src={overlay} alt="Overlay" className="overlay-image" />
      </div>

      <div className="right-side">
        <form className="form" onSubmit={handleSignUp}>
          <div className="signin-text">
            <p>Sign in</p>
          </div>
          <div className="input-container">
            <label className="label">Name</label>
            <input
              type="text"
              id="name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-container">
            <label className="label">Email</label>
            <input
              type="email"
              id="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-container">
            <label className="label">Password</label>
            <input
              type="password"
              id="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="button-signup">
            Sign Up
          </button>
          <div className="text-1">
            <p>
              By continuing, you agree to the{" "}
              <a href="/terms-of-use" className="link">
                Terms of use
              </a>{" "}
              and{" "}
              <a href="/privacy-policy" className="link">
                Privacy Policy
              </a>
              .
            </p>
          </div>
          <div className="forget-password" onClick={handlePwReset}>
            <p>Forget your password</p>
          </div>
          <div className="text-2">
            <p>Already have an account</p>
          </div>
          <button type="button" className="button-login" onClick={handleLogin}>
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
