import Maps from '../components/maps';
import * as actions from '../actions';
import { connect } from 'react-redux';

const clog = console.log;

const mapStateToProps = (state) => {
    clog('mapcontainer mapStateToProps', state);
    return {
        mapCode: state.mapCode,
        regCode: state.regCode
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    clog('mapcontainer mapDispatchToProps', ownProps);
    return {
        // dpUpdateMapcode: (mapCode, regCode, depth) => {
        //     clog('dpUpdateMapcode');
        //     return dispatch(actions.updateMapcode(mapCode, regCode, depth));
        // }
        dpUpdateMapcode: (mapCode, regCode, depth) => {
            clog('dpUpdateMapcode');
            return dispatch(actions.updateMapcodeAsync(mapCode, regCode, depth));
        }
    };
}

const MapsContainer = connect(
    mapStateToProps, mapDispatchToProps
)(Maps);

export default MapsContainer;