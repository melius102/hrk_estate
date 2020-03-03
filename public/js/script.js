const log = console.log;

// Gu: District
const districtCode = {
    "1132000000": { en: "Dobong District", ko: "도봉구" },
    "1123000000": { en: "Dongdaemun District", ko: "동대문구" },
    "1159000000": { en: "Dongjak District", ko: "동작구" },
    "1138000000": { en: "Eunpyeong District", ko: "은평구" },
    "1130500000": { en: "Gangbuk District", ko: "강북구" },
    "1174000000": { en: "Gangdong District", ko: "강동구" },
    "1168000000": { en: "Gangnam District", ko: "강남구" },
    "1150000000": { en: "Gangseo District", ko: "강서구" },
    "1154500000": { en: "Geumcheon District", ko: "금천구" },
    "1153000000": { en: "Guro District", ko: "구로구" },
    "1162000000": { en: "Gwanak District", ko: "관악구" },
    "1121500000": { en: "Gwangjin District", ko: "광진구" },
    "1111000000": { en: "Jongno District", ko: "종로구" },
    "1114000000": { en: "Jung District", ko: "중구" },
    "1126000000": { en: "Jungnang District", ko: "중랑구" },
    "1144000000": { en: "Mapo District", ko: "마포구" },
    "1135000000": { en: "Nowon District", ko: "노원구" },
    "1165000000": { en: "Seocho District", ko: "서초구" },
    "1141000000": { en: "Seodaemun District", ko: "서대문구" },
    "1129000000": { en: "Seongbuk District", ko: "성북구" },
    "1120000000": { en: "Seongdong District", ko: "성동구" },
    "1171000000": { en: "Songpa District", ko: "송파구" },
    "1147000000": { en: "Yangcheon District", ko: "양천구" },
    "1156000000": { en: "Yeongdeungpo District", ko: "영등포구" },
    "1117000000": { en: "Yongsan District", ko: "용산구" }
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
            jsonData: null
        };
        this.hClick = this.hClick.bind(this);
    }

    // componentDidMount() { }
    // www.code.go.kr
    hClick(evt) {
        let LAWD_CD = "11410";
        let DEAL_YMD = `202002`;
        log('hClick');
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
                <button onClick={this.hClick}>Click</button>
                {items}
            </React.Fragment>
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
