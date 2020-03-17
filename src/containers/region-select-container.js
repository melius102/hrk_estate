import RegionSelect from '../components/region-select';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { clog } from '../lib/util';

const mapStateToProps = (state, ownProps) => {
    return {
        provinceCode: state.provinceCode,
        districtCode: state.districtCode,
        villageCode: state.villageCode,

        provinceOptions: ownProps.provinceOptions,
        districtOptions: state.districtOptions,
        villageOptions: state.villageOptions,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    clog('mapDispatchToProps', ownProps);
    return {
        dpOptionSelected: (selectedCode, seq) => {
            return dispatch(actions.interfaceIntegrate({}, { selectedCode, seq }));
        }
    };
}

const RegionSelectContainer = connect(
    mapStateToProps, mapDispatchToProps
)(RegionSelect);

export default RegionSelectContainer;