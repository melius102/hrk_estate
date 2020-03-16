import React from 'react';

import { getList, nullCode } from '../lib/util';

const clog = console.log;

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
export default class RegionSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Area
            // selected value
            districtDisplay: "none", villageDisplay: "none",
            // options list
            district: null, village: null,
        };
        this.hProvinceSelected = this.hProvinceSelected.bind(this);
        this.hDistrictSelected = this.hDistrictSelected.bind(this);
        this.hVillageSelected = this.hVillageSelected.bind(this);
    }

    hProvinceSelected(evt) {
        clog('hProvinceSelected', evt.target.value);
        let value = evt.target.value;
        if (value) {
            getList(2, value).then(data => {
                clog(data);
                this.props.dpUpdateMapcode(value, nullCode, 1, null);
                this.setState({
                    // Area
                    districtDisplay: "initial", villageDisplay: "none",
                    // options list
                    district: data, village: null,
                });
            });
        }
    }

    hDistrictSelected(evt) {
        clog('hDistrictSelected', evt.target.value);
        let value = evt.target.value;
        if (value) {
            getList(3, value).then(data => {
                clog(data);
                let res = data.filter(v => v[0].slice(0, 5) !== value.slice(0, 5));
                let moreDetail = res.length != 0;
                if (moreDetail) {
                    this.props.dpUpdateMapcode(value, nullCode, 2, null);
                    this.setState({
                        // Area
                        // selected value
                        villageDisplay: "initial",
                        // options list
                        village: data,
                    });
                }
                else {
                    this.props.dpUpdateMapcode(value.slice(0, 2) + '0'.repeat(8), value, 3, value.slice(0, 5));
                    this.setState({
                        // Area
                        // selected value
                        villageDisplay: "none",
                        // options list
                        village: data,
                    });
                }
            });
        }
    }

    hVillageSelected(evt) {
        clog('hVillageSelected', evt.target.value);
        let value = evt.target.value;
        if (value) {
            this.props.dpUpdateMapcode(value.slice(0, 4) + '0'.repeat(6), value, 4, value.slice(0, 5));
        }
    }

    render() {
        clog("render");
        // clog("this.props.villageCode", this.props.villageCode);

        // this.state.districtDisplay
        // this.state.villageDisplay
        return (
            <React.Fragment>
                <SelectArea value={this.props.provinceCode} options={this.props.province}
                    onSelected={this.hProvinceSelected} />
                <SelectArea value={this.props.districtCode} options={this.state.district}
                    onSelected={this.hDistrictSelected} display={"initial"} />
                <SelectArea value={this.props.villageCode} options={this.state.village}
                    onSelected={this.hVillageSelected} display={"initial"} />
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
