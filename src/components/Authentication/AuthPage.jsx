import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./AuthPage.css";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Social Media Platform</h1>
          <p>Connect with friends and share your moments</p>
        </div>

        <div className="auth-tabs">
          <div className="auth-tabs-list">
            <button
              className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
          </div>

          <div className="auth-tabs-content">
            {activeTab === "login" && <LoginForm />}
            {activeTab === "register" && (
              <RegisterForm setActiveTab={setActiveTab} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
