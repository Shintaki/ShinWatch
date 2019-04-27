import React, { Component } from 'react';
import { connect } from 'react-redux'
import { addToCart } from '../../../actions/productActions'

 class Home extends Component{
    
    handleClick = (id)=>{
        this.props.addToCart(id); 
    }

    render(){
        let itemList = this.props.products.items.map(item=>{
            return(
                <div className="card-product" key={item.id}>
                        <div className="card-image-product">
                            <img src={item.img} alt={item.title}/>
                            <span className="card-title-product" style={{fontSize: '30px' , fontFamily: 'Leitura News' }} >{item.title}</span>
                            <span to="/" style={{marginLeft: '10px' , marginBottom: '10px'}} className="btn-floating btn-medium waves-effect waves-light blue" onClick={()=>{this.handleClick(item._id)}}><i className="material-icons">add</i></span>
                        </div>

                        <div className="card-content">
                            <p>{item.desc}</p>
                            <p><b>Price: {item.price}pts</b></p>
                        </div>
                 </div>

            )
        })

        return(
            <div className="container">
                <h3 className="center">Products available right now :</h3>
                <div className="box">
                    {itemList}
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state)=>{
    return {
      product: state.product
    }
  }
const mapDispatchToProps= (dispatch)=>{
    
    return{
        addToCart: (id)=>{dispatch(addToCart(id))}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Home)