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
    Alert,
    ButtonGroup,
    Slider
} from "@mui/material";
// import { ColorPicker, ColorBox } from "material-ui-color";
import tempMap from '../../assets/tempMap.png'
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import Redo from "@mui/icons-material/Redo";
import SquareIcon from '@mui/icons-material/Square';
import html2canvas from 'html2canvas';
import cloneDeep from 'lodash/cloneDeep';
import leafletImage from 'leaflet-image';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import omnivore from 'leaflet-omnivore';
import * as turf from '@turf/turf';
import Choropleth from "../ChoroplethMap/Choropleth"
import PathLayer from "./PathLayer";
import DrawLayer from "../DrawLayer";
import mapApi from '../../api/mapApi';
import { geojson } from "leaflet-omnivore";
import useUndoRedoState from "../useUndoRedoState";
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
const SmallButton = ({ tag, color, onClick }) => {
    return (
        <IconButton
            onClick={onClick}
            sx={{
                fontSize: '10px',
                backgroundColor: color,
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
            {tag}
        </IconButton>
    );
};

const PathEdit = () => {
    const {
        state: features,
        setState: setFeatures,
        index: featuresStateIndex,
        lastIndex: featuresStateLastIndex,
        goBack: undoFeatures,
        goForward: redoFeatures,
    } = useUndoRedoState([]);

    const [newFeature, setNewFeature] = useState("");
    const [selectedFeatureType, setSelectedFeatureType] = useState("string");
    const [featureForChoropleth, setFeatureForChoropleth] = useState("None");
    const [pickColor, setPickColor] = useState("red");
    const {
        state: geojsonData,
        setState: setGeojsonData,
        index: geojsonStateIndex,
        lastIndex: geojsonStateLastIndex,
        goBack: undoGeo,
        goForward: redoGeo,
    } = useUndoRedoState(null);
    const [mapCenter, setMapCenter] = useState([39.9897471840457, -75.13893127441406]);
    const [choroStep, setChoroStep] = useState(5);
    const [panelOpen, setPanelOpen] = useState(false);
    const [drawPanelOpen, setDrawPanelOpen] = useState(false);
    const [mapName, setMapName] = useState("Map Title");
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [deleteModel, setDeleteModel] = useState(false);
    const [savedImage, setSavedImage] = useState(null);
    const [selectedLabel, setSelectedLabel] = useState("None");
    const canUndo = geojsonStateIndex > 1 || featuresStateIndex > 1;
    const [query, setQuery] = useState("");
    const canRedo = geojsonStateIndex < geojsonStateLastIndex || featuresStateIndex < featuresStateLastIndex;
    const [weight, setWeight] = useState(3);
    const [opacity, setOpacity] = useState(1);
    const [dashArray, setDash] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await mapApi.fetchMap(id);
                console.log("Map Fetched", data.mappage);
                setMapName(data.mappage.title);
                if (data.mappage.map.addedFeatures.length > 0) {
                    setPickColor(data.mappage.map.addedFeatures[0].color);
                    setWeight(data.mappage.map.addedFeatures[0].weight);
                    setOpacity(data.mappage.map.addedFeatures[0].opacity);
                    setDash(data.mappage.map.addedFeatures[0].dashArray);
                }

                // Modify the code to read the fetched GeoJSON string directly
                if (data.mappage.map.baseData) {
                    try {
                        const geojsonData = JSON.parse(data.mappage.map.baseData);
                        const addedFeatures = [];
                        // console.log("geojsonData", geojsonData);
                        if (geojsonData.features && geojsonData.features.length > 0) {
                            const commonProperties = Object.keys(geojsonData.features[0].properties);

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
                        console.log("geojsonData", geojsonData);
                        setGeojsonData(geojsonData);
                        if (!addedFeatures.find((f) => f.name === 'color')) {
                            setFeatures([
                                ...addedFeatures,
                                { type: 'String', name: 'color' },
                            ]);

                            const updatedGeojsonData = {
                                ...geojsonData,
                                features: geojsonData.features.map((feature) => {
                                    const newProperties = {
                                        ...feature.properties,
                                        color: 'gray',
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
                        setGeojsonData({ type: 'FeatureCollection', features: [{ type: "String", name: "color" }] });
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
                onClick={() => (deleteProperties(feature.name))}
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
                style={{ marginBottom: '4px' }}
            >
                {feature.name}
                {deleteModel && <DeleteIcon fontSize="small" style={{ marginLeft: '4px', fontSize: '16px' }} />}
            </IconButton>

        ));
    } else {
        // Render nothing if features is empty
        displayFeatures = null;
    }
    const deleteProperties = (propertyName) => {
        if (deleteModel) {
            if (geojsonData && geojsonData.features.length > 0) {
                const updatedGeojsonData = {
                    ...geojsonData,
                    features: geojsonData.features.map((feature) => {
                        // Create a copy of the feature to avoid mutating it directly
                        const updatedProperties = { ...feature.properties };

                        // Check if the property exists and delete it
                        if (updatedProperties.hasOwnProperty(propertyName)) {
                            delete updatedProperties[propertyName];
                        }

                        // Update the feature with the modified properties
                        return { ...feature, properties: updatedProperties };
                    }),
                };
                setGeojsonData(updatedGeojsonData);
                const updatedProperties = features.filter((prop) => prop.name !== propertyName);
                console.log("updatedProperties", updatedProperties);
                setFeatures(updatedProperties);
            }
        }
    }
    const handlePanelOpen = () => {
        setPanelOpen(true);
    }
    const handleInput = (e) => {
        setQuery(e.target.value);
    }
    const handleAddFeature = () => {
        if (drawPanelOpen) {
            setError("Please save the draw first");
            setSuccessMessage(null);
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
    // const handleEditFeature = (index) => {
    //     const updatedFeatures = [...features];
    //     updatedFeatures.splice(index, 1);
    //     setFeatures(updatedFeatures);
    // };

    const handleConfirm = async (imageToSave) => {
        if (drawPanelOpen) {
            setError("Please save the draw first");
            setSuccessMessage(null);
            return;
        }
        console.log("Confirming...");
        try {
            const stringGeo = JSON.stringify(geojsonData);
            // console.log("stringGeo", stringGeo);
            const addedFeatures = {
                color: pickColor,
                weight: weight,
                opacity: opacity,
                dashArray: dashArray,
            }
            console.log(savedImage)
            const updatedMap = await mapApi.updateMap(id, stringGeo, addedFeatures, imageToSave);
            console.log("Map Updated:", updatedMap);
            setSuccessMessage("Map updated successfully!");

            // Optionally, clear any previous error message
            setError(null);
            console.log("/detail/" + id)
            setTimeout(() => {
                navigate("/detail/" + id);
            }, 2000);
        } catch (error) {
            console.error('Error updating map:', error);
            // console.log(error.response.data.errorMessage);
            setError("Error updating map: " + error.response.data.errorMessage);
        }
    };
    // const handleRankFeatures = () => {
    //     console.log("Ranking features...");
    // };
    const handleUndo = () => {
        if (drawPanelOpen) {
            setError("Please save the draw first");
            setSuccessMessage(null);
            return;
        }
        if (panelOpen) {
            setError("Please close the data edit panel first");
            return;
        }
        undoGeo();
        undoFeatures();
    }
    const handleRedo = () => {
        if (drawPanelOpen) {
            setError("Please save the draw first");
            setSuccessMessage(null);
            return;
        }
        if (panelOpen) {
            setError("Please close the data edit panel first");
            setSuccessMessage(null);
            return;
        }
        redoGeo();
        redoFeatures();
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
        // Assuming properties is an array of property names along with their types
        // console.log("Common properties:", features);

        // Update the GeoJSON data to ensure each feature has the required properties
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
    };
    const panelClose = () => {
        setPanelOpen(false);
        setError(null);
    }
    const handleDownload = () => {
        if (drawPanelOpen) {
            setError("Please save the draw first");
            setSuccessMessage(null);
            return;
        }
        if (panelOpen) {
            setError("Please close the data edit panel first");
            setSuccessMessage(null);
            return;
        }

        const geoJsonString = JSON.stringify(geojsonData, null, 2);
        const blob = new Blob([geoJsonString], { type: 'application/json' });
        const link = document.createElement('a');
        link.download = `${mapName}.geojson`;
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleDownloadGeoJSONAsImage = async (format) => {
        try {
            setSuccessMessage("Converting...It may take up to 30s");
            const mapWidth = 600; // Replace with your map width
            const mapHeight = 400; // Replace with your map height

            // Creating map container and setting styles
            let mapContainer = document.createElement('div');
            mapContainer.id = 'mapContainer';
            mapContainer.style.width = '600px';
            mapContainer.style.height = '400px';
            mapContainer.style.position = 'absolute';
            mapContainer.style.left = '-9999px';
            document.body.appendChild(mapContainer);

            // Create a map instance
            const map = L.map(mapContainer, { preferCanvas: true });

            // Add TileLayer to the map
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(map);
            const defaultStyle = {
                fillColor: "green",
                weight: 2,
                opacity: 1,
                color: "white",
                dashArray: "3",
                fillOpacity: 0.5
            };
            const getColor = (value) => {
                switch (value) {
                    case 'green':
                        return 'green';
                    case 'blue':
                        return 'blue';
                    default:
                        return value;
                }
            };
            const colorLayer = L.geoJson(geojsonData, {
                style: (feature) => {
                    const colorValue = feature.properties["color"];
                    return {
                        ...defaultStyle,
                        fillColor: getColor(colorValue),
                    };
                },
                onEachFeature: function (feature, layer) {

                    const formattedProperties = Object.entries(feature.properties)
                        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
                        .join('<br>');

                    // Display the formatted string in the popup
                    layer.bindPopup(`
                      <div>
                        ${formattedProperties}
                        <br>        
                      </div>
                    `);
                }
            });

            colorLayer.addTo(map);
            map.fitBounds(colorLayer.getBounds());

            const bounds = colorLayer.getBounds();
            map.fitBounds(bounds);

            setTimeout(() => {
                leafletImage(map, async function (err, canvas) {
                    if (err) {
                        console.error('Error converting JSON to image:', err);
                        return;
                    }

                    // Convert canvas to the specified format (PNG or JPEG)
                    if (format === 'png') {
                        const imageUrl = canvas.toDataURL('image/png');
                        downloadImage(imageUrl, 'png');
                    } else if (format === 'jpeg') {
                        canvas.toBlob(blob => {
                            const imageUrl = URL.createObjectURL(blob);
                            downloadImage(imageUrl, 'jpeg');
                        }, 'image/jpeg', 1);
                    } else if (format === "save") {
                        const imageUrl = canvas.toDataURL('image/png');
                        handleConfirm(imageUrl);
                    }

                    // Remove the mapContainer from the body
                    if (mapContainer && mapContainer.parentNode) {
                        mapContainer.parentNode.removeChild(mapContainer);
                    }
                });
            }, 1000);
        } catch (error) {
            console.error('Error converting JSON to image:', error);
            setError("Please add a region first before downloading as image")

        }
    };


    const downloadImage = (imageUrl, format) => {
        const link = document.createElement('a');
        link.download = `${mapName}.${format}`;
        link.href = imageUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setSuccessMessage(null);
    };



    const handleDeleteModel = () => {
        if (drawPanelOpen) {
            setError("Please save the draw first");
            setSuccessMessage(null);
            return;
        }
        if (panelOpen) {
            setError("Please close the data edit panel first");
            setSuccessMessage(null);
            return;
        }

        console.log("Delete Model");
        setDeleteModel((prevDeleteModel) => !prevDeleteModel);
    };

    const handleDashChange = (event, newValue) => {
        setDash(newValue);
    }

    const handleWeightChange = (event, newValue) => {
        setWeight(newValue);
      };
    const handleOpacityChange = (event, newValue) => {
        setOpacity(newValue);
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
                    {mapName}
                </Typography>
                <MapContainer id="mapContainer" ref={mapRef} center={[39.9897471840457, -75.13893127441406]} zoom={11} scrollWheelZoom={true} style={{ height: '600px', width: '100%' }}>

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
                    {geojsonData && geojsonData.features.length > 0 && <PathLayer weight={weight} opacity={opacity} color={pickColor} dashArray={dashArray}geojsonData={geojsonData} />}
                    {drawPanelOpen && <DrawLayer initialGeoJSON={geojsonData} onSave={handleSave} disable={["polygon","rectangle"]}/>}
                </MapContainer>
                {(drawPanelOpen === false) && <Button variant="contained"
                    onClick={() => {
                        if (panelOpen) {
                            setError("Please close the data edit panel first");
                            return;
                        }
                        setDrawPanelOpen(true);
                    }}
                    sx={{
                        borderRadius: '10px',
                        backgroundColor: '#0844A4', // Replace with your desired color
                        color: 'white', // Text color
                        marginTop: '10px',
                    }}>
                    Add a New Path
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
                {/* {inputButton} */}
                {/* <input type="file" accept=".geojson" onChange={handleFileUpload} /> */}

            </Grid>
            <Grid item xs={12} sm={.5}></Grid>

            {/* Right Side */}
            <Grid item xs={12} sm={4}>
                <Box sx={{ height: "40px" }}></Box>
                {/* Title */}
                <Grid container >
                    <Grid item xs={12} sm={9}>
                        <Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: "#0844A4",
                                    display: "flex",
                                    justifyContent: "left",
                                    alignItems: "center",
                                }}
                            >
                                Category: Path Map
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box>
                            <UndoIcon
                                sx={{
                                    mr: 1,
                                    cursor: canUndo ? 'pointer' : 'not-allowed',
                                    color: canUndo ? '#0844A' : 'gray',
                                    '&:hover': {
                                        color: canUndo ? 'primary.dark' : 'gray',
                                    },
                                }}
                                onClick={canUndo ? handleUndo : undefined}
                            />
                            <RedoIcon
                                sx={{
                                    cursor: canRedo ? 'pointer' : 'not-allowed',
                                    color: canRedo ? '#0844A' : 'gray',
                                    '&:hover': {
                                        color: canRedo ? 'primary.dark' : 'gray',
                                    },
                                }}
                                onClick={canRedo ? handleRedo : undefined}
                            />                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ paddingY: 2 }} />
                <Box>
                    <Typography>
                        Features: {displayFeatures}
                    </Typography>
                    {features && features.length > 0 && <Box><SmallButton tag="Data Edit" color="green" onClick={handlePanelOpen}></SmallButton>
                        {!deleteModel && <SmallButton tag="Delete" color="red" onClick={handleDeleteModel}></SmallButton>}{deleteModel && <SmallButton tag="Save" color="green" onClick={handleDeleteModel}></SmallButton>}</Box>}
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
                        <Button variant="contained" sx={{
                            borderRadius: '10px',
                            backgroundColor: '#0844A4',
                            color: 'white', // Text color
                            marginTop: '10px',
                        }} onClick={handleAddFeature}> Add More Features</Button>
                    </CardContent>
                </Card>
                <Box sx={{ paddingY: 2 }} />
                {/* {error && <Typography style={{ color: 'red' }}>{error}</Typography>} */}
                {/* <Autocomplete
                    value={featureForChoropleth}
                    onChange={(e, value) => handleChoroplethSelect(value)}
                    options={[
                        'None',
                        ...features
                            .filter((feature) => feature.type === 'string')
                            .map((feature) => feature.name)
                    ]}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Color Reference Label"
                            size="small"
                            fullWidth
                        />
                    )}
                    style={{ minWidth: '200px', flex: 1 }}
                /> */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" style={{ marginTop: '8px', marginBottom: '8px' }}>
                            Path Style Editing
                        </Typography>
                        <Typography> Path Weight: </Typography>
                        <Slider
                            aria-label="Weight"
                            defaultValue={3}
                            onChange={handleWeightChange}
                            // getAriaValueText={valuetext}
                            valueLabelDisplay="auto"
                            // step={3}
                            // marks
                            min={1}
                            max={31}
                        />
                        <Typography> Opacity: </Typography>
                        <Slider
                            aria-label="Opacity"
                            defaultValue={3}
                            onChange={handleOpacityChange}
                            // getAriaValueText={valuetext}
                            valueLabelDisplay="auto"
                            step={0.1}
                            marks
                            min={0}
                            max={1}
                        />
                        <Typography> Dash Array: </Typography>
                                                <Slider
                            aria-label="Dash Array"
                            defaultValue={3}
                            onChange={handleDashChange}
                            // getAriaValueText={valuetext}
                            valueLabelDisplay="auto"
                            // step={0.1}
                            // marks
                            min={0}
                            max={20}
                        />
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

                    </CardContent>
                </Card>

                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Button variant="contained" sx={{
                        borderRadius: '10px',
                        backgroundColor: '#0844A4',
                        color: 'white',
                        marginTop: '10px',
                    }} onClick={() => handleDownloadGeoJSONAsImage('save')}>
                        Save
                    </Button>
                    <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{ borderRadius: '10px', marginTop: '10px', marginLeft: '10px' }}>
                        <Button
                            variant="contained"
                            endIcon={<DownloadIcon />}
                            sx={{
                                borderRadius: '10px',
                                backgroundColor: '#0844A4',
                                color: 'white',
                            }}
                            onClick={() => handleDownloadGeoJSONAsImage('png')}
                        >
                            PNG
                        </Button>
                        <Button
                            variant="contained"
                            endIcon={<DownloadIcon />}
                            sx={{
                                borderRadius: '10px',
                                backgroundColor: '#0844A4',
                                color: 'white',
                            }}
                            onClick={() => handleDownloadGeoJSONAsImage('jpeg')}
                        >
                            Jpeg
                        </Button>
                        <Button variant="contained" endIcon={<DownloadIcon />}
                            sx={{
                                borderRadius: '10px',
                                backgroundColor: '#0844A4',
                                color: 'white',
                            }} onClick={handleDownload}>
                            geojson
                        </Button>
                    </ButtonGroup>
                </Box>

                {successMessage && (
                    <Alert severity="success" style={{ marginTop: '5px' }}>
                        {successMessage}
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" style={{ marginTop: '5px' }}>
                        {error}
                    </Alert>
                )}
                <Box sx={{ paddingY: 2 }} />
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

export default PathEdit;
