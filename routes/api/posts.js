const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Post Model
const Post = require('../../models/Post')
//Load Comment Validation
const validateCommentInput = require('../../validations/comment');
// @route GET api/posts/test
// @description tests posts route
// @access Public
router.get('/test', (req, res) => res.json({msg :"Posts Work"}));   


// @route POST api/posts
// @description Create post
// @access Private 
//TODO change this to upload video/image
router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const newPost=new Post({
        object:req.body.object, 
        name: req.user.name, // req.body.name
        avatar: req.user.avatar, // req.body.avatar
        user: req.user.id
    });
    newPost.save()
            .then(post=>res.json(post));
});

// @route GET api/posts
// @description show posts by date
// @access Public
router.get('/',(req,res)=>{
    Post.find()
        .sort({date: -1})
        .then(posts=> res.json(posts))
        .catch(err => res.status(404).json({message: 'no posts found'}))
});    
// @route GET api/posts/:id
// @description show posts by id
// @access Public
router.get('/:id',(req,res)=>{
    Post.findById(req.params.id)
        .then(posts=>res.json(posts))
        .catch(err=>res.status(404).json({message : 'no post with this id found'}))
})

// @route DELETE api/posts/:id
// @description delete post
// @access Private
router.delete('/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Post.findById(req.params.id)
        .then(post=>{
                //Check post owner
                if(post.user.toString()!==req.user.id){
                    return res.status(401).json({message: 'User not authorized to delete this post'})
                }
                //Delete the post
                post.remove().then(()=>res.json({success:true}));
            })
        .catch(err=>res.status(404).json({message: 'no post with this id to delete'}))
});

// @route POST api/posts/like/:id
// @description Like post
// @access Private
//TODO Change this to make different reactions on a post
router.post('/like/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Post.findById(req.params.id)
        .then(post=>{
        
            if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0){
                return res.status(400).json({message: 'Already liked'})
            }     
            // Add user id to likes array
            post.likes.unshift({user: req.user.id});
            post.save().then(post =>res.json(post));
        })
        .catch(err=>res.status(404).json({message: 'no post with this id to like'}))
});

// @route POST api/posts/unlike/:id
// @description Unlike post
// @access Private
//TODO Change this to make different reactions on a post
router.post('/unlike/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Post.findById(req.params.id)
        .then(post=>{
            
            if(post.likes.filter(like=>like.user.toString()===req.user.id).length===0){
                return res.status(400).json({message: 'You have not yet liked this post'})
            }     
            // get index to remove  
            const removeIndex = post.likes
                .map(comment=>comment.user.toString())
                .indexOf(req.user.id); 
                //remove from array
                post.likes.splice(removeIndex,1);
                //Save
                post.save().then(post=>res.json(post));
        })
        .catch(err=>res.status(404).json({message: 'no post with this id to unlike'}))
});

// @route POST api/posts/comment/:id
// @description Add comment to post
// @access Private
router.post('/comments/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors , isValid} = validateCommentInput(req.body);
    //Check Validation
    if(!isValid){
        return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
        .then(post=>{
            const newComment = {
                text:req.body.text,
                name:req.user.name,       //name:req.body.name,
                avatar:req.user.avatar,   //avatar:req.body.avatar,
                user:req.user.id
            } ;
            //Add comment to comments array
            post.comments.unshift(newComment);
            //Save
            post.save().then(post=>res.json(post));
        })
        .catch(err=>res.status(404).json({message: 'No post found'}))
});

// @route DELETE api/posts/comment/:id/:comment_id
// @description Remove comment from post
// @access Private
router.delete('/comments/:id/:comment_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    
    Post.findById(req.params.id)
        .then(post=>{
            //Check if comment exists
            if(post.comments.filter(comment=>comment._id.toString()===req.params.comment_id).length===0){
                return res.status(404).json({commentnotexists: 'Comment does not exist'});
            }
            //Get remove index
            const removeIndex = post.comments
            .map(comment => comment._id.toString())
            .indexOf(req.params.comment_id);
              //Check comment owner
              if(post.comments[removeIndex].user.toString()!==req.user.id){
                return res.status(401).json({message: 'User not authorized to delete this comment'})
            }
            //Remove comment out 
            post.comments.splice(removeIndex,1); //TODO if more than one comment is writen by a user
            post.save().then(post=>res.json(post));
        })
        .catch(err=>res.status(404).json({message: 'No post found'}))
});
module.exports = router;    
