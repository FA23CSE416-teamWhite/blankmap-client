import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CommentIcon from '@mui/icons-material/Comment';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import UpvoteIcon from '@mui/icons-material/ThumbUp';
import DownvoteIcon from '@mui/icons-material/ThumbDown';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';

const Comment = ({ comment, onReply, onUpvote, onDownvote, showReplyInput, replyText, setReplyText, handleAddReply }) => {
  return (
    <ListItem>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <Typography>{comment}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <div className="comment-actions">
            <Button onClick={onReply} color="primary" size="small">
              Reply
            </Button>
            <Button onClick={onUpvote} color="primary" size="small">
              Upvote
            </Button>
            <Button onClick={onDownvote} color="primary" size="small">
              Downvote
            </Button>
          </div>
          {showReplyInput && (
            <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 1 }}>
              <TextField
                type="text"
                placeholder="Add a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                size="small"
              />
              <Button onClick={handleAddReply} variant="contained" size="small">
                Add Reply
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </ListItem>
  );
};

const MapDetailScreen = ({ mapDetails }) => {
  const { title, description, tags, mapImage, comments } = mapDetails;
  const [newComment, setNewComment] = useState('');
  const [commentList, setCommentList] = useState(comments);

  const handleAddComment = () => {
    // Implement logic to add a comment (you may want to update your data structure)
    console.log('Adding comment:', newComment);
    // Clear the comment input
    setNewComment('');
    // Update the comment list
    setCommentList([...commentList, newComment]);
  };

  return (
    <Box sx={{ display: 'flex', marginTop: 2 }}>
      <Box sx={{ flex: 1, marginRight: 2 }}>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">Description</Typography>
          <Typography>{description}</Typography>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">Tags</Typography>
          <div className="tags">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">Actions</Typography>
          <Button variant="contained" onClick={() => console.log('Button 1 clicked')}>
            Open Edit As My Map
          </Button>
          <Button variant="contained" onClick={() => console.log('Button 2 clicked')}>
            Export Data
          </Button>
        </Box>
      </Box>

      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          <Typography variant="h4">{title}</Typography>
          <IconButton onClick={() => console.log('download button clicked')}>
            <DownloadIcon />
          </IconButton>
          <IconButton onClick={() => console.log('upvote button clicked')}>
            <UpvoteIcon />
          </IconButton>
          <IconButton onClick={() => console.log('downvote button clicked')}>
            <DownvoteIcon />
          </IconButton>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <img src={mapImage} alt="Map" style={{ width: '100%', height: 'auto' }} />
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">Comments</Typography>
          <List>
            {commentList.map((comment, index) => (
              <Comment key={index} comment={comment} />
            ))}
          </List>
          <Box>
            <TextField
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              size="small"
            />
            <Button onClick={handleAddComment} variant="contained" size="small">
              Add Comment
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MapDetailScreen;