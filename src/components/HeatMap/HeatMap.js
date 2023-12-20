import React, { useState, useEffect } from "react";
import { useMap, Marker } from 'react-leaflet'
import L, { point } from 'leaflet'
import { isEqual } from "lodash";
import "leaflet.heat"

export default  function HeatMap({addressPoints, render, setFeatures, setGeo, prevFeatures}){
    //An extract of address points from the LINZ bulk extract: http://www.linz.govt.nz/survey-titles/landonline-data/landonline-bde
//Should be this data set: http://data.linz.govt.nz/#/layer/779-nz-street-address-electoral/

   const map = useMap()
   useEffect( () => {
     const points = addressPoints
     ? addressPoints.map((p) => {
       return [p[0], p[1], p[2]]; // lat lng intensity
       })
     : [];

     var features = []
    map.eachLayer(function (layer) {
      if(layer._heat){
         map.removeLayer(layer);
      }
    });
    L.heatLayer(points).addTo(map);
    map.eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        features.push(layer.toGeoJSON());
      } 
    });
      
      console.log(map.getBounds())
      if(isEqual(features,prevFeatures)){
        return;
      }
      setFeatures(features);
      setGeo({
        type: "FeatureCollection",
        features: features
    })

   }, [addressPoints, render, setFeatures, setGeo, prevFeatures]);
}