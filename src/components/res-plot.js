import React from 'react';
import { clog } from '../lib/util';
import '../scss/res-plot.scss';

export default class ResPlot extends React.Component {
    constructor(props) {
        super(props);
        this.svg = null;
        this.state = { type: 0 };
        this.showPlot = this.showPlot.bind(this);
    }

    // static getDerivedStateFromProps(props, state) {
    //     return null;
    // }

    hClick(evt) {
        let type = this.state.type;
        if (++type == 3) type = 0;
        this.setState({ type });
    }

    render() {
        return (
            <div id="res-plot">
                <div id="item-info"></div>
                <div id="plot-btn" onClick={(evt) => { this.hClick(evt); }}><i className="fas fa-sticky-note"></i></div>
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        clog('res-plot DidUpdate');
        clog(this.props.itemListData);
        if (this.props.itemListData) {
            $('#res-plot').show();
            let items = this.props.itemListData.items.item;
            this.showPlot(items);
        }
        else $('#res-plot').hide();
    }

    componentDidMount() {
        clog('res-plot DidMount');
        clog(this.props.itemListData);
        if (this.props.itemListData) {
            $('#res-plot').show();
            let items = this.props.itemListData.items.item;
            this.showPlot(items);
        }
        else $('#res-plot').hide();
    }

    showPlot(items) {
        clog('showPlot');
        let that = this;

        that.width = $("#res-plot").width();
        that.height = $("#res-plot").height();

        reset();
        that.svg = d3.select('#res-plot').append('svg')
            .attr("width", that.width)
            .attr("height", that.height);

        // let data = [
        //     { x: 0, y: 1 }, { x: 2, y: 2 }, { x: 4, y: 5 },
        //     { x: 6, y: 7 }, { x: 8, y: 3 }, { x: 10, y: 7 }
        // ];
        // d3.csv("public/test.csv").then(data => {});
        // console.table(data, ["x", "y"]);

        let data;
        if (items) {
            // data = items.map(v => [v["거래금액"], ["거래일자"]]);
            // data = items.map(v => [v["거래금액"], new Date(v["거래일자"])]);
            // data = items.map(v => [v["거래금액"].replace(/,/g, ""), new Date(v["거래일자"])]);
            data = items.map(v => [new Date(v["거래일자"]), parseInt(v["거래금액"].replace(/,/g, "")),
            ((v) => {
                // let date = new Date(v["거래일자"]);
                // let year = ("0" + date.getFullYear()).slice(-2);
                // let month = ("0" + (date.getMonth() + 1)).slice(-2);
                // let day = ("0" + (date.getDate() + 1)).slice(-2);
                // date = `${year}-${month}-${day}`;
                let res = `
                아파트: ${v['법정동']} ${v['아파트']}<br/>
                전용면적: ${v['전용면적']}m² (${v['층']}층)<br/>
                거래액: ${v["거래금액"]}만원`;
                return res;
            })(v)
            ]);
            data.sort((a, b) => a[0] - b[0]);
            // data = [[0, 1], [2, 2], [4, 5], [6, 7], [8, 3], [10, 7]];
        } else return;

        let padding = { top: 20, right: 60, bottom: 60, left: 80 };
        let pGap = 10;

        // let xScale = d3.scaleLinear()
        let xScale = d3.scaleTime().domain([
            d3.min(data, d => d[0]), d3.max(data, d => d[0])
        ]).range([padding.left, that.width - padding.right]);

        let yScale = d3.scaleLinear().domain([
            d3.min(data, d => d[1]), d3.max(data, d => d[1])
        ]).range([that.height - padding.bottom, padding.top]);

        let type = that.state.type;
        if (type == 1 || type == 2) {
            // line plot
            let line = d3.line()
                .x(d => xScale(d[0]))
                .y(d => yScale(d[1]));
            // .curve(d3.curveMonotoneX);
            that.svg.append("path").datum(data).attr("d", line);
        }

        if (type == 0 || type == 2) {
            // scatter plot
            that.svg.selectAll('circle').data(data).enter().append('circle')
                .attr('cx', d => xScale(d[0]))
                .attr('cy', d => yScale(d[1]))
                .attr('r', 5)
                .on("mouseover", d => $("#item-info").show())
                .on("mouseout", d => $("#item-info").hide())
                .on("mousemove", function (d) {
                    $("#item-info").css({
                        top: function () {
                            let top;
                            let dpx = 10;
                            if (event.offsetY < that.height / 2) top = event.offsetY + dpx + 'px';
                            else top = event.offsetY - $(this).height() - dpx + 'px'; // clientY
                            return top;
                        },
                        left: function () {
                            let left;
                            let dpx = 10;
                            if (event.offsetX < that.width / 2) left = event.offsetX + dpx + 'px';
                            else left = event.offsetX - $(this).width() - dpx + 'px'; // clientX
                            return left;
                        }
                    }).html(d[2]);
                });
            // .append("title").text(d => d[1]);

            // that.svg.selectAll('text').data(data).enter().append('text').text(d => d[1])
            //     .attr('x', d => xScale(d[0]))
            //     .attr('y', d => yScale(d[1]));
        }

        // axis
        let xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat("%Y-%m-%d"));
        let yAxis = d3.axisLeft(yScale).ticks(5); // .tickValues([0, 2, 4, 6, 8]);

        that.svg.append('g').attr('transform', `translate(0,${that.height - padding.bottom + pGap})`).call(xAxis);
        // .selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");
        that.svg.append('g').attr('transform', `translate(${padding.left - pGap},0)`).call(yAxis);

        that.svg.append('text').attr('text-anchor', 'middle')
            .attr('x', that.width / 2).attr('y', that.height - 10).text('거래일자');
        that.svg.append('text').attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .attr('x', -that.height / 2).attr('y', 20).text('거래금액');

        function reset() {
            if (that.svg) that.svg.remove();
        }
    } // end of showPlot
}