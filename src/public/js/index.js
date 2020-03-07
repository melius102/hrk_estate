import '../scss/style.scss';

const log = console.log;

window.onload = () => {
    getList(1, '0000000000').then(data => {
        let dom = (
            <React.Fragment>
                <Page1 province={data} />
            </React.Fragment>
        );
        ReactDOM.render(dom, document.getElementById("root"));
    });
};

async function getList(depth, code) {
    if (!depth || !code) return;
    let response = await fetch(`/getlist/${depth}/${code}`);
    let data = await response.json();
    return data;
}

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
class Page1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Area
            // selected value
            provinceValue: "", districtValue: "", villageValue: "",
            districtDisplay: "none", villageDisplay: "none",
            // options list
            district: null, village: null, LAWD_CD: null,

            // Date
            DEAL_YMD: null,

            // Result
            pageNo: 1, numOfRows: 10, pageNoDisplay: "none",
            totalCount: 1, totalPage: 1, jsonData: null
        };
        this.hProvinceSelected = this.hProvinceSelected.bind(this);
        this.hDistrictSelected = this.hDistrictSelected.bind(this);
        this.hVillageSelected = this.hVillageSelected.bind(this);
        this.hMonthChange = this.hMonthChange.bind(this);
        this.hClickLoad = this.hClickLoad.bind(this);
        this.hClickClear = this.hClickClear.bind(this);
        this.hPageChange = this.hPageChange.bind(this);
    }

    hProvinceSelected(evt) {
        log('hProvinceSelected', evt.target.value);
        let value = evt.target.value;
        if (value) {
            getList(2, value).then(data => {
                log(data);
                this.setState({
                    // Area
                    // selected value
                    provinceValue: value, districtValue: "", villageValue: "",
                    districtDisplay: "initial", villageDisplay: "none",
                    // options list
                    district: data, village: null, LAWD_CD: null,

                    // Result
                    pageNo: 1, pageNoDisplay: "none",
                    totalCount: 1, totalPage: 1, jsonData: null
                });
            });
        }
    }

    hDistrictSelected(evt) {
        log('hDistrictSelected', evt.target.value);
        let value = evt.target.value;
        if (value) {
            getList(3, value).then(data => {
                log(data);
                let res = data.filter(v => v[0].slice(0, 5) !== value.slice(0, 5));
                let moreDetail = res.length != 0;
                if (moreDetail) {
                    this.setState({
                        // Area
                        // selected value
                        districtValue: value, villageValue: "",
                        villageDisplay: "initial",
                        // options list
                        village: data, LAWD_CD: null,

                        // Result
                        pageNo: 1, pageNoDisplay: "none",
                        totalCount: 1, totalPage: 1, jsonData: null
                    });
                }
                else {
                    this.setState({
                        // Area
                        // selected value
                        districtValue: value, villageValue: "",
                        villageDisplay: "none",
                        // options list
                        village: data, LAWD_CD: value.slice(0, 5),

                        // Result
                        pageNo: 1, pageNoDisplay: "none",
                        totalCount: 1, totalPage: 1, jsonData: null
                    });
                }
            });
        }
    }

    hVillageSelected(evt) {
        log('hVillageSelected', evt.target.value);
        let value = evt.target.value;
        if (value) {
            this.setState({
                // Area
                // selected value
                villageValue: value,
                // options list
                LAWD_CD: value.slice(0, 5),

                // Result
                pageNo: 1, pageNoDisplay: "none",
                totalCount: 1, totalPage: 1, jsonData: null
            });
        }
    }

    hMonthChange(evt) {
        log("hMonthChange");
        let date = new Date(evt.target.value);
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        this.setState({
            // Date
            DEAL_YMD: date.getFullYear() + month,

            // Result
            pageNo: 1, pageNoDisplay: "none",
            totalCount: 1, totalPage: 1, jsonData: null
        });
    }

    // componentDidMount() { }
    // www.code.go.kr
    hClickLoad(evt) {
        log('hClickLoad');
        if (!this.state.LAWD_CD || !this.state.DEAL_YMD) return;
        let LAWD_CD = this.state.LAWD_CD;
        let DEAL_YMD = this.state.DEAL_YMD;
        fetch(`/data/${LAWD_CD}/${DEAL_YMD}/${this.state.pageNo}/${this.state.numOfRows}`).then((response) => {
            // log(response); // header
            return response.json();
        }).then((data) => {
            let jsonData = JSON.parse(data);
            let totalCount = jsonData.response.body.totalCount;
            let totalPage = Math.ceil(totalCount / this.state.numOfRows);
            log("numOfRows", jsonData.response.body.numOfRows);
            log("pageNo", jsonData.response.body.pageNo);
            log("totalCount", jsonData.response.body.totalCount);
            log("totalPage", totalPage);
            this.setState({ pageNoDisplay: "initial", totalCount, totalPage, jsonData });
        });
    }

    hClickClear(evt) {
        log('hClickClear');
        this.setState({ jsonData: null });
    }

    hPageChange(evt) {
        log('hPageChange', evt.target.value);
        this.setState({ pageNo: evt.target.value });
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

        // if (this.state.district)
        return (
            <React.Fragment>
                <SelectArea value={this.state.provinceValue} options={this.props.province}
                    onSelected={this.hProvinceSelected} />
                <SelectArea value={this.state.districtValue} options={this.state.district}
                    onSelected={this.hDistrictSelected} display={this.state.districtDisplay} />
                <SelectArea value={this.state.villageValue} options={this.state.village}
                    onSelected={this.hVillageSelected} display={this.state.villageDisplay} />
                <input type="month" onChange={this.hMonthChange} />
                <input style={{ display: this.state.pageNoDisplay }} type="number" min="1"
                    max={this.state.totalPage} value={this.state.pageNo} onChange={this.hPageChange} />
                <button onClick={this.hClickLoad}>Load</button>
                <button onClick={this.hClickClear}>Clear</button>
                {items}
            </React.Fragment>
        );
    }
}

class SelectArea extends React.Component {
    render() {
        let optionTags = [];
        optionTags.push(<option key={0} value={""}>선택</option>);
        if (this.props.options) {
            this.props.options.forEach((v, i) => {
                optionTags.push(<option key={i + 1} value={v[0]}>{v[v.length - 1]}</option>);
            });
        }
        return (
            <select style={{ display: this.props.display }} value={this.props.value}
                onChange={this.props.onSelected}>{optionTags}</select>
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