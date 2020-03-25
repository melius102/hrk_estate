import * as types from '../actions/action-types';
import { initCode, nullCode, rdev, clog } from '../lib/util';

const initialState = {
    // region select
    provinceCode: nullCode,
    districtCode: nullCode,
    villageCode: nullCode,

    districtOptions: null,
    villageOptions: null,

    // date select
    LAWD_CD: null,
    DEALYMD1: '1970-01-01',
    DEALYMD2: '2070-12-30',

    // result load
    pageNo: 1,
    numOfRows: 20,
    totalCount: 1,
    readyFetch: 0,

    // map
    mapCode: initCode,
    regCode: nullCode,

    // item list
    itemListData: null,

    // filters
    filters: []
};

if (rdev) {
    // initialState.mapCode = initialState.provinceCode = "4100000000";
    // initialState.regCode = initialState.districtCode = "4159000000";
    // initialState.LAWD_CD = "41590";
    // initialState.DEALYMD1 = '1970-01-01';
    // initialState.DEALYMD2 = '2070-12-30';
    initialState.filters = [
        { type: 'v-name', value: '서초동' },
        { type: 'apt', value: '푸르지오' },
        { type: 'area', value: '1000 ~ 2000' },
        { type: 'amount', value: '1000 ~ 2000' }
    ];
}

function regionSelector(state = initialState, action) {
    clog('reducer', action);
    // clog('state', state);
    // clog('action', action);
    let newState = { ...state };

    // newState.provinceCode = state.provinceCode;
    // newState.districtCode = state.districtCode;
    // newState.villageCode = state.villageCode;

    // newState.districtOptions = state.districtOptions;
    // newState.villageOptions = state.villageOptions;

    // newState.LAWD_CD = state.LAWD_CD;
    // newState.DEALYMD1 = state.DEALYMD1;
    // newState.DEALYMD2 = state.DEALYMD2;

    // newState.pageNo = state.pageNo;
    // newState.numOfRows = state.numOfRows;
    // newState.totalCount = state.totalCount;
    // newState.readyFetch = state.readyFetch;

    // newState.mapCode = state.mapCode;
    // newState.regCode = state.regCode;

    // newState.itemListData = state.itemListData;

    // newState.filters = state.filters;

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
            break;

        case types.UPDATE_OPTIONS:
            newState.districtOptions = action.districtOptions;
            newState.villageOptions = action.villageOptions;
            break;

        case types.UPDATE_DATE:
            newState.DEALYMD1 = action.DEALYMD1;
            newState.DEALYMD2 = action.DEALYMD2;
            break;

        case types.PAGE_CHANGE:
            newState.pageNo = action.pageNo;
            break;

        case types.UPDATE_ITEM_LIST:
            newState.itemListData = action.itemListData;
            if (newState.itemListData) {
                newState.pageNo = action.itemListData.pageNo; // body.pageNo
                newState.totalCount = action.itemListData.totalCount; // body.totalCount
            } else {
                newState.pageNo = 1;
                newState.totalCount = 1;
            }
            break;

        case types.UPDATE_FILTERS:
            newState.filters = action.filters;
            break;

        default:
            break;
    }

    if (newState.LAWD_CD && newState.DEALYMD1 && newState.DEALYMD2 && newState.pageNo && newState.numOfRows) {
        let oldTarget = `${state.LAWD_CD}${state.DEALYMD1}${state.DEALYMD2}`;
        let newTarget = `${newState.LAWD_CD}${newState.DEALYMD1}${newState.DEALYMD2}`;
        if (newTarget != oldTarget) {
            newState.readyFetch = 1; // 0
            newState.filters = [];
        } else newState.readyFetch = 2;
    } else {
        newState.readyFetch = 0;
        newState.filters = [];
    }
    return newState;
}

export default regionSelector;