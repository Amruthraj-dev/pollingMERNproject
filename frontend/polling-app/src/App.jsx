import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "../pages/Dashboard/Home";
import LoginForm from "../pages/Auth/LoginForm";
import SignUpForm from "../pages/Auth/SignUpForm";
import CreatePoll from "../pages/Dashboard/CreatePoll";
import Mypolls from "../pages/Dashboard/Mypolls";
import VotedPolls from "../pages/Dashboard/VotedPolls";
import Bookmarks from "../pages/Dashboard/Bookmarks";
import UserProvider from "./context/UserContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" exact element={<LoginForm />} />
            <Route path="/signup" exact element={<SignUpForm />} />
            <Route path="/dashboard" exact element={<Home />} />
            <Route path="/create-poll" exact element={<CreatePoll />} />
            <Route path="/my-polls" exact element={<Mypolls />} />
            <Route path="/voted-polls" exact element={<VotedPolls />} />
            <Route path="/bookmarked-polls" exact element={<Bookmarks />} />
          </Routes>
        </Router>

        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </UserProvider>
    </div>
  );
};

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="login" />
  );
};
