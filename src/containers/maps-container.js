import Maps from '../components/maps';
import * as actions from '../actions';
import { connect } from 'react-redux';

const clog = console.log;

const mapStateToProps = (state) => {
    clog('mapStateToProps', state);
    return {
        mapCode: state.mapCode,
        regCode: state.regCode
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    clog('mapDispatchToProps', ownProps);
    return {
        dpSelectRegion: (mapCode, regCode) => dispatch(actions.selectRegion(mapCode, regCode))
    };
}

const MapsContainer = connect(
    mapStateToProps, mapDispatchToProps
)(Maps);

export default MapsContainer;