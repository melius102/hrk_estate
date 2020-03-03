const log = console.log;

// Gu: District
const districtCode = {
    "11110": { en: "Jongno District", ko: "종로구" },
    "11140": { en: "Jung District", ko: "중구" },
    "11170": { en: "Yongsan District", ko: "용산구" },
    "11200": { en: "Seongdong District", ko: "성동구" },
    "11215": { en: "Gwangjin District", ko: "광진구" },
    "11230": { en: "Dongdaemun District", ko: "동대문구" },
    "11260": { en: "Jungnang District", ko: "중랑구" },
    "11290": { en: "Seongbuk District", ko: "성북구" },
    "11305": { en: "Gangbuk District", ko: "강북구" },
    "11320": { en: "Dobong District", ko: "도봉구" },
    "11350": { en: "Nowon District", ko: "노원구" },
    "11380": { en: "Eunpyeong District", ko: "은평구" },
    "11410": { en: "Seodaemun District", ko: "서대문구" },
    "11440": { en: "Mapo District", ko: "마포구" },
    "11470": { en: "Yangcheon District", ko: "양천구" },
    "11500": { en: "Gangseo District", ko: "강서구" },
    "11530": { en: "Guro District", ko: "구로구" },
    "11545": { en: "Geumcheon District", ko: "금천구" },
    "11560": { en: "Yeongdeungpo District", ko: "영등포구" },
    "11590": { en: "Dongjak District", ko: "동작구" },
    "11620": { en: "Gwanak District", ko: "관악구" },
    "11650": { en: "Seocho District", ko: "서초구" },
    "11680": { en: "Gangnam District", ko: "강남구" },
    "11710": { en: "Songpa District", ko: "송파구" },
    "11740": { en: "Gangdong District", ko: "강동구" },
}

window.onload = () => {
    let dom = (
        <React.Fragment>
            <Page1 />
        </React.Fragment>
    );
    ReactDOM.render(dom, document.getElementById("root"));
};

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
class Page1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jsonData: null,
            LAWD_CD: null,
        };
        this.hSelected = this.hSelected.bind(this);
        this.hClickLoad = this.hClickLoad.bind(this);
        this.hClickClear = this.hClickClear.bind(this);
    }

    hSelected(evt) {
        log('hSelected');
        if (evt.target.value) {
            this.setState({ LAWD_CD: evt.target.value });
        }
    }

    // componentDidMount() { }
    // www.code.go.kr
    hClickLoad(evt) {
        log('hClickLoad');
        if (!this.state.LAWD_CD) return;
        let LAWD_CD = this.state.LAWD_CD;
        let DEAL_YMD = `202002`;
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

        return (
            <React.Fragment>
                <SelectDistrict onSelected={this.hSelected} />
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