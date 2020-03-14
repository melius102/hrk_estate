// import 'reset-css';
import 'normalize.css';
import '../scss/style.scss';
import { getList } from './util';
import Maps from './maps';
import RegionSelect from './region-select';

const clog = console.log;

window.onload = () => {
    getList(1, '0000000000').then(data => {
        let dom = (
            <React.Fragment>
                <Maps />
                <RegionSelect province={data} />
            </React.Fragment>
        );
        ReactDOM.render(dom, document.getElementById("root"));
    });
};
