import React from 'react';

export default class Item extends React.Component {
    render() {
        let item = this.props.data;
        let keys = Object.keys(item);
        let itemTr = [];
        keys.forEach((v, i) => {
            itemTr.push(
                <ItemTr key={i} trKey={v} val={item[v]} />
            );
        });
        return (
            <table>
                <tbody>
                    {itemTr}
                </tbody>
            </table>
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