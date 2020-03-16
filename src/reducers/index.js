import * as types from '../actions/action-types';
import { nullCode } from '../lib/util';

const clog = console.log;

const initialState = {
    // region select
    provinceCode: nullCode,
    districtCode: nullCode,
    villageCode: nullCode,

    // date select
    LAWD_CD: null,
    DEAL_YMD: null,

    // result load
    pageNo: 1,
    numOfRows: 10,
    totalCount: 1,

    // map
    mapCode: nullCode,
    regCode: nullCode,

    // item list
    itemListData: null
};

function regionSelector(state = initialState, action) {
    clog('reducer');
    clog('state', state);
    clog('action', action);
    let newState = {};

    newState.provinceCode = state.provinceCode;
    newState.districtCode = state.districtCode;
    newState.villageCode = state.villageCode;

    newState.LAWD_CD = state.LAWD_CD;
    newState.DEAL_YMD = state.DEAL_YMD;

    newState.pageNo = state.pageNo;
    newState.numOfRows = state.numOfRows;
    newState.totalCount = state.totalCount;

    newState.mapCode = state.mapCode;
    newState.regCode = state.regCode;
    newState.itemListData = state.itemListData;

    switch (action.type) {
        case types.UPDATE_MAPCODE:

            clog("action.depth", action.depth);
            if (action.depth == 1) {
                newState.provinceCode = action.mapCode;
                newState.districtCode = nullCode;
                newState.villageCode = nullCode;
            } else if (action.depth == 2) { // more detail
                newState.districtCode = action.mapCode;
                newState.villageCode = nullCode;
            } else if (action.depth == 3) {
                newState.provinceCode = action.mapCode;
                newState.districtCode = action.regCode;
                newState.villageCode = nullCode;
            } else if (action.depth == 4) {
                newState.districtCode = action.mapCode;
                newState.villageCode = action.regCode;
            }

            if (action.mapCode) newState.mapCode = action.mapCode;
            if (action.regCode) newState.regCode = action.regCode;

            newState.LAWD_CD = action.LAWD_CD;

            return newState;

        case types.UPDATE_DATE:
            if (action.DEAL_YMD) newState.DEAL_YMD = action.DEAL_YMD;
            return newState;

        case types.PAGE_CHANGE:
            newState.pageNo = action.pageNo;
            return newState;

        case types.UPDATE_ITEM_LIST:
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