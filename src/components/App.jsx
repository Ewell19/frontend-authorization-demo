import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils.auth";
import { getToken, setToken } from "../utils/token";
import * as api from "../utils.api";
import { AppContext } from "../context/appContext";
import "./styles/App.css";

function App() {
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRegistration = ({
    username,
    email,
    password,
    confirmPassword,
  }) => {
    if (password === confirmPassword) {
      auth
        .register(username, password, email)
        .then(() => {
          navigate("/login");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleLogin = ({ username, password }) => {
    if (!username || !password) {
      return;
    }
    auth
      .login(username, password)
      .then((data) => {
        if (data.jwt) {
          setToken(data.jwt);
          setUserData(data.user);
          setIsLoggedIn(true);
          navigate(location.state?.from.pathname || "/ducks");
          navigate(redirectpath);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    const jwt = getToken();

    if (!jwt) {
      return;
    }
    api
      .getUserInfo(jwt)
      .then((username, email) => {
        setUserData({ username, email });
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.error(err);
        setIsLoggedIn(false);
      });
  }, []);

  return (
    <AppContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, userData, setUserData }}
    >
      <Routes>
        <Route
          path="/ducks"
          element={
            <ProtectedRoute>
              <Ducks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <MyProfile userData={userData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute anonymous>
              <div className="loginContainer">
                <Login handleLogin={handleLogin} />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} anonymous>
              <div className="registerContainer">
                <Register handleRegistration={handleRegistration} />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            isLoggedIn ? (
              <Navigate to="/ducks" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        ></Route>
      </Routes>
    </AppContext.Provider>
  );
}

export default App;
