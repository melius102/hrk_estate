import React from 'react';
import Item from './item';
import { clog } from '../lib/util';

export default class ItemList extends React.Component {
    render() {
        let itemList = [];
        let jsonData = this.props.itemListData;
        if (jsonData) {
            let { body } = jsonData.response;
            let { numOfRows, pageNo, totalCount } = body;
            let itemData = body.items.item;
            let totalPage = Math.ceil(totalCount / numOfRows);
            clog("jsonData", jsonData);
            clog("numOfRows", numOfRows);
            clog("pageNo", pageNo);
            clog("totalCount", totalCount);
            clog("totalPage", totalPage);
            if (itemData instanceof Array) {
                itemData.forEach((v, i) => {
                    itemList.push(<Item key={i} index={(pageNo - 1) * numOfRows + i + 1} data={v} />);
                });
            }
        }
        return (
            <div id="item-list">
                {itemList}
            </div>
        );
    }
}

ItemList.defaultProps = {
    itemListData: null
}
