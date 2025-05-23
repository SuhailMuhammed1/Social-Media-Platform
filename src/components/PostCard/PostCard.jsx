import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./PostCard.css";
import { AuthContext } from "../context/AuthContext";

function formatDistanceToNow(date) {
  const now = new Date();
  const diff = Math.abs(now - new Date(date));
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return "Just now";
  }
}

function PostCard({ post }) {
  const { user } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isCurrentUser = user && post.user && user.id === post.user.id;
  const displayName = isCurrentUser ? "You" : post.user?.name || "Unknown User";

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="post-card card">
      <div className="post-header">
        <div className="post-user">
          <img
            src={
              post.user?.avatar
                ? `http://localhost:5000${user.avatar}`
                : "/placeholder.svg"
            }
            alt={displayName}
            className="avatar"
          />
          <div className="post-user-info">
            <div className="post-user-name">{displayName}</div>
            <span className="post-time">
              {formatDistanceToNow(post.createdAt)}
            </span>
          </div>
        </div>

        <div className="post-options">
          <button className="btn btn-icon btn-ghost" onClick={toggleDropdown}>
            <i className="icon-more-horizontal"></i>
            <span className="sr-only">More options</span>
          </button>

          {dropdownOpen && (
            <div className="post-dropdown">
              <button className="post-dropdown-item">Save post</button>
              <button className="post-dropdown-item">Hide post</button>
              <div className="dropdown-divider"></div>
              <button className="post-dropdown-item post-dropdown-item-danger">
                Report post
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="post-content">
        <p className="post-text">{post.content}</p>

        {post.media && (
          <div className="post-image-container">
            <img
              src={`http://localhost:5000${post.media}` || "/placeholder.svg"}
              alt="Post"
              className="post-image"
            />
          </div>
        )}
      </div>

      <div className="post-footer">
        <div className="post-stats">
          <div>{likesCount} likes</div>
          <div>0 comments</div>
        </div>

        <div className="post-actions">
          <button
            className={`post-action-button ${liked ? "liked" : ""}`}
            onClick={handleLike}
          >
            <i className={`icon-heart ${liked ? "icon-heart-filled" : ""}`}></i>
            Like
          </button>
          <button className="post-action-button">
            <i className="icon-message-circle"></i>
            Comment
          </button>
          <button className="post-action-button">
            <i className="icon-share"></i>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
