import React, { Component } from 'react';

import Cart from '../products/ProductsComponents/Cart';
import Home from '../products/ProductsComponents/Home';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import { getProducts } from '../../actions/productActions';
import './Products.css';
class Products extends Component {
  componentDidMount() {
    this.props.getProducts(); 
   }
  render() {
    const { items, loading } = this.props.product;
    const {addedItems} = this.props.product;
    let postContent;
    if (items === null || loading) {
      postContent = <Spinner />;
    } else {
    postContent=
      <div>
         <Cart products={{addedItems}}/>
         <Home products={{items}}/>
    </div>  
  }

  return(postContent)
}
}
Products.propTypes = {
  getProducts: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  product: state.product
});

export default connect(mapStateToProps, { getProducts })(Products);
