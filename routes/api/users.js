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
      cb(null, './public/uploads');
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
// Load User Model
const User = require('../../models/User')

// Load input Validation for registry and login
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login'); 

// @route POST api/users/register
// @description register users  
// @access Public
//TODO : image not required 
router.post('/register',upload.single('avatar') , (req,res)=>{
    //Check Validation
    const {errors , isValid} = validateRegisterInput(req.body);
    if(!isValid)
    {   
        //Stop upload and throw errors
        if(!isEmpty(req.file))
        fs.unlink(req.file.path, (err) => {
            if (err) throw err;
            console.log('file was deleted');
          });
        return res.status(400).json(errors);
    }


    User.findOne({email: req.body.email})
        .then(user => {
        if(user) {
            //Stop the upload and throw an error
            if(!isEmpty(req.file))
            fs.unlink(req.file.path, (err) => {
                if (err) throw err;
                console.log('file was deleted');
              });
            errors.email='Email already exists';
            return res.status(400).json(errors)
        } 
        else {
          
          const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
          });
          //Add image path if user uploads an image
          if(!isEmpty(req.file)) {newUser.avatar=req.file.path};

          bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if (err) throw err;
            newUser.password=hash;
            newUser.save()
               .then(user => res.json(user))
               .catch(err => console.log(err))
            })
          }) 
        }
        })
});
//@route POST /api/users/login
//@description Login user / return Token
//@access  Public
router.post('/login',(req,res) => {
const email = req.body.email;
const password = req.body.password;
//Check Validation
const {errors , isValid} = validateLoginInput(req.body);
    if(!isValid)
    {
        return res.status(400).json(errors);
    }
    User.findOne({email})
        .then(user =>
            {
            //Check if user with the email exists
            if (!user) {
                errors.email='No user matches this email';
                return res.status(404).json(errors);}
            //Check if password is valid 
            bcrypt.compare(password,user.password)
                    .then(isValid => {
                    if (isValid) {
                        // variable containing user data
                        const payload = {id : user.id , name: user.name ,avatar: user.avatar,pts: user.pts}
                        // Sign Token
                        jwt.sign(
                            payload,
                            keys.secret,
                            {expiresIn: 3600},
                            (err,token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                                })
                            });
                        }
                    else {
                        errors.password='Invalid password';
                        res.status(404).json(errors)}                 
                });

        });
});
//@route GET /api/users/current
//@description Return current user
//@access  Private
router.get('/current',passport.authenticate('jwt',{session: false}), (req, res)=>{
res.json({
name: req.user.name,
email: req.user.email,
avatar: req.user.avatar,
});
});
//@route GET /api/users/handle
//@description Return current user's handle
//@access  Private
router.get('/handle',passport.authenticate('jwt',{session: false}), (req, res)=>{
  Profile.findOne({user : req.user.id})
  .then(profile => {  
    res.json({
    handle : profile.handle
    });
})
  .catch(err=>{
    console.log(err);
    res.json({
    handle : ''
  })
})
});
//@route GET /api/users/sub
//@description Return current user subs
//@access  Private
router.get('/sub',passport.authenticate('jwt',{session: false}), (req, res)=>{
  res.json(
  req.user.subscriptions
  )
  });
//@route GET /api/users/sub/:search
//@description Return current user subs by search
//@access  Private
router.get('/sub/:search',passport.authenticate('jwt',{session: false}), (req, res)=>{
  const subs = [];
  let reg = new RegExp('.*'+req.params.search+'.*',"i")
  req.user.subscriptions.forEach(function(element) {
    if(element.profile.handle.match(reg))
    {
      subs.unshift(element)};
    });
    res.json(
      subs
      )
  });

//@route POST /api/users/sub/:handle
//@description Subscribe to someone
//@access  Private
router.post('/sub/:handle',passport.authenticate('jwt',{session:false}),(req,res)=>{
  Profile.findOne({handle: req.params.handle})
        .populate('user',['avatar'])        
      .then(profile=>{
        if(isEmpty(profile))
          {return res.status(404).json({message: 'no user with this handle to sub to'})}
        else
        {
          if(req.user.subscriptions.filter(sub=>sub.profile.handle===req.params.handle).length>0){
          // get index to remove  
          const removeIndex = req.user.subscriptions
          .map(subToRemove=>subToRemove.profile.handle)
          .indexOf(req.params.handle); 
          //remove from array
          req.user.subscriptions.splice(removeIndex,1);
          //Save
          req.user.save().then(user=>res.json(user));
          }     
          else {// Add user handle to subs array
          let newSub = {};
          newSub.about=profile.about;
          newSub.website=profile.website;
          newSub.location=profile.location;
          newSub.status=profile.status;
          newSub.user=profile.user;
          newSub.handle=profile.handle;
          newSub.socials=profile.socials;
          newSub.avatar=profile.user.avatar;
          req.user.subscriptions.unshift({profile : newSub});
          req.user.save().then(user =>res.json(user));
            }
        }
      })
      .catch(err=>{console.log(err);res.status(404).json({message: 'no user with this handle to sub to'})})
});

module.exports = router;
