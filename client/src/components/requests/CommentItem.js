import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { deleteComment } from "../../actions/requestActions";

class CommentItem extends Component {
  onDeleteClick(requestId, commentId) {
    this.props.deleteComment(requestId, commentId);
  }

  render() {
    const { comment, requestId, auth } = this.props;

    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href="profile.html">
              <img
                className="rounded-circle d-none d-md-block"
                src={"http://localhost:3000/" + comment.avatar}
                alt=""
              />
            </a>
            <br />
            <p className="text-center">{comment.handle}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{comment.text}</p>
            {comment.user === auth.user.id ? (
              <button
                onClick={this.onDeleteClick.bind(this, requestId, comment._id)}
                type="button"
                className="btn btn-danger mr-1"
              >
                <i className="fa fa-times" />
                Delete Comment
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

CommentItem.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  requestId: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteComment }
)(CommentItem);
