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

let projection = d3.geoMercator().center([rgeo.lon, rgeo.lat])
    .scale(rgeo.scale).rotate([0, 0])
    .translate([width / 2, height / 2]);

let path = d3.geoPath().projection(projection);

d3.json(rgeo.url).then(json => {
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
});