const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const CommandeSchema = new Schema({
items:[
        {
            date:{
                type: Date,
            },   
            desc:{
                type: String,
            },
            title:{
                type: String,
            },
            quantity:{
                type:Number
            },
            img:{
                type:String,
            },
            idproduct:{
                type: String,
            }
        }
    ],

shipping:{
    type:Boolean,
    required: true,
},
total:{
    type:Number,
    required: true,
},
date: {
    type: Date,
    default: Date.now(),
},

});
module.exports = Commande = mongoose.model('commande',CommandeSchema);

