import React from 'react';
import { clog } from '../lib/util';

export default class Item extends React.Component {

    hClick(evt) {
        // clog(evt.nativeEvent.target);
        $(evt.nativeEvent.target).next().slideToggle();
    }

    render() {
        let item = this.props.data;
        let keys = Object.keys(item);
        let itemTr = [];
        keys.forEach((v, i) => {
            itemTr.push(
                <ItemTr key={i} trKey={v} val={item[v]} />
            );
        });
        let title = `${item["법정동"]}, ${item["아파트"]}, ${item["거래금액"]}`;
        return (
            <React.Fragment>
                <div className="item-title" onClick={(evt) => this.hClick(evt)}>{this.props.index}. {title}</div>
                <div className="item-table-wrap">
                    <table>
                        <tbody>
                            {itemTr}
                        </tbody>
                    </table>
                </div>
            </React.Fragment >
        );
    }
}

class ItemTr extends React.Component {
    render() {
        return (
            <tr>
                <td>{this.props.trKey}</td>
                <td>{this.props.val}</td>
            </tr>
        );
    }
}