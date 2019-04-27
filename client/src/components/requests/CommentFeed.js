import React, { Component } from "react";
import PropTypes from "prop-types";
import CommentItem from "./CommentItem";

class CommentFeed extends Component {
  render() {
    const { comments, requestId } = this.props;

    return comments.map(comment => (
      <CommentItem key={comment._id} comment={comment} requestId={requestId} />
    ));
  }
}

CommentFeed.propTypes = {
  comments: PropTypes.array.isRequired,
  requestId: PropTypes.string.isRequired
};

export default CommentFeed;
