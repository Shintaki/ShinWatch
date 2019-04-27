import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import ProfilesItem from './ProfilesItem';
import { getProfilesBySearch } from '../../actions/profileActions';
import SearchField from "react-search-field";

class Profiles extends Component {
  componentDidMount() {
    this.props.getProfilesBySearch();
  }
  onChange=(value) => {
      this.props.getProfilesBySearch(value);  
    };
  render() {
    const { profiles, loading } = this.props.profile;
    let profileItems;

    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (profiles.length > 0) {
        profileItems = profiles.map(profile => (
          <ProfilesItem key={profile._id} profile={profile} />
        ));
      } else {
        profileItems = <h4>No profiles found...</h4>;
      }
    }

    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">User Profiles</h1>
              <p className="lead text-center">
                Browse and check out users' profiles
              </p>
              <SearchField
                    
                    placeholder="Search..."
                    onChange={this.onChange.bind(this.value)}
                    classNames="test-class"
              />
              {profileItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profiles.propTypes = {
  getProfilesBySearch: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, {  getProfilesBySearch })(Profiles);
