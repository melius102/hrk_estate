import * as types from './action-types';

export const selectRegion = (mapCode, regCode) => ({
    type: types.SELREGION,
    mapCode, regCode
});

export const showItems = (items) => ({
    type: types.SHOWITEMS,
    items
});
