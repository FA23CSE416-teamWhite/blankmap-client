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

export default function Choropleth({color}) {
  const map = useMap();

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/timwis/leaflet-choropleth/gh-pages/examples/basic/crimes_by_district.geojson"
    )
      .then((response) => response.json())
      .then((geojson) => {
        const choroplethLayer = L.choropleth(geojson, {
          valueProperty: "incidents",
          scale: ["white", color],
          steps: 5,
          mode: "q",
          style,
          onEachFeature: function (feature, layer) {
            layer.bindPopup(
              "District " +
                feature.properties.dist_num +
                "<br>" +
                feature.properties.incidents.toLocaleString() +
                " incidents"
            );
          }
        });

        choroplethLayer.addTo(map);

        // If you need to fit the map bounds to the choropleth layer
        // map.fitBounds(choroplethLayer.getBounds());
      });
  }, [map, color]);

  return null;
}