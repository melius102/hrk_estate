import * as types from './ActionTypes';

export const selectRegion = (mapCode, regCode) => ({
    type: types.SELREGION,
    mapCode, regCode
});

export const showItems = (items) => ({
    type: types.SHOWITEMS,
    items
});
