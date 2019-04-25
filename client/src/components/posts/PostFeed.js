import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PostItem from './PostItem';

class PostFeed extends Component {
  render() {
    const { posts } = this.props;

    return posts.map(post => <PostItem  type={this.props.type} key={post.id} post={post} />);
  }
}

PostFeed.propTypes = {
  posts: PropTypes.array.isRequired
};

export default PostFeed;
