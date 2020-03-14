import * as types from '../actions/action-types';

const initialState = {
    mapCode: null,
    regCode: null,
    items: null
};

function regionSelector(state = initialState, action) {
    switch (action.type) {
        case types.SELREGION:
            return {
                mapCode: action.mapCode,
                regCode: action.regCode
            };
        case types.SHOWITEMS:
            return {
                items: action.items
            };
        default:
            return state;
    }
}

export default regionSelector;