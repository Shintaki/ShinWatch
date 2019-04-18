const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load request model
const Request = require("../../models/Request");

//Load Validation for request
const validateRequestInput = require("../../validations/request");

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
        return(res.status(404).json(errors));
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
          .then(post => res.json(post))
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

module.exports = router;
