import React from 'react';
import { clog } from '../lib/util';

export default class DateSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: undefined };
        this.hMonthChange = this.hMonthChange.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        let date;
        if (props.DEAL_YMD) {
            date = props.DEAL_YMD;
            date = `${date.slice(0, 4)}-${date.slice(4, 6)}`;
        }
        return {
            value: date
        }
    }

    hMonthChange(evt) {
        let date = new Date(evt.target.value);
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        this.props.dpUpdateDate(date.getFullYear() + month); // DEAL_YMD
        // this.setState({ DEAL_YMD: date.getFullYear() + month });
    }

    render() {
        return (
            <div id="date-picker">
                <input type="month" onChange={this.hMonthChange} defaultValue={this.state.value} />
            </div>
        );
    }

    componentDidMount() {
        let date = new Date();
        date.setMonth(date.getMonth() - 1); // 1 month ago
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        this.props.dpUpdateDate(date.getFullYear() + month); // DEAL_YMD
    }
}