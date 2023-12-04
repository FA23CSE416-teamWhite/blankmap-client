import React, { useState, useRef, useEffect } from "react";
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

const DrawLayer = ({initialGeoJSON, onSave}) => {
    const [editableFG, setEditableFG] = useState(null);
    // const [geoJSON, setGeoJSON] = useState({ type: 'FeatureCollection', features: [] });
    const [geoJSON, setGeoJSON] = useState(initialGeoJSON);
    useEffect(() => {
        // Log GeoJSON to console whenever it changes (for testing)
        console.log(initialGeoJSON)
        console.log('GeoJSON:', geoJSON);
        onSave(geoJSON);
      }, [geoJSON, initialGeoJSON, onSave]);

    const onFeatureGroupReady = (reactFGref) => {

        // store the ref for future access to content
        setEditableFG(reactFGref);
    };
    const onChange = () => {
        // editableFG contains the edited geometry, which can be manipulated through the leaflet API
        if (!editableFG) {
            return;
        }
        console.log(geoJSON); 
    };

    const onCreated = (e) => {
        console.log("_onCreated:", e);
        console.log("editableFG",editableFG);
        console.log(e.layer.toGeoJSON());
        const layer = e.layer.toGeoJSON();
        setGeoJSON((prevGeoJSON) => ({
          type: 'FeatureCollection',
          features: [...prevGeoJSON.features, layer],
        }));
        // onSave(geoJSON);
    };

    const onEdited = (e) => {
        console.log("_onEdited:", e);
        console.log("data", geoJSON);
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