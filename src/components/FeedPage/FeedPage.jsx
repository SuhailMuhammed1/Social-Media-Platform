import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import PostCard from "../PostCard/PostCard";
import CreatePostForm from "../CreatePostForm/CreatePostForm";
import "./FeedPage.css";

// Mock data for posts
const MOCK_POSTS = [
  {
    id: "1",
    user: {
      id: "2",
      name: "Jane Smith",
      avatar: "https://via.placeholder.com/40",
    },
    content:
      "Just finished a great book! Would highly recommend it to everyone. #reading #books",
    image: "https://via.placeholder.com/600x400",
    likes: 24,
    comments: 5,
    createdAt: "2023-06-15T10:30:00Z",
  },
  {
    id: "2",
    user: {
      id: "3",
      name: "Mike Johnson",
      avatar: "https://via.placeholder.com/40",
    },
    content: "Beautiful sunset at the beach today! 🌅 #nature #sunset #beach",
    image: "https://via.placeholder.com/600x400",
    likes: 42,
    comments: 8,
    createdAt: "2023-06-14T19:45:00Z",
  },
  {
    id: "3",
    user: {
      id: "4",
      name: "Sarah Williams",
      avatar: "https://via.placeholder.com/40",
    },
    content:
      "Just got a new job! So excited to start this new chapter in my career. #newjob #career",
    image: null,
    likes: 67,
    comments: 15,
    createdAt: "2023-06-13T14:20:00Z",
  },
];

function FeedPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/");
      return;
    }

    setUser(JSON.parse(userData));
    setIsLoading(false);
  }, [navigate]);

  const handleCreatePost = (newPost) => {
    const post = {
      id: Date.now().toString(),
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
      content: newPost.content,
      image: newPost.image || null,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
    };

    setPosts([post, ...posts]);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="feed-container">
        <div className="feed-main">
          <div className="card create-post-card">
            <div className="card-content">
              <CreatePostForm onSubmit={handleCreatePost} />
            </div>
          </div>

          <div className="posts-container">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <div className="feed-sidebar">
          <div className="card">
            <div className="card-content">
              <h3 className="sidebar-heading">Friend Suggestions</h3>
              <div className="friend-suggestions">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="friend-suggestion-item">
                    <div className="friend-info">
                      <img
                        src={`https://via.placeholder.com/40`}
                        alt="User avatar"
                        className="avatar"
                      />
                      <div>
                        <p className="friend-name">User {i}</p>
                        <p className="friend-mutual">3 mutual friends</p>
                      </div>
                    </div>
                    <button className="btn btn-outline btn-sm">Add</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <h3 className="sidebar-heading">Recent Messages</h3>
              <div className="recent-messages">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="message-preview"
                    onClick={() => navigate("/messages")}
                  >
                    <img
                      src={`https://via.placeholder.com/40`}
                      alt="User avatar"
                      className="avatar"
                    />
                    <div className="message-preview-content">
                      <p className="message-sender">User {i}</p>
                      <p className="message-excerpt">Hey, how are you doing?</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-ghost btn-full"
                onClick={() => navigate("/messages")}
              >
                View All Messages
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default FeedPage;
