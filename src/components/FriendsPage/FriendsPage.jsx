import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import "./FriendsPage.css";

// Mock data for friends
const MOCK_FRIENDS = [
  {
    id: "1",
    name: "Jane Smith",
    username: "janesmith",
    avatar: "https://via.placeholder.com/100",
    mutualFriends: 12,
  },
  {
    id: "2",
    name: "Mike Johnson",
    username: "mikejohnson",
    avatar: "https://via.placeholder.com/100",
    mutualFriends: 8,
  },
  {
    id: "3",
    name: "Sarah Williams",
    username: "sarahwilliams",
    avatar: "https://via.placeholder.com/100",
    mutualFriends: 5,
  },
];

// Mock data for friend requests
const MOCK_FRIEND_REQUESTS = [
  {
    id: "4",
    name: "Alex Brown",
    username: "alexbrown",
    avatar: "https://via.placeholder.com/100",
    mutualFriends: 3,
  },
  {
    id: "5",
    name: "Emily Davis",
    username: "emilydavis",
    avatar: "https://via.placeholder.com/100",
    mutualFriends: 7,
  },
];

// Mock data for suggestions
const MOCK_SUGGESTIONS = [
  {
    id: "6",
    name: "David Wilson",
    username: "davidwilson",
    avatar: "https://via.placeholder.com/100",
    mutualFriends: 15,
  },
  {
    id: "7",
    name: "Lisa Taylor",
    username: "lisataylor",
    avatar: "https://via.placeholder.com/100",
    mutualFriends: 9,
  },
  {
    id: "8",
    name: "Robert Miller",
    username: "robertmiller",
    avatar: "https://via.placeholder.com/100",
    mutualFriends: 6,
  },
  {
    id: "9",
    name: "Jennifer Clark",
    username: "jenniferclark",
    avatar: "https://via.placeholder.com/100",
    mutualFriends: 4,
  },
];

function FriendsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState(MOCK_FRIENDS);
  const [friendRequests, setFriendRequests] = useState(MOCK_FRIEND_REQUESTS);
  const [suggestions, setSuggestions] = useState(MOCK_SUGGESTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
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

  const handleAcceptRequest = (id) => {
    const request = friendRequests.find((req) => req.id === id);

    if (request) {
      // Add to friends
      setFriends([...friends, request]);

      // Remove from requests
      setFriendRequests(friendRequests.filter((req) => req.id !== id));

      alert(`You are now friends with ${request.name}.`);
    }
  };

  const handleRejectRequest = (id) => {
    const request = friendRequests.find((req) => req.id === id);

    if (request) {
      // Remove from requests
      setFriendRequests(friendRequests.filter((req) => req.id !== id));

      alert(`You rejected ${request.name}'s friend request.`);
    }
  };

  const handleAddFriend = (id) => {
    const suggestion = suggestions.find((sug) => sug.id === id);

    if (suggestion) {
      // Remove from suggestions
      setSuggestions(suggestions.filter((sug) => sug.id !== id));

      alert(`You sent a friend request to ${suggestion.name}.`);
    }
  };

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="friends-container">
        <div className="friends-header">
          <h1 className="friends-title">Friends</h1>
          <div className="friends-search">
            <i className="icon-search"></i>
            <input
              type="search"
              placeholder="Search friends..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="friends-tabs">
          <button
            className={`friends-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Friends
          </button>
          <button
            className={`friends-tab ${
              activeTab === "requests" ? "active" : ""
            }`}
            onClick={() => setActiveTab("requests")}
          >
            Friend Requests
            {friendRequests.length > 0 && (
              <span className="tab-badge">{friendRequests.length}</span>
            )}
          </button>
          <button
            className={`friends-tab ${
              activeTab === "suggestions" ? "active" : ""
            }`}
            onClick={() => setActiveTab("suggestions")}
          >
            Suggestions
          </button>
        </div>

        <div className="friends-content">
          {activeTab === "all" && (
            <>
              {filteredFriends.length > 0 ? (
                <div className="friends-grid">
                  {filteredFriends.map((friend) => (
                    <div key={friend.id} className="friend-card card">
                      <div className="friend-card-content">
                        <div className="friend-info">
                          <img
                            src={friend.avatar || "/placeholder.svg"}
                            alt={friend.name}
                            className="avatar avatar-lg"
                          />
                          <div className="friend-details">
                            <h3 className="friend-name">{friend.name}</h3>
                            <p className="friend-username">
                              @{friend.username}
                            </p>
                            <p className="friend-mutual">
                              {friend.mutualFriends} mutual friends
                            </p>
                          </div>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => navigate(`/profile/${friend.id}`)}
                          >
                            Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-friends card">
                  <div className="card-content">
                    <p>No friends found matching your search.</p>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "requests" && (
            <>
              {friendRequests.length > 0 ? (
                <div className="friends-grid">
                  {friendRequests.map((request) => (
                    <div key={request.id} className="friend-card card">
                      <div className="friend-card-content">
                        <div className="friend-info">
                          <img
                            src={request.avatar || "/placeholder.svg"}
                            alt={request.name}
                            className="avatar avatar-lg"
                          />
                          <div className="friend-details">
                            <h3 className="friend-name">{request.name}</h3>
                            <p className="friend-username">
                              @{request.username}
                            </p>
                            <p className="friend-mutual">
                              {request.mutualFriends} mutual friends
                            </p>
                          </div>
                          <div className="friend-actions">
                            <button
                              className="btn btn-outline btn-icon btn-sm btn-success"
                              onClick={() => handleAcceptRequest(request.id)}
                            >
                              <i className="icon-check"></i>
                              <span className="sr-only">Accept</span>
                            </button>
                            <button
                              className="btn btn-outline btn-icon btn-sm btn-danger"
                              onClick={() => handleRejectRequest(request.id)}
                            >
                              <i className="icon-x"></i>
                              <span className="sr-only">Reject</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-friends card">
                  <div className="card-content">
                    <p>You have no pending friend requests.</p>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "suggestions" && (
            <div className="friends-grid">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="friend-card card">
                  <div className="friend-card-content">
                    <div className="friend-info">
                      <img
                        src={suggestion.avatar || "/placeholder.svg"}
                        alt={suggestion.name}
                        className="avatar avatar-lg"
                      />
                      <div className="friend-details">
                        <h3 className="friend-name">{suggestion.name}</h3>
                        <p className="friend-username">
                          @{suggestion.username}
                        </p>
                        <p className="friend-mutual">
                          {suggestion.mutualFriends} mutual friends
                        </p>
                      </div>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleAddFriend(suggestion.id)}
                      >
                        <i className="icon-user-plus"></i>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default FriendsPage;
