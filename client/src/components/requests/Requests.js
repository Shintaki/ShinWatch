import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import RequestFeed from "./RequestFeed";
import Spinner from "../common/Spinner";
import { getRequests, getRequestsByType } from "../../actions/requestActions";
import { setSubs } from "../../actions/authActions";
import SelectListGroup from "../common/SelectListGroup";

class Requests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "upvotes"
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.props.getRequestsByType(this.state.type);
  }
  componentDidMount() {
    this.props.getRequestsByType("date");
   }

  render() {
    const { requests, loading } = this.props.request;
    let requestContent;
    let type;
    this.state.type==='date'? type='upvotes' : type='date' 
    const options = [
      { label: "Date", value: "upvotes" },
      { label: "Upvotes", value: "date" }
    ];
    if (requests === null || loading) {
      requestContent = <Spinner />;
    } else {
      requestContent = (
        <div>
          <SelectListGroup
            placeholder="Type"
            name="type"
            value={this.state.type}
            onChange={this.onChange}
            options={options}
            info="Choose how you want to filter requests"
          />
          <RequestFeed type={type} requests={requests} />
        </div>
      );
    }

    return (
      <div className="feed">
        <div className="container">
          <div className="row">
            <div className="col-md-12">{requestContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

Requests.propTypes = {
  getRequests: PropTypes.func.isRequired,
  getRequestsByType: PropTypes.func.isRequired,
  request: PropTypes.object.isRequired,
  subscriptions: PropTypes.object.isRequired,
  setSubs: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  request: state.request,
  subscriptions: state.subscriptions
});

export default connect(
  mapStateToProps,
  { getRequests, getRequestsByType, setSubs }
)(Requests);
