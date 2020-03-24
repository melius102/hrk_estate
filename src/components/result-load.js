import React from 'react';
import { rdev, clog, allItemHide } from '../lib/util';

export default class ResultLoad extends React.Component {
    constructor(props) {
        super(props);
        this.hClickSearch = this.hClickSearch.bind(this);
        this.hClickFilter = this.hClickFilter.bind(this);
        this.hClickClear = this.hClickClear.bind(this);
    }

    // componentDidMount() { }
    // www.code.go.kr
    hClickSearch(evt) {
        clog('hClickSearch');
        allItemHide();
        if (!this.props.LAWD_CD || !this.props.DEALYMD1 || !this.props.DEALYMD2) return;
        let { LAWD_CD, DEALYMD1, DEALYMD2, numOfRows } = this.props;
        let pageNo = 1;
        fetch(`/redata/data/${LAWD_CD}/${DEALYMD1}/${DEALYMD2}/${pageNo}/${numOfRows}`, {
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
                <button id="search-btn" onClick={this.hClickSearch}>검색</button>
                <button id="filter-btn" onClick={this.hClickFilter}>필터</button>
                <button id="clear-btn" onClick={this.hClickClear}>지우기</button>
            </div>
        );
    }

    componentDidMount() {
        if (rdev) {
            // setTimeout(() => $('#search-btn').trigger('click'), 500);
        }
    }
}