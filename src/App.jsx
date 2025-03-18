import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./components/Authentication/AuthPage";
import FeedPage from "./components/FeedPage/FeedPage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import MessagesPage from "./components/MessagePage/MessagePage";
import FriendsPage from "./components/FriendsPage/FriendsPage";
import NotificationsPage from "./components/NotificationsPage/NotificationsPage";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/feed" />
            ) : (
              <AuthPage setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route
          path="/feed"
          element={isLoggedIn ? <FeedPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <ProfilePage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile/:id"
          element={isLoggedIn ? <ProfilePage /> : <Navigate to="/" />}
        />
        <Route
          path="/messages"
          element={isLoggedIn ? <MessagesPage /> : <Navigate to="/" />}
        />
        <Route
          path="/friends"
          element={isLoggedIn ? <FriendsPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={isLoggedIn ? <NotificationsPage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
