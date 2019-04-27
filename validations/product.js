const Validator = require('validator');
const isEmpty = require('./is-empty')

module.exports = function validateProductInput(data,file){
let errors = {};
data.desc = !isEmpty(data.desc) ? data.desc : '';
data.title = !isEmpty(data.title) ? data.title : '';
data.price = !isEmpty(data.price) ? data.price : '';
data.quantity = !isEmpty(data.quantity) ? data.quantity : '';
data.img = !isEmpty(data.img) ? data.img : '';

if(!Validator.isLength(data.title,{min: 2 , max : 30})){
errors.title = 'Title must be between 2 and 30 characters';
}
if(Validator.isEmpty(data.title)){
    errors.title='Title field is required'
}
if(Validator.isEmpty(data.img) && isEmpty(file)){
    errors.img='Image field is required';
}
if(!Validator.isLength(data.desc,{min: 2 , max : 200})){
    errors.desc = 'Description must be between 2 and 200 characters';
    }
    if(Validator.isEmpty(data.desc)){
        errors.desc='Description field is required'
    }
if(!Validator.isNumeric(data.price)){
    errors.price='Price must be a number'
}
else{
    if(data.price<1){
        errors.price='Price must be positive'
    }
}
if(!Validator.isNumeric(data.quantity)){
    errors.quantity='Quantity must be a number'
}
else{
    if(data.quantity<1){
        errors.quantity='Quantity must be positive'
    }
}
if(Validator.isEmpty(data.price)){
    errors.price='Price field is required'
}
if(Validator.isEmpty(data.quantity)){
    errors.quantity='Quantity field is required'
}
return{
    errors,
    isValid: isEmpty(errors)
}
}