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
import { MapContainer, TileLayer, useMapEvents,Marker} from 'react-leaflet';

const MapEditHeat = () => {
    const [points, setPoints] = useState([]);
    const [mapCenter, setMapCenter] = useState([39.9897471840457, -75.13893127441406]);
    const [intensity, setIntensity] = useState("");
    const [pointLocation, setPointLocation] = useState("");
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
            console.log(points)
        }
    };

    const LocationFinder = () => {
        const map = useMapEvents({
            click(e) {
                setPointLocation(Object.values(e.latlng));
                console.log(pointLocation)
            },
        });
        return null;
    };
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
                    A Heat Map Example
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
                    {<HeatMap addressPoints={points}/>}
                    <LocationFinder/>
                    <Marker position={pointLocation} ></Marker>)
                </MapContainer>
                <Button variant="contained" onClick={handleAddPoint}>
                    Add a point
                </Button>
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
                            <UndoIcon sx={{ mr: 1 }} />
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
                <Typography> Choose a Color</Typography>
                <Box sx={{ paddingY: 1 }}>
                    <SquareIcon sx={{ color: "red", paddingX: 1 }} />
                    <SquareIcon sx={{ color: "blue", paddingX: 1 }} />
                    <SquareIcon sx={{ color: "yellow", paddingX: 1 }} />
                    <SquareIcon sx={{ color: "green", paddingX: 1 }} />
                    <SquareIcon sx={{ color: "purple", paddingX: 1 }} />
                </Box>

                <Box>

                    <Button variant="contained" sx={{ paddingY: 1, marginLeft: 2 } } href="/create">
                        Render as Heat Map
                    </Button></Box>
            </Grid>
            <Grid item xs={12} sm={.5}></Grid>
        </Grid>
    );
};

export default MapEditHeat;
