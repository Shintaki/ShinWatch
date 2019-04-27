const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
name: {
    type: String,
    require: true
},
email: {
    type: String,
    required: true,
},
pts: {
    type: Number,
    default: 0,
},
password: {
    type: String,
    required: true,
},
avatar: {
    type: String,
    default: 'public\\uploads\\default.png'
},
date: {
    type: Date,
    default: Date.now(),
},
subscriptions: [
    {
        profile: {
            type: Object,
        },
        date: {
            type: Date,
            default: Date.now()
        }
    }

],
});
module.exports = User = mongoose.model('users',UserSchema);

