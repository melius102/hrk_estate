import React from 'react';
import { clog } from '../lib/util';

export default class DateSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value1: null,
            value2: null
        };
    }

    static getDerivedStateFromProps(props, state) {
        let date1, date2;
        if (props.DEALYMD1) date1 = props.DEALYMD1;
        if (props.DEALYMD2) date2 = props.DEALYMD2;
        return { value1: date1, value2: date2 };
    }

    hMonthChange(evt, no) {
        let date = new Date(evt.target.value);
        if (!isNaN(date.getDate())) {
            if (no == 1) {
                let date2 = new Date(this.state.value2);
                if (date <= date2) {
                    date = date.toISOString().slice(0, 10);
                    this.props.dpUpdateDate(date, this.state.value2);
                }
            }
            else {
                let date1 = new Date(this.state.value1);
                if (date1 <= date) {
                    date = date.toISOString().slice(0, 10);
                    this.props.dpUpdateDate(this.state.value1, date);
                }
            }
        }
    }

    render() {
        return (
            <div id="date-picker">
                <input type="date" onChange={evt => this.hMonthChange(evt, 1)} value={this.state.value1} />
                <span>~</span>
                <input type="date" onChange={evt => this.hMonthChange(evt, 2)} value={this.state.value2} />
            </div>
        );
    }

    componentDidMount() {
        let date = new Date(); // today
        let today = date.toISOString().slice(0, 10);
        date.setMonth(date.getMonth() - 1); // 1 month ago
        let oneMonthAgo = date.toISOString().slice(0, 10);
        // let year = today.getFullYear();
        // let month = today.getMonth() + 1;
        // let day = today.getDate();

        // let month = ("0" + (date.getMonth() + 1)).slice(-2);
        // this.props.dpUpdateDate(date.getFullYear() + month, date.getFullYear() + month); // DEAL_YMD
        this.props.dpUpdateDate(oneMonthAgo, today); // DEAL_YMD
    }
}