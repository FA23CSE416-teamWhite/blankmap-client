import React, { useState, useEffect } from "react";
import { useMap, Marker } from 'react-leaflet'
import L, { point } from 'leaflet'
import "leaflet.heat"

export default function HeatMap({addressPoints}){
    //An extract of address points from the LINZ bulk extract: http://www.linz.govt.nz/survey-titles/landonline-data/landonline-bde
//Should be this data set: http://data.linz.govt.nz/#/layer/779-nz-street-address-electoral/

   const map = useMap()
   useEffect(() => {
     const points = addressPoints
     ? addressPoints.map((p) => {
       return [p[0], p[1], p[2]]; // lat lng intensity
       })
     : [];

    
     console.log(points)
     L.heatLayer(points).addTo(map);
   }, [addressPoints]);
}