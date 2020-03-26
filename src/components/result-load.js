import React from 'react';
import { rdev, clog, allItemHide } from '../lib/util';

export default class ResultLoad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayClear: "none",
            displaySearch: "none",
            displayFilter: "none"
        };

        this.hClickSearch = this.hClickSearch.bind(this);
        this.hClickFilter = this.hClickFilter.bind(this);
        this.hClickClear = this.hClickClear.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        let newState = { ...state };
        if (props.readyFetch) {
            newState.displaySearch = 'initial';
            newState.displayFilter = 'initial';
        } else {
            newState.displaySearch = 'none';
            newState.displayFilter = 'none';
        }
        return newState;
    }

    // componentDidMount() { }
    // www.code.go.kr
    hClickSearch(evt) {
        clog('hClickSearch');
        allItemHide();
        if (!this.props.LAWD_CD || !this.props.DEALYMD1 || !this.props.DEALYMD2) return;
        let { LAWD_CD, DEALYMD1, DEALYMD2, numOfRows } = this.props;
        // fetch(`/redata/data/${LAWD_CD}/${DEALYMD1}/${DEALYMD2}/${pageNo}/${numOfRows}`, {})
        fetch(`/redata/data/${LAWD_CD}/${DEALYMD1}/${DEALYMD2}/1/all`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filters: this.props.filters })
        }).then((response) => {
            // clog(response); // header
            return response.json();
        }).then((jsonBody) => {
            // let jsonBody = JSON.parse(data);
            this.props.dpUpdateItemList(jsonBody);
        });
    }

    hClickFilter(evt) {
        clog('hClickFilter');
        $('#filter-wrap').slideToggle();
    }

    hClickClear(evt) {
        clog('hClickClear');
        this.props.dpUpdateItemList(null);
    }

    render() {
        return (
            <div id="control-btns">
                <button id="search-btn" style={{ display: this.state.displaySearch }} onClick={this.hClickSearch}>검색</button>
                <button id="filter-btn" style={{ display: this.state.displayFilter }} onClick={this.hClickFilter}>필터</button>
                <button id="clear-btn" style={{ display: this.state.displayClear }} onClick={this.hClickClear}>지우기</button>
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // if (!this.props.readyFetch) $('#filter-wrap').hide();
    }

    componentDidMount() {
        if (rdev) {
            // setTimeout(() => $('#search-btn').trigger('click'), 500);
        }
    }
}