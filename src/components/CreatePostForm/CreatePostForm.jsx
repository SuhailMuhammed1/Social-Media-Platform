import { useState, useRef } from "react";
import "./CreatePostForm.css";

function CreatePostForm({ onSubmit }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload this to a server
      // For now, we'll just use a placeholder
      setImage("https://via.placeholder.com/600x400");
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && !image) {
      alert("Please add some text or an image to your post.");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you would send this to an API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSubmit({
        content,
        image,
      });

      // Reset form
      setContent("");
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      alert("There was an error creating your post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post-form">
      <div className="create-post-header">
        <img
          src="https://via.placeholder.com/40"
          alt="Your avatar"
          className="avatar"
        />
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="create-post-textarea"
          rows={3}
        />
      </div>

      {image && (
        <div className="create-post-image-preview">
          <img
            src={image || "/placeholder.svg"}
            alt="Post preview"
            className="preview-image"
          />
          <button
            type="button"
            className="remove-image-button"
            onClick={handleRemoveImage}
          >
            <i className="icon-x"></i>
            <span className="sr-only">Remove image</span>
          </button>
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
            <span className="sr-only">Add image</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
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
