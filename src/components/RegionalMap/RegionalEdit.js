import React, { useState, useEffect, Component, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GlobalStoreContext } from '../../store/index';
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import DataEditPanel from '../DataEditPanel';
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
import tempMap from '../../assets/tempMap.png'
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import Redo from "@mui/icons-material/Redo";
import SquareIcon from '@mui/icons-material/Square';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import omnivore from 'leaflet-omnivore';
import * as turf from '@turf/turf';
import Choropleth from "../Choropleth"
import ColorLayer from "../ColorLayer";
import DrawLayer from "../DrawLayer";
import mapApi from '../../api/mapApi';
import { geojson } from "leaflet-omnivore";
import cloneDeep from 'lodash/cloneDeep';

const RegionalEdit = () => {
    const { globalStore } = useContext(GlobalStoreContext);
    const [file_created, setFile_created] = useState(null);
    // const tempMapData = {
    //     addedFeatures: [
    //         { type: "String", name: "Name" },
    //         { type: "Number", name: "Population" },
    //         { type: "Number", name: "Area" },
    //         { type: "Number", name: "GDP" },
    //         { type: "Number", name: "HDI" },],
    //     baseData: [],
    //     mapType: "Choropleth"
    // }
    // console.log(globalStore.currentMap)
    const [features, setFeatures] = useState([]);
    const [newFeature, setNewFeature] = useState("");
    const [selectedFeatureType, setSelectedFeatureType] = useState("string");
    const [featureForChoropleth, setFeatureForChoropleth] = useState("");
    const [pickColor, setPickColor] = useState("red");
    const [geojsonData, setGeojsonData] = useState(null);
    const [mapCenter, setMapCenter] = useState([39.9897471840457, -75.13893127441406]);
    const [mapName, setMapName] = useState("Map Title");
    const [choroStep, setChoroStep] = useState(5);
    const [panelOpen, setPanelOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);
    const [drawPanelOpen, setDrawPanelOpen] = useState(false);
    const { id } = useParams();
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
                        console.log("geojsonData", geojsonData);
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
                        console.log("geojson:",geojsonData);
                        setGeojsonData(geojsonData);
                        if(!features.find((f) => f.name === 'color')){
                            setFeatures([
                                ...features,
                                { type: 'String', name: 'color' },
                            ]);
                
                            const updatedGeojsonData = {
                                ...geojsonData,
                                features: geojsonData.features.map((feature) => {
                                    const newProperties = {
                                        ...feature.properties,
                                        color: selectedFeatureType === 'red',
                                    };
                
                                    return {
                                        ...feature,
                                        properties: newProperties,
                                    };
                                }),
                            };
                
                            setGeojsonData(updatedGeojsonData);
                        }
                        // Other operations with the GeoJSON data as needed
                        // mapRef.current.fitBounds(data.getBounds());
                    } catch (error) {
                        console.error("Error parsing GeoJSON:", error);
                        setError("Error parsing GeoJSON", error);
                        setGeojsonData({ type: 'FeatureCollection', features: [{ type: "String", name: "color" }]});
                    }
                } else {
                    console.log("default")
                    setGeojsonData({ type: 'FeatureCollection', features: [{ type: "String", name: "color" }] });
                }
            } catch (error) {
                console.error('Error fetching map:', error);
                setError("Error fetching map: " + error.response.data.errorMessage);
            }
        };
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, successMessage]);
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
        const updatedGeojsonData = editedData.features.map((feature) => {
            const updatedProperties = { ...feature.properties };

            features.forEach(({ name, type }) => {
                if (!(name in updatedProperties)) {
                    // Property is missing, initialize based on type
                    updatedProperties[name] = type === 'string' ? 'New Created' : 0;
                }
            });

            return { ...feature, properties: updatedProperties };
        });

        // Avoid triggering re-render if the state doesn't change
        if (
            JSON.stringify(updatedGeojsonData) !== JSON.stringify(geojsonData)
        ) {
            const editedGeo = cloneDeep({ ...editedData, features: updatedGeojsonData });
            setGeojsonData(editedGeo);
            setFeatures(features);
            console.log("setGeojsonData", editedGeo);
        }
        // setPanelOpen(false);
        // You can update your geojsonData state or perform other actions here
    };
    const panelClose = () => {
        setPanelOpen(false);
    }
    const handleDownload = () => {
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
                    {geojsonData && geojsonData.features.length > 0 && <ColorLayer geojsonData={geojsonData} colorProperty="color" />}
                    {drawPanelOpen&&<DrawLayer initialGeoJSON={geojsonData} onSave={handleSave}/>}
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
                    }}
                    sx={{
                        borderRadius: '10px',
                        backgroundColor: '#0844A4', // Replace with your desired color
                        color: 'white', // Text color
                        marginTop: '10px',
                    }}>
                    Close the drawn panel
                </Button>}
                {/* {inputButton} */}
                {/* <input type="file" accept=".geojson" onChange={handleFileUpload} /> */}

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
                                Category: Simple Regional Map
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
                {error && <Typography style={{ color: 'red' }}>{error}</Typography>}
                {/* <Autocomplete
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
                /> */}
            
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

export default RegionalEdit;
