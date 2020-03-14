// http://192.168.0.64:3000
import '../scss/maps.scss';
import { code2map } from './geoJsonList';

const clog = console.log;

export default class Maps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            set: false,
            mapCode: '0000000000',
            region: null
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
        if (state.set) {
            return { mapCode: state.mapCode, set: false }
        } else if (props.mapCode) {
            return { mapCode: props.mapCode };
        } else {
            return null;
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
        this.showMap(code2map[this.state.mapCode]);
    }

    componentDidMount() {
        clog('masps DidMount');
        this.showMap(code2map[this.state.mapCode]);
    }

    showMap(rgeo) {
        let that = this;
        that.svg = d3.select('#maps').append('svg')
            .attr("width", that.width)
            .attr("height", that.height);

        that.projection = d3.geoMercator().center([rgeo.lon, rgeo.lat])
            .scale(rgeo.scale).rotate([0, 0])
            .translate([that.width / 2, that.height / 2]);

        // https://github.com/d3/d3-geo
        // let projection = d3.geoAlbersUsa();
        that.path = d3.geoPath().projection(that.projection);

        d3.json(rgeo.url).then(json => {
            // clog(json);
            that.svg.selectAll("path")
                .data(json.features)
                .enter().append("path")
                .attr("d", that.path)
                .on("click", function (d, index) {
                    if ($(this).hasClass("selected")) {
                        let rcode = fullCode(d.properties[rgeo.prop_num]);
                        if (code2map.hasOwnProperty(rcode)) {
                            reset();
                            // that.showMap(code2map[d.properties[rgeo.prop_num]]);
                            that.setState({ mapCode: rcode, set: true });
                        }
                    }
                    that.svg.selectAll("path").classed("selected", d2 => d == d2);
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

            that.svg.selectAll("text")
                .data(json.features)
                .enter().append("text")
                .attr("text-anchor", "middle")
                .attr("transform", function (d) { return "translate(" + that.path.centroid(d) + ")"; })
                .text(d => d.properties[rgeo.prop_name]);
        });

        function reset() {
            that.svg.remove();
            $("#rname").hide();
        }

        function fullCode(code) {
            let rcode = code + '0'.repeat(10 - code.length);
            clog(rcode);
            return rcode;
        }
    }
}