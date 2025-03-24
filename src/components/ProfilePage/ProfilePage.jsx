import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import PostCard from "../PostCard/PostCard";
import "./ProfilePage.css";
import { getProfile, uploadAvatar, uploadCoverPhoto } from "../../service/api";

// Mock data for user profile
const MOCK_PROFILE = {
  id: "1",
  name: "John Doe",
  username: "johndoe",
  avatar: "https://via.placeholder.com/100",
  coverPhoto: "https://via.placeholder.com/1200x300",
  bio: "Software developer | Photography enthusiast | Coffee lover",
  location: "San Francisco, CA",
  website: "https://johndoe.com",
  joinedDate: "January 2020",
  following: 245,
  followers: 1024,
  posts: [
    {
      id: "101",
      user: {
        id: "1",
        name: "John Doe",
        avatar: "https://via.placeholder.com/40",
      },
      content:
        "Just launched my new website! Check it out and let me know what you think. #webdev #design",
      image: "https://via.placeholder.com/600x400",
      likes: 32,
      comments: 8,
      createdAt: "2023-06-10T15:30:00Z",
    },
    {
      id: "102",
      user: {
        id: "1",
        name: "John Doe",
        avatar: "https://via.placeholder.com/40",
      },
      content: "Beautiful day for a hike! 🏔️ #nature #outdoors",
      image: "https://via.placeholder.com/600x400",
      likes: 45,
      comments: 12,
      createdAt: "2023-06-05T12:15:00Z",
    },
  ],
};

function ProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setProfile] = useState({
    friends: [],
    photos: [],
    posts: [],
    interest: [],
  });
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/");
      return;
    }

    const currentUser = JSON.parse(userData);
    setUser(currentUser);

    const fetchProfile = async () => {
      try {
        const profileData = await getProfile(id || currentUser.id);
        setProfile({
          ...profileData,
          friends: profileData.friends || [],
          photos: profileData.photos || [],
          posts: profileData.posts || [],
          interests: profileData.interests || [],
        });
        setIsCurrentUser(id ? currentUser.id === id : true);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, id]);

  const handleUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    let response;
    if (type === "avatar") {
      response = await uploadAvatar(file);
    } else if (type === "coverPhoto") {
      response = await uploadCoverPhoto(file);
    }

    if (response && response[type]) {
      setProfile((prevProfile) => ({ ...prevProfile, [type]: response[type] }));
    } else {
      alert(response.error || "Upload failed");
    }
  };

  if (isLoading || !profile) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="profile-container">
        {/* Cover Photo and Profile Info */}
        <div className="profile-header card">
          <div className="cover-photo">
            <img
              src={
                profile.coverPhoto
                  ? `http://localhost:5000${profile.coverPhoto}`
                  : "/placeholder.svg"
              }
              alt="Cover"
              className="cover-photo-img"
            />
            {isCurrentUser && (
              <button
                className="cover-photo-btn btn btn-icon"
                onClick={() => document.getElementById("coverInput").click()}
              >
                <i className="icon-camera"></i>
                <span className="sr-only">Change cover photo</span>
              </button>
            )}
            <input
              type="file"
              id="coverInput"
              style={{ display: "none" }}
              onChange={(e) => handleUpload(e, "coverPhoto")}
              accept="image/*"
            />
          </div>

          <div className="profile-info">
            <div className="profile-main-info">
              <div className="profile-avatar-container">
                <img
                  src={
                    profile.avatar
                      ? `http://localhost:5000${profile.avatar}`
                      : "/placeholder.svg"
                  }
                  alt={profile.name}
                  className="profile-avatar"
                />
                {isCurrentUser && (
                  <button
                    className="avatar-change-btn btn btn-icon"
                    onClick={() =>
                      document.getElementById("avatarInput").click()
                    }
                  >
                    <i className="icon-camera"></i>
                    <span className="sr-only">Change profile picture</span>
                  </button>
                )}
                <input
                  type="file"
                  id="avatarInput"
                  style={{ display: "none" }}
                  className="hidden"
                  onChange={(e) => handleUpload(e, "avatar")}
                  accept="image/*"
                />
              </div>
              <div className="profile-name-container">
                <h1 className="profile-name">{profile.name}</h1>
                <p className="profile-username">
                  @{profile.name.toLowerCase().replace(/\s/g, "")}
                </p>
              </div>
            </div>

            <div className="profile-actions">
              {isCurrentUser && (
                <button
                  className="btn btn-outline"
                  onClick={() => navigate("/edit-profile")}
                >
                  <i className="icon-edit"></i>
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="profile-details">
            <p className="profile-bio">{profile.bio}</p>

            <div className="profile-meta">
              {profile.location && (
                <div className="profile-meta-item">
                  <i className="icon-map-pin"></i>
                  {profile.location}
                </div>
              )}
              {profile.website && (
                <div className="profile-meta-item">
                  <i className="icon-link"></i>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-link"
                  >
                    {profile.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
              {profile.joinedDate && (
                <div className="profile-meta-item">
                  <i className="icon-calendar"></i>
                  Joined {profile.joinedDate}
                </div>
              )}
            </div>

            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-value">{profile.following}</span>
                <span className="profile-stat-label">Following</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">{profile.followers}</span>
                <span className="profile-stat-label">Followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          <div className="profile-tabs">
            <button
              className={`profile-tab ${activeTab === "posts" ? "active" : ""}`}
              onClick={() => setActiveTab("posts")}
            >
              Posts
            </button>
            <button
              className={`profile-tab ${
                activeTab === "photos" ? "active" : ""
              }`}
              onClick={() => setActiveTab("photos")}
            >
              Photos
            </button>
            <button
              className={`profile-tab ${
                activeTab === "friends" ? "active" : ""
              }`}
              onClick={() => setActiveTab("friends")}
            >
              Friends
            </button>
            <button
              className={`profile-tab ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              About
            </button>
          </div>

          <div className="profile-tab-content">
            {activeTab === "posts" && (
              <div className="profile-posts">
                {profile.posts && profile.posts.length > 0 ? (
                  profile.posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <p>No posts available.</p>
                )}
              </div>
            )}

            {activeTab === "photos" && (
              <div className="card">
                <div className="card-content">
                  <div className="photos-grid">
                    {profile.photos.length > 0 ? (
                      profile.photos.map((photo, i) => (
                        <img
                          key={i}
                          src={photo}
                          alt={`Photo ${i}`}
                          className="photo-item"
                        />
                      ))
                    ) : (
                      <p>No photos available.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "friends" && (
              <div className="card">
                <div className="card-content">
                  <div className="friends-grid">
                    {profile.friends > 0 ? (
                      profile.friends.map((friend, i) => (
                        <div key={i} className="friend-item">
                          <img
                            src={
                              friend.avatar || "https://via.placeholder.com/100"
                            }
                            alt={`Friend ${i}`}
                            className="friend-avatar"
                          />
                          <p className="friend-item-name">{friend.name}</p>
                        </div>
                      ))
                    ) : (
                      <p>No friends.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="card">
                <div className="card-content">
                  <div className="about-section">
                    <h3 className="about-heading">Bio</h3>
                    <p>{profile.bio}</p>
                  </div>
                  <div className="about-section">
                    <h3 className="about-heading">Work</h3>
                    <p>{profile.work}</p>
                  </div>
                  <div className="about-section">
                    <h3 className="about-heading">Education</h3>
                    <p>{profile.education}</p>
                  </div>
                  <div className="about-section">
                    <h3 className="about-heading">Interests</h3>
                    <div className="interests-list">
                      {profile.interest.length > 0 ? (
                        profile.interest.map((interest, index) => (
                          <div key={index} className="interest-tag">
                            {interest}
                          </div>
                        ))
                      ) : (
                        <p>Not specified</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ProfilePage;
