import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {passOrder, addShipping , subShipping} from '../../../actions/productActions'
//import { addShipping } from './actions/cartActions'
class Recipe extends Component{
    constructor(props) {
        super(props);
        this.state = {
          shipping: false,
          errors: {}
        };
      }
    
      componentWillReceiveProps(newProps) {
        if (newProps.errors) {
          this.setState({ errors: newProps.errors });
        }
      }
      componentWillUnmount() {
         if(this.refs.shipping.checked)
              this.props.substractShipping()
    }
    

    handleChecked = (e)=>{
        if(e.target.checked){
            this.setState({...this.state ,shipping: true});
            this.props.addShipping();
        }
        else{
            this.setState({...this.state , shipping: false});
            this.props.subShipping();
        }
    }
    onSubmit = (e) =>{
     e.preventDefault();
      const order = {};
      order.total=this.props.total;
      order.addedItems=this.props.addedItems;
      order.shipping=this.state.shipping;
      this.props.passOrder(order,this.props.history);
    }
    render(){
        const {errors} = this.state;
        return(
            <div className="container">
                <div className="collection">
                    <li className="collection-item">
                            <label>
                                <input type="checkbox" ref="shipping" onChange= {this.handleChecked} />
                                <span>Shipping(+50pts)</span>
                            </label>
                        </li>
                        <li className={classnames('form-control form-control-lg', {
                            'is-invalid': errors.pts
                            })}  >
                  <b>Total: {this.props.total} pts</b></li>
                  
                {errors.pts && <div className="invalid-feedback">{errors.pts}</div>}
                    </div>
                    <div className="checkout">
                    <div className='row'>
                    <form onSubmit={this.onSubmit}>
                <div className="form-group">
                <p className="waves-effect waves-light btn">
                <input
                  type="submit"
                  value="Checkout"
                  
                  error={errors.pts} />
                  </p>
                </div>
                </form>
                        <a  style={{marginLeft: '50px'}} href="/products"><button type="button" className="btn btn-labeled btn-info">
                <i className="glyphicon glyphicon-refresh"></i>Refresh</button></a>  
                    </div>
                 </div>
                 </div>
        )
    }
}
Recipe.propTypes = {
    addShipping: PropTypes.func.isRequired,
    subShipping: PropTypes.func.isRequired,
    passOrder: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
  };
const mapStateToProps = (state)=>{
    return{
        addedItems: state.product.addedItems,
        total: state.product.total,
        errors: state.errors
    }
}


export default connect(mapStateToProps,{addShipping,subShipping,passOrder})(withRouter(Recipe))
