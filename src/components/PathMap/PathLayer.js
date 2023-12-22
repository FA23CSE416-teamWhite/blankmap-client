import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";



export default function ColorLayer({ geojsonData, fillColor="gray",weight=2,opacity=0.5,color="white",dashArray="5",fillOpacity=0.5 }) {
  const map = useMap();


  useEffect(() => {
    const defaultStyle = {
        fillColor: fillColor,
        weight: weight,
        opacity: opacity,
        color: color,
        dashArray: dashArray,
        fillOpacity: fillOpacity,
        lineCap: 'round',
        lineJoin: 'round',
      };
    if (!geojsonData) return;

    const colorLayer = L.geoJson(geojsonData, {
      style: (feature) => {
        return {
          ...defaultStyle,
        };
      },
      onEachFeature: function (feature, layer) {

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
    });

    colorLayer.addTo(map);
    map.fitBounds(colorLayer.getBounds());


    return () => {
      map.removeLayer(colorLayer);
    };
  }, [map, geojsonData, fillColor, weight, opacity, color, dashArray, fillOpacity]);
  return null;
}