import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import DataEditPanel from '../DataEditPanel';
import {
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    CardContent,
    Autocomplete,
    Card,
    Paper,
    Alert,
    ButtonGroup,
} from "@mui/material";
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import html2canvas from 'html2canvas';
import SquareIcon from '@mui/icons-material/Square';
import DrawLayer from '../DrawLayer';
import cloneDeep from 'lodash/cloneDeep';
import leafletImage from 'leaflet-image'; // Make sure to import leaflet-image
import 'leaflet-easyprint';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import omnivore from 'leaflet-omnivore';
import * as turf from '@turf/turf';
import Choropleth from "./Choropleth"
import mapApi from '../../api/mapApi';
import DeleteIcon from '@mui/icons-material/Delete';
import useUndoRedoState from "../useUndoRedoState";
import "leaflet-choropleth";
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
const MapEdit = () => {
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
    const [choroStep, setChoroStep] = useState(5);
    const [panelOpen, setPanelOpen] = useState(false);
    const [drawPanelOpen, setDrawPanelOpen] = useState(false);
    const [mapName, setMapName] = useState("Map Title");
    const [successMessage, setSuccessMessage] = useState(null);
    const { id } = useParams();
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [deleteModel, setDeleteModel] = useState(false);
    const [savedImage, setSavedImage] = useState(null);
    const canUndo = geojsonStateIndex > 1 || featuresStateIndex > 1;
    const canRedo = geojsonStateIndex < geojsonStateLastIndex || featuresStateIndex < featuresStateLastIndex;
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
                setError("Error fetching map: " + error.response.data.errorMessage);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, successMessage]);
    // useEffect(() => {
    //     if (savedImage !== null) {
    //         // Call handleConfirm or any other action here after savedImage state is updated
    //         handleConfirm();
    //     }
    // }, [savedImage]);
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
                step: choroStep,
                featureChoropleth: featureForChoropleth
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
    //this handleSave is for Data editor, not the whole map
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
            const style = {
                fillColor: "#F28F3B",
                weight: 2,
                opacity: 1,
                color: "white",
                dashArray: "3",
                fillOpacity: 0.5
            };
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

            const choroplethLayer = L.choropleth(geojsonData, {
                valueProperty: featureForChoropleth,
                scale: ["white", pickColor],
                steps: choroStep,
                mode: "q",
                style,
                onEachFeature: function (feature, layer) {
                    // Convert feature.properties to a custom formatted string
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
            }
            ).addTo(map);
            const legend = L.control({ position: 'bottomright' });
            legend.onAdd = function () {
                var div = L.DomUtil.create('div', 'info legend')
                var limits = choroplethLayer.options.limits
                var colors = choroplethLayer.options.colors
                var labels = []

                // Add min & max
                div.innerHTML = '<div>' + featureForChoropleth + '</div><div class="labels"><div class="min">' + limits[0] + '</div><div class="max">' + limits[limits.length - 1] + '</div></div>'

                limits.forEach(function (limit, index) {
                    labels.push('<li style="background-color: ' + colors[index] + '"></li>')
                })

                div.innerHTML += '<ul>' + labels.join('') + '</ul>'
                return div
            };
            if (featureForChoropleth !== "" && featureForChoropleth !== null && featureForChoropleth !== undefined && featureForChoropleth !== "None") {
                // console.log("feature for choropleth", featureForChoropleth);
                legend.addTo(map);
                console.log("legend added");
            }

            const bounds = choroplethLayer.getBounds();
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
                        // console.log("to uRL")
                        downloadImage(imageUrl, 'png');
                    } else if (format === 'jpeg') {
                        canvas.toBlob(blob => {
                            const imageUrl = URL.createObjectURL(blob);
                            // console.log("to uRL")
                            downloadImage(imageUrl, 'jpeg');
                        }, 'image/jpeg', 1);
                    } else if (format === "save") {
                        setSuccessMessage("Saving...");
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
                    {geojsonData && geojsonData.features.length > 0 && <Choropleth color={pickColor} geojsonData={geojsonData} featureForChoropleth={featureForChoropleth} step={choroStep} updateGeojsonData={updateGeojsonData} />}
                    {drawPanelOpen && <DrawLayer initialGeoJSON={geojsonData} onSave={handleSave} disable={["line"]} />}

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
                                Category: Choropleth Map
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
                            />
                        </Box>
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

export default MapEdit;
