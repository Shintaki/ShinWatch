import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import SubProfilesItem from './SubProfilesItem';
import { getProfilesBySearch } from '../../actions/profileActions';
import SearchField from "react-search-field";
import {setSubsByHandle, setSubs} from '../../actions/authActions';

class SubProfiles extends Component {
  componentDidMount() {
    this.props.setSubs();
  }
  onChange=(value) => {
    this.props.setSubsByHandle(value); 
    };
  render() {
    const { loading } = this.props.profile;
    const profiles = this.props.subscriptions.subscriptions;
    let profileItems;

    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (profiles.length > 0) {
        profileItems = profiles.map(profile => (
          <SubProfilesItem key={profile._id} profile={profile} />
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
              <h1 className="display-4 text-center">Subscriptions Profiles</h1>
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

SubProfiles.propTypes = {
  getProfilesBySearch: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  subscriptions: PropTypes.object.isRequired,
  setSubsByHandle: PropTypes.func.isRequired,
  setSubs: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  subscriptions: state.subscriptions
});

export default connect(mapStateToProps, {  getProfilesBySearch , setSubsByHandle, setSubs })(SubProfiles);
