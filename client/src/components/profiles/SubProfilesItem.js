import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import isEmpty from '../../utils/is-empty';
import Moment from 'react-moment';

class SubProfilesItem extends Component {
  render() {
    const sub = this.props.profile;
    const arraySocials= [];
    for (var property in sub.profile.socials) {
        let value = sub.profile.socials[property]
        if (sub.profile.socials.hasOwnProperty(property)) {
            let icon="fa fa-"+property;
        arraySocials.unshift({value,icon});
        }
    }
    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <div className="col-2">
            <img style={{
              width:  '130px',
              height: '130px'}}
              src={sub.profile.avatar} alt="" 
              className="rounded-circle" />
          </div>
          <div className="col-lg-6 col-md-4 col-8">
            <h3>{sub.profile.handle}</h3>
            <p>
              {sub.profile.status}
            </p>
            <p>
              {isEmpty(sub.profile.location) ? null : (
                <span>{sub.profile.location}</span>
              )}
            </p>
            <p>
              {isEmpty(sub.profile.about) ? null : (
                <span className='lead'>{sub.profile.about}</span>
              )}
            </p>
             <p>
               <span>Subbed since : <Moment format="YYYY-MMM ">{sub.date}</Moment></span>
            </p>
            <Link to={`/profile/${sub.profile.handle}`} className="btn btn-info">
              View profile
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
              {sub.profile.website?
              <a style={{textDecoration: 'none' , color: 'black'}} href={sub.profile.website}>
              <li  className="list-group-item">
                  <i className="fa fa-globe" />
                  {' '}{sub.profile.website}
                </li></a> : null}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

SubProfilesItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default SubProfilesItem;
