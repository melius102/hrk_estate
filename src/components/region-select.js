import React from 'react';

import { getList, nullCode } from '../lib/util';

const clog = console.log;

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
export default class RegionSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            districtDisplay: "initial", villageDisplay: "initial",
        };
        this.hProvinceSelected = this.hProvinceSelected.bind(this);
        this.hDistrictSelected = this.hDistrictSelected.bind(this);
        this.hVillageSelected = this.hVillageSelected.bind(this);
    }

    hProvinceSelected(evt) {
        clog('hProvinceSelected', evt.target.value);
        let selectedCode = evt.target.value;
        if (selectedCode) {
            this.props.dpProvinceSelected(selectedCode);
        }
    }

    hDistrictSelected(evt) {
        clog('hDistrictSelected', evt.target.value);
        let selectedCode = evt.target.value;
        if (selectedCode) {
            this.props.dpDistrictSelected(selectedCode);
        }
    }

    hVillageSelected(evt) {
        clog('hVillageSelected', evt.target.value);
        let selectedCode = evt.target.value;
        if (selectedCode) {
            this.props.dpUpdateMapcode(selectedCode.slice(0, 4) + '0'.repeat(6), selectedCode, 4, selectedCode.slice(0, 5));
        }
    }

    render() {
        return (
            <React.Fragment>
                <SelectArea value={this.props.provinceCode} options={this.props.provinceOptions}
                    onSelected={this.hProvinceSelected} />
                <SelectArea value={this.props.districtCode} options={this.props.districtOptions}
                    onSelected={this.hDistrictSelected} display={this.state.districtDisplay} />
                <SelectArea value={this.props.villageCode} options={this.props.villageOptions}
                    onSelected={this.hVillageSelected} display={this.state.villageDisplay} />
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
