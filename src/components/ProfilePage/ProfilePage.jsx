import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import PostCard from "../PostCard/PostCard";
import "./ProfilePage.css";

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
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/");
      return;
    }

    const currentUser = JSON.parse(userData);
    setUser(currentUser);

    // In a real app, you would fetch the profile data from an API based on the id
    // For now, we'll use mock data
    setProfile(MOCK_PROFILE);

    // Check if this is the current user's profile
    setIsCurrentUser(id ? currentUser.id === id : true);

    setIsLoading(false);
  }, [navigate, id]);

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
              src={profile.coverPhoto || "/placeholder.svg"}
              alt="Cover"
              className="cover-photo-img"
            />
            {isCurrentUser && (
              <button className="cover-photo-btn btn btn-icon">
                <i className="icon-camera"></i>
                <span className="sr-only">Change cover photo</span>
              </button>
            )}
          </div>

          <div className="profile-info">
            <div className="profile-main-info">
              <div className="profile-avatar-container">
                <img
                  src={profile.avatar || "/placeholder.svg"}
                  alt={profile.name}
                  className="profile-avatar"
                />
                {isCurrentUser && (
                  <button className="avatar-change-btn btn btn-icon">
                    <i className="icon-camera"></i>
                    <span className="sr-only">Change profile picture</span>
                  </button>
                )}
              </div>
              <div className="profile-name-container">
                <h1 className="profile-name">{profile.name}</h1>
                <p className="profile-username">@{profile.username}</p>
              </div>
            </div>

            <div className="profile-actions">
              {isCurrentUser ? (
                <button
                  className="btn btn-outline"
                  onClick={() => navigate("/settings")}
                >
                  <i className="icon-edit"></i>
                  Edit Profile
                </button>
              ) : (
                <button className="btn btn-primary">Follow</button>
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
                {profile.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {activeTab === "photos" && (
              <div className="card">
                <div className="card-content">
                  <div className="photos-grid">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <img
                        key={i}
                        src={`https://via.placeholder.com/300`}
                        alt={`Photo ${i}`}
                        className="photo-item"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "friends" && (
              <div className="card">
                <div className="card-content">
                  <div className="friends-grid">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="friend-item">
                        <img
                          src={`https://via.placeholder.com/100`}
                          alt={`Friend ${i}`}
                          className="friend-avatar"
                        />
                        <p className="friend-item-name">Friend {i}</p>
                        <p className="friend-item-mutual">42 mutual friends</p>
                      </div>
                    ))}
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
                    <p>Senior Developer at Acme Inc.</p>
                  </div>
                  <div className="about-section">
                    <h3 className="about-heading">Education</h3>
                    <p>Computer Science, University of Technology</p>
                  </div>
                  <div className="about-section">
                    <h3 className="about-heading">Interests</h3>
                    <div className="interests-list">
                      {[
                        "Photography",
                        "Hiking",
                        "Coding",
                        "Coffee",
                        "Travel",
                      ].map((interest) => (
                        <div key={interest} className="interest-tag">
                          {interest}
                        </div>
                      ))}
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
