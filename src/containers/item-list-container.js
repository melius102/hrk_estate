import ItemList from '../components/item-list';
import * as actions from '../actions';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
    itemListData: state.itemListData,
    pageNo: state.pageNo,
    numOfRows: state.numOfRows,
    readyFetch: state.readyFetch
});


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dpUpdateItemList: (itemListData) => {
            return dispatch(actions.updateItemList(itemListData));
        }
    };
}

const ItemListContainer = connect(mapStateToProps, mapDispatchToProps)(ItemList);

export default ItemListContainer;