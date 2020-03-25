import Filter from '../components/filter';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { clog } from '../lib/util';


const mapStateToProps = (state, ownProps) => {
    return {
        LAWD_CD: state.LAWD_CD,
        DEALYMD1: state.DEALYMD1,
        DEALYMD2: state.DEALYMD2,
        filters: state.filters,
        readyFetch: state.readyFetch
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        updateFilters: (filters) => {
            return dispatch(actions.updateFilters(filters));
        }
    };
}

const FilterContainer = connect(
    mapStateToProps, mapDispatchToProps
)(Filter);

export default FilterContainer;