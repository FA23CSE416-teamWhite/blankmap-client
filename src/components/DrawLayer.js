import React, { useState, useRef } from "react";
import {
    MapContainer,
    TileLayer,
    FeatureGroup,
    GeoJSON,
    useMapEvent
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Workaround for broken icons when using webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png"
});

const DrawLayer = () => {
    const [editableFG, setEditableFG] = useState(null);
    const [geojsonData, setGeojsonData] = useState(null);

    const onFeatureGroupReady = (reactFGref) => {

        // store the ref for future access to content
        setEditableFG(reactFGref);
    };

    const onChange = () => {
        // editableFG contains the edited geometry, which can be manipulated through the leaflet API
        if (!editableFG) {
            return;
        }

        const geojsonData = editableFG.leafletElement.toGeoJSON();
        console.log(geojsonData);
    };

    const onCreated = (e) => {
        console.log("_onCreated:", e);
        onChange();
    };

    const onEdited = (e) => {
        console.log("_onEdited:", e);
        onChange();
    };

    const onDeleted = (e) => {
        console.log("_onDeleted:", e);
        onChange();
    };

    const onMounted = (drawControl) => {
        console.log("_onMounted", drawControl);
    };

    const onEditStart = (e) => {
        console.log("_onEditStart", e);
    };

    const onEditStop = (e) => {
        console.log("_onEditStop", e);
    };

    const onDeleteStart = (e) => {
        console.log("_onDeleteStart", e);
    };

    const onDeleteStop = (e) => {
        console.log("_onDeleteStop", e);
    };

    // Handle map click events
    const MapClickHandler = () => {
        const map = useMapEvent("click", (e) => {
            console.log("Map Clicked:", e.latlng);
        });

        return null;
    };

    return (
            <FeatureGroup
                ref={(reactFGref) => {
                    onFeatureGroupReady(reactFGref);
                }}
            >
                <EditControl
                    position="topright"
                    onEdited={onEdited}
                    onCreated={onCreated}
                    onDeleted={onDeleted}
                    onMounted={onMounted}
                    onEditStart={onEditStart}
                    onEditStop={onEditStop}
                    onDeleteStart={onDeleteStart}
                    onDeleteStop={onDeleteStop}
                    onChange={onChange}
                    draw={{
                        rectangle: false
                    }}
                />
            </FeatureGroup>

    );
};

export default DrawLayer;