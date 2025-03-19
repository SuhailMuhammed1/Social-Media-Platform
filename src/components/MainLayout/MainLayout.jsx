import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./MainLayout.css";
import { AuthContext } from "../context/AuthContext";

function MainLayout({ children }) {
  const { user, isLoading, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  //   const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Notification counts
  const [messageCount, setMessageCount] = useState(3);
  const [notificationCount, setNotificationCount] = useState(5);
  const [friendRequestCount, setFriendRequestCount] = useState(2);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  const navItems = [
    { icon: "home", label: "Feed", href: "/feed" },
    {
      icon: "users",
      label: "Friends",
      href: "/friends",
      count: friendRequestCount,
    },
    {
      icon: "message-square",
      label: "Messages",
      href: "/messages",
      count: messageCount,
    },
    {
      icon: "bell",
      label: "Notifications",
      href: "/notifications",
      count: notificationCount,
    },
    { icon: "user", label: "Profile", href: "/profile" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  const avatarUrl = user.avatar
    ? `https://social-media-platform-backend-lmnk.onrender.com${user.avatar}`
    : "/placeholder.svg";

  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-logo">
            <Link to="/feed" className="logo-link">
              <span className="logo-text">Social Media Platform</span>
            </Link>
          </div>

          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            <i className={`icon-${isMobileMenuOpen ? "x" : "menu"}`}></i>
            <span className="sr-only">Toggle menu</span>
          </button>

          <div className="search-container">
            <div className="search-box">
              <i className="icon-search"></i>
              <input
                type="search"
                placeholder="Search..."
                className="search-input"
              />
            </div>
          </div>

          <nav className="desktop-nav">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`nav-item ${
                  location.pathname === item.href ? "active" : ""
                }`}
              >
                <div className="nav-icon-container">
                  <i className={`icon-${item.icon}`}></i>
                  {item.count > 0 && (
                    <span className="notification-badge">{item.count}</span>
                  )}
                </div>
                <span className="sr-only">{item.label}</span>
              </Link>
            ))}

            <div className="user-dropdown">
              <button className="avatar-button" onClick={toggleDropdown}>
                <div className="avatar">
                  <img src={avatarUrl} alt={user.name} />
                </div>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-user-name">{user.name}</p>
                    <p className="dropdown-user-email">{user.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profile" className="dropdown-item">
                    Profile
                  </Link>
                  <Link className="dropdown-item">Settings</Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Log out
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/feed" className="mobile-logo">
            <span className="logo-text">Social Media Platform</span>
          </Link>

          <nav className="mobile-nav">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`mobile-nav-item ${
                  location.pathname === item.href ? "active" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="nav-icon-container">
                  <i className={`icon-${item.icon}`}></i>
                  {item.count > 0 && (
                    <span className="notification-badge">{item.count}</span>
                  )}
                </div>
                {item.label}
              </Link>
            ))}
            <button
              className="mobile-nav-item"
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
            >
              <i className="icon-log-out"></i>
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
    </div>
  );
}

export default MainLayout;
