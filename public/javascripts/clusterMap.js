mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "cluster-map",
    style: "mapbox://styles/mapbox/outdoors-v11", // choose from Mapbox's core styles, or make your own
    center: [23.727539, 37.983810],
    zoom: 5,
});

map.addControl(new mapboxgl.NavigationControl());

map.on("load", () => {
    // Add a new source from our GeoJSON data and set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.addSource("campgrounds", {
        type: "geojson",
        data: campgrounds,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
        id: "clusters",
        type: "circle",
        source: "campgrounds",
        filter: ["has", "point_count"],
        paint: {
            // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
            // with three steps to implement three types of circles:
            "circle-color": [
                "step",
                ["get", "point_count"],
                "#d66d6b",
                3,
                "#b3406a",
                10,
                "#a461b0",
            ],
            "circle-radius": ["step", ["get", "point_count"], 10, 3, 15, 10, 20],
        },
    });

    map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "campgrounds",
        filter: ["has", "point_count"],
        layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
        },
    });

    map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "campgrounds",
        filter: ["!", ["has", "point_count"]],
        paint: {
            "circle-color": "#e09936",
            "circle-radius": 6,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
        },
    });

    // inspect a cluster on click
    map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ["clusters"],
        });
        const clusterId = features[0].properties.cluster_id;
        map
            .getSource("campgrounds")
            .getClusterExpansionZoom(clusterId, (err, zoom) => {
                if (err) return;

                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom,
                });
            });
    });

    // When a click event occurs on a feature in the unclustered-point layer, open a popup at
    // the location of the feature, with description HTML from its properties.
    map.on("click", "unclustered-point", (e) => {
        const { popUpMarkup } = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates.slice();

        // Ensure that if the map is zoomed out such that multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        if (["mercator", "equirectangular"].includes(map.getProjection().name)) {
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popUpMarkup)
            .addTo(map);
    });

    map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
    });
});