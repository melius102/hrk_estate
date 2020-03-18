import React from 'react';
import { clog } from '../lib/util';

export default class Item extends React.Component {

    hClick(evt) {
        $(evt.currentTarget).next().slideToggle();
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
        let title1 = `${item["법정동"]} ${item["아파트"]} (${item["층"]} 층, ${item["전용면적"]} m²)`;
        let title2 = `${item["거래금액"]} 만원 [${item["월"]}월/${item["일"]}일]`;

        return (
            <React.Fragment>
                <div className="item-title" onClick={(evt) => this.hClick(evt)}>
                    <div className="item-num">
                        <div>{this.props.index}</div>
                    </div>
                    <div className="item-content">
                        <div className="first">{title1}</div>
                        <div className="second">{title2}</div>
                    </div>
                </div>
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