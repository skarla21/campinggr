mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v11", // style URL
    center: [lon, lat], // starting position
    zoom: 12, // starting zoom
});

const popup = new mapboxgl.Popup({
    offset: 15,
    closeButton: true,
    closeOnClick: false
})
    .setLngLat([lon, lat])
    .setHTML(`<h6><b>${campgroundTitle}</b></h6><p>${campgroundDescription}</p>`)
    .setMaxWidth("150px");

const marker = new mapboxgl.Marker()
    .setLngLat([lon, lat])
    .addTo(map)
    .setPopup(popup);

map.addControl(new mapboxgl.NavigationControl());
