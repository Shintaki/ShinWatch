const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load profile and user models
const Profile = require('../../models/Profile')
const User = require('../../models/User')
 
//Load Validation for profile
const validateProfileInput = require('../../validations/profile');
// @route GET api/profile/test
// @description tests profile route
// @access Public
router.get('/test', (req, res) => res.json({msg :"Profile Work"}));   


// @route GET api/profile/test
// @description Access to current user's profile
// @access Private
router.get('/', passport.authenticate('jwt', {session:false}),(req,res)=>{
    const errors= {};
    Profile.findOne({user: req.user.id})
           .then(profile=>{
               if(!profile){
                errors.noprofile='There is no profile for this user'; 
                return res.status(404).json(errors);    
               }
               return res.json(profile);
           })
           .catch(err =>res.status(404).json(err));
});   

// @route GET api/profile/handle/(handle)
// @description Get profile by handle
// @access Public
router.get('/handle/:handle',(req,res)=>{
    const errors={};
    Profile.findOne({handle: req.params.handle})
    .populate('user',['name','avatar'])
    .then(profile => {
        if(!profile){
            errors.noprofile='There is no profile for this user handle';
            res.status(404).json(errors);
        }
        res.json(profile);
    })
    .catch(err=> res.status(404).json(err));
})

// @route GET api/profile/handle/(id)
// @description Get profile by user id
// @access Public
router.get('/user/:user_id',(req,res)=>{
    const errors={};
    Profile.findOne({user: req.params.user_id})
    .populate('user',['name','avatar'])
    .then(profile => {
        if(!profile){
            errors.noprofile='There is no profile for this user id';
            res.status(404).json(errors);
        }
        res.json(profile);
    })
    .catch(err=> res.status(404).json({noprofile:'there is no profile for this user id'}));
})

// @route GET api/profile/all
// @description Get all the profile 
// @access Public

router.get('/all',(req,res)=>{
    const errors={};
    Profile.find()
    .populate('user',['name','avatar'])
    .then(profiles => {
        if(!profiles){
            errors.noprofiles='There is no profiles!';
            res.status(404).json(errors);
        }
        res.json(profiles);
    })
    .catch(err=> res.status(404).json({noprofiles:'there is no profiles'}));
})

// @route GET api/profile/test
// @description Create/Update current user's profile
// @access Private
router.post('/update', passport.authenticate('jwt', {session:false}),(req,res)=>{
    const {errors , isValid} = validateProfileInput(req.body);
    //Check validation
    if(!isValid){
        return(res.status(400).json(errors));
    }
    const profileFields={};
    profileFields.user=req.user.id;
    if(req.body.handle) profileFields.handle=req.body.handle;
    if(req.body.about) profileFields.about=req.body.about;
    profileFields.socials={};
    if(req.body.youtube) profileFields.socials.youtube=req.body.youtube;
    if(req.body.twitter) profileFields.socials.twitter=req.body.twitter;
    if(req.body.facebook) profileFields.socials.facebook=req.body.facebook;
    if(req.body.instagram) profileFields.socials.instagram=req.body.instagram;
    Profile.findOne({user: req.user.id})
            .then(profile =>{
            if(profile){
                //Update profile
                Profile.findOneAndUpdate({user: req.user.id},{$set : profileFields},{new: true})
                        .then(profile => res.json(profile));
            }
            else{
                //First entry to profile , we need to create the profile
                //Check if handle is unique
                Profile.findOne({handle: profileFields.handle})
                        .populate('user' , ['name','avatar'])
                        .then(profile =>{
                            if(profile){
                                errors.handle='handle already exists';
                                res.status(400).json(errors);
                            }
                            //Save Profile
                            new Profile(profileFields).save()
                                                      .then(profile =>res.json(profile));
                        })
            }
            });
});   


module.exports = router;