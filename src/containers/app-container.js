import React from 'react';

// import Maps from '../components/maps';
// import RegionSelect from '../components/region-select';

import MapsContainer from './maps-container';
import RegionSelectContainer from './region-select-container';
import DateSelectContainer from './date-select-container';
import ResultLoadContainer from './result-load-container';
import FilterContainer from './filter-container';
import ResPlotContainer from './res-plot-container';
import ItemListContainer from './item-list-container';
import PaginationContainer from './pagination-container';
import { clog } from '../lib/util';

export default class App extends React.Component {
    render() {
        let headerText = "아파트 매매 실거래가 정보 (수도권)";
        let footerText = "Powered by Open API of DATA.go.kr";
        return (
            <React.Fragment>
                <header><h1>{headerText}</h1></header>
                <MapsContainer />
                <RegionSelectContainer provinceOptions={this.props.provinceOptions} />
                <DateSelectContainer />
                <ResultLoadContainer />
                <FilterContainer />
                <ResPlotContainer />
                <PaginationContainer />
                <ItemListContainer />
                <footer><p>{footerText}</p></footer>
            </React.Fragment>
        );
    }
}
