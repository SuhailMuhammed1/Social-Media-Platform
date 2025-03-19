import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import PostCard from "../PostCard/PostCard";
import CreatePostForm from "../CreatePostForm/CreatePostForm";
import "./FeedPage.css";
import { getFeedPosts } from "../../service/api";

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
  const [posts, setPosts] = useState([]);
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getFeedPosts();
        setPosts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    const userData = JSON.parse(localStorage.getItem("user")); // Get logged-in user

    if (!userData) return;

    const postWithUser = {
      ...newPost,
      user: {
        id: userData.id,
        name: userData.name,
        avatar: userData.avatar || "/placeholder.svg",
      },
    };

    setPosts([postWithUser, ...posts]);
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
              <CreatePostForm
                onPostCreated={handlePostCreated}
                userId={user?.id}
              />
            </div>
          </div>

          <div className="posts-container">
            {posts.map((post) => (
              <PostCard key={post._id || post.id} post={post} />
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
        </div>
      </div>
    </MainLayout>
  );
}

export default FeedPage;
