const log = console.log;

window.onload = () => {
    let dom = (
        <React.Fragment>
            <Page1 />
        </React.Fragment>
    );
    ReactDOM.render(dom, document.getElementById("root"));
    getList(1, '0000000000');
};

function getList(depth, code) {
    if (!depth || !code) return;
    fetch(`/getlist/${depth}/${code}`)
        .then((response) => {
            // log(response); // header
            return response.json();
        })
        .then((data) => {
            log(data);
        });
}

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
class Page1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jsonData: null,
            LAWD_CD: null,
            DEAL_YMD: null
        };
        this.hSelected = this.hSelected.bind(this);
        this.hClickLoad = this.hClickLoad.bind(this);
        this.hClickClear = this.hClickClear.bind(this);
        this.hMonthChange = this.hMonthChange.bind(this);
    }

    hSelected(evt) {
        log('hSelected');
        if (evt.target.value) {
            this.setState({ LAWD_CD: evt.target.value });
        }
    }

    hMonthChange(evt) {
        log("hMonthChange");
        let date = new Date(evt.target.value);
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        this.setState({ DEAL_YMD: date.getFullYear() + month });
    }

    // componentDidMount() { }
    // www.code.go.kr
    hClickLoad(evt) {
        log('hClickLoad');
        if (!this.state.LAWD_CD || !this.state.DEAL_YMD) return;
        let LAWD_CD = this.state.LAWD_CD;
        let DEAL_YMD = this.state.DEAL_YMD;
        fetch(`/data/${LAWD_CD}/${DEAL_YMD}`)
            .then((response) => {
                // log(response); // header
                return response.json();
            })
            .then((data) => {
                let jsonData = JSON.parse(data);
                // log(jsonData);
                this.setState({ jsonData });
            });
    }

    hClickClear(evt) {
        log('hClickClear');
        this.setState({ jsonData: null });
    }

    render() {
        log("render");
        let items = [];
        if (this.state.jsonData) {
            let itemData = this.state.jsonData.response.body.items.item;
            if (itemData instanceof Array) {
                itemData.forEach((v, i) => items.push(<Item key={i} data={v} />));
            }
        }
        log('items.length', items.length);
        return (
            <React.Fragment>
                <SelectDistrict onSelected={this.hSelected} />
                <input type="month" onChange={this.hMonthChange} />
                <button onClick={this.hClickLoad}>Load</button>
                <button onClick={this.hClickClear}>Clear</button>
                {items}
            </React.Fragment>
        );
    }
}

class SelectDistrict extends React.Component {
    render() {
        let districtCodeKey = Object.keys(districtCode);
        let optionTags = [];
        optionTags.push(<option key={0} value={""}>선택</option>);
        districtCodeKey.forEach((v, i) => {
            optionTags.push(<option key={i + 1} value={v}>{districtCode[v].ko}</option>);
        });
        return (
            <select onChange={this.props.onSelected}>{optionTags}</select>
        );
    }
}

class Item extends React.Component {
    render() {
        let item = this.props.data;
        let keys = Object.keys(item);
        let itemTr = [];
        keys.forEach((v, i) => {
            itemTr.push(
                <ItemTr key={i} trKey={v} val={item[v]} />
            );
        });
        return (
            <table>
                <tbody>
                    {itemTr}
                </tbody>
            </table>
        );
    }
}

class ItemTr extends React.Component {
    render() {
        return (
            <tr>
                <td>{this.props.trKey}</td>
                <td>{this.props.val}</td>
            </tr>
        );
    }
}