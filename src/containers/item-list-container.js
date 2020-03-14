import ItemList from '../components/item-list';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({ itemListData: state.itemListData });

// const mapDispatchToProps = (dispatch) => ({});

const ItemListContainer = connect(mapStateToProps)(ItemList);

export default ItemListContainer;