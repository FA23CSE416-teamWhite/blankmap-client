import React, { useEffect, useState, useContext,useRef } from "react";
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import { GlobalStoreContext } from '../store/index';
import AuthContext from "../auth";
import leafletImage from 'leaflet-image';
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
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';


const MapCreationPage = () => {
    const { globalStore } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext)
    // State for form inputs
    const [mapName, setMapName] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Choropleth");
    const [routerAdd, setRouterAdd] = useState("edit")
    const fileInputRef = React.useRef();

    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState("");
    const navigate = useNavigate();
    const [fileContent, setFileContent] = useState(null);
    const [error, setError] = useState(null);
    const [geojson, setGeojson] = useState(null);
    const [map, setMap] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const mapRef = useRef(null);
    const [imageURL, setImageURL] = useState('');
    const [loadingImage, setLoadingImage] = useState(false);
    // const [center, setCenter] = useState([0,0]);
    function handleSubmit() {
        if (!fileContent) {
            // console.error('Please select a file.');
            setError("Please select a file.");
            return;
        }
        if (mapName === "" || description === "" || tags.length===0 || selectedFile === "") {
            // alert("Please fill all fields");
            setError("Please fill all fields");
            return;
        }
        console.log("file:", fileContent)
        const stringifiedFileContent = JSON.stringify(fileContent);
        let modifiedTags = [...tags];
        if (!tags.includes(selectedCategory)) {
            modifiedTags = [...tags, selectedCategory]; // default add the category like "Choropleth" as a tag
        }
        // console.log("stringifided", stringifiedFileContent);

        const parsedContent = JSON.parse(fileContent)
        //prevent non points from being in heat maps
        if(selectedCategory == "HeatMap" && parsedContent["features"]){
            parsedContent["features"].forEach(function(feature){
                if(feature["geometry"]["type"] != "Point"){
                    setError("Invalid File Type!")
                    return;
                }
            })
        }

        auth.getLoggedIn()
        try {
            // globalStore.createMap(mapName, description, isPublic, selectedCategory, modifiedTags, stringifiedFileContent, routerAdd, selectedFile,imageURL)
        } catch (error) {
            console.log(error);
            setError("Error creating map: ", error);
        }
    }
    const handleStartWithBlank = () => {
        if (mapName === "" || description === "" || tags === "") {
            // alert("Please fill all fields");
            setError("Please fill all fields");
            return;
        }
        console.log("Load from Map");
        console.log("Map Name: ", mapName);
        console.log("Is Public: ", isPublic);
        console.log("Description: ", description);

        var defaultMap ={
            "type": "FeatureCollection",
            "features": []
        }

        if(selectedCategory == "Regional"){
            defaultMap = {
                "type": "FeatureCollection",
                "features": [{ type: "String", name: "color" }]
            }
        }
        
        const stringifiedFileContent = JSON.stringify(JSON.stringify(defaultMap));
        console.log("stringifided", JSON.parse(stringifiedFileContent));
        auth.getLoggedIn()
        globalStore.createMap(mapName, description, isPublic, selectedCategory, tags, stringifiedFileContent, routerAdd, null)
        // mapApi.createMap(mapName, isPublic, description, tags, selectedCategory, selectedFile)
        // Logic to handle starting with a blank map
        // console.log("Start with Blank Map");
    };

    const handleLoadFromMap = async () => {
        fileInputRef.current.click();
    };

    const convertGeoJSONToPNG = async (file) => {
        if (!file) {
            console.error('No file selected');
            return;
        }
    
        const reader = new FileReader();
    
        reader.onload = async function (event) {
            const fileContent = event.target.result;
            try {
                console.log('File content before parsing:', fileContent);
                const parsedContent = JSON.parse(fileContent);
                console.log('Parsed content:', parsedContent);
    
                const mapWidth = 600; // Replace with your map width
                const mapHeight = 400; // Replace with your map height
                const canvas = document.createElement('canvas');
                canvas.width = mapWidth;
                canvas.height = mapHeight;
    
                // let mapContainer = document.getElementById('mapContainer');
                // if (mapContainer && mapContainer.parentNode) {
                //     mapContainer.remove();
                // }
    
                let mapContainer = document.createElement('div');
                mapContainer.id = 'mapContainer';
                mapContainer.style.width = '600px';
                mapContainer.style.height = '400px';
                mapContainer.style.position = 'absolute';
                mapContainer.style.left = '-9999px';
                document.body.appendChild(mapContainer);
    
                const map = L.map(mapContainer, { preferCanvas: true });
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors',
                }).addTo(map);

                const geojsonLayer = L.geoJSON(parsedContent).addTo(map);
    
                const bounds = geojsonLayer.getBounds();
                console.log('Bounds:', bounds);
    
                map.fitBounds(bounds);
    
                setTimeout(() => {
                    leafletImage(map, async function (err, canvas) {
                        if (err) {
                            console.error('Error converting JSON to image:', err);
                            return;
                        }
                        console.log('Canvas:', canvas);
                        const imageUrl = canvas.toDataURL('image/png');
                        setImageURL(imageUrl);
                        
                        // Remove the mapContainer from the body
                        if (mapContainer && mapContainer.parentNode) {
                            mapContainer.parentNode.removeChild(mapContainer);
                        }
                        console.log(imageURL)
                        setLoadingImage(false);
                    });
                }, 1000);
            } catch (error) {
                console.error('Error converting JSON to image:', error);
            }
        };
    
        reader.readAsText(file);
    };
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setLoadingImage(true);
        if (!file || !(file.name.endsWith('.json') || file.name.endsWith('.geojson'))) {
            // Display an error message or handle it as needed
            setLoadingImage(false); // Reset loading state
            return;
        }

        console.log(file);
        setSelectedFile(file);
        setSelectedFileName(file.name);
        convertGeoJSONToPNG (file); 
        const reader = new FileReader();
        
        reader.onload = function (event) {
            const fileContent = event.target.result;
            setFileContent(fileContent);

            try {
                const parsedContent = JSON.parse(fileContent);
                setGeojson(parsedContent);
                console.log(parsedContent);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };

        reader.readAsText(file);
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
        // Check if the new tag already exists in the tags array
        if (!tags.includes(newTag)) {
            setTags([...tags, newTag]);
        }
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
                <FormControl fullWidth margin="normal" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                    <TextField
                        id="mapTags"
                        type="text"
                        value={newTag}
                        margin="normal"
                        label="Add Tags:"
                        variant="outlined"
                        multiline
                        sx={{
                            width: '400px', // Set the width to make it square
                            // height: '250px',
                            borderRadius: '8px', // Optional: Set the border-radius for rounded corners
                        }}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add some tags to highlight your map"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '400px' }}>
                        <Button variant="contained"
                            onClick={addTag}
                            sx={{
                                borderRadius: '10px',
                                backgroundColor: '#0844A4', // Replace with your desired color
                                color: 'white', // Text color
                            }}>
                            Add Tag
                        </Button>
                    </Box>

                </FormControl>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        justifyContent: 'flex-start', // Align chips to the start of the container
                    }}
                >
                    {tags.map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag}
                            onDelete={() => removeTag(tag)}
                            sx={{ margin: '0.5rem' }}
                        />
                    ))}
                </Box>

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
                <Box sx={{ display: 'flex', alignItems: 'center', border: '3px solid #0844A4', padding: '10px', marginTop: '30px', marginRight: "10%", borderRadius: '10px' }}>
                    {selectedFile && (
                        <MapContainer id="mapContainer" ref={setMap} center={[0, 0]} zoom={2} scrollWheelZoom={true} style={{ height: '600px', width: '100%' }} >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {geojson && <GeoJSON key={JSON.stringify(geojson)} // Add a key that changes when geojson changes
            data={geojson} />}
                        </MapContainer>
                    )}
                    {!selectedFile &&
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
                        </Button>}
                    <Box sx={{ width: '10px' }}></Box>
                    {!selectedFile && <Button
                        variant="contained"
                        onClick={handleLoadFromMap}
                        sx={{
                            borderRadius: '10px',
                            backgroundColor: '#0844A4', // Replace with your desired color
                            color: 'white', // Text color
                        }}
                    >
                        Load From Map
                    </Button>}
                    <input
                        id="fileInput"
                        type="file"
                        accept=".json, .geojson"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </Box>
                {selectedFile && <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!imageURL || loadingImage}
                    sx={{
                        borderRadius: '10px',
                        backgroundColor: '#0844A4', // Replace with your desired color
                        color: 'white', // Text color
                        marginY: 2
                    }}
                >
                    Create and Edit Map
                </Button>}
                {selectedFile && <Button
                    variant="contained"
                    onClick={handleLoadFromMap}
                    sx={{
                        borderRadius: '10px',
                        backgroundColor: '#0844A4', // Replace with your desired color
                        color: 'white', // Text color
                        marginLeft: '10px',
                    }}
                >
                    Load From Another
                </Button>}
               
                {imageURL && (
    <div>
        <p>Image Preview:</p>
        <img src={imageURL} alt="Map Preview" style={{ maxWidth: '100%', maxHeight: '400px' }} />
    </div>
)}
                {error && <FormHelperText error>{error}</FormHelperText>}
                {imagePreview && (
                    <div>
                        <p>Image Preview:</p>
                        <img src={imagePreview} alt="File Preview" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                    </div>
                )}
            </Grid>
        </Grid>
    );
};

export default MapCreationPage;