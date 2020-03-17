import DateSelect from '../components/date-select';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { clog } from '../lib/util';


const mapStateToProps = (state, ownProps) => {
    return {
        DEAL_YMD: state.DEAL_YMD
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dpUpdateDate: (DEAL_YMD) => {
            clog('dpUpdateDate');
            return dispatch(actions.updateDate(DEAL_YMD));
        }
    };
}

const DateSelectContainer = connect(
    mapStateToProps, mapDispatchToProps
)(DateSelect);

export default DateSelectContainer;