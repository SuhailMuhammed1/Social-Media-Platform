import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import "./EditProfile.css";
import { updateProfile } from "../../service/api";
import { AuthContext } from "../context/AuthContext";

function EditProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
    work: "",
    education: "",
    interest: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    setFormData({
      name: user.name || "",
      bio: user.bio || "",
      location: user.location || "",
      website: user.website || "",
      work: user.work || "",
      education: user.education || "",
      interest: user.interest ? user.interest.join(", ") : "",
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("website", formData.website);
      formDataToSend.append("work", formData.work);
      formDataToSend.append("education", formData.education);
      formDataToSend.append("interest", formData.interest);

      const updatedUser = await updateProfile(user.id, formDataToSend);

      setUser(updatedUser); // Update global user state
      localStorage.setItem("user", JSON.stringify(updatedUser)); // Save locally

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="edit-profile-container">
        <div className="edit-profile-header">
          <h1 className="edit-profile-title">Edit Profile</h1>
          <button
            className="btn btn-outline"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
        </div>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="edit-profile-card card">
            <div className="card-header">
              <h2 className="card-title">Basic Information</h2>
            </div>
            <div className="card-content">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio" className="form-label">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Tell us about yourself"
                  rows={3}
                />
                <p className="form-help-text">
                  Brief description for your profile. URLs are hyperlinked.
                </p>
              </div>
            </div>
          </div>

          <div className="edit-profile-card card">
            <div className="card-header">
              <h2 className="card-title">Contact Information</h2>
            </div>
            <div className="card-content">
              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="City, Country"
                />
              </div>

              <div className="form-group">
                <label htmlFor="website" className="form-label">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          <div className="edit-profile-card card">
            <div className="card-header">
              <h2 className="card-title">Additional Information</h2>
            </div>
            <div className="card-content">
              <div className="form-group">
                <label htmlFor="work" className="form-label">
                  Work
                </label>
                <input
                  type="text"
                  id="work"
                  name="work"
                  value={formData.work}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Company, Position"
                />
              </div>

              <div className="form-group">
                <label htmlFor="education" className="form-label">
                  Education
                </label>
                <input
                  type="text"
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="School, Degree"
                />
              </div>

              <div className="form-group">
                <label htmlFor="interests" className="form-label">
                  Interests
                </label>
                <input
                  type="text"
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Separate with commas"
                />
                <p className="form-help-text">
                  Add your interests, separated by commas (e.g., Photography,
                  Hiking, Coding)
                </p>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

export default EditProfile;
