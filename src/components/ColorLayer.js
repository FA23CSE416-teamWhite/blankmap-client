import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const defaultStyle = {
  fillColor: "green",
  weight: 2,
  opacity: 1,
  color: "white",
  dashArray: "3",
  fillOpacity: 0.5
};

export default function ColorLayer({ geojsonData, colorProperty }) {
  const map = useMap();

  useEffect(() => {
    if (!geojsonData || !colorProperty) return;

    const colorLayer = L.geoJson(geojsonData, {
      style: (feature) => {
        // Customize the style based on the color property of each feature
        const colorValue = feature.properties[colorProperty];
        return {
          ...defaultStyle,
          fillColor: getColor(colorValue), // Customize the color based on your logic
        };
      },
      onEachFeature: function (feature, layer) {
        // Convert feature.properties to a custom formatted string
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

    // If you need to fit the map bounds to the color layer
    // map.fitBounds(colorLayer.getBounds());

    return () => {
      map.removeLayer(colorLayer);
    };
  }, [map, geojsonData, colorProperty]);

  // You can define your color logic based on the color property value
  const getColor = (value) => {
    switch (value) {
      case 'green':
        return 'green';
      case 'blue':
        return 'blue';
      // Add more cases as needed
      default:
        return value;
    }
  };

  return null;
}