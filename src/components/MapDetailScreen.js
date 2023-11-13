import React from "react";
import { Link } from "react-router-dom";
import {useState} from 'react';
import NavBar from "./NavBar";
const Comment = ({ comment, onReply, onUpvote, onDownvote }) => {
    const [replyText, setReplyText] = useState("");
    const [showReplyInput, setShowReplyInput] = useState(false);
  
    const handleReply = () => {
      setShowReplyInput(!showReplyInput);
    };
  
    const handleAddReply = () => {
      // Implement logic to add a reply (you may want to update your data structure)
      console.log("Adding reply:", replyText);
      // Clear the reply input
      setReplyText("");
      // Hide the reply input
      setShowReplyInput(false);
    };
  
    return (
      <li>
        {comment}
        <div className="comment-actions">
          <button onClick={onReply || handleReply}>Reply</button>
          <button onClick={onUpvote}>Upvote</button>
          <button onClick={onDownvote}>Downvote</button>
        </div>
        {showReplyInput && (
          <div className="reply-input">
            <input
              type="text"
              placeholder="Add a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button onClick={handleAddReply}>Add Reply</button>
          </div>
        )}
      </li>
    );
  };
  
const MapDetailScreen = ({ mapDetails }) => {
  const { title, description, tags, mapImage, comments } = mapDetails;
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState(comments);
  const handleAddComment = () => {
    // Implement logic to add a comment (you may want to update your data structure)
    console.log("Adding comment:", newComment);
    // Clear the comment input
    setNewComment("");
    // Update the comment list
    setCommentList([...commentList, newComment]);
  };
  return (
    <div className="map-detail-screen">
        <NavBar/>
      <div className="left-side">
        <div className="description-box">
          <h2>Description</h2>
          <p>{description}</p>
        </div>

        <div className="tags-box">
          <h2>Tags</h2>
          <div className="tags">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="buttons">
          <button onClick={() => console.log("Button 1 clicked")}>Open Edit As My Map</button>
          <button onClick={() => console.log("Button 2 clicked")}>Export Data</button>
        </div>
      </div>

      <div className="right-side">
        <div className="map-name">
            <h1>{title}</h1>
            <button onClick={() => console.log("Button 3 clicked")}>download</button>
            <button onClick={() => console.log("Button 3 clicked")}>upvote</button>
            <button onClick={() => console.log("Button 3 clicked")}>downvote</button>
        <div/>
        <div className="map-image">
          <img src={mapImage} alt="Map" />
        </div>

        <div className="comment-box">
      <h2>Comments</h2>
      <ul>
        {commentList.map((comment, index) => (
          <Comment key={index} comment={comment} />
        ))}
      </ul>
      <div className="comment-input">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
      </div>
    </div>
    </div>
  );
};

export default MapDetailScreen;