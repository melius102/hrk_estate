import React from 'react';

import { getList } from '../lib/util';
import Item from './item';

const clog = console.log;

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
export default class RegionSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Area
            // selected value
            provinceValue: "", districtValue: "", villageValue: "",
            districtDisplay: "none", villageDisplay: "none",
            // options list
            district: null, village: null, LAWD_CD: null,

            // Date
            DEAL_YMD: null,

            // Result
            pageNo: 1, numOfRows: 10, pageNoDisplay: "none",
            totalCount: 1, totalPage: 1, jsonData: null
        };
        this.hProvinceSelected = this.hProvinceSelected.bind(this);
        this.hDistrictSelected = this.hDistrictSelected.bind(this);
        this.hVillageSelected = this.hVillageSelected.bind(this);
        this.hMonthChange = this.hMonthChange.bind(this);
        this.hClickLoad = this.hClickLoad.bind(this);
        this.hClickClear = this.hClickClear.bind(this);
        this.hPageChange = this.hPageChange.bind(this);
    }

    hProvinceSelected(evt) {
        clog('hProvinceSelected', evt.target.value);
        let value = evt.target.value;
        if (value) {
            getList(2, value).then(data => {
                clog(data);
                this.setState({
                    // Area
                    // selected value
                    provinceValue: value, districtValue: "", villageValue: "",
                    districtDisplay: "initial", villageDisplay: "none",
                    // options list
                    district: data, village: null, LAWD_CD: null,

                    // Result
                    pageNo: 1, pageNoDisplay: "none",
                    totalCount: 1, totalPage: 1, jsonData: null
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
                    this.setState({
                        // Area
                        // selected value
                        districtValue: value, villageValue: "",
                        villageDisplay: "initial",
                        // options list
                        village: data, LAWD_CD: null,

                        // Result
                        pageNo: 1, pageNoDisplay: "none",
                        totalCount: 1, totalPage: 1, jsonData: null
                    });
                }
                else {
                    this.setState({
                        // Area
                        // selected value
                        districtValue: value, villageValue: "",
                        villageDisplay: "none",
                        // options list
                        village: data, LAWD_CD: value.slice(0, 5),

                        // Result
                        pageNo: 1, pageNoDisplay: "none",
                        totalCount: 1, totalPage: 1, jsonData: null
                    });
                }
            });
        }
    }

    hVillageSelected(evt) {
        clog('hVillageSelected', evt.target.value);
        let value = evt.target.value;
        if (value) {
            this.setState({
                // Area
                // selected value
                villageValue: value,
                // options list
                LAWD_CD: value.slice(0, 5),

                // Result
                pageNo: 1, pageNoDisplay: "none",
                totalCount: 1, totalPage: 1, jsonData: null
            });
        }
    }

    hMonthChange(evt) {
        clog("hMonthChange");
        let date = new Date(evt.target.value);
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        this.setState({
            // Date
            DEAL_YMD: date.getFullYear() + month,

            // Result
            pageNo: 1, pageNoDisplay: "none",
            totalCount: 1, totalPage: 1, jsonData: null
        });
    }

    // componentDidMount() { }
    // www.code.go.kr
    hClickLoad(evt) {
        clog('hClickLoad');
        if (!this.state.LAWD_CD || !this.state.DEAL_YMD) return;
        let LAWD_CD = this.state.LAWD_CD;
        let DEAL_YMD = this.state.DEAL_YMD;
        fetch(`/data/${LAWD_CD}/${DEAL_YMD}/${this.state.pageNo}/${this.state.numOfRows}`).then((response) => {
            // clog(response); // header
            return response.json();
        }).then((data) => {
            let jsonData = JSON.parse(data);
            let totalCount = jsonData.response.body.totalCount;
            let totalPage = Math.ceil(totalCount / this.state.numOfRows);
            clog("numOfRows", jsonData.response.body.numOfRows);
            clog("pageNo", jsonData.response.body.pageNo);
            clog("totalCount", jsonData.response.body.totalCount);
            clog("totalPage", totalPage);
            this.setState({ pageNoDisplay: "initial", totalCount, totalPage, jsonData });
        });
    }

    hClickClear(evt) {
        clog('hClickClear');
        this.setState({ jsonData: null });
    }

    hPageChange(evt) {
        clog('hPageChange', evt.target.value);
        this.setState({ pageNo: evt.target.value });
    }

    render() {
        clog("render");
        let items = [];
        if (this.state.jsonData) {
            let itemData = this.state.jsonData.response.body.items.item;
            if (itemData instanceof Array) {
                itemData.forEach((v, i) => items.push(<Item key={i} data={v} />));
            }
        }
        clog('items.length', items.length);

        // if (this.state.district)
        return (
            <React.Fragment>
                <SelectArea value={this.state.provinceValue} options={this.props.province}
                    onSelected={this.hProvinceSelected} />
                <SelectArea value={this.state.districtValue} options={this.state.district}
                    onSelected={this.hDistrictSelected} display={this.state.districtDisplay} />
                <SelectArea value={this.state.villageValue} options={this.state.village}
                    onSelected={this.hVillageSelected} display={this.state.villageDisplay} />
                <input type="month" onChange={this.hMonthChange} />
                <input style={{ display: this.state.pageNoDisplay }} type="number" min="1"
                    max={this.state.totalPage} value={this.state.pageNo} onChange={this.hPageChange} />
                <button onClick={this.hClickLoad}>Load</button>
                <button onClick={this.hClickClear}>Clear</button>
                {items}
            </React.Fragment>
        );
    }
}

class SelectArea extends React.Component {
    render() {
        let optionTags = [];
        optionTags.push(<option key={0} value={""}>선택</option>);
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
