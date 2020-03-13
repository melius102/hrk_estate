// http://192.168.0.64:3000
import '../scss/maps.scss';
import { province, seoul, gyeonggi } from './geoJsonList';

const clog = console.log;
clog('masps start');

let rgeo = province;

let width = 500;
let height = 500;

let svg = d3.select('#maps').append('svg')
    .attr("width", width)
    .attr("height", height);

// https://github.com/d3/d3-geo
// let projection = d3.geoAlbersUsa();
let projection = d3.geoMercator().center([rgeo.lon, rgeo.lat])
    .scale(rgeo.scale).rotate([0, 0])
    .translate([width / 2, height / 2]);

let path = d3.geoPath().projection(projection);

d3.json(rgeo.url).then(json => {
    // clog(json);

    svg.selectAll("path")
        .data(json.features)
        .enter().append("path")
        .attr("d", path)
        .on("click", (d, index) => {
            svg.selectAll("path")
                .classed("selected", d2 => d == d2);

            svg.selectAll("text")
                .classed("selected", d2 => d == d2);
        });
    // .on("mouseenter", () => clog("enter"))
    // .on("mouseleave", () => clog("leave"));
    // .on("mouseover", () => clog("over"))
    // .on("mouseout", () => clog("out"));

    svg.selectAll("text")
        .data(json.features)
        .enter().append("text")
        .attr("text-anchor", "middle")
        .attr("transform", function (d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("class", "region-label")
        .text(d => d.properties[rgeo.prop_name]);
});