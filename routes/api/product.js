const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const multer = require('multer');
const fs = require('fs');
const isEmpty = require('../../validations/is-empty');

//Set Storage Engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './public/products');
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + file.originalname);
    }
  });
// Filter only images
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
// Init Upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});
// Load Product Model
const Product = require('../../models/Product')

// Load Commande Model
const Commande = require('../../models/Commande')


// Load User Model
const User = require('../../models/User')

// Load input Validation for registry and login
const validateProductInput = require('../../validations/product');

// @route POST api/product
// @description Create product
// @access Private 
router.post('/',passport.authenticate('jwt',{session:false}),upload.single('img'),(req,res)=>{
    const {errors , isValid} = validateProductInput(req.body,req.file);
    
    if(!isValid )
    {   
        //Stop upload and throw errors
        if(!isEmpty(req.file))
        fs.unlink(req.file.path, (err) => {
            if (err) throw err;
            });
        return res.status(400).json(errors);
    }
    const newProduct=new Product({
        desc:req.body.desc,
        price:req.body.price,
        title: req.body.title,
        quantity: req.body.quantity,
    });

    if(!isEmpty(req.file)) {newProduct.img=req.file.path}
    else{errors.content='No file uploaded';
    return res.status(400).json(errors)}
    Product.findOne({title: req.body.title})
            .then(product =>{
                if(product){
                    //Stop the upload and throw an error
                if(!isEmpty(req.file))
                fs.unlink(req.file.path, (err) => {
                    if (err) throw err;
                    console.log('file was deleted');
                    });
                errors.title="This title is already in db"
                return res.status(400).json(errors);
                }
                else{
                    // new product not found in the db
                    newProduct.save()
                    .then(post=>res.json(post))
                    .catch(err => console.log(err)); 
                }
            })
            
     
    });
// @route GET api/products
// @description show products 
// @access Public
    router.get('/',(req,res)=>{
        Product.find()
            .then(products=> {res.json(products)})
            .catch(err => res.status(404).json({message: 'no products found'}))
    });    
// @route GET api/products/:id
// @description show products by id
// @access Public
router.get('/:id',(req,res)=>{
    Product.findById(req.params.id)
        .then(products=>res.json(products))
        .catch(err=>res.status(404).json({message : 'no post with this id found'}))
})

// @route DELETE api/posts/:id
// @description delete post
// @access Private

//TODO modify this to mmake it decrement quantity 
router.post('/order',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const errors = {};
    //no order passed
    if(req.body.total===0)
                {   
                    errors.pts='No order passed'
                    return res.status(400).json(errors);
                }   
    User.findById(req.user.id)
        .then(user=>{
                // user points not enough
                
                if(user.pts<req.body.total)
                {   
                    errors.pts='Not enough points to make this action'
                    return res.status(400).json(errors);
                }  
                //user with enough points to make order 
                else{
                    const items = [];
                    let counter=0;
                    length=req.body.addedItems.length;
                    const newOrder = new Commande({
                    shipping: req.body.shipping,
                    total: req.body.total,
                    items: [],
                    });
                    
                    // loop through every element ordered to update db
                    (req.body.addedItems).forEach(element => {
                        Product.findOne({_id : element._id})
                        .then(product => {
                            if (element.quantity===product.quantity){
                                // Delete product from db
                                product.remove().
                                        then(()=>{console.log('product removed')})
                            }
                            else{
                                //update product quantity in db
                                product.quantity=product.quantity-element.quantity;
                                product.save()
                                        .then(console.log('product updated'))
                                        
                            }
                            element.idproduct=element._id;
                            items.unshift(element);
                            counter++;
                            // execute this after the foreach
                            if(counter===length){
                                //create new order in db
                                newOrder.items=items;
                                newOrder.save()
                                .then(console.log('Order passed'))
                                .catch(err => {console.log(err)})
                                //update user pts in db
                                user.pts=user.pts-req.body.total;
                                user.save()
                                .then(console.log('User points updated'))
                                .catch(err => {console.log(err)})
                                
                            }
                        })
                        .catch(err => {console.log(err)})
                    });
                    
                    
                }
            })
        .catch(err=>{console.log(err);res.status(404).json({message: 'no user found'})})
});
module.exports = router;