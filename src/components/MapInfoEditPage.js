import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import { GlobalStoreContext } from '../store/index';
import AuthContext from "../auth";
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
import { useParams } from 'react-router-dom'


const MapInfoEditPage = () => {
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
    const { id } = useParams();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await mapApi.fetchMap(id);
                const geojson = JSON.parse(data.mappage.map.baseData);
                console.log(data.mappage);
                setMapName(data.mappage.title);
                setIsPublic(data.mappage.publicStatus);
                setDescription(data.mappage.description);
                setSelectedCategory(data.mappage.map.mapType);
                setTags(data.mappage.tags);
                setGeojson(geojson);
            } catch (error) {
                console.error('Error fetching map:', error);
            }
        };

        fetchData();
    }, [id]);
    // const [center, setCenter] = useState([0,0]);

    function handleSubmit() {
        // if (!fileContent) {
        //     // console.error('Please select a file.');
        //     setError("Please select a file.");
        //     return;
        // }
        if (mapName === "" || description === "" || tags === "" || selectedFile === "") {
            // alert("Please fill all fields");
            setError("Please fill all fields");
            return;
        }
        const stringifiedFileContent = JSON.stringify(JSON.stringify(geojson));
        let modifiedTags = [...tags];
        if (!tags.includes(selectedCategory)) {
            modifiedTags = [...tags, selectedCategory]; // default add the category like "Choropleth" as a tag
        }
        // console.log("stringifided", stringifiedFileContent);
        auth.getLoggedIn()
        try {
            globalStore.updateMapInfo(id, mapName, description, isPublic, selectedCategory, modifiedTags, stringifiedFileContent, routerAdd, selectedFile)
            // globalStore.createMap(mapName, description, isPublic, selectedCategory, modifiedTags, stringifiedFileContent, routerAdd, selectedFile)
        } catch (error) {
            console.log(error);
            setError("Error creating map: ", error);
        }
    }
    const handleStartWithBlank = () => {
        console.log("Load from Map");
        console.log("Map Name: ", mapName);
        console.log("Is Public: ", isPublic);
        console.log("Description: ", description);
        navigate("/" + routerAdd)
        // mapApi.createMap(mapName, isPublic, description, tags, selectedCategory, selectedFile)
        // Logic to handle starting with a blank map
        // console.log("Start with Blank Map");
    };

    const handleLoadFromMap = async () => {
        fileInputRef.current.click();
    };

    // const fitBounds = () => {
    //     if (map && geojson) {
    //       map.fitBounds(geojson.getBounds());
    //     }
    //   };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file || !(file.name.endsWith('.json') || file.name.endsWith('.geojson'))) {
            // Display an error message or handle it as needed
            console.error('Please select a valid JSON file.');
            return;
        }

        console.log(file);
        setSelectedFile(file);
        setSelectedFileName(file.name);

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
                    {geojson && (
                        <MapContainer ref={setMap} center={[0, 0]} zoom={2} scrollWheelZoom={true} style={{ height: '600px', width: '100%' }} >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {geojson && <GeoJSON data={geojson} />}
                        </MapContainer>
                    )}
                    {!geojson &&
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
                    {!geojson && <Button
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
                {geojson && <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                        borderRadius: '10px',
                        backgroundColor: '#0844A4', // Replace with your desired color
                        color: 'white', // Text color
                        marginY: 2
                    }}
                >
                    Edit Map
                </Button>}
                {geojson && <Button
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
                {error && <FormHelperText error>{error}</FormHelperText>}
            </Grid>
        </Grid>
    );
};

export default MapInfoEditPage;