import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-choropleth"; // Keep this line if using the leaflet-choropleth plugin

const style = {
  fillColor: "#F28F3B",
  weight: 2,
  opacity: 1,
  color: "white",
  dashArray: "3",
  fillOpacity: 0.5
};

export default function Choropleth({color, geojsonData, featureForChoropleth, step}) {
  const map = useMap();
    console.log(step)
  useEffect(() => {
    if (!geojsonData) return;
    const choroplethLayer = L.choropleth(geojsonData, {
        valueProperty: featureForChoropleth,
        scale: ["white", color],
        steps: step,
        mode: "q",
        style,
        onEachFeature: function (feature, layer) {
            // Convert feature.properties to a custom formatted string
            const formattedProperties = Object.entries(feature.properties)
              .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
              .join('<br>');
        
            // Display the formatted string in the popup
            layer.bindPopup(formattedProperties);
          }
      });
      const legend = L.control({ position: 'bottomright' });
      legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend')
        var limits = choroplethLayer.options.limits
        var colors = choroplethLayer.options.colors
        var labels = []
    
        // Add min & max
        div.innerHTML = '<div>'+featureForChoropleth+'</div><div class="labels"><div class="min">' + limits[0] + '</div><div class="max">' + limits[limits.length - 1] + '</div></div>'
    
        limits.forEach(function (limit, index) {
          labels.push('<li style="background-color: ' + colors[index] + '"></li>')
        })
    
        div.innerHTML += '<ul>' + labels.join('') + '</ul>'
        return div
      };

        choroplethLayer.addTo(map);
        if(featureForChoropleth!==""){
          legend.addTo(map);
        }
        map.fitBounds(choroplethLayer.getBounds());
            return () => {
      map.removeLayer(choroplethLayer);
      map.removeControl(legend);
    };

        // If you need to fit the map bounds to the choropleth layer
        // map.fitBounds(choroplethLayer.getBounds());

  }, [map,color,geojsonData,featureForChoropleth,step]);

  return null; 
}