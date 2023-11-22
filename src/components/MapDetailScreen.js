import React, { useState } from 'react';
import Tags from './Tags.js';
import {
    Box,
    Typography,
    Button,
    TextField,
    List,
    ListItem,
    IconButton,
    Paper,
    Grid,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import UpvoteIcon from '@mui/icons-material/ThumbUp';
import DownvoteIcon from '@mui/icons-material/ThumbDown';
import temp_map from './images/temp_map.png'
import { useNavigate } from 'react-router';

const Comment = ({ comment }) => {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('')
    const [replyList, setReplyList] = useState(comment.replys);

    const onReply = () => {
        const showInput = showReplyInput === true ? false : true;
        setShowReplyInput(showInput);
    };
    const onUpvote = () => {
        setLikes(likes + 1)
    }
    const onDownvote = () => {
        setDislikes(dislikes + 1)
    }
    const handleAddReply = () => {
        if (replyText == ''){
            console.log("Empty comment")
        }
        else {
            // Implement logic to add a comment (you may want to update your data structure)
            console.log('Adding reply:', replyText);
            // Clear the comment input
            setReplyText('');
            // Update the comment list
            const newReply = { user: "Guest", reply: replyText };
            setReplyList([...replyList, newReply]);
        }
    }
    return (
        <ListItem>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                <Typography><span style={{ color: 'steelblue' }}>{comment.user}</span> says: {comment.comment}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <div className="comment-actions">
                        <Button onClick={onReply} color="primary" size="small">
                            Reply
                        </Button>
                        <Button onClick={onUpvote} color="primary" size="small">
                            Upvote {likes}
                        </Button>
                        <Button onClick={onDownvote} color="primary" size="small">
                            Downvote {dislikes}
                        </Button>
                    </div>
                    {showReplyInput && (
                        <Box>
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
                        </Box>
                        
                    )}
                </Box>
                {showReplyInput && (
                    <Box sx={{ marginLeft: '20px' }}>
                        <Typography style={{ fontSize: '15px', color: "blue"}}>Replies</Typography>
                        <List>
                            {replyList.map((reply, index) => (
                                <Typography style={{ fontSize: '12px' }}>
                                    <span style={{ color: 'steelblue' }}>{reply.user}</span> says: {reply.reply}
                                </Typography>
                            ))}
                        </List>
                    </Box>
                )}

            </Box>
        </ListItem>
    );
};

const MapDetailScreen = ({ mapDetails }) => {
    const { title, description, tags, mapImage, comments } = mapDetails;
    const [newComment, setNewComment] = useState('');
    const [newTags, setNewTags] = useState('');
    const [commentList, setCommentList] = useState(comments);
    // const [newDescription, setDescription] = useState(description);
    const [tagList, setTagList] = useState(tags);
    const [likeColor, setLikeColor] = useState('grey');
    const [dislikeColor, setDislikeColor] = useState('grey');
    const navigate = useNavigate();

    const handleAddComment = () => {
        if (newComment == ''){
            console.log("Empty comment")
        }
        else {
            // Implement logic to add a comment (you may want to update your data structure)
            console.log('Adding comment:', newComment);
            // Clear the comment input
            setNewComment('');
            // Update the comment list
            const newCommentObject = { user: "Guest", comment: newComment, replys: []}
            setCommentList([...commentList, newCommentObject]);
        }
    };
    // const handleUpdateDescription = () => {
    //     console.log('Updating description:', newDescription);
    // }
    const handleAddTag = () => {
        if (newTags == ''){
            console.log("Empty tag")
        }
        else {
            // Implement logic to add a comment (you may want to update your data structure)
            console.log('Adding tag:', newTags);
            setNewTags('');
            // Update the comment list
            setTagList([...tagList, newTags]);
        }
    }
    const handleDeleteTag = () => {
        console.log('Deleting Tag:', newTags)
        setNewTags('');
    }
    const handleLike = () => {
        const newColor = likeColor === 'grey' ? 'steelblue' : 'grey';
        setLikeColor(newColor);
        if (dislikeColor === 'red') {
            setDislikeColor('grey')
        }

    };
    const handleDislike = () => {
        const newColor = dislikeColor === 'grey' ? 'red' : 'grey';
        setDislikeColor(newColor);
        if (likeColor === 'steelblue') {
            setLikeColor('grey')
        }
    };
    return (
        <Box sx={{ marginTop: 2, marginLeft: 2, marginRight: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 3, marginBottom: 2 }}>
                        <Typography variant="h6">Description</Typography>
                        {/* <TextField
                                type="description"
                                placeholder="Add a description..."
                                value={newDescription}
                                onChange={(e) => setDescription(e.target.value)}
                                multiline
                                rows = {10}
                                sx={{ height: '100%', width: '100%' }} 
                            /> */}
                        <Typography>{description}</Typography>
                    </Paper>

                    <Paper elevation={3} sx={{ p: 2, borderRadius: 3, marginBottom: 2 }}>
                        <Typography variant="h6">Tags</Typography>
                        <Tags tags={tags}></Tags>
                    </Paper>

                    <Box>
                        <Button variant="contained" onClick={() => navigate('/edit')} sx = {{height: '40px'}}>
                            Open Edit As My Map
                        </Button>
                        <Button variant="contained" onClick={() => console.log('Button 2 clicked')} sx = {{height: '40px', marginLeft:'20px'}}>
                            Export Data
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 3, marginBottom: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                            <Typography variant="h4">{title}</Typography>
                            <IconButton onClick={() => console.log('download button clicked')}>
                                <DownloadIcon />
                            </IconButton>
                            <IconButton onClick={handleLike}>
                                <UpvoteIcon style={{ color: likeColor }}/>
                            </IconButton>
                            <IconButton onClick={handleDislike}>
                                <DownvoteIcon style={{ color: dislikeColor }}/>
                            </IconButton>
                        </Box>
                        <img src={temp_map} alt="Map" style={{ width: '100%', height: 'auto' }} />
                    </Paper>

                    <Paper elevation={3} sx={{ p: 2, borderRadius: 3, marginBottom: 2 }}>
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
                                sx={{ height: '40px' }} 
                            />
                            <Button
                                onClick={handleAddComment}
                                variant="contained"
                                size="small"
                                sx={{ height: '40px', marginLeft: '8px' }} 
                            >
                                Add Comment
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MapDetailScreen;