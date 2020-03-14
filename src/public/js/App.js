import Maps from './maps';
import RegionSelect from './region-select';

const clog = console.log;

export default class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Maps mapCode={this.props.mapCode} />
                <RegionSelect province={this.props.province} />
            </React.Fragment>
        );
    }
}