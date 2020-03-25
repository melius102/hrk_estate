import React from 'react';
import { clog } from '../lib/util';
import '../scss/res-plot.scss';

export default class ResPlot extends React.Component {
    constructor(props) {
        super(props);
        this.svg = null;

        this.showPlot = this.showPlot.bind(this);
    }

    // static getDerivedStateFromProps(props, state) {
    //     return null;
    // }

    render() {
        return (
            <div id="res-plot"></div>
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        clog('res-plot DidUpdate');
        this.showPlot();
    }

    componentDidMount() {
        clog('res-plot DidMount');
        this.showPlot();
    }

    showPlot() {
        clog('showPlot');
        let that = this;
        that.width = $("#res-plot").width();
        that.height = $("#res-plot").height();

        that.svg = d3.select('#res-plot').append('svg')
            .attr("width", that.width)
            .attr("height", that.height);
    } // end of showPlot
}