import * as types from '../actions/action-types';

const clog = console.log;

const initialState = {
    mapCode: '0000000000',
    regCode: '0000000000',
    itemListData: null
};

function regionSelector(state = initialState, action) {
    clog('reducer', state, action);
    let newState = {};
    newState.mapCode = state.mapCode;
    newState.regCode = state.regCode;
    newState.itemListData = state.itemListData;

    switch (action.type) {
        case types.SELREGION:
            // return {
            //     mapCode: action.mapCode,
            //     regCode: action.regCode
            // };

            if (action.mapCode) newState.mapCode = action.mapCode;
            if (action.regCode) newState.regCode = action.regCode;
            return newState;
        case types.SHOWITEMS:
            // return {
            //     itemListData: action.itemListData
            // };

            newState.itemListData = action.itemListData;
            return newState;
        default:
            return newState;
    }
}

export default regionSelector;