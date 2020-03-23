import ResultLoad from '../components/result-load';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { clog } from '../lib/util';

const mapStateToProps = (state, ownProps) => {
    return {
        LAWD_CD: state.LAWD_CD,
        DEALYMD1: state.DEALYMD1,
        DEALYMD2: state.DEALYMD2,
        pageNo: state.pageNo,
        numOfRows: state.numOfRows
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dpUpdateItemList: (itemListData) => {
            clog('dpUpdateItemList');
            return dispatch(actions.updateItemList(itemListData));
        }
    };
}

const ResultLoadContainer = connect(
    mapStateToProps, mapDispatchToProps
)(ResultLoad);

export default ResultLoadContainer;