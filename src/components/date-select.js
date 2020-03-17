import React from 'react';

const clog = console.log;

export default class DateSelect extends React.Component {
    constructor(props) {
        super(props);
        this.hMonthChange = this.hMonthChange.bind(this);
    }

    hMonthChange(evt) {
        let date = new Date(evt.target.value);
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        this.props.dpUpdateDate(date.getFullYear() + month); // DEAL_YMD
        // this.setState({ DEAL_YMD: date.getFullYear() + month });
    }

    render() {
        let date = new Date();
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let value = `${date.getFullYear()}-${month}`;
        clog(value);
        return (
            <div id="date-picker">
                <input type="month" onChange={this.hMonthChange} defaultValue={value} />
            </div>
        );
    }
}