import React from 'react';
import FilterItem from './filter-item';
import { clog } from '../lib/util';

export default class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            radioVal: null,
            display0: "initial",
            display1: "none",
            pholder: "예) 서초동",
            options: [],
            OptionVal1: '',
            OptionVal2: '',
            readyFetch: 0
        };
        this.hChange = this.hChange.bind(this);
        this.hRemove = this.hRemove.bind(this);
        this.hSelected = this.hSelected.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        let newState = { ...state };
        if (state.radioVal == 'v-name' || state.radioVal == 'apt') {
            newState.display0 = 'initial';
            newState.display1 = 'none';
            newState.pholder = '예) 서초동';
            if (state.radioVal == 'apt') newState.pholder = '예) 푸르지오';
        } else if (state.radioVal == 'area' || state.radioVal == 'amount') {
            newState.display0 = 'none';
            newState.display1 = 'initial';
        }

        if (!props.readyFetch || (props.readyFetch == 1 && props.readyFetch != state.readyFetch)) {
            newState.radioVal = null;
            newState.display0 = "initial";
            newState.display1 = "none";
            newState.options = [];
            newState.OptionVal1 = '';
            newState.OptionVal2 = '';
        }
        newState.readyFetch = props.readyFetch;
        return newState;
    }

    hChange(radioVal) {
        let { LAWD_CD, DEALYMD1, DEALYMD2 } = this.props;
        if (radioVal == 'v-name' || radioVal == 'apt' || radioVal == 'area' || radioVal == 'amount') {
            fetch(`/redata/option/${radioVal}/${LAWD_CD}/${DEALYMD1}/${DEALYMD2}`, {
                method: 'GET'
            }).then((response) => {
                return response.json();
            }).then((jsonBody) => {
                let { options } = jsonBody;
                this.setState({ radioVal, options, OptionVal1: '', OptionVal2: '' });
            });
        }
        else {
            this.setState({ radioVal });
        }
    }

    hAdd() {
        let filters = [...this.props.filters];
        let value;
        // method 2 select
        if (this.state.radioVal == "v-name" || this.state.radioVal == "apt") {
            if (this.state.OptionVal1) {
                clog(this.state.OptionVal1);
                value = this.state.OptionVal1;
            }
        } else if (this.state.radioVal == 'area' || this.state.radioVal == 'amount') {
            if (this.state.OptionVal1 && this.state.OptionVal2) {
                let { OptionVal1, OptionVal2 } = this.state;
                value = `${OptionVal1} ~ ${OptionVal2}`;
            }
        }

        /*
        // method 1 input type=text
        if (this.state.radioVal == "v-name" || this.state.radioVal == "apt") {
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
        */

        if (value) {
            let item = { type: this.state.radioVal, value };
            let fiterItems = this.props.filters.map(v => JSON.stringify(v));
            if (fiterItems.includes(JSON.stringify(item))) return;
            filters.push(item);
            this.props.updateFilters(filters);
        }
    }

    hRemove(item) {
        let filters = this.props.filters.filter(v => JSON.stringify(v) != item);
        this.props.updateFilters(filters);
    }

    hSelected(evt, num) {
        if (num == 1) {
            let OptionVal1 = evt.currentTarget.value;
            this.setState({ OptionVal1 });
        }
        else if (num == 2) {
            let OptionVal2 = evt.currentTarget.value;
            this.setState({ OptionVal2 });
        }
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
                        <input type="radio" id="v-name" name="ftype" checked={"v-name" == this.state.radioVal}
                            value={"v-name"} onChange={(evt) => { this.hChange(evt.currentTarget.value) }} />
                        <label htmlFor="v-name">법정동</label>
                    </div>
                    <div className="radio-set">
                        <input type="radio" id="apt" name="ftype" checked={"apt" == this.state.radioVal}
                            value={"apt"} onChange={(evt) => { this.hChange(evt.currentTarget.value) }} />
                        <label htmlFor="apt">아파트명</label>
                    </div>
                    <div className="radio-set">
                        <input type="radio" id="area" name="ftype" checked={"area" == this.state.radioVal}
                            value={"area"} onChange={(evt) => { this.hChange(evt.currentTarget.value) }} />
                        <label htmlFor="area">전용면적(m²)</label>
                    </div>
                    <div className="radio-set">
                        <input type="radio" id="amount" name="ftype" checked={"amount" == this.state.radioVal}
                            value={"amount"} onChange={(evt) => { this.hChange(evt.currentTarget.value) }} />
                        <label htmlFor="amount">거래금액(만원)</label>
                    </div>
                </div>
                <div id="filter-select">
                    <div id="filter-sel0" style={{ display: this.state.display0 }}>
                        {/* change input tag to select tag for UX */}
                        {/* <input type="text" placeholder={this.state.pholder} /> */}
                        <SelectFilter val={this.state.OptionVal1} options={this.state.options} onSelected={evt => this.hSelected(evt, 1)} />
                    </div>
                    <div id="filter-sel1" style={{ display: this.state.display1 }}>
                        {/* <input type="number" /> */}
                        <SelectFilter val={this.state.OptionVal1} options={this.state.options} onSelected={evt => this.hSelected(evt, 1)} />
                        <span>~</span>
                        {/* <input type="number" /> */}
                        <SelectFilter val={this.state.OptionVal2} options={this.state.options} onSelected={evt => this.hSelected(evt, 2)} />
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
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.props.readyFetch) {
            $('#filter-wrap').slideUp();
        }
    }
}

class SelectFilter extends React.Component {
    render() {
        let optionTags = [];
        optionTags.push(<option key={0} value={''}>선택</option>);
        if (this.props.options) {
            this.props.options.forEach((v, i) => {
                optionTags.push(<option key={i + 1} value={v}>{v}</option>);
            });
        }
        return (
            <select value={this.props.val} onChange={this.props.onSelected}>{optionTags}</select>
        );
    }
}