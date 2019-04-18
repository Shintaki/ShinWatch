import React, { Component } from 'react';
import isEmpty from '../../utils/is-empty';
import {addSub} from '../../actions/profileActions';
import {setSubs} from '../../actions/authActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

class ProfileHeader extends Component {

  onClick(){
    this.props.addSub(this.props.profile.handle); 
  }
  render() {
    if(this.props.auth.isAuthentificated) this.props.setSubs(); 
    const { profile} = this.props;
    const avatarLink = "http://localhost:3000/"+profile.user.avatar;
    const subButton=(<button
      onClick={this.onClick.bind(this)}
      className="btn btn-light"
    >Subscribe</button>);


    const unsubButton=(<button
      onClick={this.onClick.bind(this)}
      className="btn btn-danger"
    >Unsubscribe</button>)
    
    
    const button =(this.props.subscriptions.subscriptions.filter(sub=>sub.profile.handle===this.props.profile.handle).length>0? unsubButton : subButton);
    
    const CheckSubsButton=(<Link to='/subprofiles'><button
      className="btn btn-primary"
    >Check Subs</button></Link>)
    
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-info text-white mb-3">
            <div className="row">
              <div className="col-4 col-md-6 m-auto">
                <img
                style={{
                  width:  "500px",
                  height: "500px",
                position: "center"}}
                  className="rounded-circle"
                  src={avatarLink}
                  alt=""
                />
              </div>
            </div>
            <div className="text-center">
              <h1 className="display-4 text-center">{profile.handle}</h1>
              <p className="lead text-center">
                {profile.status}{' '}
              </p>
              {isEmpty(profile.location) ? null : <p>{profile.location}</p>}
              <p>
                {isEmpty(profile.website) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.website}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i className="fa fa-globe fa-2x" />
                  </a>
                )}

                {isEmpty(profile.socials && profile.socials.twitter) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.socials.twitter}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i className="fa fa-twitter fa-2x" />
                  </a>
                )}

                {isEmpty(profile.socials && profile.socials.facebook) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.socials.facebook}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i className="fa fa-facebook fa-2x" />
                  </a>
                )}

                {isEmpty(profile.socials && profile.socials.youtube) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.socials.youtube}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i className="fa fa-youtube fa-2x" />
                  </a>
                )}

                {isEmpty(profile.socials && profile.socials.instagram) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.socials.instagram}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <i className="fa fa-instagram fa-2x" />
                  </a>
                )}
              </p>
            {this.props.auth.isAuthentificated && (this.props.profile.handle!==this.props.auth.user.handle)? button : null}
            {this.props.auth.isAuthentificated && (this.props.profile.handle===this.props.auth.user.handle)? CheckSubsButton : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfileHeader.propTypes = {
  addSub: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  setSubs: PropTypes.func.isRequired,
  subscriptions: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  subscriptions: state.subscriptions
});


export default connect(mapStateToProps, { addSub ,setSubs})(ProfileHeader);
