import DateSelect from '../components/date-select';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { clog } from '../lib/util';


const mapStateToProps = (state, ownProps) => {
    return {
        DEALYMD1: state.DEALYMD1,
        DEALYMD2: state.DEALYMD2
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dpUpdateDate: (DEALYMD1, DEALYMD2) => {
            clog('dpUpdateDate');
            return dispatch(actions.updateDate(DEALYMD1, DEALYMD2));
        }
    };
}

const DateSelectContainer = connect(
    mapStateToProps, mapDispatchToProps
)(DateSelect);

export default DateSelectContainer;