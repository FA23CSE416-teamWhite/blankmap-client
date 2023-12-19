import React, { useState, useRef, useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    FeatureGroup,
    GeoJSON,
    useMapEvent,
    Polygon,
    CircleMarker,
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
    const [geoJSON, setGeoJSON] = useState(initialGeoJSON || { type: 'FeatureCollection', features: [] });
    const featureGroupRef = useRef();
    useEffect(() => {
        console.log("initialGeoJSON: ", initialGeoJSON);
        console.log("geoJSON: ", geoJSON);  
        // const convertMultiPolygonsToPolygons = (geoJSON) => {
        //     const convertedFeatures = geoJSON.features.map((feature) => {
        //       if (feature.geometry.type === 'MultiPolygon') {
        //         // Convert the MultiPolygon to a Polygon by taking the first polygon
        //         return {
        //           ...feature,
        //           geometry: {
        //             type: 'Polygon',
        //             coordinates: feature.geometry.coordinates[0], // Assuming the first polygon
        //           },
        //         };
        //       }
        //       return feature;
        //     });
          
        //     return {
        //       type: 'FeatureCollection',
        //       features: convertedFeatures,
        //     };
        //   };

        if (featureGroupRef.current) {
            const leafletGeoJSON = new L.GeoJSON(geoJSON);
            const leafletFG = featureGroupRef.current;
            // console.log("onReady: ",featureGroupRef.current);
            // console.log("onReady: ",leafletGeoJSON);
      
            leafletGeoJSON.eachLayer((layer) => {
              leafletFG.addLayer(layer);
            });
      
            // Store the ref for future access to content
            setEditableFG(featureGroupRef);
          }
        //   if (featureGroupRef.current) {
        //     const leafletFG = featureGroupRef.current;
        //     const convertedGeoJSON = convertMultiPolygonsToPolygons(geoJSON);
        //     console.log("geoJson: ", geoJSON)
        //     console.log("converted geoJson: ", convertedGeoJSON);  
        //     const leafletGeoJSON = new L.GeoJSON(convertedGeoJSON);
        //     console.log("onReady: ",leafletGeoJSON);
        
        //     leafletGeoJSON.eachLayer((layer) => {
        //       leafletFG.addLayer(layer);
        //     });
        
        //     // Store the ref for future access to content
        //     setEditableFG(featureGroupRef);
        //   }
        // console.log(initialGeoJSON)
        // console.log('GeoJSON:', geoJSON);
        // onSave(geoJSON);
      }, [geoJSON, initialGeoJSON, onSave]);


    const onChange = () => {
        // editableFG contains the edited geometry, which can be manipulated through the leaflet API
        if (!editableFG) {
            return;
        }
        console.log(geoJSON); 
    };

    const onCreated = (e) => {
        // console.log("_onCreated:", e);
        // console.log("editableFG", editableFG);
        console.log(e.layer.toGeoJSON());
        const layer = e.layer.toGeoJSON();
        // setGeoJSON({
        //     type: 'FeatureCollection',
        //     features: [...geoJSON.features, layer],
        //   });
        // onSave is called directly with the updated GeoJSON data
        onSave({
          type: 'FeatureCollection',
          features: [...initialGeoJSON.features, layer],
        });

      };

    //   const onEdited = (e) => {
    //     console.log("_onEdit:", e);
      
    //     // Assuming e.layers is an array of edited layers
    //     const editedLayers = e.layers.toGeoJSON();
      
    //     // Update the GeoJSON data by adding the edited layers
    //     const updatedGeoJSON = {
    //       type: 'FeatureCollection',
    //       features: [...geoJSON.features, ...editedLayers.features],
    //     };
      
    //     // Save the updated GeoJSON data
    //     onSave(updatedGeoJSON);
    //   };

    const onDeleted = (e) => {
        const deletedLayers = e.layers.toGeoJSON();
        

        const updatedGeoJSON = {
          type: 'FeatureCollection',
          features: geoJSON.features.filter((feature) => {
            // Filter out the deleted layers
            return !deletedLayers.features.some((deletedFeature) => {
              return (
                JSON.stringify(feature.geometry) === JSON.stringify(deletedFeature.geometry)
              );
            });
          }),
        };
    

        setGeoJSON(updatedGeoJSON);
        onSave(updatedGeoJSON);
      };

    const onMounted = (drawControl) => {
        console.log("_onMounted", drawControl);
    };

    // const onEditStart = (e) => {
    //     console.log("_onEditStart", e);
    // };

    // const onEditStop = (e) => {
    //     console.log("_onEditStop", e);
    // };

    const onDeleteStart = (e) => {
        console.log("_onDeleteStart", e);
    };

    const onDeleteStop = (e) => {
        console.log("_onDeleteStop", e);
    };

    return (
            <FeatureGroup
                ref={featureGroupRef}
            >
                <EditControl
                    position="topright"
                    // onEdited={onEdited}
                    onCreated={onCreated}
                    onDeleted={onDeleted}
                    onMounted={onMounted}
                    // onEditStart={onEditStart}
                    // onEditStop={onEditStop}
                    onDeleteStart={onDeleteStart}
                    onDeleteStop={onDeleteStop}
                    onChange={onChange}
                    draw={{
                        circlemarker: false,
                        circle: false,
                    }}
                    edit = {{
                        edit:false
                    }}
                />
            </FeatureGroup>

    );
};

export default DrawLayer;