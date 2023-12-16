import React, { useState, useEffect, Component, useContext, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GlobalStoreContext } from '../store/index';
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import DataEditPanel from './DataEditPanel';
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
    Autocomplete,
    Card,
    Paper,
} from "@mui/material";
import tempMap from '../assets/tempMap.png'
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import Redo from "@mui/icons-material/Redo";
import SquareIcon from '@mui/icons-material/Square';
import DrawLayer from './DrawLayer';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import omnivore from 'leaflet-omnivore';
import * as turf from '@turf/turf';
import Choropleth from "./Choropleth"
import mapApi from '../api/mapApi';

const MapEdit = () => {
    const { globalStore } = useContext(GlobalStoreContext);
    const [file_created, setFile_created] = useState(null);
    const [features, setFeatures] = useState([]);
    const [newFeature, setNewFeature] = useState("");
    const [selectedFeatureType, setSelectedFeatureType] = useState("string");
    const [featureForChoropleth, setFeatureForChoropleth] = useState("None");
    const [pickColor, setPickColor] = useState("red");
    const [geojsonData, setGeojsonData] = useState(null);
    const [mapCenter, setMapCenter] = useState([39.9897471840457, -75.13893127441406]);
    const [choroStep, setChoroStep] = useState(5);
    const [panelOpen, setPanelOpen] = useState(false);
    const [drawPanelOpen, setDrawPanelOpen] = useState(false);
    const [mapName, setMapName] = useState("Map Title");
    const { id } = useParams();
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await mapApi.fetchMap(id);
                console.log("Map Fetched", data.mappage);
                setMapName(data.mappage.title);
                if (data.mappage.map.addedFeatures.length > 0) {
                    setPickColor(data.mappage.map.addedFeatures[0].color);
                    setChoroStep(data.mappage.map.addedFeatures[0].step);
                    setFeatureForChoropleth(data.mappage.map.addedFeatures[0].featureChoropleth);
                }

                // Modify the code to read the fetched GeoJSON string directly
                if (data.mappage.map.baseData) {
                    try {
                        const geojsonData = JSON.parse(data.mappage.map.baseData);
                        // console.log("geojsonData", geojsonData);
                        if (geojsonData.features && geojsonData.features.length > 0) {
                            const commonProperties = Object.keys(geojsonData.features[0].properties);
                            const addedFeatures = [];

                            for (const feature of geojsonData.features) {
                                const featureProperties = Object.keys(feature.properties);

                                const newCommonProperties = commonProperties.filter((property) =>
                                    featureProperties.includes(property)
                                );

                                commonProperties.length = 0;
                                commonProperties.push(...newCommonProperties);

                                for (const property of commonProperties) {
                                    const propertyType = typeof feature.properties[property];

                                    const existingFeature = addedFeatures.find((f) => f.name === property);
                                    if (!existingFeature) {
                                        addedFeatures.push({ type: propertyType, name: property });
                                    } else {
                                        if (existingFeature.type !== propertyType) {
                                            existingFeature.type = "Mixed";
                                        }
                                    }
                                }
                            }

                            setFeatures(addedFeatures);
                        }

                        setGeojsonData(geojsonData);
                        // Other operations with the GeoJSON data as needed
                        // mapRef.current.fitBounds(data.getBounds());
                    } catch (error) {
                        console.error("Error parsing GeoJSON:", error);
                        setError("Error parsing GeoJSON", error);
                    }
                } else {
                    setGeojsonData({ type: 'FeatureCollection', features: [] });
                }
            } catch (error) {
                console.error('Error fetching map:', error);
                setError("Error fetching map:", error);
            }
        };
        fetchData();
    }, [id]);
    let displayFeatures;
    if (features.length > 0) {
        displayFeatures = features.map((feature, index) => (
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
                    transition: 'background-color 0.3s',
                    ':hover': {
                        backgroundColor: '#0A5CE8',
                    },
                }}
            >
                {feature.name}
            </IconButton>
        ));
    } else {
        // Render nothing if features is empty
        displayFeatures = null;
    }
    const handlePanelOpen = () => {
        setPanelOpen(true);
    }
    const handleAddFeature = () => {
        if (drawPanelOpen) {
            setError("Please save the draw first");
            return;
        }
        if (geojsonData && selectedFeatureType && newFeature) {
            const isFeatureAlreadyExists = features.some(
                (feature) => feature.name === newFeature
            );
            if (isFeatureAlreadyExists) {
                console.log('Feature already exists!');
                return;
            }
            setFeatures([
                ...features,
                { type: selectedFeatureType, name: newFeature },
            ]);

            const updatedGeojsonData = {
                ...geojsonData,
                features: geojsonData.features.map((feature) => {
                    const newProperties = {
                        ...feature.properties,
                        [newFeature]: selectedFeatureType === 'string' ? '' : 0,
                    };

                    return {
                        ...feature,
                        properties: newProperties,
                    };
                }),
            };

            setGeojsonData(updatedGeojsonData);

            setSelectedFeatureType('string');
            setNewFeature('');
        }
    };
    const handleEditFeature = (index) => {
        const updatedFeatures = [...features];
        updatedFeatures.splice(index, 1);
        setFeatures(updatedFeatures);
    };

    const handleConfirm = async () => {
        if (drawPanelOpen) {
            setError("Please save the draw first");
            return;
        }
        console.log("Confirming...");
        try {
            const stringGeo = JSON.stringify(geojsonData);
            // console.log("stringGeo", stringGeo);
            const addedFeatures = {
                color: pickColor,
                step: choroStep,
                featureChoropleth: featureForChoropleth
            }
            const updatedMap = await mapApi.updateMap(id, stringGeo, addedFeatures);
            console.log("Map Updated:", updatedMap);
        } catch (error) {
            console.error('Error updating map:', error);
        }
    };

    const handleRankFeatures = () => {
        console.log("Ranking features...");
    };
    const handleUndo = () => {
    }
    const handleRedo = () => {
    }
    const handleChoroplethSelect = (value) => {
        setFeatureForChoropleth(value);
    }
    const handleFeatureTypeChange = (event) => {
        setSelectedFeatureType(event.target.value);
    };
    const updateGeojsonData = (newData) => {
        setGeojsonData(newData);
    };
    const handleSave = (editedData) => {
        // Implement your logic to save the edited data, e.g., updating state or sending it to a server
        // console.log('Saving edited data:', editedData);
        setGeojsonData(editedData);
        // setPanelOpen(false);
        // You can update your geojsonData state or perform other actions here
    };
    const panelClose = () => {
        setPanelOpen(false);
    }
    const handleDownload = () => {
        if (drawPanelOpen) {
            setError("Please save the draw first");
            return;
        }
        const geoJsonString = JSON.stringify(geojsonData, null, 2);
        const blob = new Blob([geoJsonString], { type: 'application/json' });
        const link = document.createElement('a');
        link.download = 'title.geojson';
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
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
                    {mapName}
                </Typography>
                <MapContainer ref={mapRef} center={mapCenter} zoom={11} scrollWheelZoom={true} style={{ height: '600px', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* <Marker position={[51.505, -0.09]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker> */}
                    {/* {geojsonData && <GeoJSON data={geojsonData} />} */}
                    {geojsonData && geojsonData.features.length > 0 && <Choropleth color={pickColor} geojsonData={geojsonData} featureForChoropleth={featureForChoropleth} step={choroStep} updateGeojsonData={updateGeojsonData} />}
                    {drawPanelOpen && <DrawLayer initialGeoJSON={geojsonData} onSave={handleSave} />}
                </MapContainer>
                {(drawPanelOpen === false) && <Button variant="contained"
                    onClick={() => {
                        setDrawPanelOpen(true);
                    }}
                    sx={{
                        borderRadius: '10px',
                        backgroundColor: '#0844A4', // Replace with your desired color
                        color: 'white', // Text color
                        marginTop: '10px',
                    }}>
                    Add a New Region
                </Button>}
                {drawPanelOpen && <Button variant="contained"
                    onClick={() => {
                        setDrawPanelOpen(false);
                        setError(null);
                    }}
                    sx={{
                        borderRadius: '10px',
                        backgroundColor: '#0844A4', // Replace with your desired color
                        color: 'white', // Text color
                        marginTop: '10px',
                    }}>
                    Save the draw
                </Button>}

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
                    {features && features.length > 0 && <Button onClick={handlePanelOpen}>Data Edit</Button>}
                </Box>

                <Box sx={{ paddingY: 2 }} />
                <Card>
                    <CardContent>
                        <FormControl fullWidth size="small">
                            <InputLabel id="feature-type-label">Feature Type</InputLabel>
                            <Select
                                labelId="feature-type-label"
                                id="feature-type"
                                value={selectedFeatureType}
                                onChange={handleFeatureTypeChange}
                                label="feature type"
                                inputProps={{
                                    style: { height: '36px' },
                                }}
                            >
                                <MenuItem value="string">String</MenuItem>
                                <MenuItem value="number">Number</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            type="text"
                            fullWidth
                            label="Feature name:"
                            variant="outlined"
                            placeholder="Add a feature..."
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            size="small"
                            sx={{ height: '40px', marginBottom: '10px', marginTop: '10px' }}
                        />
                    </CardContent>
                </Card>
                <Button variant="contained" sx={{
                    borderRadius: '10px',
                    backgroundColor: '#0844A4',
                    color: 'white', // Text color
                    marginTop: '10px',
                }} onClick={handleAddFeature}> Add More Features</Button>
                <Box sx={{ paddingY: 2 }} />

                <Autocomplete
                    value={featureForChoropleth}
                    onChange={(e, value) => handleChoroplethSelect(value)}
                    options={[
                        'None',
                        ...features
                            .filter((feature) => feature.type === 'number')
                            .map((feature) => feature.name)
                    ]}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Feature for Choropleth"
                            size="small"
                            fullWidth
                        />
                    )}
                    style={{ minWidth: '200px', flex: 1 }}
                />
                <FormControl fullWidth size="small" style={{ marginTop: '10px' }}>
                    <InputLabel id="step-type-label">Choropleth Step:</InputLabel>
                    <Select
                        labelId="step-type-label"
                        id="step-type"
                        value={choroStep}
                        onChange={(e) => setChoroStep(e.target.value)}
                        label="Choropleth Step:"
                        inputProps={{
                            style: { height: '36px' },
                        }}
                    >
                        <MenuItem value="1">1</MenuItem>
                        <MenuItem value="3">3</MenuItem>
                        <MenuItem value="5"> 5 </MenuItem>
                        <MenuItem value="10">10</MenuItem>
                        <MenuItem value="20">20</MenuItem>
                        {/* <MenuItem value="50">50</MenuItem>
                        <MenuItem value="100">100</MenuItem> */}
                    </Select>
                </FormControl>
                <Typography> Choose a Color: {pickColor}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SquareIcon
                        sx={{
                            color: 'red',
                            padding: 1,
                            border: pickColor === 'red' ? '2px solid #0844A4' : '2px solid transparent',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setPickColor('red')}
                    />
                    <SquareIcon
                        sx={{
                            color: 'blue',
                            padding: 1,
                            border: pickColor === 'blue' ? '2px solid #0844A4' : '2px solid transparent',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setPickColor('blue')}
                    />
                    <SquareIcon
                        sx={{
                            color: 'yellow',
                            padding: 1,
                            border: pickColor === 'yellow' ? '2px solid #0844A4' : '2px solid transparent',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setPickColor('yellow')}
                    />
                    <SquareIcon
                        sx={{
                            color: 'green',
                            padding: 1,
                            border: pickColor === 'green' ? '2px solid #0844A4' : '2px solid transparent',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setPickColor('green')}
                    />
                    <SquareIcon
                        sx={{
                            color: 'purple',
                            padding: 1,
                            border: pickColor === 'purple' ? '2px solid #0844A4' : '2px solid transparent',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setPickColor('purple')}
                    />
                </Box>

                <Box>
                    <Button variant="contained" sx={{
                        borderRadius: '10px',
                        backgroundColor: '#0844A4', // Replace with your desired color
                        color: 'white', // Text color
                        marginTop: '10px',
                    }}> Rank It</Button>
                    <Button variant="contained" sx={{
                        borderRadius: '10px',
                        backgroundColor: '#0844A4', // Replace with your desired color
                        color: 'white', // Text color
                        marginTop: '10px',
                        marginLeft: '10px'
                    }} onClick={handleConfirm}>
                        Save
                    </Button>
                    <Button variant="contained" sx={{
                        borderRadius: '10px',
                        backgroundColor: '#0844A4', // Replace with your desired color
                        color: 'white', // Text color
                        marginTop: '10px',
                        marginLeft: '10px'
                    }} onClick={handleDownload}>
                        download
                    </Button></Box>
                {error && <Typography style={{ color: 'red' }}>{error}</Typography>}
            </Grid>
            <Grid item xs={12} sm={.5}></Grid>
            {panelOpen && (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper elevation={3} style={{ padding: '10px', border: '1px solid #ccc', marginTop: '20px', marginInline: '20px', marginBottom: '20px' }}>
                            <Typography variant="h5" style={{ marginBottom: '20px' }}>Data Edit Panel</Typography>
                            <DataEditPanel geojsonData={geojsonData} onSave={handleSave} features={features} panelClose={panelClose} />
                        </Paper>
                    </Grid>
                </Grid>
            )}</Grid>
    );
};

export default MapEdit;
