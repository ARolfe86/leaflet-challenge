// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

//Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);  
});

function createFeatures(earthquakeData) {
  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)},<br> Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km</p>`);
  }

  function depthToColor(value) {
    if (value < 10) {
      return "#a3f600";
    } else if (value < 30) {
      return "#dcf400";  
    } else if (value < 50) {
      return "#f7db11";
    } else if (value < 70) {
      return "#fdb72a";
    } else if (value < 90) {
      return "fca35d";
    }
    return "#ff5f65";
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
      let color = depthToColor(feature.geometry.coordinates[2]);
      return L.circleMarker(latlng, { radius: feature.properties.mag * 5, fillOpacity: 0.75, fillColor: color, color: "gray", weight: 1 });
    }
  });
  // Set up the legend
  let legend = L.control({position: "bottomright"});
  legend.onAdd= function() {
    let div = L.DomUtil.create("div", "info legend");
    let labels = [
      "<strong>Depth of Earthquakes (km)</strong>",
      "<li style=\"background-color: #a3f600;\">&lt; 10</li>",
      "<li style=\"background-color: #dcf400;\">10 - 30</li>",
      "<li style=\"background-color: #f7db11;\">30 - 50</li>",
      "<li style=\"background-color: #fdb72a;\">50 - 70</li>",
      "<li style=\"background-color: #fca35d;\">70 - 90</li>",
      "<li style=\"background-color: #ff5f65;\">90+ </li>",


    ];

    div.innerHTML = "<ul>" + labels.join("") + "</ul>";
    return div;
  }
 

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Creat our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });
    
  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
      
  legend.addTo(myMap);
}



