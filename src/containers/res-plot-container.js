import ResPlot from '../components/res-plot';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { clog } from '../lib/util';

const mapStateToProps = (state) => {
    return {
        itemListData: state.itemListData
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    };
};

const ResPlotContainer = connect(
    mapStateToProps // , mapDispatchToProps
)(ResPlot);

export default ResPlotContainer;