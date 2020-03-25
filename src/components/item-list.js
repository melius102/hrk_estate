import React from 'react';
import Item from './item';
import { clog } from '../lib/util';

export default class ItemList extends React.Component {
    render() {
        let itemList = [];
        let jsonBody = this.props.itemListData;
        if (jsonBody) {
            let body = jsonBody;
            let { numOfRows, pageNo, totalCount } = body;
            let itemData = body.items.item;
            let totalPage = Math.ceil(totalCount / numOfRows);
            clog("jsonBody", jsonBody);
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.props.readyFetch && this.props.itemListData) {
            this.props.dpUpdateItemList(null);
        }
    }
}

ItemList.defaultProps = {
    itemListData: null
}
