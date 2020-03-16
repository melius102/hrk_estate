import * as types from './action-types';
import { getList, nullCode } from '../lib/util';

const clog = console.log;

export const updateMapcode = (mapCode, regCode, depth, LAWD_CD) => {
    return {
        type: types.UPDATE_MAPCODE,
        mapCode, regCode, depth, LAWD_CD
    };
}

export const updateOptions = (districtOptions, villageOptions) => {
    return {
        type: types.UPDATE_OPTIONS,
        districtOptions, villageOptions
    }
};

// https://velopert.com/3401
export const provinceSelected = (selectedCode) => (dispatch, getState) => {
    getList(2, selectedCode).then(data => {
        dispatch(updateMapcode(selectedCode, nullCode, 1, null));
        dispatch(updateOptions(data, null));
    });
}

export const districtSelected = (selectedCode) => (dispatch, getState) => {

    let { districtOptions } = getState();
    getList(3, selectedCode).then(data => {
        let res = data.filter(v => v[0].slice(0, 5) !== selectedCode.slice(0, 5));
        let moreDetail = res.length != 0;
        if (moreDetail) {
            dispatch(updateMapcode(selectedCode, nullCode, 2, null));
        }
        else {
            dispatch(updateMapcode(selectedCode.slice(0, 2) + '0'.repeat(8), selectedCode, 3, selectedCode.slice(0, 5)));
        }
        dispatch(updateOptions(districtOptions, data));
    });
}

export const updateDate = (DEAL_YMD) => {
    return {
        type: types.UPDATE_DATE,
        DEAL_YMD
    };
}

export const pageChange = (pageNo) => {
    return {
        type: types.PAGE_CHANGE,
        pageNo
    };
};

export const updateItemList = (itemListData) => ({
    type: types.UPDATE_ITEM_LIST,
    itemListData
});

// https://velopert.com/3401
export const updateMapcodeAsync = (mapCode, regCode, depth) => (dispatch, getState) => {
    clog('getState', getState());
    setTimeout(
        () => { dispatch(updateMapcode(mapCode, regCode, depth)) },
        2000
    );
}
