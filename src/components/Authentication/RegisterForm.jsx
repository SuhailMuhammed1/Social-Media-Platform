import { useState } from "react";
import "./Forms.css";
import { registerUser } from "../../service/api";

function RegisterForm({ setActiveTab }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await registerUser(formData);
      if (data.message !== "User registered successfully")
        throw new Error(data.message);

      setSuccess("Registration successful!");
      setTimeout(() => setActiveTab("login"), 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          className="form-input"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-email" className="form-label">
          Email
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          className="form-input"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-password" className="form-label">
          Password
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          className="form-input"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="form-input"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-full"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Register"}
      </button>
    </form>
  );
}

export default RegisterForm;
