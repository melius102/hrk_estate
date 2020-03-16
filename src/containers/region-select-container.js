import RegionSelect from '../components/region-select';
import * as actions from '../actions';
import { connect } from 'react-redux';

const clog = console.log;

const mapStateToProps = (state, ownProps) => {
    clog('mapStateToProps', ownProps);
    return {
        province: ownProps.province,
        provinceCode: state.provinceCode,
        districtCode: state.districtCode,
        villageCode: state.villageCode,

        LAWD_CD: state.LAWD_CD,
        DEAL_YMD: state.DEAL_YMD
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    clog('mapDispatchToProps', ownProps);
    return {
        // dpUpdateItemList: (itemListData) => {
        //     clog('dpUpdateItemList');
        //     return dispatch(actions.updateItemList(itemListData));
        // },
        dpUpdateMapcode: (mapCode, regCode, depth, LAWD_CD) => {
            clog('dpUpdateMapcode');
            return dispatch(actions.updateMapcode(mapCode, regCode, depth, LAWD_CD));
        }
    };
}

const RegionSelectContainer = connect(
    mapStateToProps, mapDispatchToProps
)(RegionSelect);

export default RegionSelectContainer;