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
                {/* <div id="item-info"></div> */}
                <div id="plot-type-btn" onClick={(evt) => { this.hClick(evt); }}><i className="fas fa-sticky-note"></i></div>
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
            $('#res-plot').hide();
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
            $('#res-plot').hide();
        }
        else $('#res-plot').hide();
    }

    showPlot(items) {
        clog('showPlot');
        let that = this;
        let padding = { top: 20, right: 40, bottom: 30, left: 60 };
        let pGap = 10;
        let radius = 7;

        that.width = $("#res-plot").width();
        that.height = $("#res-plot").height();

        reset();
        that.svg = d3.select('#res-plot').append('svg')
            .attr("width", that.width)
            .attr("height", that.height);

        // add the tooltip area to the webpage
        var tooltip = d3.select('#res-plot').append("div")
            .attr("id", "item-info")
            .style("opacity", 0)

        let w = that.width - padding.right - padding.left;
        let h = that.height - padding.top - padding.bottom;

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

        // let xScale = d3.scaleLinear()
        let xScale = d3.scaleTime().domain([
            d3.min(data, d => d[0]), d3.max(data, d => d[0])
            // ]).range([padding.left, that.width - padding.right]);
        ]).range([0 + radius * 3, w - radius * 3]);

        let yScale = d3.scaleLinear().domain([
            d3.min(data, d => d[1]), d3.max(data, d => d[1])
            // ]).range([that.height - padding.bottom, padding.top]);
        ]).range([h - radius * 3, 0 + radius * 3]);

        let graph = that.svg.append('g')
            .attr('transform', `translate(${padding.left}, ${padding.top})`);

        let type = that.state.type;
        if (type == 1 || type == 2) {
            // line plot
            let line = d3.line()
                .x(d => xScale(d[0]))
                .y(d => yScale(d[1]));
            // .curve(d3.curveMonotoneX);
            graph.append("path").datum(data).attr("d", line);
        }

        if (type == 0 || type == 2) {
            // scatter plot
            graph.selectAll('circle').data(data).enter().append('circle')
                .attr('cx', d => xScale(d[0]))
                .attr('cy', d => yScale(d[1]))
                .attr('r', radius)
                .on("mouseover", d => {
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    let dpx = 5;

                    tooltip.html(d[2]).style("top", function () {
                        let top;
                        if (event.offsetY < that.height / 2) top = event.offsetY + dpx;
                        else top = event.offsetY - $(this).outerHeight() - dpx; // clientY
                        return top + 'px';
                    }).style("left", function () {
                        // clog(tooltip.node() == this);
                        let left;
                        if (event.offsetX < that.width / 2) left = event.offsetX + dpx;
                        else left = event.offsetX - $(this).outerWidth() - dpx; // clientX
                        return left + "px";
                    });

                    // .style("left", (d3.event.offsetX + 5) + "px")
                    // .style("top", (d3.event.offsetY - 28) + "px");
                })
                .on("mouseout", function (d) {
                    tooltip.transition().duration(500).style("opacity", 0);
                });

            // jQuery
            // .on("mousemove", function (d) {
            //     $("#item-info").css({
            //         top: function () {
            //             let top;
            //             let dpx = 10;
            //             if (event.offsetY < that.height / 2) top = event.offsetY + dpx + 'px';
            //             else top = event.offsetY - $(this).height() - dpx + 'px'; // clientY
            //             return top;
            //         },
            //         left: function () {
            //             let left;
            //             let dpx = 10;
            //             if (event.offsetX < that.width / 2) left = event.offsetX + dpx + 'px';
            //             else left = event.offsetX - $(this).width() - dpx + 'px'; // clientX
            //             return left;
            //         }
            //     }).html(d[2]);
            // });
            // .append("title").text(d => d[1]);

            // that.svg.selectAll('text').data(data).enter().append('text').text(d => d[1])
            //     .attr('x', d => xScale(d[0]))
            //     .attr('y', d => yScale(d[1]));
        }

        // x-axis
        let xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat("%Y-%m-%d"));
        graph.append('g').attr('transform', `translate(0,${h})`).call(xAxis)
            // .selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)")
            .append('text').attr('class', 'label').attr('text-anchor', 'end')
            .attr('x', w - 5).attr('y', -5).text('거래일자');
        //.attr('fill', 'red');

        // y-axis
        let yAxis = d3.axisLeft(yScale).ticks(5); // .tickValues([0, 2, 4, 6, 8]);
        graph.append('g').attr('transform', `translate(${0},0)`).call(yAxis)
            .append('text').attr('class', 'label').attr('text-anchor', 'end')
            .attr('transform', 'rotate(-90)')
            .attr('x', -5).attr('y', 5).attr("dy", "1em").text('거래금액(만원)');

        let fRect = that.svg.insert('rect', '*').attr('id', 'f-rect')
            .attr("width", w).attr("height", h)
            .attr("x", padding.left).attr("y", padding.top)
            .attr("fill", 'white');

        // second rect
        d3.select(fRect.node().parentNode).insert('rect', '*').attr('id', 's-rect')
            .attr("width", that.width).attr("height", that.height);

        function reset() {
            if (that.svg) that.svg.remove();
        }
    } // end of showPlot
}