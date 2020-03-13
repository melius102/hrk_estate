// http://192.168.0.64:3000
import '../scss/maps.scss';
import { province, name_obj } from './geoJsonList';

const clog = console.log;
clog('masps start');

let svg, projection, path;
let width = 500;
let height = 500;

showMap(province);

function showMap(rgeo) {
    svg = d3.select('#maps').append('svg')
        .attr("width", width)
        .attr("height", height);

    projection = d3.geoMercator().center([rgeo.lon, rgeo.lat])
        .scale(rgeo.scale).rotate([0, 0])
        .translate([width / 2, height / 2]);

    // https://github.com/d3/d3-geo
    // let projection = d3.geoAlbersUsa();
    path = d3.geoPath().projection(projection);

    d3.json(rgeo.url).then(json => {
        // clog(json);
        svg.selectAll("path")
            .data(json.features)
            .enter().append("path")
            .attr("d", path)
            .on("click", function (d, index) {
                if ($(this).hasClass("selected")) {
                    clog(d.properties[rgeo.prop_num]);
                    if (name_obj.hasOwnProperty(d.properties[rgeo.prop_num])) {
                        reset();
                        showMap(name_obj[d.properties[rgeo.prop_num]]);
                    }
                }
                svg.selectAll("path").classed("selected", d2 => d == d2);
                // svg.selectAll("text").classed("selected", d2 => d == d2);
            })
            // .on("mouseenter", () => clog("enter"))
            // .on("mouseleave", () => clog("leave"));
            .on("mouseover", d => $("#rname").show())
            .on("mouseout", d => $("#rname").hide())
            .on("mousemove", function (d) {
                // clog(this, event == d3.event);
                // clog(event.clientY + 'px', event.clientX + 'px');
                $("#rname").css({
                    top: event.clientY - 30 + 'px',
                    left: event.clientX + 'px'
                }).text(d.properties[rgeo.prop_name]);
            })
            .append("title")
            .text(d => d.properties[rgeo.prop_name]);

        svg.selectAll("text")
            .data(json.features)
            .enter().append("text")
            .attr("text-anchor", "middle")
            .attr("transform", function (d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("class", "region-label")
            .text(d => d.properties[rgeo.prop_name]);
    });

    function reset() {
        svg.remove();
        $("#rname").hide();
    }
}
