import React, { useEffect, useState, useContext, useRef } from "react";
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
    Chip,
    Alert
} from '@mui/material';
import mapApi from "../api/mapApi";
import { FormHelperText } from "@mui/material";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { kml } from "@tmcw/togeojson";
const shp = require('shpjs');
const JSZip = require('jszip');
const temp_map = 'https://datavizcatalogue.com/methods/images/top_images/choropleth.png';

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
    const [creatingMessage, setCreatingMessage] = useState(false);
    const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB in bytes

    const isFileSizeValid = (file) => {
        return file.size <= MAX_FILE_SIZE;
    };
    // const [center, setCenter] = useState([0,0]);
    function handleSubmit() {
        if (!fileContent) {
            // console.error('Please select a file.');
            setError("Please select a file.");
            return;
        }
        console.log("TAGS"+tags)
        console.log(tags.length)
        if (mapName === "" || description === "" || tags.length === 0 || selectedFile === "") {
            // alert("Please fill all fields");
            setError("Please fill all fields");
            return;
        }

        const stringifiedFileContent = JSON.stringify(fileContent);
        let modifiedTags = [...tags];
        if (!tags.includes(selectedCategory)) {
            modifiedTags = [...tags, selectedCategory]; // default add the category like "Choropleth" as a tag
        }
        // console.log("stringifided", stringifiedFileContent);

        const parsedContent = JSON.parse(fileContent)
        //prevent non points from being in heat maps
        if ((selectedCategory == "HeatMap" || selectedCategory == "Point" )&& parsedContent["features"]) {
            parsedContent["features"].forEach(function (feature) {
                if (feature["geometry"]["type"] != "Point") {
                    setError("Invalid File Type!")
                    return;
                }
            })
        }

        auth.getLoggedIn()
        try {
            globalStore.createMap(mapName, description, isPublic, selectedCategory, modifiedTags, stringifiedFileContent, routerAdd, selectedFile,imageURL)
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

        var defaultMap = {
            "type": "FeatureCollection",
            "features": [
               
            ]
        };
        if(selectedCategory==="HeatMap" || selectedCategory==="Point"){
            defaultMap = {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "properties": {
                            "Bounds": [
                                [-90, -180], // Southwest coordinates
                                [90, 180]  // Northeast coordinates
                            ],
                        }
                    }
                ]
            };
        }

        // if(selectedCategory == "Regional"){
        //     defaultMap = {
        //         "type": "FeatureCollection",
        //         "features": [{ type: "String", name: "color" }]
        //     }
        // }
        
        const stringifiedFileContent = JSON.stringify(JSON.stringify(defaultMap));
        console.log("stringifided", JSON.parse(stringifiedFileContent));
        auth.getLoggedIn()
        globalStore.createMap(mapName, description, isPublic, selectedCategory, tags, stringifiedFileContent, routerAdd, null,temp_map)
        // mapApi.createMap(mapName, isPublic, description, tags, selectedCategory, selectedFile)
        // Logic to handle starting with a blank map
        // console.log("Start with Blank Map");
    };

    const handleLoadFromMap = async () => {
        fileInputRef.current.click();
    };

    const convertGeoJSONToPNG = async (file) => {
        setCreatingMessage("Creating map...It may take a while");
        if (!file) {
            console.error('No file selected');
            return;
        }

        const reader = new FileReader();

        reader.onload = async function (event) {
            // const fileContent = event.target.result;
            try {
                const parsedContent = JSON.parse(fileContent);
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
                        setCreatingMessage(null);

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
        const rawFile = event.target.files[0];
        setError()
        if (!rawFile || !(rawFile.name.endsWith('.json') || rawFile.name.endsWith('.geojson') || rawFile.name.endsWith('.zip') || rawFile.name.endsWith('.kml'))) {
            // Display an error message or handle it as needed
            setError('Please choose a file of type: .json, .geojson, .kml, .zip');
            setLoadingImage(false); // Reset loading state
            return;
        }

        if (!isFileSizeValid(rawFile)) {
            setError('File size exceeds 16MB. Please choose a smaller file.');
            setLoadingImage(false); // Reset loading state
            return;
        }
    
        const reader = new FileReader();

        reader.onload = async function (event) {
            const data = event.target.result;
            let fileContent = data;

            if (rawFile.name.endsWith('.zip')) {
                console.log("if statement shp");
                fileContent = await convertSHPtoJSON(rawFile);
            } else if (rawFile.name.endsWith('.kml')) {
                console.log("if statement kml");
                fileContent = convertKMLtoJSON(data);
            }

            setFileContent(fileContent);
            setSelectedFile(rawFile);
            setSelectedFileName(rawFile.name);
        };

        if (rawFile.name.endsWith('.zip')) {
            reader.readAsArrayBuffer(rawFile);
        } else {
            reader.readAsText(rawFile);
        }
    };
    useEffect(() => {
        if (fileContent) {
            try {
                const parsedContent = JSON.parse(fileContent);
                setGeojson(parsedContent);
                console.log(parsedContent);
                convertGeoJSONToPNG(selectedFile);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
    }, [fileContent, selectedFile]);

    const convertSHPtoJSON = async (file) => {
        console.log("convert shp to geojson")
        const zip = await JSZip.loadAsync(file);
        const shpFile = Object.keys(zip.files).find(
            (filename) => filename.toLowerCase().endsWith('.shp')
        );
        const shpBuffer = await zip.files[shpFile].async('blob').then((blob) =>
            blob.arrayBuffer()
        );


        const dbfFile = Object.keys(zip.files).find(
            (filename) => filename.toLowerCase().endsWith('.dbf')
        );
        const dbfBuffer = await zip.files[dbfFile].async('blob').then((blob) =>
            blob.arrayBuffer()
        );
        const geometryData = shp.parseShp(shpBuffer);
        const attributeData = shp.parseDbf(dbfBuffer);
        console.log(attributeData)
        const features = geometryData.map((geometry, index) => {
            const attributes = attributeData[index];
            return {
                type: 'Feature',
                geometry,
                properties: attributes,
            };
        });
        const geoJSON = {
            type: 'FeatureCollection',
            features,
        };
        // const geoJSON = shp.combine([shp.parseShp(shpBuffer)]);
        return JSON.stringify(geoJSON)
    }
    const convertKMLtoJSON = (file) => {
        console.log("convert kml to geojson")
        const DOMParser = require("xmldom").DOMParser;
        const kmlFile = new DOMParser().parseFromString(file);
        const geoJSON = kml(kmlFile)
        return JSON.stringify(geoJSON)
    }
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
                        : selectedValue === 'Point'
                            ? 'point-edit'
                        : selectedValue === 'Path'
                            ? 'path-edit': 'edit';
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
                                <MenuItem value="Path">Path Map</MenuItem>
                                <MenuItem value="Point">Point Map</MenuItem>
                                {/* Add more categories as needed */}
                            </Select>
                        </Box>
                    </Grid>
                </Grid>
                {error && <FormHelperText error>{error}</FormHelperText>}
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
                        accept=".json, .geojson, .kml, .zip"
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
                {creatingMessage && <Alert severity="success" style={{ marginTop: '5px' }}>
                    {creatingMessage}
                </Alert>}

                {imageURL && (
                    <div>
                        <p>Image Preview:</p>
                        <img src={imageURL} alt="Map Preview" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                    </div>
                )}


            </Grid>
        </Grid>
    );
};

export default MapCreationPage;