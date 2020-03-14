import React from 'react';

import '../scss/maps.scss';

import { code2map } from '../lib/geo-json-list';

const clog = console.log;

export default class Maps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            set: true,
            mapCode: null,
            regCode: null
        };

        this.svg = null;
        this.projection = null;
        this.path = null;
        this.width = 500;
        this.height = 500;

        this.showMap = this.showMap.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        clog("getDerivedStateFromProps");
        if (state.mapCode == props.mapCode) {
            return {
                set: false,
                regCode: props.regCode
            }
        } else {
            return {
                set: true,
                mapCode: props.mapCode,
                regCode: props.regCode
            }
        }
    }

    render() {
        return (
            <div id="maps">
                <div id="rname"></div>
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        clog('masps DidUpdate');
        this.showMap(code2map[this.state.mapCode], this.state.regCode);
    }

    componentDidMount() {
        clog('masps DidMount');
        this.showMap(code2map[this.state.mapCode], this.state.regCode);
    }

    showMap(rmap, regin) {
        clog('showMap', rmap, regin);
        let that = this;
        if (!that.state.set) {
            clog(that.state.regCode);
            that.svg.selectAll("path").classed("selected", d => fullCode(d.properties[rmap.prop_num]) == that.state.regCode);
            return;
        }

        reset();
        that.svg = d3.select('#maps').append('svg')
            .attr("width", that.width)
            .attr("height", that.height);

        that.projection = d3.geoMercator().center([rmap.lon, rmap.lat])
            .scale(rmap.scale).rotate([0, 0])
            .translate([that.width / 2, that.height / 2]);

        // https://github.com/d3/d3-geo
        // let projection = d3.geoAlbersUsa();
        that.path = d3.geoPath().projection(that.projection);

        d3.json(rmap.url).then(json => {
            // clog(json);
            that.svg.selectAll("path")
                .data(json.features)
                .enter().append("path")
                .attr("d", that.path)
                .classed("selected", d => {
                    return fullCode(d.properties[rmap.prop_num]) == regin;
                })
                .on("click", function (d, index) {
                    clog(d.properties[rmap.prop_num]);
                    if ($(this).hasClass("selected")) { // 2nd click
                        let rcode = fullCode(d.properties[rmap.prop_num]);
                        if (code2map.hasOwnProperty(rcode)) {
                            // reset();
                            // that.showMap(code2map[d.properties[rmap.prop_num]]);
                            // that.setState({ mapCode: rcode, set: true });
                            that.props.dpSelectRegion(rcode, null);
                        }
                    }
                    let rcode = fullCode(d.properties[rmap.prop_num]);
                    that.props.dpSelectRegion(that.state.mapCode, rcode);
                    // that.svg.selectAll("path").classed("selected", d2 => d == d2);
                    // that.svg.selectAll("text").classed("selected", d2 => d == d2);
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
                    }).text(d.properties[rmap.prop_name]);
                })
                .append("title")
                .text(d => d.properties[rmap.prop_name]);

            that.svg.selectAll("text")
                .data(json.features)
                .enter().append("text")
                .attr("text-anchor", "middle")
                .attr("transform", function (d) { return "translate(" + that.path.centroid(d) + ")"; })
                .text(d => d.properties[rmap.prop_name]);
        });

        function reset() {
            if (that.svg) that.svg.remove();
            $("#rname").hide();
        }

        function fullCode(code) {
            return code + '0'.repeat(10 - code.length);
        }
    }
}