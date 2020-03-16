import * as types from '../actions/action-types';
import { initCode, nullCode } from '../lib/util';

const clog = console.log;

const initialState = {
    // region select
    provinceCode: nullCode,
    districtCode: nullCode,
    villageCode: nullCode,

    districtOptions: null,
    villageOptions: null,

    // date select
    LAWD_CD: null,
    DEAL_YMD: null,

    // result load
    pageNo: 1,
    numOfRows: 10,
    totalCount: 1,

    // map
    mapCode: initCode,
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

    newState.districtOptions = state.districtOptions;
    newState.villageOptions = state.villageOptions;

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
            clog("action.sequ", action.sequ);
            if (action.sequ == 'seq0') {
                newState.provinceCode = nullCode;
                newState.districtCode = nullCode;
                newState.villageCode = nullCode;
            } else if (action.sequ == 'seq2') {
                newState.provinceCode = action.mapCode;
                newState.districtCode = nullCode;
                newState.villageCode = nullCode;
            } else if (action.sequ == 'seq4') { // final
                newState.provinceCode = action.mapCode;
                newState.districtCode = action.regCode;
                newState.villageCode = nullCode;
            } else if (action.sequ == 'seq5') { // more detail
                newState.districtCode = action.mapCode;
                newState.villageCode = nullCode;
            } else if (action.sequ == 'seq6') { // final
                newState.districtCode = action.mapCode;
                newState.villageCode = action.regCode;
            }

            if (/seq\d{1}/.test(action.sequ)) {
                newState.mapCode = action.mapCode;
                newState.regCode = action.regCode;
            }

            // cancel
            if (action.sequ == 'can2') {
                newState.provinceCode = nullCode;
                newState.districtCode = nullCode;
                newState.mapCode = initCode;
            } else if (action.sequ == 'can4') {
                newState.districtCode = nullCode;
                newState.mapCode = newState.mapCode.slice(0, 2) + '0'.repeat(8);
            }

            if (/can\d{1}/.test(action.sequ)) {
                newState.villageCode = nullCode;
                newState.regCode = nullCode;
            }

            newState.LAWD_CD = action.LAWD_CD;
            return newState;

        case types.UPDATE_OPTIONS:
            newState.districtOptions = action.districtOptions;
            newState.villageOptions = action.villageOptions;
            return newState;

        case types.UPDATE_DATE:
            newState.DEAL_YMD = action.DEAL_YMD;
            return newState;

        case types.PAGE_CHANGE:
            newState.pageNo = action.pageNo;
            return newState;

        case types.UPDATE_ITEM_LIST:
            newState.itemListData = action.itemListData;
            return newState;

        default:
            return newState;
    }
}

export default regionSelector;