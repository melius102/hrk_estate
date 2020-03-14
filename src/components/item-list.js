import React from 'react';
import Item from './item';

const clog = console.log;

export default class ItemList extends React.Component {
    render() {
        clog("ItemList");
        let items = [];
        if (this.props.itemListData) {
            let itemData = this.props.itemListData.response.body.items.item;
            if (itemData instanceof Array) {
                itemData.forEach((v, i) => items.push(<Item key={i} data={v} />));
            }
        }
        clog('items.length', items.length);
        return (
            <React.Fragment>
                {items}
            </React.Fragment>
        );
    }
}

ItemList.defaultProps = {
    itemListData: null
}
