// Create map
var myMap = L.map("map", {
    center: [36.1716,-115.1391],
    zoom:5

});

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// URL to data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Fetch JSON data
d3.json(url).then(function(data) {
    // Loop through features in data to collect variables
    data.features.forEach(function (feature) {
        var lat = feature.geometry.coordinates[1];
        var lon = feature.geometry.coordinates[0];
        var mag = feature.properties.mag;
        var depth = feature.geometry.coordinates[2];
        var place = feature.properties.place;
        var time = feature.properties.time;
        var timeFormatted = new Date(time).toLocaleString();

        // Set circle options
        var circleOptions = {
            radius:mag *5,
            fillOpacity:0.9,
            color: "black",
            fillColor:getColor(depth),
            weight: 1
        };

        // Add circle markers to map
        L.circleMarker([lat,lon],circleOptions).bindPopup(
                                "Place: " + place + 
                                "<br>Latitude: " + lat + 
                                "<br>Longitude: " + lon + 
                                "<br>Magnitude: " + mag + 
                                "<br>Depth: " + depth + " km" + 
                                "<br>Time: " + timeFormatted).addTo(myMap);
    });

// Add legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");
    var labels = ["-10 to 10 km", "10 to 30 km", "30 to 50 km", "50 to 70 km", "70 to 90 km", "90+ km"];
    var colors = ["#00FF00", "#ADFF2F", "#FFFF00", "#FFCB7F", "#FF8C00", "#FF0000"];

    div.innerHTML += "<h4>Depth Legend</h4>";

    for (var i = 0; i < labels.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '; width: 10px; height: 10px; display: inline-block;"></i> ' +
            labels[i] + '<br>';
    }

    return div;
};

legend.addTo(myMap);
});

// Function to select circle color
function getColor(depth) {
    if (depth >= -10 && depth < 10) {
        return "#00FF00"; // Green
    } else if (depth >= 10 && depth < 30) {
        return "#ADFF2F"; // Light green
    } else if (depth >= 30 && depth < 50) {
        return "#FFFF00"; // Yellow
    } else if (depth >= 50 && depth < 70) {
        return "#FFCB7F"; // Orange
    } else if (depth >= 70 && depth < 90) {
        return "#FF8C00"; // Dark orange
    } else {
        return "#FF0000"; // Red
    }
}