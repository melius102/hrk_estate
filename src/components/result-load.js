import React from 'react';

const clog = console.log;

export default class ResultLoad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNoDisplay: "initial",
            totalCount: 1,
            totalPage: 1
        }
        this.hClickLoad = this.hClickLoad.bind(this);
        this.hClickClear = this.hClickClear.bind(this);
        this.hPageChange = this.hPageChange.bind(this);
    }

    // componentDidMount() { }
    // www.code.go.kr
    hClickLoad(evt) {
        clog('hClickLoad');
        if (!this.props.LAWD_CD || !this.props.DEAL_YMD) return;
        let { LAWD_CD, DEAL_YMD, pageNo, numOfRows } = this.props;
        fetch(`/data/${LAWD_CD}/${DEAL_YMD}/${pageNo}/${numOfRows}`).then((response) => {
            // clog(response); // header
            return response.json();
        }).then((data) => {
            let jsonData = JSON.parse(data);
            let totalCount = jsonData.response.body.totalCount;
            let totalPage = Math.ceil(totalCount / numOfRows);
            clog("numOfRows", jsonData.response.body.numOfRows);
            clog("pageNo", jsonData.response.body.pageNo);
            clog("totalCount", jsonData.response.body.totalCount);
            clog("totalPage", totalPage);
            this.props.dpUpdateItemList(jsonData);
            this.setState({ pageNoDisplay: "initial", totalCount, totalPage });
        });
    }

    hClickClear(evt) {
        clog('hClickClear');
        this.props.dpUpdateItemList(null);
    }

    hPageChange(evt) {
        clog('hPageChange', evt.target.value);
        this.props.dpPageChange(evt.target.value); // pageNo 
        // this.setState({ pageNo: evt.target.value });
    }

    render() {
        return (
            <React.Fragment>
                <input style={{ display: this.state.pageNoDisplay }} type="number" min="1"
                    max={this.state.totalPage} value={this.props.pageNo} onChange={this.hPageChange} />
                <button onClick={this.hClickLoad}>Load</button>
                <button onClick={this.hClickClear}>Clear</button>
            </React.Fragment>
        );
    }
}