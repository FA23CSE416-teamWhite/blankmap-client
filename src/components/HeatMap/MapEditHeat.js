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
import Redo from "@mui/icons-material/Redo";
import SquareIcon from '@mui/icons-material/Square';
import {useMap, MapContainer, TileLayer, useMapEvents,Marker, Popup} from 'react-leaflet';

const MapEditHeat = () => {
    const [points, setPoints] = useState([]);
    const [render, setRender] = useState(false);
    const [undoPoints, setUndoPoints] = useState([]);
    const [mapCenter, setMapCenter] = useState([39.9897471840457, -75.13893127441406]);
    const [intensity, setIntensity] = useState(0);
    const [pointLocation, setPointLocation] = useState([0,0]);
    const [geojsonData, setGeojsonData] = useState(null);
    const mapRef = React.useRef();
    useEffect(() => {
        setPoints([
        ]);
    }, []);

    const handleAddPoint = () => {
        if (intensity && pointLocation) {
            setPoints([
                ...points,
                [...pointLocation, intensity],
            ]);
            setUndoPoints([])
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
    const handleDeletePoint = (i) =>{
        points.splice(i,1)
        setPoints(points)
    }

    const handleUndo = () =>{
        if(points.length > 0){
            undoPoints.push(points.splice(points.length-1,1))
            setUndoPoints(undoPoints)
            setPoints(points)
        }
    }

    const handleRedo = () =>{
        if(undoPoints.length > 0){
            points.push(undoPoints.pop())
            setPoints(points)
            setUndoPoints(undoPoints)
        }
    }


    const handleRender = () =>{
        setRender(!render)
    }

    const handleSaveMap = () =>{
        
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
                Title: <TextField placeholder="Enter Title"></TextField>
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
                    {render && <HeatMap addressPoints={points}/>}
                    <LocationFinder/>
                    {points.map((position, idx) => 
                    <Marker key={`marker-${idx}`} position={position}>

                    <Popup>
                        <Typography>Intensity: {points[idx][2]}</Typography>
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
                            <UndoIcon sx={{ mr: 1 }} onClick={handleUndo} />
                            <Redo />
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
                <Box sx={{ paddingY: 1 }} onClick={handleRender} >

                    <Button variant="contained" >
                        Render
                    </Button>
                </Box>

                <Box sx={{ paddingY: 1 }} onClick={handleSaveMap} >

                    <Button variant="contained" href="/create">
                        Save
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={12} sm={.5}></Grid>
        </Grid>
    );
};

export default MapEditHeat;
