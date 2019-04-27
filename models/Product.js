const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ProductSchema = new Schema({
title: {
    type: String,
    require: true
},
desc: {
    type: String,
    required: true,
},
price: {
    type: Number,
    required: true,
},
quantity: {
    type: Number,
    required: true,
},
img: {
    type: String,
    required: true,
},
date: {
    type: Date,
    default: Date.now(),
},

});
module.exports = Product = mongoose.model('product',ProductSchema);

