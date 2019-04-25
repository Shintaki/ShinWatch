import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PostFeed from './PostFeed';
import Spinner from '../common/Spinner';
import { getPosts, getPostsByType } from '../../actions/postActions';
import { setSubs } from '../../actions/authActions';
import SelectListGroup from '../common/SelectListGroup';

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "upvotes"   
    };
    
    this.onChange = this.onChange.bind(this);
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value  });
    this.props.getPostsByType(this.state.type);
  }
  componentDidMount() {
    this.props.getPostsByType("date");
    this.props.setSubs();
  }

  render() {
   //TODO make the filters work
    const { posts, loading } = this.props.post;
    let postContent;
    let type;
    this.state.type==='date'? type='upvotes' : type='date' 
    const options = [
      { label: 'Date', value: 'upvotes' },
      { label: 'Upvotes', value: 'date' }
    ];
    if (posts === null || loading) {
      postContent = <Spinner />;
    } else {
      postContent = <div>
        <SelectListGroup
                  placeholder="Type"
                  name="type"
                  value={this.state.type}
                  onChange={this.onChange}
                  options={options}
                  info="Choose how you want to filter posts"
                />
        <PostFeed type={type} posts={posts} />
      </div>
    }

    return (
      <div className="feed">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {postContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  getPostsByType: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  subscriptions: PropTypes.object.isRequired,
  setSubs: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  post: state.post,
  subscriptions: state.subscriptions
});

export default connect(mapStateToProps, { getPosts , getPostsByType ,setSubs })(Posts);
