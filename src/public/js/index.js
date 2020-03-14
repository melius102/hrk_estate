// import 'reset-css';
import 'normalize.css';
import '../scss/style.scss';
import { getList } from './util';
import App from './App';

const clog = console.log;
const initCode = '0000000000';

window.onload = () => {
    getList(1, initCode).then(data => {
        let dom = (
            <App mapCode={initCode} province={data} />
        );
        ReactDOM.render(dom, document.getElementById("root"));
    });
};
