async function getList(depth, code) {
    if (!depth || !code) return;
    let response = await fetch(`/getlist/${depth}/${code}`);
    let data = await response.json();
    return data;
}

const nullCode = '0000000000';

export { getList, nullCode };