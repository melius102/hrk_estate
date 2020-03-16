import React from 'react';
import { nullCode } from '../lib/util';

const clog = console.log;

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
export default class RegionSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            districtDisplay: "initial", villageDisplay: "initial",
        };
    }

    static getDerivedStateFromProps(props, state) {
        let newState = {}
        newState.districtDisplay = state.districtDisplay;
        newState.villageDisplay = state.villageDisplay;

        if (props.districtOptions) newState.districtDisplay = "initial";
        else newState.districtDisplay = "none";

        if (props.villageOptions) newState.villageDisplay = "initial";
        else newState.villageDisplay = "none";

        return newState;
    }

    hSelected(evt, seq) {
        this.props.dpOptionSelected(evt.target.value, seq);
    }

    render() {
        return (
            <React.Fragment>
                <SelectArea value={this.props.provinceCode} options={this.props.provinceOptions}
                    onSelected={(evt) => { this.hSelected(evt, 'seq2'); }} />
                <SelectArea value={this.props.districtCode} options={this.props.districtOptions}
                    onSelected={(evt) => { this.hSelected(evt, 'seq4'); }} display={this.state.districtDisplay} />
                <SelectArea value={this.props.villageCode} options={this.props.villageOptions}
                    onSelected={(evt) => { this.hSelected(evt, 'seq6'); }} display={this.state.villageDisplay} />
            </React.Fragment>
        );
    }
}

class SelectArea extends React.Component {
    render() {
        let optionTags = [];
        optionTags.push(<option key={0} value={nullCode}>선택</option>);
        if (this.props.options) {
            this.props.options.forEach((v, i) => {
                optionTags.push(<option key={i + 1} value={v[0]}>{v[v.length - 1]}</option>);
            });
        }
        return (
            <select style={{ display: this.props.display }} value={this.props.value}
                onChange={this.props.onSelected}>{optionTags}</select>
        );
    }
}
