import React from 'react';
import { rdev, clog, allItemHide } from '../lib/util';

export default class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNoDisplay: "none",
            totalPage: 1
        }
    }

    static getDerivedStateFromProps(props, state) {
        clog('props', props);
        // if (props.totalCount && props.numOfRows) {
        let totalPage = Math.ceil(props.totalCount / props.numOfRows);
        if (totalPage > 1) {
            return {
                pageNoDisplay: "block",
                totalPage
            };
        } else {
            return {
                pageNoDisplay: "none",
                totalPage: 1
            };
        }
    }

    // www.code.go.kr
    hPageChange(dpage) {
        allItemHide();
        if (!this.props.LAWD_CD || !this.props.DEALYMD1 || !this.props.DEALYMD2) return;
        let { LAWD_CD, DEALYMD1, DEALYMD2, pageNo, numOfRows } = this.props;
        let newPageNo = Number(pageNo) + dpage;
        if (newPageNo < 1 || newPageNo > this.state.totalPage) return;

        this.props.dpPageChange(newPageNo); // pageNo 
        this.setState({ pageNoDisplay: "block" });

        // fetch(`/redata/data/${LAWD_CD}/${DEALYMD1}/${DEALYMD2}/${newPageNo}/${numOfRows}`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ filters: this.props.filters })
        // }).then((response) => {
        //     // clog(response); // header
        //     return response.json();
        // }).then((jsonBody) => {
        //     // let jsonBody = JSON.parse(data);
        //     this.props.dpUpdateItemList(jsonBody);
        //     this.setState({ pageNoDisplay: "block" });
        // });
        // this.props.dpPageChange(pageNo); // pageNo 
    }

    render() {
        return (
            <div id='pagination' style={{ display: this.state.pageNoDisplay }}>
                <div onClick={(evt) => { this.hPageChange(-1) }}><i id="ch-left" className="fas fa-chevron-left"></i></div>
                <div> {this.props.pageNo} / {this.state.totalPage} </div>
                <div onClick={(evt) => { this.hPageChange(1) }}><i id="ch-right" className="fas fa-chevron-right"></i></div>
            </div>
        );
    }

    componentDidMount() {
        if (this.props.pageNo == 1) $("#ch-left").addClass("end");
        else $("#ch-left").removeClass("end");
        if (this.props.pageNo == this.state.totalPage) $("#ch-right").addClass("end");
        else $("#ch-right").removeClass("end");

        if (rdev) {
            // setTimeout(() => $('#search-btn').trigger('click'), 500);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.pageNo == 1) $("#ch-left").addClass("end");
        else $("#ch-left").removeClass("end");
        if (this.props.pageNo == this.state.totalPage) $("#ch-right").addClass("end");
        else $("#ch-right").removeClass("end");
    }
}