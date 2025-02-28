import React, { useContext, useState } from "react";
import AuthLayout from "../../src/components/layout/AuthLayout";
import { useNavigate, Link } from "react-router-dom";
import ProfilePicSelector from "../../src/components/input/ProfilePicSelector";
import AuthInput from "../../src/components/input/AuthInput";
import { validateEmail } from "../../src/utils/helper";
import axiosInstance from "../../src/utils/axiosInstance";
import { API_PATHS } from "../../src/utils/apiPaths";
import { UserContext } from "../../src/context/UserContext";
import uploadImage from "../../src/utils/uploadImage";

const SignUpForm = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  //handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";
  
    // Validate inputs
    if (!fullName) {
      setError("Please enter the full name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!username) {
      setError("Please enter username");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");
  
    try {
      // Upload profile picture if provided
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
  
      // Call the register API
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        username,
        email,
        password,
        profileImageUrl,
      });
  
      const { token, user } = response.data;
  
      // If token is missing, throw an error to catch block
      if (!token) {
        throw new Error("Registration failed: No token received.");
      }
  
      // Save token and update user context, then navigate to dashboard
      localStorage.setItem("token", token);
      updateUser(user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error: ", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again");
      }
    }
  };
  

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignup}>
          <ProfilePicSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AuthInput
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              type="text"
              placeholder="John"
            />
            <AuthInput
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="email"
            />
            <AuthInput
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              label="Username"
              placeholder="@"
              type="text"
            />
            <AuthInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 Characters"
              type="password"
            />
            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <button type="submit" className="btn-primary">
              CREATE ACCOUNT
            </button>

            <p className="text-[13px] text-slate-800 mt-3">
              Already have an account?
              <Link className="font-medium text-sky-500 underline" to="/login">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUpForm;
