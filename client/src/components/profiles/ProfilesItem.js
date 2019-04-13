import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import isEmpty from '../../utils/is-empty';

class ProfilesItem extends Component {
  render() {
    const { profile } = this.props;
    const arraySocials= [];
    for (var property in profile.socials) {
        let value = profile.socials[property]
        if (profile.socials.hasOwnProperty(property)) {
            let icon="fa fa-"+property;
        arraySocials.unshift({value,icon});
        }
    }
    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <div className="col-2">
            <img src={profile.user.avatar} alt="" className="rounded-circle" />
          </div>
          <div className="col-lg-6 col-md-4 col-8">
            <h3>{profile.handle}</h3>
            <p>
              {profile.status}
            </p>
            <p>
              {isEmpty(profile.location) ? null : (
                <span>{profile.location}</span>
              )}
            </p>
            <p>
              {isEmpty(profile.about) ? null : (
                <span className='lead'>{profile.about}</span>
              )}
            </p>
            <Link to={`/profile/${profile.handle}`} className="btn btn-info">
              View Profile
            </Link>
          </div>
          <div className="col-md-4 d-none d-md-block">
            <h4>Social Links</h4>
            <ul className="list-group">
              {arraySocials.map((object, index) => (
                <a  key={index} style={{textDecoration: 'none' , color: 'black'}} href={object.value}>
                <li key={index} className="list-group-item">
                  <i className={object.icon} />
                  {' '}{object.value}
                </li>
                </a>
              ))}
              {profile.website?
              <a style={{textDecoration: 'none' , color: 'black'}} href={profile.website}>
              <li  className="list-group-item">
                  <i className="fa fa-globe" />
                  {' '}{profile.website}
                </li></a> : null}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

ProfilesItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfilesItem;
