import React, { Component } from 'react';
class Landing extends Component {
    render() { 
        return (  
            <div>
            <div className="landing">
    <div className="dark-overlay landing-inner text-light">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h1 className="display-3 mb-4">Shin Watch
            </h1>
            <p className="lead"> Check out and request covers and arts , share your own with the world and gain products by being active</p>
            <hr />
            <a href="register" className="btn btn-lg btn-info mr-2">Sign Up</a>
            <a href="login" className="btn btn-lg btn-light">Login</a>
          </div>
        </div>
      </div>
    </div>
  </div>    
            </div>
        );
    }
}
 
export default Landing;