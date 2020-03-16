import ResultLoad from '../components/result-load';
import * as actions from '../actions';
import { connect } from 'react-redux';

const clog = console.log;

const mapStateToProps = (state, ownProps) => {
    return {
        LAWD_CD: state.LAWD_CD,
        DEAL_YMD: state.DEAL_YMD,
        pageNo: state.pageNo,
        numOfRows: state.numOfRows
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dpPageChange: (pageNo) => {
            clog('dpPageChange');
            return dispatch(actions.pageChange(pageNo));
        },
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