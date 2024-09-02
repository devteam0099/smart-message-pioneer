import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import overlay from "../../Assets/SignUp.png";
import logo from "../../Assets/Logo.png";
import "./LogIn.css";
import { toast } from "react-toastify";
import { useFollowerContext } from "../../Utils/Context/Context";
import { clearCookie, handleLocalStorageClear } from "../../Utils/helper";

const LogIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setProfileData } = useFollowerContext();

  const handleSignup = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  const handlePwReset = (e) => {
    e.preventDefault();
    navigate("/reset-pw");
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data?.code === 200 || data?.code === 1000) {
        // function getFullCookie(name) {
        //   const value = `; ${document.cookie}`;
        //   const parts = value.split(`; ${name}=`);
        //   if (parts.length === 2) return parts.pop().split(";").shift();
        //   return null;
        // }
        // const authSession = await getFullCookie("auth_session");
        // console.log(`auth_session=${authSession}`);

        const cookies1 = document.cookie;
        // console.log("const cookies1 = document.cookie;", cookies1);

        const expireDate = new Date();
        expireDate.setFullYear(expireDate.getFullYear() + 10); // Set cookie to expire in 10 years
        document.cookie = `${cookies1}; expires=${expireDate.toUTCString()}; path=/`;

        // console.log("Login Up successful", data, response, document.cookie);
        const originalString = `${data?.data?.role}!`;
        const encodedString = btoa(originalString);
        localStorage.setItem("role", encodedString);
        // console.log("data?.data for login", data?.data)
        setProfileData({
          ...data?.data,
          gender: {
            label:
              data?.data?.gender?.charAt(0).toUpperCase() +
              data?.data?.gender?.slice(1).toLowerCase(),
            value:
              data?.data?.gender?.charAt(0).toUpperCase() +
              data?.data?.gender?.slice(1).toLowerCase(),
          },
        });
        localStorage.setItem(
          "profile",
          JSON.stringify({
            ...data?.data,
            gender: {
              label:
                data?.data?.gender?.charAt(0).toUpperCase() +
                data?.data?.gender?.slice(1).toLowerCase(),
              value:
                data?.data?.gender?.charAt(0).toUpperCase() +
                data?.data?.gender?.slice(1).toLowerCase(),
            },
          })
        );
        if (cookies1) {
          console.log("Auth session saved to state", cookies1, originalString);
          if (originalString === "AGENT!") {
            navigate("/dashboard");
            toast.success("Login successfully");
          } else if (originalString === "USER!") {
            navigate("/account-management");
            toast.success("Login successfully");
          } else if (originalString === "ADMIN!") {
            navigate("/admin/ticket-management");
            toast.success("Login successfully");
          } else {
            clearCookie("auth_session");
            handleLocalStorageClear();
            navigate("/");
            toast.error("Access Denied");
          }
        }
      } else {
        toast.error("Error during Log in");
      }
    } catch (error) {
      console.error(error?.message);
      toast.error(error?.message);
    }
  };
  return (
    <div className="container login-page">
      <div className="left-side">
        <img src={logo} alt="Logo" className="overlay-logo" />
        <div className="overlay-text">
          Elevate Your CRM with Smart Message Pioneer for WhatsApp!
        </div>
        <img src={overlay} alt="Overlay" className="overlay-image" />
      </div>

      <div className="right-side">
        <form className="form" onSubmit={handleLogin}>
          <div className="login-text">
            <p>Log in</p>
          </div>
          <div className="input-container">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button-signup">
            Log In
          </button>
          <div className="forget-password" onClick={handlePwReset}>
            <p>Forget your password</p>
          </div>
          <div className="text-1">
            <p>New to Smart Message Pioneer</p>
          </div>
          <button type="button" className="button-login" onClick={handleSignup}>
            Create an account
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
