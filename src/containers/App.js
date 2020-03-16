import React from 'react';

// import Maps from '../components/maps';
// import RegionSelect from '../components/region-select';

import MapsContainer from './maps-container';
import RegionSelectContainer from './region-select-container';
import DateSelectContainer from './date-select-container';
import ResultLoadContainer from './result-load-container';
import ItemListContainer from './item-list-container';

const clog = console.log;

export default class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                {/* <Maps mapCode={this.props.mapCode} regCode={this.props.regCode} /> */}
                {/* <RegionSelect province={this.props.province} /> */}
                <MapsContainer />
                <RegionSelectContainer province={this.props.province} />
                <DateSelectContainer />
                <ResultLoadContainer />
                <ItemListContainer />
            </React.Fragment>
        );
    }
}