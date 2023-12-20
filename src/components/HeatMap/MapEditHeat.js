import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import {
    Box,
    Typography,
    TextField,
    Button,
} from "@mui/material";
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';

import HeatMap from "./HeatMap";
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from "@mui/icons-material/Redo";
import SquareIcon from '@mui/icons-material/Square';
import {useMap, MapContainer, TileLayer, useMapEvents,Marker, Popup} from 'react-leaflet';
import { Link, useNavigate, useParams } from "react-router-dom";
import L, { point } from 'leaflet'
import mapApi from '../../api/mapApi';
import useUndoRedoState from "../useUndoRedoState";

const MapEditHeat = () => {
    // const [points, setPoints] = useState([]);
    const [render, setRender] = useState(false);
    const [mapName, setMapName] =useState("");
    const [mapCenter, setMapCenter] = useState([39.9897471840457, -75.13893127441406]);
    const [intensity, setIntensity] = useState(0);
    const [pointLocation, setPointLocation] = useState([0,0]);
    // const [geojsonData, setGeojsonData] = useState(null);
    const [features, setFeatures] = useState([])
    const mapRef = React.useRef();
    const { id } = useParams();

    const {
        state: points,
        setState: setPoints,
        index: pointsStateIndex,
        lastIndex: pointsStateLastIndex,
        goBack: undoPoints,
        goForward: redoPoints,
    } = useUndoRedoState([]);
    const {
        state: geojsonData,
        setState: setGeojsonData,
        index: geojsonStateIndex,
        lastIndex: geojsonStateLastIndex,
        goBack: undoGeo,
        goForward: redoGeo,
    } = useUndoRedoState(null);
    const canUndo = geojsonStateIndex > 1 || pointsStateIndex > 1;
    const canRedo = geojsonStateIndex < geojsonStateLastIndex || pointsStateIndex < pointsStateLastIndex;


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await mapApi.fetchMap(id);
                console.log("map edit content", data.mappage);
                setMapName(data.mappage.title);

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
                        loadFeatures(geojsonData)
                        
                        // Other operations with the GeoJSON data as needed
                        // mapRef.current.fitBounds(data.getBounds());
                    } catch (error) {
                        console.error("Error parsing GeoJSON:", error);
                    }
                } else {
                    setGeojsonData({ type: 'FeatureCollection', features: [] });
                }
            } catch (error) {
                console.error('Error fetching map:', error);
            }
        };

        fetchData();
    }, [id]);
    let displayFeatures;
    if (features.length > 0) {
        // displayFeatures = features.map((feature, index) => (
        //     <IconButton
        //         key={index}
        //         sx={{
        //             fontSize: '10px',
        //             backgroundColor: '#0844A4',
        //             color: 'white',
        //             padding: '5px',
        //             borderRadius: '10px',
        //             margin: '0 4px',
        //             boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        //             transition: 'background-color 0.3s',
        //             ':hover': {
        //                 backgroundColor: '#0A5CE8',
        //             },
        //         }}
        //     >
        //         {feature.name}
        //     </IconButton>
        // ));
    } else {
        // Render nothing if features is empty
        displayFeatures = null;
    }

    const handleAddPoint = () => {
        if (intensity && pointLocation) {
            const temp = [
                ...points,
                [...pointLocation, intensity],
            ]
            setPoints(temp);
            setRender(!render)
        }else{
            alert("Pick a Point and Intensity!")
        }
    };

    const LocationFinder = () => {
        const map = useMapEvents({
            click(e) {
                setPointLocation(Object.values(e.latlng));
            },
        });
        return null;
    };

    const loadFeatures = (data=null) => {
        if(!data){
            data = geojsonData
        }
        var points = []
        data["features"].forEach(function(feature){
            var point = feature["geometry"]["coordinates"]
            var temp = point[1]
            point[1] = point[0]
            point[0] = temp

            if(point.length < 3){
                point[2] = 0
            }
            points.push(point)
        })
        console.log(points)
        setPoints(points)
        setRender(!render)
    };

    const handleDeletePoint = (i) =>{
        const temp = points
        temp.splice(i,1)
        setPoints(temp)
        setRender(!render)
    }

    const handleEditPoint = (e,i) =>{
        const temp = points
        temp[i][2] = e.target.value
        setPoints(temp)
        setRender(!render)
    }

    const handleDownload = () =>{
        const geoJsonString = JSON.stringify(geojsonData, null, 2);
        const blob = new Blob([geoJsonString], { type: 'application/json' });
        const link = document.createElement('a');
        link.download = mapName + '.geojson';
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleUndo =() =>{
        undoGeo();
        undoPoints();
    }

    const handleRedo =() =>{
        redoGeo();
        redoPoints();
    }

    const handleRender = () =>{
        setRender(!render)
    }

    const handleUpdateGeo = (newGeo) =>{
        setGeojsonData(newGeo)
    }

    const HandleSaveMap = async() =>{
        setRender(!render)
        console.log("features:",features)
        try {
            const stringGeo = JSON.stringify(geojsonData);
            console.log("stringGeo", stringGeo);
            const updatedMap = await mapApi.updateMap(id, stringGeo,[]);
            console.log('Map updated successfully:', updatedMap);
        } catch (error) {
            console.error('Error updating map:', error);
        }
    }
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
                        paddingY:2
                    }}
                >
                {mapName}
                </Typography>
                <MapContainer ref={mapRef} center={mapCenter} zoom={11} scrollWheelZoom={true} style={{ height: '600px', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* {geojsonData && <GeoJSON data={geojsonData} />} */}
                    <HeatMap addressPoints={points} render={render} setFeatures={setFeatures} setGeo={setGeojsonData}/>
                    <LocationFinder/>
                    {points.map((position, idx) => 
                    <Marker key={`marker-${idx}`} position={position}>

                    <Popup>
                        <Typography>Intensity: </Typography>
                        <TextField placeholder={points[idx][2]} inputProps={{ type: 'number'}} onChange={(e)=> handleEditPoint(e,idx)}/>
                        <Button onClick={()=> handleDeletePoint(idx)}> delete point </Button>
                    </Popup>
                    </Marker>)}
                </MapContainer>
                <Box display='flex' sx={{paddingY:2}}>
                <Typography sx={{paddingX:2, fontSize:'24px'}}> Lat: {pointLocation[0]} </Typography>
                <Typography sx={{paddingX:2, fontSize:'24px'}}> Long: {pointLocation[1]} </Typography>
                    <Button variant="contained" onClick={handleAddPoint}>
                        Add a point
                    </Button>
                </Box>
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
                                Category: Heat Map
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
                <Typography> Intensity:</Typography>
                <TextField
                    placeholder="Type a number…"
                    inputProps={{ type: 'number'}}
                    onChange={(e) => setIntensity(e.target.value)}
                    />
                {/* <Typography> Choose a Color</Typography>
                <Box sx={{ paddingY: 1 }}>
                    <SquareIcon sx={{ color: "red", paddingX: 1 }} />
                    <SquareIcon sx={{ color: "blue", paddingX: 1 }} />
                    <SquareIcon sx={{ color: "yellow", paddingX: 1 }} />
                    <SquareIcon sx={{ color: "green", paddingX: 1 }} />
                    <SquareIcon sx={{ color: "purple", paddingX: 1 }} />
                </Box> */}
                <Box sx={{ paddingY: 1 }} onClick={handleDownload} >

                    <Button variant="contained" >
                        Download
                    </Button>
                </Box>

                <Box sx={{ paddingY: 1 }} onClick={HandleSaveMap} >

                    <Button variant="contained">
                        Save
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={12} sm={.5}></Grid>
        </Grid>
    );
};

export default MapEditHeat;
