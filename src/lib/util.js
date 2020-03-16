async function getList(depth, code) {
    if (!depth || !code) return;
    let response = await fetch(`/getlist/${depth}/${code}`);
    let data = await response.json();
    return data;
}

const initCode = '0000000000';
const nullCode = '';

export { getList, initCode, nullCode };