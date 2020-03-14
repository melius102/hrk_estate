import RegionSelect from '../components/region-select';
import * as actions from '../actions';
import { connect } from 'react-redux';

const clog = console.log;

const mapStateToProps = (state, ownProps) => {
    clog('mapStateToProps', ownProps);
    return {
        province: ownProps.province
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    clog('mapDispatchToProps', ownProps);
    return {
        dpShowItems: (itemListData) => dispatch(actions.showItems(itemListData))
    };
}

const RegionSelectContainer = connect(
    mapStateToProps, mapDispatchToProps
)(RegionSelect);

export default RegionSelectContainer;