import React, { Component } from 'react';

import Cart from '../products/ProductsComponents/Cart';
import Home from '../products/ProductsComponents/Home';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import { getProducts } from '../../actions/productActions';
import { reloadUserData } from '../../actions/authActions';
import './Products.css';
class Products extends Component {
  componentDidMount() {
    this.props.getProducts();
    this.props.reloadUserData(); 
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
         <p style={{fontSize: '20px' , fontStyle: 'italic'}}>You currently have {this.props.auth.user.pts} Pts to spend</p>
         <Cart products={{addedItems}} pts={this.props.auth.user.pts} />
         <Home products={{items}}/>
    </div>  
  }

  return(postContent)
}
}
Products.propTypes = {
  getProducts: PropTypes.func.isRequired,
  reloadUserData: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  product: state.product,
  auth: state.auth
});

export default connect(mapStateToProps, { getProducts,reloadUserData})(Products);
