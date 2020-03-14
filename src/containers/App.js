import Maps from '../components/maps';
import RegionSelect from '../components/region-select';

const clog = console.log;

export default class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Maps mapCode={'4100000000'} region={'4150000000'} />
                <RegionSelect province={this.props.province} />
            </React.Fragment>
        );
    }
}