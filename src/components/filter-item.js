import React from 'react';
import { clog } from '../lib/util';

export default class FilterItem extends React.Component {

    render() {
        let value;
        clog(JSON.stringify(this.props.item));
        if (this.props.item.type == 'v-name' || this.props.item.type == 'apt') {
            value = this.props.item.value
        } else if (this.props.item.type == 'area') {
            value = this.props.item.value + '(m²)';
        } else {
            value = this.props.item.value + '(만원)';
        }

        return (
            <div className="filter-item">
                <span>{value}</span>
                <i className="fas fa-times" onClick={() => { this.props.onRemove(JSON.stringify(this.props.item)) }} ></i>
            </div>
        );
    }
}
