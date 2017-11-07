function ChiasmLeaflet() {
    var my = ChiasmComponent({
        center: [0, 0],
        zoom: 2
    });

    my.el = document.createElement("div");

    d3.select(my.el).style("background-color", "black");

    my.map = L.map(my.el, {
        attributionControl: false
    }).setView(my.center, my.zoom);

    L.tileLayer("http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png").addTo(my.map);

    function getCenter() {
        var center = my.map.getCenter();
        return [center.lng, center.lat];
    }

    function setCenter(center) {
        my.map.off("move", onMove);
        my.map.panTo(L.latLng(center[1], center[0]), {
            animate: false
        });
        my.map.on("move", onMove);
    }

    my.map.on("move", onMove);

    function onMove() {
        my.center = getCenter();
        my.zoom = my.map.getZoom();
    }

    my.when("center", setCenter);
    my.when("zoom", my.map.setZoom, my.map);

    my.when("box", function(box) {
        d3.select(my.el).style("width", box.width + "px").style("height", box.height + "px");
        my.map.invalidateSize();
    });
    return my;
}