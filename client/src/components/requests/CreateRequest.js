import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
//import InputGroup from "../common/InputGroup";
import SelectListGroup from "../common/SelectListGroup";
import { createRequest } from "../../actions/requestActions";

class CreateRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      title: "",
      theme: "",
      description: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const requestData = {
      title: this.state.title,
      theme: this.state.theme,
      description: this.state.description
    };

    this.props.createRequest(requestData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    // Select options for status
    const options = [
      { label: "Wallpaper", value: "Wallpaper" },
      { label: "Cover", value: "Cover" }
    ];

    return (
      <div className="create-request">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Make Your Request</h1>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Title"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  error={errors.title}
                  info="A title for your request"
                />
                <SelectListGroup
                  placeholder="Theme"
                  name="theme"
                  value={this.state.theme}
                  onChange={this.onChange}
                  options={options}
                  error={errors.theme}
                  info="Give us an idea on what you want"
                />

                <TextAreaFieldGroup
                  placeholder="Description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                  info="A description of your request"
                />

                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateRequest.propTypes = {
  request: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  request: state.request,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createRequest }
)(withRouter(CreateRequest));
