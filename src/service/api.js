import axios from "axios";

const API_BASE_URL = "https://social-media-platform-backend-lmnk.onrender.com";

export const registerUser = async (userData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginUser = async (userData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      credentials: "include",
    });

    const data = await res.json();
    console.log("Login Response:", data); // Debugging log

    if (!res.ok) throw new Error(data.message);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch user profile
export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Create a Post (With Image/Video)
export const createPost = async ({ content, media, userId }) => {
  try {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("userId", userId);
    if (media) {
      formData.append("media", media);
    }

    const res = await fetch(`${API_BASE_URL}/posts/create`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to create post");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Get Feed Posts
export const getFeedPosts = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/posts/feed`);
    return await res.json();
  } catch (error) {
    throw new Error("Error fetching feed posts");
  }
};

// Get User Posts (Profile Page)
export const getUserPosts = async (userId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/posts/${userId}`);
    return await res.json();
  } catch (error) {
    throw new Error("Error fetching user posts");
  }
};

// Upload Avatar
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const response = await fetch(`${API_BASE_URL}/users/upload/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return { error: "Upload failed" };
  }
};

// Upload Cover Photo
export const uploadCoverPhoto = async (file) => {
  const formData = new FormData();
  formData.append("coverPhoto", file);

  try {
    const response = await fetch(`${API_BASE_URL}/users/upload/cover`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error("Error uploading cover photo:", error);
    return { error: "Upload failed" };
  }
};

export const updateProfile = async (userId, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/user/${userId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating profile:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update profile."
    );
  }
};
