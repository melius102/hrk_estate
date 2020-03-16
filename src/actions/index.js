import * as types from './action-types';

export const updateMapcode = (mapCode, regCode, depth, LAWD_CD) => {
    return {
        type: types.UPDATE_MAPCODE,
        mapCode, regCode, depth, LAWD_CD
    };
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
    console.log('getState', getState());
    setTimeout(
        () => { dispatch(updateMapcode(mapCode, regCode, depth)) },
        2000
    );
}
