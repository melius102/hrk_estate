import Filter from '../components/filter';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { clog } from '../lib/util';


const mapStateToProps = (state, ownProps) => {
    return { filters: state.filters };
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