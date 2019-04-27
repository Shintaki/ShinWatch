import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { clearCurrentProfile } from '../../actions/profileActions';

class Topper extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
    this.props.clearCurrentProfile();
  }

  render() {
    const { isAuthentificated, user } = this.props.auth;
    const hrefLink = '#';
    const avatarLink = "http://localhost:3000/"+user.avatar;
    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a
            style={{fontSize:'20px' ,fontFamily: 'Leitura News' , fontStyle: 'italic'}}
            href="/profile"
            className="nav-link"
          >
            <img
              className="rounded-circle"
              src={avatarLink}
              alt={user.name}
              style={{ width: '40px', height: '30px', marginRight: '5px' }}
            />
            Profile
          </a>
        </li>
        <li className="nav-item">
          <a
            style={{fontSize:'20px' ,fontFamily: 'Leitura News' , fontStyle: 'italic',marginTop: '2px'}}
            href={hrefLink}
            onClick={this.onLogoutClick.bind(this)}
            className="nav-link"
          >
            Logout
          </a>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" style={{fontSize:'20px' ,fontFamily: 'Leitura News' , fontStyle: 'italic'}} to="/register">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" style={{fontSize:'20px' ,fontFamily: 'Leitura News' , fontStyle: 'italic'}} to="/login">
            Login
          </Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" style={{fontSize:'25px' ,fontFamily: 'Leitura News' , fontStyle: 'italic'}} to="/" >
          <img
              src="http://localhost:3000/public/icons/Untitled.png"
              alt=''
                style={{ width: '100px', height: '30px', marginRight: '5px' }}
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            <ul className="navbar-nav mr-auto">
            <li className="nav-item">
                <Link className="nav-link" style={{fontSize:'20px' ,fontFamily: 'Leitura News' , fontStyle: 'italic'}} to="/profiles">
                  {' '}
                  Profiles
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" style={{fontSize:'20px' ,fontFamily: 'Leitura News' , fontStyle: 'italic'}} to="/posts">
                  {' '}
                  Posts
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" style={{fontSize:'20px' ,fontFamily: 'Leitura News' , fontStyle: 'italic'}} to="/products">
                  {' '}
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" style={{fontSize:'20px' ,fontFamily: 'Leitura News' , fontStyle: 'italic'}} to="/requests">
                  {' '}
                  Requests
                </Link>
              </li>
            </ul>
            {isAuthentificated ? authLinks : guestLinks}
          </div>
        </div>
      </nav>
    );
  }
}

Topper.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser , clearCurrentProfile })(Topper);
