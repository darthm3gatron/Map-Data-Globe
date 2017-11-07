function Globe () {
    var my = ChiasmComponent({
        backgroundColor: "black",
        foregroundColor: "white",
        center: [0, 0],
        zoom: 1,
        sens: 0.25
    });

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    var projection = d3.geo.orthographic().clipAngle(90);
    var path = d3.geo.path().projection(projection).context(context);

    d3.select(canvas).call(d3.behavior.drag().origin(function(){
        var r = projection.rotate();
        return {
            x: r [0] / my.sens,
            y: -r[1] / my.sens
        };
    }).on("drag", function(){
        var lng = -d3.event.x * my.sens;
        var lat = d3.event.y * my.sens;

        lat = lat > 89 ? 89 : lat < -89 ? -89 : lat;

        my.center = [lng, lat];
    }));

    my.el = canvas;

    my.box = {
        width: 960,
        height: 600
    };

    my.radius = my.box.height / 2 - 5;
    my.scale = my.radius;
    my.cosLat = 1;

    my.when("box", function (box) {
        canvas.width = box.width;
        canvas.height = box.height;
        projection.translate([box.width / 2, box.height / 2]);
        my.radius = box.height / 2 - 5;
    });

    my.when("radius", function (radius) {
        my.scale = radius;
    });

    my.when("scale", function (scale) {
        projection.scale(my.scale);
    });

    my.when("center", function (center) {
        var lat = center[1];
        my.cosLat = Math.cos(toRadians(lat));
        my.rotate = [-center[0], -center[1]];
    });

    my.when("rotate", function(rotate){
        projection.rotate(rotate);
    });

    function toRadians(deg) {
        return deg / 180 * Math.PI;
    }

    d3.json("world-110m.json", function(error, world){
        if (error) throw error;
        var land = topojson.feature(world, world.objects.land);
        d3.timer(function(elapsed){
            context.fillStyle = my.backgroundColor;
            context.fillRect(0, 0, my.box.width, my.box.height);
            context.fillStyle = my.foregroundColor;
            context.strokeStyle = my.foregroundColor;
            context.beginPath();
            path(land);
            context.fill();

            var constant = 800;
            var currentViewRadius = constant * my.box.height * my.cosLat / (Math.pow(2, my.zoom + 8));
            currentViewRadius = currentViewRadius < 1 ? 1 : currentViewRadius;
            var radius = my.radius < 1 ? 1 : my.radius;

            context.beginPath();
            context.arc(my.box.width / 2, my.box.height / 2, radius, 0, 2 * Math.PI, true);
            context.lineWidth = 2.5;
            context.stroke();

            context.save();
            context.globalCompositeOperation = "difference";
            context.strokeStyle = "white";

            context.beginPath();
            context.arc(my.box.width / 2, my.box.height / 2, currentViewRadius, 0, 2 * Math.PI, true);
            context.lineWidth = 2.5;
            context.stroke();

            context.restore();
        });
    });
    return my;
}