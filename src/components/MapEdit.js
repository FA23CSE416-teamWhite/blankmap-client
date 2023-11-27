import React, { useState, useEffect, Component, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalStoreContext } from '../store/index';
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
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
    CardContent,
} from "@mui/material";
import tempMap from '../assets/tempMap.png'
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import Redo from "@mui/icons-material/Redo";
import Card from "@mui/material/Card";
import SquareIcon from '@mui/icons-material/Square';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import omnivore from 'leaflet-omnivore';
import * as turf from '@turf/turf';
import Choropleth from "./Choropleth"

const MapEdit = () => {
    const tempMapData = {
        addedFeatures: [
            { type: "String", name: "Name" },
            { type: "Number", name: "Population" },
            { type: "Number", name: "Area" },
            { type: "Number", name: "GDP" },
            { type: "Number", name: "HDI" },],
        baseData: [],
        mapType: "Choropleth"
    }
    const [features, setFeatures] = useState(tempMapData.addedFeatures);
    const [newFeature, setNewFeature] = useState("");

    const [selectedFeatureType, setSelectedFeatureType] = useState("");
    const [pickColor, setPickColor] = useState("");
    const [geojsonData, setGeojsonData] = useState(null);
    const [mapCenter, setMapCenter] = useState([40, -75]);
    let displayFeatures = features.map((feature, index) => (
        <IconButton
            key={index}
            sx={{
                fontSize: '10px',
                backgroundColor: '#0844A4',
                color: 'white',
                padding: '5px',
                borderRadius: '10px',
                margin: '0 4px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'background-color 0.3s', // Add transition for smooth color change
                ':hover': {
                    backgroundColor: '#0A5CE8', // Change color on hover
                },
            }}
        >
            {feature.name}
        </IconButton>
    ));
    const handleAddFeature = () => {
        if (selectedFeatureType && newFeature) {
            setFeatures([
                ...features,
                { type: selectedFeatureType, name: newFeature },
            ]);

            setSelectedFeatureType("");
            setNewFeature("");
        }
    };

    const handleEditFeature = (index) => {
        const updatedFeatures = [...features];
        updatedFeatures.splice(index, 1);
        setFeatures(updatedFeatures);
    };

    const handleRenderChoropleth = () => {
        console.log("Rendering as choropleth map...");
    };

    const handleRankFeatures = () => {
        console.log("Ranking features...");
    };
    const handleUndo = () => {
    }
    const handleRedo = () => {
    }
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const data = JSON.parse(e.target.result);
              setGeojsonData(data);
      
              // Extract center coordinates from GeoJSON data
            //   mapRef.current.fitBounds(data.getBounds());
            };
            reader.readAsText(file);
          }
      };
    const mapRef = React.useRef();
    return (
        <Grid container>
            <Grid item xs={12} sm={1}></Grid>
            <Grid item xs={12} sm={6}>
                <Typography
                    variant="h4"
                    sx={{
                        color: "black",
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "left",
                    }}
                >
                    Map Title
                </Typography>
                <MapContainer ref={mapRef} center={mapCenter} zoom={13} scrollWheelZoom={true} style={{ height: '600px', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* <Marker position={[51.505, -0.09]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker> */}
                    {geojsonData && <GeoJSON data={geojsonData} />}
                    <Choropleth />
                </MapContainer>
                <Button variant="contained"
                    sx={{
                        borderRadius: '10px',
                        backgroundColor: '#0844A4', // Replace with your desired color
                        color: 'white', // Text color
                        marginTop: '10px',
                    }}>
                    Add a New Region
                </Button>
                <input type="file" accept=".geojson" onChange={handleFileUpload} />

            </Grid>
            <Grid item xs={12} sm={.5}></Grid>

            {/* Right Side */}
            <Grid item xs={12} sm={4}>
                <Box sx={{ height: "40px" }}></Box>
                {/* Title */}
                <Grid container>
                    <Grid item xs={12} sm={9}>
                        <Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: "blue",
                                    display: "flex",
                                    justifyContent: "left",
                                    alignItems: "center",
                                }}
                            >
                                Category: Choropleth Map
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box>
                            <UndoIcon sx={{ mr: 1 }} onClick={handleUndo} />
                            <Redo onClick={handleRedo} />
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ paddingY: 2 }} />
                <Box>
                    <Typography>
                        Features: {displayFeatures}
                    </Typography>
                    <Link>edit</Link>
                </Box>

                <Box sx={{ paddingY: 2 }} />

                <Card>
                    <CardContent>
                        <Typography>Feature Name:</Typography>
                        <TextField
                            type="text"
                            fullWidth
                            placeholder="Add a feature..."
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            size="small"
                            sx={{ height: '40px' }}
                        />
                    </CardContent>
                </Card>
                <Button variant="contained"                     sx={{
                        borderRadius: '10px',
                        backgroundColor: '#0844A4', // Replace with your desired color
                        color: 'white', // Text color
                        marginTop: '10px',
                    }} onClick={handleAddFeature}> Add More Features</Button>
                <Box sx={{ paddingY: 2 }} />

                <Typography>
                    Feature for Choropleth
                </Typography>
                <TextField label="Choose a Feature"></TextField>
                <Typography> Choose a Color: {pickColor}</Typography>
                <Box sx={{ paddingY: 1 }}>
                    <SquareIcon sx={{ color: "red", paddingX: 1 }} onClick={() => setPickColor("red")} />
                    <SquareIcon sx={{ color: "blue", paddingX: 1 }} onClick={() => setPickColor("blue")} />
                    <SquareIcon sx={{ color: "yellow", paddingX: 1 }} onClick={() => setPickColor("yellow")} />
                    <SquareIcon sx={{ color: "green", paddingX: 1 }} onClick={() => setPickColor("green")} />
                    <SquareIcon sx={{ color: "purple", paddingX: 1 }} onClick={() => setPickColor("purple")} />
                </Box>

                <Box>
                    <Button variant="contained"                     sx={{
                        borderRadius: '10px',
                        backgroundColor: '#0844A4', // Replace with your desired color
                        color: 'white', // Text color
                        marginTop: '10px',
                    }}> Rank It</Button>
                    <Button variant="contained"                     sx={{
                        borderRadius: '10px',
                        backgroundColor: '#0844A4', // Replace with your desired color
                        color: 'white', // Text color
                        marginTop: '10px',
                        marginLeft: '10px'
                    }} href="/create">
                        Render as Choropleth Map
                    </Button></Box>
            </Grid>
            <Grid item xs={12} sm={.5}></Grid>
        </Grid>
    );
};

export default MapEdit;
