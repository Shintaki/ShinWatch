import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { addLike, addReaction } from "../../actions/requestActions";
class RequestItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  onLikeClick(id) {
    this.props.addLike(id,this.props.type);
  }

  onReactClick(id, type) {
    this.props.addReaction(id, type);
  }

  findUserLike(upvotes) {
    const { auth } = this.props;
    if (upvotes.filter(like => like.user === auth.user.id).length > 0) {
      return true;
    } else {
      return false;
    }
  }

  findUserReact(reactions) {
    const { auth } = this.props;
    if (reactions.filter(react => react.user === auth.user.id).length > 0) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { request, showActions, errors } = this.props;
    const linkProfile = "profile/" + request.handle;
    const likeButton = (
      <button
        onClick={this.onLikeClick.bind(this, request._id)}
        type="button"
        className="btn btn-light mr-1"
      >
        <i
          className={classnames("fa fa-thumbs-up", {
            "text-info": this.findUserLike(request.likes)
          })}
        />
        <span className="badge badge-light">{request.likes.length}</span>
      </button>
    );

    const redirectButton = (
      <Link to="/login">
        <button type="button" className="btn btn-light mr-1">
          <i
            className={classnames("fa fa-thumbs-up", {
              "text-info": this.findUserLike(request.likes)
            })}
          />
          <span className="badge badge-light">{request.likes.length}</span>
        </button>
      </Link>
    );

    const Content = <p src={"http://localhost:3000/" + request.content} />;

    // item in all requests display format
    const itemFormat = (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href={linkProfile} style={{ textDecoration: "none" }}>
              <img
                className="rounded-circle d-none d-md-block"
                style={{
                  width: "130px",
                  height: "130px"
                }}
                src={"http://localhost:3000/" + request.avatar}
                alt=""
              />
              <br />
              <p className="text-center" style={{ color: "black" }}>
                By : {request.handle}
              </p>
            </a>
            <p className="text-center">Requested in :</p>
            <p className="text-center">
              <Moment format="YYYY-MM-DD HH:mm">{request.date}</Moment>
            </p>
          </div>
          <div className="col-md-10">
            <Link
              to={`/request/${request._id}`}
              className="text-center"
              style={{
                fontSize: "25px",
                textDecoration: "none",
                color: "black"
              }}
            >
              <p>{request.title}</p>
            </Link>
            {
              //showActions ? null :
              <textarea readOnly rows="9" cols="90" className="lead">
                {request.description}
              </textarea>
            }
            <div className="lead">{Content}</div>
            <span>
              {this.props.auth.isAuthentificated ? likeButton : redirectButton}

              <Link
                to={`/request/${request._id}`}
                className="btn btn-info mr-1"
              >
                Comments
                <span
                  style={{ marginLeft: "5px" }}
                  className="badge badge-light"
                >
                  {request.comments.length}
                </span>
              </Link>
            </span>
          </div>
        </div>
      </div>
    );
    // element to display reactions when logged in
    const reactionDisplay = (
      <div>
        <div
          className={classnames("form-control form-control-lg", {
            "is-invalid": errors.reactions
          })}
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            display: "block",
            width: "35%"
          }}
        >
          <span>
            <button
              onClick={this.onReactClick.bind(this, request._id, "love")}
              type="button"
              className="btn btn-light mr-1"
            >
              <i
                className={classnames("far fa-grin-hearts", {
                  "text-info": this.findUserReact(request.reactions)
                })}
              />

              <span className="badge badge-light">
                {request.nbr_reactions.love}
              </span>
            </button>
          </span>
          <span>
            <button
              onClick={this.onReactClick.bind(this, request._id, "wow")}
              type="button"
              className="btn btn-light mr-1"
            >
              <i
                className={classnames("far fa-surprise", {
                  "text-info": this.findUserReact(request.reactions)
                })}
              />

              <span className="badge badge-light">
                {request.nbr_reactions.wow}
              </span>
            </button>
          </span>
          <span>
            <button
              onClick={this.onReactClick.bind(this, request._id, "sad")}
              type="button"
              className="btn btn-light mr-1"
            >
              <i
                className={classnames("far fa-sad-tear", {
                  "text-info": this.findUserReact(request.reactions)
                })}
              />

              <span className="badge badge-light">
                {request.nbr_reactions.sad}
              </span>
            </button>
          </span>
          <span>
            <button
              onClick={this.onReactClick.bind(this, request._id, "angry")}
              type="button"
              className="btn btn-light mr-1"
            >
              <i
                className={classnames("far fa-angry", {
                  "text-info": this.findUserReact(request.reactions)
                })}
              />

              <span className="badge badge-light">
                {request.nbr_reactions.angry}
              </span>
            </button>
          </span>
          <span>
            <button
              onClick={this.onReactClick.bind(this, request._id, "stars")}
              type="button"
              className="btn btn-light mr-1"
            >
              <i
                className={classnames("far fa-grin-stars", {
                  "text-info": this.findUserReact(request.reactions)
                })}
              />

              <span className="badge badge-light">
                {request.nbr_reactions.stars}
              </span>
            </button>
          </span>
        </div>

        {errors.reactions && (
          <div className="invalid-feedback" style={{ textAlign: "center" }}>
            {errors.reactions}
          </div>
        )}
      </div>
    );

    const loginButton = (
      <div className="wrapper" style={{ textAlign: "center" }}>
        <Link to="/login">
          <button type="button" className="btn btn-light">
            Login first to React
          </button>
        </Link>
      </div>
    );

    const requestFormat = (
      <div>
        <p
          className="text-center"
          style={{
            fontSize: "35px",
            fontFamily: "Leitura News",
            fontStyle: "italic"
          }}
        >
          {request.title}
        </p>
        <div className="card card-body mb-3">
          <div className="row">
            <div className="col-md-2">
              <a href={linkProfile}>
                <img
                  className="rounded-circle d-none d-md-block"
                  src={"http://localhost:3000/" + request.avatar}
                  alt=""
                />
                <br />
                <p className="text-center" style={{ color: "black" }}>
                  {request.handle}
                </p>
              </a>
              <p className="text-center">Requested in :</p>
              <p className="text-center">
                <Moment format="YYYY-MM-DD HH:mm">{request.date}</Moment>
              </p>
            </div>
            <div className="col-md-10">
              {showActions ? null : (
                <p className="lead">{request.description}</p>
              )}
            </div>
          </div>
        </div>
        <div
          className="lead"
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            display: "block",
            width: "60%"
          }}
        >
          {Content}
        </div>

        {this.props.auth.isAuthentificated ? reactionDisplay : loginButton}
      </div>
    );
    return <div>{showActions ? itemFormat : requestFormat}</div>;
  }
}

RequestItem.defaultProps = {
  showActions: true
};

RequestItem.propTypes = {
  addLike: PropTypes.func.isRequired,
  addReaction: PropTypes.func.isRequired,
  request: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addLike, addReaction }
)(RequestItem);
