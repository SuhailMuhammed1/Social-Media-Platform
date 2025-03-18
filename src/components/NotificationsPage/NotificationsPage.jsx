import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import "./NotificationsPage.css";

// Mock data for notifications
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "like",
    user: {
      id: "2",
      name: "Jane Smith",
      avatar: "https://via.placeholder.com/40",
    },
    content: "liked your post",
    target: "Beautiful sunset at the beach today!",
    isRead: false,
    createdAt: "2023-06-15T10:30:00Z",
  },
  {
    id: "2",
    type: "comment",
    user: {
      id: "3",
      name: "Mike Johnson",
      avatar: "https://via.placeholder.com/40",
    },
    content: "commented on your post",
    target: "Just finished a great book!",
    isRead: false,
    createdAt: "2023-06-14T19:45:00Z",
  },
  {
    id: "3",
    type: "friend_request",
    user: {
      id: "4",
      name: "Sarah Williams",
      avatar: "https://via.placeholder.com/40",
    },
    content: "sent you a friend request",
    target: "",
    isRead: true,
    createdAt: "2023-06-13T14:20:00Z",
  },
  {
    id: "4",
    type: "friend_accept",
    user: {
      id: "5",
      name: "David Wilson",
      avatar: "https://via.placeholder.com/40",
    },
    content: "accepted your friend request",
    target: "",
    isRead: true,
    createdAt: "2023-06-12T09:15:00Z",
  },
  {
    id: "5",
    type: "mention",
    user: {
      id: "6",
      name: "Lisa Taylor",
      avatar: "https://via.placeholder.com/40",
    },
    content: "mentioned you in a comment",
    target: "Hey @johndoe, what do you think about this?",
    isRead: false,
    createdAt: "2023-06-11T16:40:00Z",
  },
];

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

function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/");
      return;
    }

    setUser(JSON.parse(userData));
    setIsLoading(false);
  }, [navigate]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="notifications-container">
        <div className="notifications-header">
          <h1 className="notifications-title">Notifications</h1>
          <button className="btn btn-ghost" onClick={markAllAsRead}>
            Mark all as read
          </button>
        </div>

        <div className="notifications-list">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  notification.isRead ? "read" : "unread"
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="notification-icon">
                  <img
                    src={notification.user.avatar || "/placeholder.svg"}
                    alt={notification.user.name}
                    className="avatar"
                  />
                </div>
                <div className="notification-content">
                  <div className="notification-text">
                    <span className="notification-user">
                      {notification.user.name}
                    </span>{" "}
                    {notification.content}
                    {notification.target && (
                      <span className="notification-target">
                        : "{notification.target}"
                      </span>
                    )}
                  </div>
                  <div className="notification-time">
                    {formatDistanceToNow(notification.createdAt)}
                  </div>
                </div>
                {!notification.isRead && (
                  <div className="notification-indicator"></div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-notifications">
              <p>You have no notifications</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default NotificationsPage;
