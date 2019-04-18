const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRequestInput(data) {
  let errors = {};
  data.title = !isEmpty(data.title) ? data.title : "";
  data.theme = !isEmpty(data.theme) ? data.theme : "";
  data.description = !isEmpty(data.description) ? data.description : "";

  if (!Validator.isLength(data.title, { min: 2, max: 40 })) {
    errors.title = "Title must be between 2 and 40 characters";
  }
  if (Validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }

  if (Validator.isEmpty(data.theme)) {
    errors.theme = "Theme field is required";
  }
  if (Validator.isEmpty(data.description)) {
    errors.description = "Description field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
