const log = console.log;

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

    hClick(evt) {
        let LAWD_CD = "11110";
        let DEAL_YMD = "201512";
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
        if (this.state.jsonData) {
            let itemData = this.state.jsonData.response.body.items.item;
            let items = [];
            itemData.forEach((v, i) => {
                items.push(<Item key={i} data={v} />);
            });
            return (
                <React.Fragment>
                    <button onClick={this.hClick}>Click</button>
                    {items}
                </React.Fragment>
            );
        }
        else {
            return (
                <React.Fragment>
                    <button onClick={this.hClick}>Click</button>
                </React.Fragment>
            );
        }
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
