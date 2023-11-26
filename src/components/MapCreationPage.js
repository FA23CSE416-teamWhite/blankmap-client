import React, { useEffect, useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import { GlobalStoreContext } from '../store/index'; 
import {
    Box,
    Typography,
    TextField,
    TextareaAutosize,
    FormControl,
    FormControlLabel,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    Button,
    Chip
} from '@mui/material';
import mapApi from "../api/mapApi";
import { FormHelperText } from "@mui/material";

const MapCreationPage = () => {
    const { globalStore, setQueryString } = useContext(GlobalStoreContext);
    // State for form inputs
    const [mapName, setMapName] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Choropleth");
    const [routerAdd, setRouterAdd] = useState("edit")
    const fileInputRef = React.useRef();

    const[selectedFile, setSelectedFile] = useState(null);  
    const [selectedFileName, setSelectedFileName] = useState("");
    const navigate = useNavigate();

    function handleSubmit(){
        if(mapName=== "" ||description===""||tags===""||selectedFile==="" ){
            alert("Please fill all fields");
                return;
        }
        globalStore.createMap(mapName,description,isPublic,tags,selectedFile)
    }
    const handleStartWithBlank = () => {
        console.log("Load from Map");
        console.log("Map Name: ", mapName);
        console.log("Is Public: ", isPublic);
        console.log("Description: ", description);
        navigate("/" + routerAdd)
        mapApi.createMap(mapName, isPublic, description, tags, selectedCategory, selectedFile)
        // Logic to handle starting with a blank map
        console.log("Start with Blank Map");
    };

    const handleLoadFromMap = async () => {
        fileInputRef.current.click();
    };


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        // Do something with the selected file, for example, store it in state
        setSelectedFile(file);
        setSelectedFileName(file.name);
    };
    const handleCategoryChange = (event) => {
        // Update the selected category when the user chooses from the dropdown
        const selectedValue = event.target.value;

        // Set the appropriate edit value based on the selected category
        const editValue =
            selectedValue === 'Choropleth' || selectedValue === ''
                ? 'edit'
                : selectedValue === 'HeatMap'
                    ? 'edit-heat'
                    : selectedValue === 'Regional'
                        ? 'regional-edit'
                        : 'edit';
        setSelectedCategory(selectedValue);
        setRouterAdd(editValue);
    };
    const handleToggleSwitch = () => {
        setIsPublic(!isPublic);
    };

    const addTag = () => {
        if (newTag.trim() === "") return;
        setTags([...tags, newTag]);
        setNewTag("");
      };
    
      const removeTag = (tagToRemove) => {
        const updatedTags = tags.filter((tag) => tag !== tagToRemove);
        setTags(updatedTags);
      };

    return (
        <Grid container>
            <Grid item xs={12} sm={1}></Grid>
            <Grid item xs={12} sm={3}>
                {/* <Typography variant="h4" sx={{ color: 'black', textAlign: 'center' }}>
                    Create Map
                </Typography> */}
                <FormControl sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <TextField

                        id="mapName"
                        type="text"
                        value={mapName}
                        margin="normal"
                        size="small"
                        label="Map Name:"
                        variant="outlined"
                        placeholder="Enter Name of the map"
                        onChange={(e) => setMapName(e.target.value)}
                        sx={{
                            width: '400px', // Set the width to make it square
                            borderRadius: '8px', // Optional: Set the border-radius for rounded corners
                        }}
                    />
                </FormControl>
                <Box>
                    <FormControlLabel
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            '& .MuiSwitch-thumb': {
                                color: isPublic ? '#0844A4' : '#D6D6D6', // Change thumb color based on the switch state
                            },
                            '& .MuiSwitch-track': {
                                backgroundColor: isPublic ? '#99ff99' : '#D6D6D6', // Change track color based on the switch state
                            },
                        }}
                        control={<Switch checked={isPublic} onChange={handleToggleSwitch} />}
                        label={
                            <Typography variant="body1">
                                {isPublic ? 'Public' : 'Private'}
                            </Typography>
                        }
                        labelPlacement="start"
                    />
                </Box>
                <FormControl fullWidth margin="normal" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <TextField
                        id="mapDescription"
                        type="text"
                        value={description}
                        margin="normal"
                        label="Description:"
                        variant="outlined"
                        placeholder="Enter a map description"
                        fullWidth
                        multiline
                        sx={{
                            width: '400px', // Set the width to make it square
                            height: '250px', // Set the height to make it
                            borderRadius: '8px', // Optional: Set the border-radius for rounded corners
                        }}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={10}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal" sx={{marginY:3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    
                    <Box display="flex" alignItems="center">
                    <TextField
                        id="mapTags"
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a Tag"
                    />
                    <Button sx={{marginX:1}} variant="contained" onClick={addTag}>
                        Add Tag
                    </Button>
                    </Box>
                    <Box mt={1}>
                    {tags.map((tag, index) => (
                        <Chip
                        key={index}
                        label={tag}
                        onDelete={() => removeTag(tag)}
                        sx={{ margin: '0.5rem' }}
                        />
                    ))}
                    </Box>
                </FormControl>

                {/* <FormControl fullWidth margin="normal" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <TextField
                        id="mapTags"
                        type="text"
                        value={tags}
                        margin="normal"
                        label="Tags:"
                        variant="outlined"
                        placeholder="Enter your map tags (Use space to divide tags)"
                        fullWidth
                        multiline
                        sx={{
                            width: '400px', // Set the width to make it square
                            height: '200px', // Set the height to make it
                            borderRadius: '8px', // Optional: Set the border-radius for rounded corners
                        }}
                        onChange={handleTagsChange}
                        rows={5}
                    />
                </FormControl> */}
            </Grid>
            <Grid item xs={12} sm={1}>
            </Grid>
            <Grid item xs={12} sm={7}>
                <Box sx={{ height: '40px' }}></Box>
                <Grid container>
                    <Grid item xs={12} sm={5} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ color: '#0844A4', display: 'flex', justifyContent: 'left' }}>
                            How do you want to start:
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Box>
                            <InputLabel sx={{ justifyContent: 'right', alignItems: 'center' }} htmlFor="selectedCategory">Choose a Category:</InputLabel>
                            <Select
                                id="selectedCategory"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                sx={{ width: '200px', display: 'flex', justifyContent: 'right', alignItems: 'center', }}
                                size="small"
                            >
                                {/* <MenuItem value="">-- Select --</MenuItem> */}
                                <MenuItem value="Choropleth">Choropleth</MenuItem>
                                <MenuItem value="HeatMap">Heat Map</MenuItem>
                                <MenuItem value="Regional">Regional Map</MenuItem>
                                {/* Add more categories as needed */}
                            </Select>
                        </Box>
                    </Grid>
                </Grid>
                {selectedFileName}
                <Box sx={{ display: 'flex', alignItems: 'center', border: '3px solid #0844A4', padding: '10px', marginTop: '30px', marginRight: "20px", borderRadius: '10px' }}>
                    <Button
                        variant="contained"
                        onClick={handleStartWithBlank}
                        sx={{
                            borderRadius: '10px',
                            backgroundColor: '#0844A4', // Replace with your desired color
                            color: 'white', // Text color
                        }}
                    >
                        Start With Blank
                    </Button>
                    <Box sx={{ width: '10px' }}></Box>
                    <Button
                        variant="contained"
                        onClick={handleLoadFromMap}
                        sx={{
                            borderRadius: '10px',
                            backgroundColor: '#0844A4', // Replace with your desired color
                            color: 'white', // Text color
                        }}
                    >
                        Load From Map
                    </Button>
                    <input
                        type="file"
                        accept=".json"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </Box>
                <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            borderRadius: '10px',
                            backgroundColor: '#0844A4', // Replace with your desired color
                            color: 'white', // Text color
                            marginY:2
                        }}
                    >
                        Submit
                    </Button>
            </Grid>
        </Grid>
    );
};

export default MapCreationPage;