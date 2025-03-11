import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../src/components/layout/AuthLayout";
import AuthInput from "../../src/components/options/AuthInput";
import { validateEmail } from "../../src/utils/helper";
import axiosInstance from "../../src/utils/axiosInstance";
import { API_PATHS } from "../../src/utils/apiPaths";
import { UserContext } from "../../src/context/UserContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }
    setError("");

    //Login API
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
          <AuthInput
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="please use john@gmail.com for login"
            type="text"
          />
          <AuthInput
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="password- 12345"
            type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submmit" className="btn-primary">
            LOGIN
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?
            <Link className="font-medium text-sky-500 underline" to="/signup">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;
