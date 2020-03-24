import React from 'react';
import FilterItem from './filter-item';
import { clog } from '../lib/util';

export default class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            radioValue: "v-name",
            display0: "initial",
            display1: "none",
            pholder: "예) 서초동"
        };
        this.hChange = this.hChange.bind(this);
        this.hRemove = this.hRemove.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        let newState = { ...state };
        if (state.radioValue == 'v-name' || state.radioValue == 'apt') {
            newState.display0 = 'initial';
            newState.display1 = 'none';
            newState.pholder = '예) 서초동';
            if (state.radioValue == 'apt') newState.pholder = '예) 푸르지오';
        } else {
            newState.display0 = 'none';
            newState.display1 = 'initial';
        }
        return newState;
    }

    hChange(evt) {
        let radioValue = evt.currentTarget.value
        this.setState({ radioValue });
    }

    hAdd() {
        let filters = [...this.props.filters];
        let value;
        if (this.state.radioValue == "v-name" || this.state.radioValue == "apt") {
            value = $("#filter-sel0>input").val();
            if (value.trim() == '') return;
            $("#filter-sel0>input").val('');
        } else {
            let value0 = $("#filter-sel1>input")[0].value;
            let value1 = $("#filter-sel1>input")[1].value;
            if (value0.trim() == '' || value1.trim() == '') return;
            value = `${value0} ~ ${value1}`;
            $("#filter-sel1>input").val('');
        }
        let item = { type: this.state.radioValue, value };
        let fiterItems = this.props.filters.map(v => JSON.stringify(v));
        if (fiterItems.includes(JSON.stringify(item))) return;
        filters.push(item);
        this.props.updateFilters(filters);
    }

    hRemove(item) {
        let filters = this.props.filters.filter(v => JSON.stringify(v) != item);
        this.props.updateFilters(filters);
    }

    render() {
        let filters = [];
        this.props.filters.forEach((v, i) => {
            filters.push(<FilterItem key={i} item={v} onRemove={this.hRemove} />);
        });

        return (
            <div id="filter-wrap">
                <div id="filter-radios">
                    <div className="radio-set">
                        <input type="radio" id="v-name" name="ftype" checked={"v-name" == this.state.radioValue}
                            value={"v-name"} onChange={this.hChange} />
                        <label htmlFor="v-name">법정동, 도로명</label>
                    </div>
                    <div className="radio-set">
                        <input type="radio" id="apt" name="ftype" checked={"apt" == this.state.radioValue}
                            value={"apt"} onChange={this.hChange} />
                        <label htmlFor="apt">아파트명</label>
                    </div>
                    <div className="radio-set">
                        <input type="radio" id="area" name="ftype" checked={"area" == this.state.radioValue}
                            value={"area"} onChange={this.hChange} />
                        <label htmlFor="area">전용면적(m²)</label>
                    </div>
                    <div className="radio-set">
                        <input type="radio" id="amount" name="ftype" checked={"amount" == this.state.radioValue}
                            value={"amount"} onChange={this.hChange} />
                        <label htmlFor="amount">거래금액(만원)</label>
                    </div>
                </div>
                <div id="filter-select">
                    <div id="filter-sel0" style={{ display: this.state.display0 }}>
                        <input type="text" placeholder={this.state.pholder} />
                    </div>
                    <div id="filter-sel1" style={{ display: this.state.display1 }}>
                        <input type="number" />
                        <span>~</span>
                        <input type="number" />
                    </div>
                    <button onClick={() => { this.hAdd() }}>추가</button>
                    <button onClick={() => { this.props.updateFilters([]); }}>초기화</button>
                </div>
                <div id="filter-box">
                    {filters}
                </div>
            </div>
        );
    }
    componentDidMount() { }
}
