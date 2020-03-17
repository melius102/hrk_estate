async function getList(depth, code) {
    if (!depth || !code) return;
    let response = await fetch(`/getlist/${depth}/${code}`);
    let data = await response.json();
    return data;
}

const initCode = '0000000000';
const nullCode = '';
const seoulCode = '1100000000';

// Exceptional Code
const districtCodes = ['1121500000', '1130500000', '1154500000'];

const clog = console.log;
const rdev = 0;

export { getList, initCode, nullCode, seoulCode, districtCodes, rdev, clog };
