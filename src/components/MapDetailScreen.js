import React, { useState, useContext, useEffect } from 'react';
import { useParams } from "react-router-dom"
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
    Card,
    CardContent,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import UpvoteIcon from '@mui/icons-material/ThumbUp';
import DownvoteIcon from '@mui/icons-material/ThumbDown';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import temp_map from './images/temp_map.png'
import { useNavigate } from 'react-router';
import { GlobalStoreContext } from '../store/index';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import AuthContext from '../auth';
import Choropleth from './Choropleth';
import SendIcon from '@mui/icons-material/Send';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import mapApi from '../api/mapApi';
import ReplyIcon from '@mui/icons-material/Reply';
const Comment = ({ comment, updateReplies, updateComment }) => {
    const { auth } = useContext(AuthContext);
    const [likes, setLikes] = useState(comment.likes);
    const [likeClicked, setLikeClicked] = useState(false);
    const [dislikes, setDislikes] = useState(comment.dislikes);
    const [dislikeClicked, setDislikeClicked] = useState(false);
    const [showReplyInput, setShowReplyInput] = useState(false);

    const [replyText, setReplyText] = useState('');
    const [replyList, setReplyList] = useState(comment.replies);

    const onReply = () => {
        const showInput = showReplyInput === true ? false : true;
        setShowReplyInput(showInput);
    };
    const onUpvote = () => {
        let newCommentValue = comment
        if (!likeClicked) {
            setLikes(likes + 1)
            newCommentValue.likes = likes + 1
        }
        else {
            setLikes(comment.likes)
            newCommentValue.likes = comment.likes
        }
        setLikeClicked(!likeClicked)
        if (dislikeClicked) {
            setDislikes(comment.dislikes)
            setDislikeClicked(!dislikeClicked)
            newCommentValue.dislikes = comment.dislikes
        }
        updateComment(comment.commentId, newCommentValue)
    }
    const onDownvote = () => {
        let newCommentValue = comment
        if (!dislikeClicked) {
            setDislikes(dislikes + 1)
            newCommentValue.dislikes = dislikes + 1
        }
        else {
            setDislikes(comment.dislikes)
            newCommentValue.dislikes = comment.dislikes
        }
        setDislikeClicked(!dislikeClicked)
        if (likeClicked) {
            setLikes(comment.likes)
            setLikeClicked(!likeClicked)
            newCommentValue.likes = comment.likes
        }
        updateComment(comment.commentId, newCommentValue)
    }
    const handleAddReply = () => {
        if (replyText == '') {
            console.log("Empty comment")
        }
        else {
            // Implement logic to add a comment (you may want to update your data structure)
            console.log('Adding reply:', replyText);
            // Clear the comment input
            setReplyText('');
            // Update the comment list
            let username = ""
            if (auth.loggedIn) {
                username = auth.user.userName
            }
            else {
                username = "Guest"
            }
            let newReplyList;
            const newReply = { user: username, reply: replyText };
            if (!replyList) {
                newReplyList = [newReply];
                setReplyList(newReplyList);
            }
            else {
                newReplyList = [...replyList, newReply];
                setReplyList(newReplyList);
            }
            console.log("Key is:", comment.commentId)
            updateReplies(comment.commentId, newReplyList)
        }
    }
    let replyDisplay;
    if (replyList) {
        replyDisplay = replyList.map((reply, index) => (
            console.log("reply is", reply),
            <Typography key={reply._id} style={{ fontSize: '12px' }}>
                <span style={{ color: 'steelblue' }}>{reply.user}</span>: {reply.reply}
            </Typography>
        ))
    }

    return (
        <ListItem>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                <Typography><span style={{ color: 'steelblue' }}>{comment.commenter}</span>: {comment.content}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <div className="comment-actions">
                        {!showReplyInput && <Button onClick={onReply} color="primary" size="small" endIcon={<ArrowDropDownIcon />}>
                            Replies
                        </Button>}
                        {showReplyInput && <Button onClick={onReply} color="primary" size="small" endIcon={<ArrowDropUpIcon />}>
                            Replies
                        </Button>}
                        <Button onClick={onUpvote} color="primary" size="small">
                            Upvote {likes}
                        </Button>
                        <Button onClick={onDownvote} color="primary" size="small">
                            Downvote {dislikes}
                        </Button>
                    </div>
                </Box>
                {showReplyInput && (
                    <Card sx={{ marginTop: '20px' }}>
                        <CardContent>
                            {showReplyInput && (
                                <Box sx={{ marginLeft: '20px' }}>
                                    <List>
                                        {replyDisplay}
                                    </List>
                                    <TextField
                                        type="text"
                                        label="Reply"
                                        variant="outlined"
                                        placeholder="Add a reply..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        size="small"
                                        sx={{ borderRadius: '10px', }}
                                        style={{ borderRadius: '10px' }}
                                    // style={{height: '20px'}}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleAddReply}
                                        endIcon={<SendIcon />}
                                        sx={{
                                            borderRadius: '10px',
                                            backgroundColor: '#0844A4', // Replace with your desired color
                                            color: 'white', // Text color
                                            // marginLeft: '10px',
                                            marginLeft: '8px',
                                            height: '40px'
                                        }}
                                    ></Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                )}

            </Box>
        </ListItem>
    );
};

const MapDetailScreen = () => {
    const { globalStore } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [error, setError] = useState(null);
    let { id } = useParams();
    const [currentMapPage, setCurrentMapPage] = useState({
        _id: '',
        title: '',
        description: '',
        tags: [],
        upvotes: 0,
        downvotes: 0,
        comments: [],
        map: {
            mapType: '',
            baseData: '',
            addedFeatures: [],
        },

    });
    const [choroplethAdded, setChoroplethAdded] = useState(null);
    const [geojsonData, setGeojsonData] = useState(null);
    const [type, setType] = useState(null);
    const [newComment, setNewComment] = useState('');
    // const [newTags, setNewTags] = useState('');
    const [commentList, setCommentList] = useState([]);
    // const [newDescription, setDescription] = useState(description);
    const [tagList, setTagList] = useState([]);
    const [likeColor, setLikeColor] = useState('grey');
    const [newLikes, setLikes] = useState(0);
    const [dislikeColor, setDislikeColor] = useState('grey');
    const [newDislikes, setDislikes] = useState(0);
    const [commenting, setCommenting] = useState(false);
    let editText = 'Open Edit As My Map'
    if (auth.user.id === currentMapPage.owner) {
        editText = "Edit My Map"
    }
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                // console.log("fetching map" + id);
                const data = await mapApi.fetchMap(id);
                // console.log("fetched map", data.mappage);
                setCurrentMapPage(data.mappage);
                setChoroplethAdded(data.mappage.map.addedFeatures[0])
                setType(data.mappage.map.mapType)
                setGeojsonData(JSON.parse(data.mappage.map.baseData))
                setTagList(data.mappage.tags)
                setLikes(data.mappage.upvotes)
                setDislikes(data.mappage.downvotes)
                setCommentList(data.mappage.comments)
            } catch (error) {
                console.error('Error fetching map:', error);
                setError(error.message);
            }
        };

        fetchData();
    }, [id]);


    // console.log("currentMapPage is", currentMapPage)
    // let type = currentMapPage.map.mapType
    // let geojsonData = JSON.parse(currentMapPage.map.baseData)
    // let color = 'red'
    // let step = 5
    // let featureForChoropleth = ""
    // if (currentMapPage && type === "Choropleth" && currentMapPage.map.addedFeatures.length > 0) {
    //     color = currentMapPage.map.addedFeatures[0].color
    //     step = currentMapPage.map.addedFeatures[0].step
    //     featureForChoropleth = currentMapPage.map.addedFeatures[0].featureChoropleth
    // }

    // console.log("geojsonData is", geojsonData)  
    // //console.log(globalStore.currentMap)
    // const newMap = globalStore.setMapPage(id);
    // console.log(globalStore.selectedFile)
    // const [mapCenter, setMapCenter] = useState([39.9897471840457, -75.13893127441406]);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             if (globalStore.currentMap == null || globalStore.currentMap._id !== id) {
    //                 // Fetch the map page data using globalStore.setMapPage(id)
    //                 const mapPageData = await globalStore.setMapPage(id);
    //                 console.log("mapPageData inside the async ",mapPageData);
    //                 // Update the currentMapPage state if mapPageData exists
    //                 if (mapPageData) {
    //                     setCurrentMapPage(mapPageData);
    //                 } else {
    //                     console.log('Map page data not found');
    //                 }
    //             } else {
    //                 // If the currentMapPage matches the ID, set it to state directly
    //                 setCurrentMapPage(globalStore.currentMap);
    //                 const mapPageData = await globalStore.setMapPage(id);
    //                 console.log("testing to see mappage data:", mapPageData)
    //             }
    //         } catch (error) {
    //             console.error('Error fetching map page:', error);
    //         }
    //     };

    //     fetchData();
    // }, [globalStore, id]);
    // console.log("Current map page: ", currentMapPage)
    const handleCommenting = () => {
        setCommenting(true);
    };

    const updateCommentReplies = (commentIndex, newReplies) => {
        console.log('updateCommentReplies', commentIndex, newReplies)
        const updatedComments = [...commentList];
        updatedComments[commentIndex].replies = newReplies;
        setCommentList(updatedComments);
        globalStore.setMapPageComments(currentMapPage._id, updatedComments)
    };
    const updateComment = (commentIndex, comment) => {
        const updatedComments = [...commentList];
        updatedComments[commentIndex].likes = comment.likes;
        updatedComments[commentIndex].dislikes = comment.dislikes;
        setCommentList(updatedComments);
        globalStore.setMapPageComments(currentMapPage._id, updatedComments)
    };
    let commentDisplay;
    if (commentList != []) {
        commentDisplay = commentList.map((comment, index) => (
            <Comment key={comment.commentId} comment={comment} updateReplies={updateCommentReplies} updateComment={updateComment} />
        ))
    }
    const handleAddComment = () => {
        if (newComment == '') {
            console.log("Empty comment")
        }
        else {
            // Implement logic to add a comment (you may want to update your data structure)
            console.log('Adding comment:', newComment);
            // Clear the comment input
            setNewComment('');
            // Update the comment list
            let username = ""
            if (auth.loggedIn) {
                username = auth.user.userName
            }
            else {
                username = "Guest"
            }
            let newCommentObject = { commenter: username, commentId: 0, content: newComment, likes: 0, dislikes: 0, replies: [] };
            let newComments;
            if (!commentList) {
                setCommentList([newCommentObject]);
                newComments = [newCommentObject]
            }
            else {
                newCommentObject.commentId = commentList.length
                setCommentList([...commentList, newCommentObject]);
                newComments = [...commentList, newCommentObject]
            }
            globalStore.setMapPageComments(currentMapPage._id, newComments)
            setCommenting(false);
        }
    };

    // const handleUpdateDescription = () => {
    //     console.log('Updating description:', newDescription);
    // }
    // const handleAddTag = () => {
    //     if (newTags == ''){
    //         console.log("Empty tag")
    //     }
    //     else {
    //         // Implement logic to add a comment (you may want to update your data structure)
    //         console.log('Adding tag:', newTags);
    //         setNewTags('');
    //         // Update the comment list
    //         setTagList([...tagList, newTags]);
    //     }
    // }
    // const handleDeleteTag = () => {
    //     console.log('Deleting Tag:', newTags)
    //     setNewTags('');
    // }
    const handleLike = () => {
        console.log('newLikes:', newLikes)
        const newColor = likeColor === 'grey' ? 'steelblue' : 'grey';
        setLikeColor(newColor);
        if (newColor === 'grey') {
            setLikes(currentMapPage.upvotes);
            globalStore.addMapPageLikes(currentMapPage._id, currentMapPage.upvotes);
        }
        else if (newColor === 'steelblue') {
            setLikes(newLikes + 1);
            globalStore.addMapPageLikes(currentMapPage._id, newLikes + 1);
        }
        if (dislikeColor === 'red') {
            setDislikeColor('grey')
            setDislikes(currentMapPage.downvotes)
            globalStore.addMapPageDislikes(currentMapPage._id, currentMapPage.downvotes)
        }
        // globalStore.setMapPageLikes(newLikes);
    };

    const handleDislike = () => {
        const newColor = dislikeColor === 'grey' ? 'red' : 'grey';
        setDislikeColor(newColor);
        if (newColor === 'grey') {
            setDislikes(currentMapPage.downvotes);
            globalStore.addMapPageDislikes(currentMapPage._id, currentMapPage.downvotes)
        }
        else if (newColor === 'red') {
            setDislikes(newDislikes + 1);
            globalStore.addMapPageDislikes(currentMapPage._id, newDislikes + 1)
        }
        if (likeColor === 'steelblue') {
            setLikeColor('grey')
            setLikes(currentMapPage.upvotes)
            globalStore.addMapPageLikes(currentMapPage._id, currentMapPage.upvotes);
        }
    };
    const handleEditPage = () => {
        console.log(auth.user)
        console.log("Viewer is: ", auth.user.id)
        console.log("Owner is: ", currentMapPage.owner)
        if (auth.user.id === currentMapPage.owner) {
            console.log("Is owner already - going to map-info-edit")
            navigate('/map-info-edit/' + currentMapPage._id)
        }
        else if(auth.user.id === "658207d16c2fdba1fd5475a7"){
            console.log("auth is guest!")
            alert("You must be logged in to create a map!")
            navigate("/login")
        }
        else {
            console.log("Is only viewer!")
            console.log(currentMapPage)
            let routerAdd = 'map-info-edit'
            console.log("selectedFile", globalStore.selectedFile)
            const geojson = JSON.parse(currentMapPage.map.baseData);
            const imageURL = currentMapPage.imageURL
            const stringifiedFileContent = JSON.stringify(JSON.stringify(geojson));
            globalStore.copyMap(currentMapPage.title,
                currentMapPage.description,
                currentMapPage.publicStatus,
                currentMapPage.map.mapType,
                currentMapPage.tags,
                stringifiedFileContent,
                currentMapPage.map.addedFeatures,
                routerAdd,
                null,
                imageURL)
        }
    }
    const handleDownload = () => { 

    }
    const mapRef = React.useRef();
    return (
        <Box sx={{ marginTop: 2, marginLeft: 2, marginRight: 2, marginBottom: 2 }}>
            <Grid container spacing={2}>

                <Grid item xs={12} md={8}>

                    <Paper elevation={3} sx={{ p: 2, borderRadius: 3, marginBottom: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                            <Typography variant="h4">{currentMapPage.title}</Typography>
                            <IconButton onClick={() => console.log('download button clicked')}>
                                <DownloadIcon />
                            </IconButton>
                            <IconButton onClick={handleLike}>
                                <UpvoteIcon style={{ color: likeColor }} />
                            </IconButton>
                            {newLikes}
                            <IconButton onClick={handleDislike}>
                                <DownvoteIcon style={{ color: dislikeColor }} />
                            </IconButton>
                            {newDislikes}
                        </Box>
                        <MapContainer ref={mapRef} center={[39.9897471840457, -75.13893127441406]} zoom={11} scrollWheelZoom={true} style={{ height: '600px', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {choroplethAdded ? (
                                geojsonData && geojsonData.features.length > 0 && type === "Choropleth" ? (
                                    <Choropleth color={choroplethAdded.color} geojsonData={geojsonData} step={choroplethAdded.step} featureForChoropleth={choroplethAdded.featureChoropleth} setError={setError} />
                                ) : null
                            ) : (
                                geojsonData && geojsonData.features.length > 0 && type === "Choropleth" ? (
                                    <Choropleth geojsonData={geojsonData} color="red" step={5} featureForChoropleth="None" setError={setError} />
                                ) : null

                            )}
                            {/*{drawPanelOpen&&<DrawLayer/>} */}
                        </MapContainer>
                        {/* <img src={temp_map} alt="Map" style={{ width: '100%', height: 'auto' }} /> */}
                    </Paper>

                    <Paper elevation={3} sx={{ p: 2, borderRadius: 3, marginBottom: 2 }}>
                        <Typography variant="h6">Comments</Typography>
                        <List>
                            {commentDisplay}
                        </List>
                        {commenting && <Box>
                            <TextField
                                type="text"
                                label="Comment"
                                variant="outlined"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                size="small"
                                sx={{ borderRadius: '10px', }}
                                style={{ borderRadius: '10px' }}
                            // style={{height: '20px'}}
                            />
                            <Button
                                variant="contained"
                                onClick={handleAddComment}
                                endIcon={<SendIcon />}
                                sx={{
                                    borderRadius: '10px',
                                    backgroundColor: '#0844A4', // Replace with your desired color
                                    color: 'white', // Text color
                                    // marginLeft: '10px',
                                    marginLeft: '8px',
                                    height: '40px'
                                }}
                            ></Button>
                        </Box>
                        }
                        {!commenting && <Box><Button
                            variant="contained"
                            onClick={handleCommenting}
                            endIcon={<ReplyIcon />}
                            sx={{
                                borderRadius: '10px',
                                backgroundColor: '#0844A4', // Replace with your desired color
                                color: 'white', // Text color
                                // marginLeft: '10px',
                                marginLeft: '8px',
                                height: '40px'
                            }}
                        >Comment</Button>
                        </Box>}
                    </Paper>
                </Grid>
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
                        <Typography>{currentMapPage.description}</Typography>
                    </Paper>

                    <Paper elevation={3} sx={{ p: 2, borderRadius: 3, marginBottom: 2 }}>
                        <Typography variant="h6">Tags</Typography>
                        <Tags tags={tagList}></Tags>
                    </Paper>

                    <Box>

                        <Button
                            variant="contained"
                            onClick={handleEditPage}
                            sx={{
                                borderRadius: '10px',
                                backgroundColor: '#0844A4', // Replace with your desired color
                                color: 'white', // Text color
                                // marginLeft: '10px',
                                marginTop: '10px',
                            }}
                        >
                            {editText}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => console.log('Button 2 clicked')}
                            sx={{
                                borderRadius: '10px',
                                backgroundColor: '#0844A4', // Replace with your desired color
                                color: 'white', // Text color
                                marginLeft: '10px',
                                marginTop: '10px',
                            }}
                        >
                            Export Data
                        </Button>
                        {error && <Typography style={{ color: 'red' }}>{error}</Typography>}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MapDetailScreen;