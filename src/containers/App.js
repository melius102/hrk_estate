import React from 'react';

import Maps from '../components/maps';
import RegionSelect from '../components/region-select';

const clog = console.log;

export default class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Maps mapCode={this.props.mapCode} regCode={this.props.regCode} />
                <RegionSelect province={this.props.province} />
            </React.Fragment>
        );
    }
}