import Pagination from '../components/pagination';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { rdev, clog } from '../lib/util';

const mapStateToProps = (state, ownProps) => {
    return {
        LAWD_CD: state.LAWD_CD,
        DEAL_YMD: state.DEAL_YMD,
        pageNo: state.pageNo,
        numOfRows: state.numOfRows,
        totalCount: state.totalCount
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

const PaginationContainer = connect(
    mapStateToProps, mapDispatchToProps
)(Pagination);

export default PaginationContainer;