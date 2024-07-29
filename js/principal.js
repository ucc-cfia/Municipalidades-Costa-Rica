// Objeto mapa
var mapa = L.map("mapaid", {
    center: [9.7, -84.0],
    zoom: 8,
});

// Capa base Positron de Carto
positromap = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
    {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
    }
).addTo(mapa);

// Capa base de OSM
osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});

// Capa base de ESRI World Imagery
esriworld = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
);

// Capas base
var mapasbase = {
    "Carto Positron": positromap,
    OpenStreetMap: osm,
    "ESRI WorldImagery": esriworld,
};

// Control de capas
control_capas = L.control
    .layers(mapasbase, null, { collapsed: false })
    .addTo(mapa);

// Control de escala
L.control.scale().addTo(mapa);

// Capa vectorial de puntos Municipalidades de Costa Rica en formato GeoJSON
$.getJSON("datos/municipalidades_cr.geojson", function (geodata) {
    var municipalidades_cr = L.geoJson(geodata, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 4, // Set the radius of the circle
                fillColor: "#FFA500", // Orange color
                color: "#000", // Border color
                weight: 1, // Border thickness
                opacity: 1, // Border opacity
                fillOpacity: 0.8 // Fill opacity
            });
        },
        onEachFeature: function (feature, layer) {
            var popupText = "<strong>Municipalidad:</strong> " + feature.properties.MUNICIPALIDAD +
                            "<br><strong>Región:</strong> " + feature.properties.REGIÓN +
                            "<br><strong>Departamento:</strong> " + feature.properties.DEPARTAMENTO;
            layer.bindPopup(popupText);
        }
    }).addTo(mapa);

    control_capas.addOverlay(municipalidades_cr, "Municipalidades de Costa Rica");
});

// Capa de Municipalidades con área de gestión de riesgo
$.getJSON("datos/municipalidades_gr.geojson", function (geodata) {
    var municipalidades_gr = L.geoJson(geodata, {
        pointToLayer: function (feature, latlng) {
            var leafIcon = new L.Icon({
                iconUrl: 'https://static.vecteezy.com/system/resources/previews/010/153/330/original/tree-icon-sign-symbol-design-free-png.png', 
                iconSize: [25, 25], // Set a uniform size without incline or shadow
                iconAnchor: [10, 10], // Adjust icon anchor to be centered
                popupAnchor: [-3, -10] // Adjust popup anchor to open above the icon
            });
            return L.marker(latlng, {icon: leafIcon});
        },
        onEachFeature: function (feature, layer) {
            var popupText = "<strong>Municipalidad</strong>: " +
                feature.properties.MUNICIPALIDAD +
                "<br>" +
                "<strong>Región</strong>: " +
                feature.properties.REGIÓN +
                "<br>" +
                "<strong>Departamento</strong>: " +
                feature.properties.DEPARTAMENTO;
            layer.bindPopup(popupText);
        },
    }).addTo(mapa);

    control_capas.addOverlay(municipalidades_gr, "Municipalidades con Gestión de Riesgo");
});


