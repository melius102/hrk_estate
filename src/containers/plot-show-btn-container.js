import React from 'react';
import { rdev, clog } from '../lib/util';
import * as actions from '../actions';
import { connect } from 'react-redux';

class PlotShowBtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: "none"
        }
    }

    static getDerivedStateFromProps(props, state) {
        clog(props.totalCount);
        if (props.totalCount > 0) {
            return {
                display: "block"
            };
        } else {
            return {
                display: "none"
            };
        }
    }

    hClick() {
        $('#res-plot').slideToggle();
    }

    render() {
        return (
            <i id="plot-show-btn" className="fas fa-sticky-note"
                onClick={(evt) => { this.hClick(evt) }}
                style={{ display: this.state.display }}></i>
        );
    }
}

// PlotShowBtnContainer
export default connect(
    (state) => ({
        totalCount: state.totalCount
    }),
    (dispatch) => ({
        dpPageChange: (pageNo) => {
            return dispatch(actions.pageChange(pageNo));
        }
    })
)(PlotShowBtn);