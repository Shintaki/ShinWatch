const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load request model
const Request = require("../../models/Request");

//Load Profile Model for the handle
const Profile = require("../../models/Profile");

//Load Comment Validation
const validateCommentInput = require("../../validations/comment");

//Load Validation for request
const validateRequestInput = require("../../validations/request");

// @route GET api/request
// @description show requests by date
// @access Public
router.get("/date", (req, res) => {
  Request.find()
    .sort({ date: -1 })
    .then(request => {
      res.json(request);
    })
    .catch(err => res.status(404).json({ message: "no requests found" }));
});

// @route GET api/request/upvotes
// @description show request by upvotes
// @access Public
router.get("/upvotes", (req, res) => {
  Request.aggregate(
    [
        { "$project": {
            "user": 1,
            "description": 1,
            "theme": 1,
            "handle": 1,
            "title": 1,
            "avatar": 1,
            "likes": 1,
            "reactions": 1,
            "nbr_reactions": 1,
            "comments": 1,
            "date": 1,
            "length": { "$size": "$likes" },
        }},
        { "$sort": { "length": -1 } }
    ],
)
.then( (requests) => 
        {res.json(requests);}    
    )
    .catch(err => res.status(404).json({ message: "no requests found" }));
});

// @route GET api/request/:id
// @description show requests by id
// @access Public
router.get("/:id", (req, res) => {
  Request.findById(req.params.id)
    .then(request => res.json(request))
    .catch(err =>
      res.status(404).json({ message: "no request with this id found" })
    );
});

// @route   GET api/request/all
// @desc    Get all requests
// @access  Public
router.get("/all", (req, res) => {
  const errors = {};

  Request.find()
    .populate("request", ["title", "theme"])
    .then(requests => {
      if (!requests) {
        errors.norequest = "There are no requests";
        return res.status(404).json(errors);
      }

      res.json(requests);
    })
    .catch(err => res.status(404).json({ request: "There are no requests" }));
});
// @route   GET api/request/all/:search
// @desc    Get requests by search tags on handle
// @access  Public
router.get("/all/:search", (req, res) => {
  const errors = {};
  Request.find({ handle: new RegExp(".*" + req.params.search + ".*", "i") })
    .then(requests => {
      if (!requests) {
        errors.norequest = "There are no requests";
        return res.status(404).json(errors);
      }
      res.json(requests);
    })
    .catch(err => res.status(404).json({ request: "There are no requests" }));
});
// @route GET api/request/handle/:handle
// @description Get all requests of a user by handle
// @access Public
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Request.findOne({ handle: req.params.handle })
    .then(request => {
      if (!request) {
        errors.norequest = "There is no requests for this user handle";
        return res.status(404).json(errors);
      }
      res.json(request);
    })
    .catch(err => res.status(404).json(err));
});

// @route GET api/request/user/(id)
// @description Get request by user id
// @access Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Request.findOne({ user: req.params.user_id })
    .then(request => {
      if (!request) {
        errors.norequest = "There is no requests for this user id";
        res.status(404).json(errors);
      }
      res.json(request);
    })
    .catch(err =>
      res
        .status(404)
        .json({ norequest: "there is no requests for this user id" })
    );
});

// @route POST api/request
// @description Create/Update request
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateRequestInput(req.body);
    //Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newRequest = new Request({
      description: req.body.description,
      theme: req.body.theme,
      title: req.body.title,
      avatar: req.user.avatar,
      user: req.user.id
    });
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        newRequest.handle = profile.handle;
        newRequest
          .save()
          .then(request => res.json(request))
          .catch(err => console.log(err));
      })
      .catch(err => {
        errors.handle = "No user profile exists";
        console.log(err);
        return res.status(400).json(errors);
      });
  }
);
// @route   DELETE api/request
// @desc    Delete user and request
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Request.findOneAndRemove({ request: req.request.id }).then(() => {
      User.findOneAndRemove({ _id: req.request.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

// @route POST api/request/like/:id
// @description like request
// @access Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Request.findById(req.params.id)
      .then(request => {
        if (
          request.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          // get index to remove
          const removeIndex = request.likes
            .map(comment => comment.user.toString())
            .indexOf(req.user.id);
          //remove from array
          request.likes.splice(removeIndex, 1);
          //Save
          request.save().then(request => res.json(request));
        } else {
          // Add user id to likes array
          request.likes.unshift({ user: req.user.id });
          request.save().then(request => res.json(request));
        }
      })
      .catch(err =>
        res.status(404).json({ message: "no request with this id to like" })
      );
  }
);

router.post(
  "/react/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Request.findById(req.params.id)
      .then(request => {
        const result = request.reactions.filter(
          reaction => reaction.user.toString() === req.user.id
        );
        if (result.length > 0) {
          // get index to remove
          const removeIndex = request.reactions
            .map(comment => comment.user.toString())
            .indexOf(req.user.id);
          //Check if same reaction or not
          if (req.body.type === result[0].type) {
            //remove from array
            request.reactions.splice(removeIndex, 1);
            //decrement number by 1
            if (result[0].type === "stars") {
              request.nbr_reactions.stars--;
            } else if (result[0].type === "sad") {
              request.nbr_reactions.sad--;
            } else if (result[0].type === "love") {
              request.nbr_reactions.love--;
            } else if (result[0].type === "wow") {
              request.nbr_reactions.wow--;
            } else if (result[0].type === "angry") {
              request.nbr_reactions.angry--;
            } else {
              errors.reactions = "no reaction of this type available";
              return res.status(400).json(errors);
            }
            //Save
            request.save().then(request => res.json(request));
          } else {
            errors.reactions =
              "You already reacted with " +
              result[0].type +
              ", Make sure to remove it first";
            return res.status(400).json(errors);
          }
        } else {
          // Add user id to likes array
          request.reactions.unshift({ user: req.user.id, type: req.body.type });
          //increment number by 1

          if (req.body.type === "stars") {
            request.nbr_reactions.stars++;
          } else if (req.body.type === "sad") {
            request.nbr_reactions.sad++;
          } else if (req.body.type === "love") {
            request.nbr_reactions.love++;
          } else if (req.body.type === "wow") {
            request.nbr_reactions.wow++;
          } else if (req.body.type === "angry") {
            request.nbr_reactions.angry++;
          } else {
            errors.reactions = "no reaction of this type available";
            return res.status(400).json(errors);
          }
          request.save().then(request => res.json(request));
        }
      })
      .catch(err => {
        console.log(err);
        res
          .status(404)
          .json({ message: "no request with this id to react to" });
      });
  }
);

// @route POST api/request/comment/:id
// @description Add comment to request
// @access Private
router.post(
  "/comments/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Request.findById(req.params.id)
      .then(request => {
        const newComment = {
          text: req.body.text, //name:req.body.name,
          avatar: req.user.avatar, //avatar:req.body.avatar,
          user: req.user.id
        };
        Profile.findOne({ user: req.user.id }).then(profile => {
          newComment.handle = profile.handle;
          //Add comment to comments array
          request.comments.unshift(newComment);
          //Save
          request.save().then(request => res.json(request));
        });
      })
      .catch(err => res.status(404).json({ message: "No request found" }));
  }
);

// @route DELETE api/request/comment/:id/:comment_id
// @description Remove comment from request
// @access Private
router.delete(
  "/comments/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Request.findById(req.params.id)
      .then(request => {
        //Check if comment exists
        if (
          request.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }
        //Get remove index
        const removeIndex = request.comments
          .map(comment => comment._id.toString())
          .indexOf(req.params.comment_id);
        //Check comment owner
        if (request.comments[removeIndex].user.toString() !== req.user.id) {
          return res
            .status(401)
            .json({ message: "User not authorized to delete this comment" });
        }
        //Remove comment out
        request.comments.splice(removeIndex, 1); //TODO if more than one comment is writen by a user
        request.save().then(request => res.json(request));
      })
      .catch(err => res.status(404).json({ message: "No request found" }));
  }
);

module.exports = router;
