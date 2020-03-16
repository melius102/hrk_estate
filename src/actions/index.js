import * as types from './action-types';
import { getList, nullCode } from '../lib/util';

const clog = console.log;

// https://velopert.com/3401
export const interfaceIntegrate = ({ mapCode, regCode, final }, { selectedCode, seq }) => (dispatch, getState) => {
    let sequence = null;
    let seqCode = null;
    if (mapCode) { // map interface

        const regex0 = /0{10}/; // initCode
        const regex1 = /[1-9]{2}0{8}/; // province
        const regex2 = /[1-9]{2}[0-9]{2}0{6}/; // district
        const regex3 = /[1-9]{2}[0-9]{3}0{5}/; // village

        if (regCode) {
            seqCode = regCode;
            if (regex1.test(seqCode)) sequence = 'seq1'; // 1 province select
            else if (regex2.test(seqCode)) {
                if (final) sequence = 'seq4'; // 4 district select final
                else sequence = 'seq3'; // 3 district select
            }
            else if (regex3.test(seqCode)) sequence = 'seq6'; // 6 village select final
        } else {
            seqCode = mapCode;
            if (regex0.test(seqCode)) sequence = 'seq0'; // 0 init show map
            else if (regex1.test(seqCode)) sequence = 'seq2'; // 2 province show map
            else if (regex2.test(seqCode)) sequence = 'seq5'; // 5 district show map
        }
    } else { // select interface
        if (seq == 'seq2' || seq == 'seq4' || seq == 'seq6') {
            if (selectedCode) {
                seqCode = selectedCode;
                sequence = seq;
            } else { // selection cancel
                if (seq == 'seq2') sequence = 'can2';
                else if (seq == 'seq4') sequence = 'can4';
                else if (seq == 'seq6') sequence = 'can6';
            }
        }
    }

    // selection sequence
    let { districtOptions, villageOptions } = getState();
    if (sequence == 'seq0') {
        dispatch(updateMapcode(mapCode, nullCode, 'seq0', null));
        dispatch(updateOptions(null, null));
    } else if (sequence == 'seq1' || sequence == 'seq3') {
        dispatch(updateMapcode(mapCode, regCode, 'seq1', null));
    } else if (sequence == 'seq2') {
        getList(2, seqCode).then(data => {
            dispatch(updateMapcode(seqCode, nullCode, 'seq2', null));
            dispatch(updateOptions(data, null));
        });
    } else if (sequence == 'seq4' || sequence == 'seq5') {
        getList(3, seqCode).then(data => {
            let res = data.filter(v => v[0].slice(0, 5) !== seqCode.slice(0, 5));
            let moreDetail = res.length != 0;
            if (!moreDetail) { // final
                dispatch(updateMapcode(seqCode.slice(0, 2) + '0'.repeat(8), seqCode, 'seq4', seqCode.slice(0, 5)));
                dispatch(updateOptions(districtOptions, null));
            }
            else {
                dispatch(updateMapcode(seqCode, nullCode, 'seq5', null));
                dispatch(updateOptions(districtOptions, data));
            }
        });
    } else if (sequence == 'seq6') { // final
        dispatch(updateMapcode(seqCode.slice(0, 4) + '0'.repeat(6), seqCode, 'seq6', seqCode.slice(0, 5)));
    }

    // selection cancel
    if (sequence == 'can2') {
        dispatch(updateMapcode(null, null, 'can2', null));
        dispatch(updateOptions(null, null));
    } else if (sequence == 'can4') {
        dispatch(updateMapcode(null, null, 'can4', null));
        dispatch(updateOptions(districtOptions, null));
    } else if (sequence == 'can6') {
        dispatch(updateMapcode(null, null, 'can6', null));
        dispatch(updateOptions(districtOptions, villageOptions));
    }
}

export const updateMapcode = (mapCode, regCode, sequ, LAWD_CD) => {
    return {
        type: types.UPDATE_MAPCODE,
        mapCode, regCode, sequ, LAWD_CD
    };
}

export const updateOptions = (districtOptions, villageOptions) => {
    return {
        type: types.UPDATE_OPTIONS,
        districtOptions, villageOptions
    }
};

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