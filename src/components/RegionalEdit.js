import React, { useState, useEffect, Component } from "react";
import { Link, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
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
import tempMap from '../assets/regional.png'
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import Redo from "@mui/icons-material/Redo";
import Card from "@mui/material/Card";
import SquareIcon from '@mui/icons-material/Square';

const RegionalEdit = () => {
    const [features, setFeatures] = useState([]);

    const [selectedFeatureType, setSelectedFeatureType] = useState("");
    const [featureName, setFeatureName] = useState("");
    useEffect(() => {
        setFeatures([
            { type: "String", name: "Name" },
            { type: "Number", name: "Population" },
            { type: "Number", name: "Area" },
            { type: "Number", name: "GDP" },
            { type: "Number", name: "HDI" },
        ]);
    }, []);

    const handleAddFeature = () => {
        if (selectedFeatureType && featureName) {
            setFeatures([
                ...features,
                { type: selectedFeatureType, name: featureName },
            ]);

            setSelectedFeatureType("");
            setFeatureName("");
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
                    Simple Regional Maps Example
                </Typography>
                <img src={tempMap} alt="fireSpot" style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%'}}height="480" width="700" />
                <Button variant="contained">
                    Add a New Region
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
                                Category: Regional Map
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

                <Box sx={{ paddingY: 2 }} />
                <Box>
                    <Typography>
                        Features: Name, Population
                    </Typography>
                    <Link>edit</Link>
                </Box>

                <Box sx={{ paddingY: 2 }} />

                <Card>
                    <CardContent>
                        <Typography>Feature Name:</Typography>
                        <TextField fullWidth label="Population"></TextField>
                    </CardContent>
                </Card>
                <Button variant="contained" sx={{ paddingY: 1 }}> Add More Features</Button>
                <Box sx={{ paddingY: 2 }} />

                <Typography>
                    Feature for Choropleth
                </Typography>
                <TextField label="Choose a Feature"></TextField>
                <Typography> Choose a Color</Typography>
                <Box sx={{ paddingY: 1 }}>
                    <SquareIcon sx={{ color: "red", paddingX: 1 }} />
                    <SquareIcon sx={{ color: "blue", paddingX: 1 }} />
                    <SquareIcon sx={{ color: "yellow", paddingX: 1 }} />
                    <SquareIcon sx={{ color: "green", paddingX: 1 }} />
                    <SquareIcon sx={{ color: "purple", paddingX: 1 }} />
                </Box>

                <Box>
                    <Button variant="contained" sx={{ paddingY: 1, paddinX: 1 }}> Rank It</Button>
                    <Button variant="contained" sx={{ paddingY: 1, marginLeft: 2 } } href="/create">
                        Render as Regional Map
                    </Button></Box>
            </Grid>
            <Grid item xs={12} sm={.5}></Grid>
        </Grid>
    );
};

export default RegionalEdit;
