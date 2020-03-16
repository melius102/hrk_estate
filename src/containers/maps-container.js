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
    clog('mapcontainer mapDispatchToProps');
    return {
        dpMapRegionSelected: (mapCode, regCode, final) => {
            return dispatch(actions.interfaceIntegrate({ mapCode, regCode, final }, {}));
        }
    };
}

const MapsContainer = connect(
    mapStateToProps, mapDispatchToProps
)(Maps);

export default MapsContainer;