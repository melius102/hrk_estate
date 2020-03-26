import React from 'react';
import Item from './item';
import { clog } from '../lib/util';

export default class ItemList extends React.Component {
    render() {
        let itemList = [];
        let jsonBody = this.props.itemListData;
        if (jsonBody) {
            let body = jsonBody;
            let { totalCount } = body;
            let numOfRows = this.props.numOfRows;
            let pageNo = this.props.pageNo;
            let itemData = body.items.item;
            // if (numOfRows == 'all') numOfRows = totalCount;
            let totalPage = Math.ceil(totalCount / numOfRows);
            clog("jsonBody", jsonBody);
            clog("numOfRows", numOfRows);
            clog("pageNo", pageNo);
            clog("totalCount", totalCount);
            clog("totalPage", totalPage);
            if (itemData instanceof Array) {
                // itemData.forEach((v, i) => { });
                for (let i = (pageNo - 1) * numOfRows; i < pageNo * numOfRows; i++) {
                    if (i >= itemData.length) break;
                    itemList.push(<Item key={i} index={i + 1} data={itemData[i]} />);
                }
            }
        }
        return (
            <div id="item-list">
                {itemList}
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.props.readyFetch && this.props.itemListData) {
            this.props.dpUpdateItemList(null);
        }
    }
}

ItemList.defaultProps = {
    itemListData: null
}
