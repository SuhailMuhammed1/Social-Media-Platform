import { useState, useRef, useContext } from "react";
import "./CreatePostForm.css";
import { createPost } from "../../service/api";
import { AuthContext } from "../context/AuthContext";

function CreatePostForm({ onPostCreated, userId }) {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const avatarUrl = user?.avatar
    ? `http://localhost:5000${user.avatar}`
    : "/placeholder.svg";

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && !media) {
      alert("Please add some text or media to your post.");
      return;
    }

    if (!userId) {
      alert("User not authenticated. Please log in.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createPost({ content, media, userId });

      if (!response || response.error) {
        console.error("Server Error:", response.error);
        alert(response.error || "Error creating post");
        return;
      }

      onPostCreated(response.post);
      setContent("");
      setMedia(null);
      setPreview(null);
      fileInputRef.current.value = "";
    } catch (error) {
      alert("Error creating post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post-form">
      <div className="create-post-header">
        <img src={avatarUrl} alt="Your avatar" className="avatar" />
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="create-post-textarea"
          rows={3}
        />
      </div>

      {preview && (
        <div className="create-post-image-preview">
          <img
            src={preview || "/placeholder.svg"}
            alt="Post preview"
            className="preview-image"
          />
        </div>
      )}

      <div className="create-post-footer">
        <div className="create-post-actions">
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={handleImageClick}
          >
            <i className="icon-image"></i>
            <span className="sr-only">Add Media</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            className="hidden-file-input"
          />
          <button type="button" className="btn btn-ghost btn-icon">
            <i className="icon-smile"></i>
            <span className="sr-only">Add emoji</span>
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}

export default CreatePostForm;
