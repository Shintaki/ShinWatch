import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ProfileHeader from './ProfileHeader';
import ProfileAbout from './ProfileAbout';
import Spinner from '../common/Spinner';
import { getProfileByHandle } from '../../actions/profileActions';
import { getPostsByHandle } from '../../actions/postActions';
import ImageGallery from 'react-image-gallery';
import youtubeURLtoID from '../../utils/youtubeURLtoID';
const hrefLink = '';

class ShowProfile extends Component {
  constructor() {
    super();
    this.state = {
      showIndex: true,
      showBullets: true,
      showThumbnails: true,
      showNav: true,
      slideOnThumbnailOver: false,
      thumbnailPosition: 'bottom',  
      showVideo: {},
    }
    };
  componentDidMount() {
    if (this.props.match.params.handle) {
      this.props.getProfileByHandle(this.props.match.params.handle);
      this.props.getPostsByHandle(this.props.match.params.handle);
  }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile.profile === null && this.props.profile.loading && nextProps.post.posts.length===0) {
      this.props.history.push('/not-found');
    }
  } 

  _handleInputChange(state, event) {
    this.setState({[state]: event.target.value});
  }

  _handleCheckboxChange(state, event) {
    this.setState({[state]: event.target.checked});
  }

  _handleThumbnailPositionChange(event) {
    this.setState({thumbnailPosition: event.target.value});
  }


  

  _toggleShowVideo(url) {
    this.state.showVideo[url] = !Boolean(this.state.showVideo[url]);
    this.setState({
      showVideo: this.state.showVideo
    });

    if (this.state.showVideo[url]) {
      if (this.state.showPlayButton) {
        this.setState({showGalleryPlayButton: false});
      }

      if (this.state.showFullscreenButton) {
        this.setState({showGalleryFullscreenButton: false});
      }
    }
  }

  _renderVideo(item) {
    return (
      <div className='image-gallery-image'>
        {
            <div className='video-wrapper'>
                <a
                  href={hrefLink}
                  className='close-video'
                  onClick={this._toggleShowVideo.bind(this, item.embedUrl)}
                >
                </a>
                <iframe
                  title={item.id}
                  width='1080'
                  height='500'
                  src={item.embedUrl}
                  frameBorder='0'
                  allowFullScreen
                >
                </iframe>
            </div>
        }
      </div>
    );
  }

  render() {
    const { profile, loading  } = this.props.profile;
    const { posts } = this.props.post;
    let profileContent;
    let elements = [];
    if (profile === null || loading) {
      profileContent = <Spinner />;
    } else {
      posts.map(post => { 
        const element = {}; 
          if (post.type==="Image"){
            element.original="http://localhost:3000/"+post.content;
            element.thumbnail="http://localhost:3000/"+post.content;
            element.description=post.title;
          }
          if(post.type==="Video"){
            // converts Youtube URL to video id
            const id=youtubeURLtoID(post.content);

            element.thumbnail= `https://img.youtube.com/vi/`+id+`/0.jpg`;
            element.original= `https://img.youtube.com/vi/`+id+`/0.jpg`;
            element.embedUrl= 'https://www.youtube.com/embed/'+id;
            element.description=post.title;
            element.renderItem= this._renderVideo.bind(this)
          }
      elements.push(element);
      return elements.length;
    });
    
      
      const postsDisplay=(<ImageGallery 
        items={elements} 
        showFullscreenButton={false}
        showPlayButton={false}
        showThumbnails={this.state.showThumbnails}
        showIndex={this.state.showIndex}
        showNav={this.state.showNav}
        thumbnailPosition={this.state.thumbnailPosition}
        slideOnThumbnailOver={this.state.slideOnThumbnailOver}/>);
      profileContent = (
        <div>
          <div className="row">
            
        <div className="col-md-6" />
      </div>
          <ProfileHeader profile={profile} />
          <ProfileAbout profile={profile} />
          
          <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3">
            <h3 className="text-center text-info">{profile.handle}'s Posts</h3>
            {this.props.post.posts.length>0 ? null : <p className="lead">This user didnt's post anything yet</p>}
          </div>
        </div>
      </div>
      {this.props.post.posts.length>0 ? postsDisplay : null}

        </div>

      );
    }

    return (
      <div className="profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12">{profileContent}</div>
          </div>
          </div>
      </div>
    );
  }
}

ShowProfile.propTypes = {
  getProfileByHandle: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  getPostsByHandle: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  post: state.post,
});

export default connect(mapStateToProps, { getProfileByHandle , getPostsByHandle})(ShowProfile);
