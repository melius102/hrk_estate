import React from 'react';
import { rdev, clog, allItemHide } from '../lib/util';

export default class ResultLoad extends React.Component {
    constructor(props) {
        super(props);
        this.hClickLoad = this.hClickLoad.bind(this);
        this.hClickClear = this.hClickClear.bind(this);
    }

    // componentDidMount() { }
    // www.code.go.kr
    hClickLoad(evt) {
        clog('hClickLoad');
        allItemHide();
        if (!this.props.LAWD_CD || !this.props.DEALYMD1 || !this.props.DEALYMD2) return;
        let { LAWD_CD, DEALYMD1, DEALYMD2, numOfRows } = this.props;
        let pageNo = 1;
        fetch(`/redata/data/${LAWD_CD}/${DEALYMD1}/${DEALYMD2}/${pageNo}/${numOfRows}`).then((response) => {
            // clog(response); // header
            return response.json();
        }).then((jsonBody) => {
            // let jsonBody = JSON.parse(data);
            this.props.dpUpdateItemList(jsonBody);
        });
    }

    hClickClear(evt) {
        clog('hClickClear');
        this.props.dpUpdateItemList(null);
    }

    render() {
        return (
            <div id="control-btns">
                <button id="search-btn" onClick={this.hClickLoad}>검색</button>
                <button id="clear-btn" onClick={this.hClickClear}>지우기</button>
            </div>
        );
    }

    componentDidMount() {
        if (rdev) {
            setTimeout(() => $('#search-btn').trigger('click'), 500);
        }
    }
}