import React from 'react';
import { clog } from '../lib/util';

export default class Item extends React.Component {

    hClick(evt) {
        $(evt.currentTarget).next().slideToggle();
    }

    preprocessItem(v) {
        let newItem = {};
        let date = new Date(v["거래일자"]);

        newItem["아파트 (건축년도)"] = `${v["아파트"]} (${v["건축년도"]}년)`;
        newItem["전용면적 (층수)"] = `${v["전용면적"]} m² (${v["층"]}층)`;
        newItem["거래금액"] = `${v["거래금액"]} 만원`;

        // newItem["거래일자"] = `${v["년"]}년 ${v["월"]}월 ${v["일"]}일`;
        newItem["거래일자"] = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

        newItem["도로명 주소"] = `${v["지역명"]} ${v["도로명"]} ${v["도로명건물본번호코드"]}`;
        if (Number(v["도로명건물부번호코드"])) newItem["도로명 주소"] += `-${v["도로명건물부번호코드"]}`;
        newItem["법정동 주소"] = `${v["지역명"]} ${v["법정동"]} ${v["법정동본번코드"]}`;
        if (Number(v["법정동부번코드"])) newItem["법정동 주소"] += `-${v["법정동부번코드"]}`;
        return newItem;
    }

    render() {
        let item = this.props.data;
        // let newItem = item;
        let newItem = this.preprocessItem(item);
        let keys = Object.keys(newItem);
        let itemTr = [];
        keys.forEach((v, i) => {
            itemTr.push(
                <ItemTr key={i} trKey={v} val={newItem[v]} />
            );
        });
        let title1 = `${item["법정동"]} ${item["아파트"]} (${item["전용면적"]} m², ${item["층"]} 층)`;
        let title2 = `${item["거래금액"]} 만원 [${newItem["거래일자"]}]`;

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