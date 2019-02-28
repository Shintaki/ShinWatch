import React, { Component } from 'react';
import {Navbar , Nav  } from 'react-bootstrap'

class Topper extends Component {
    render() { 
        return (  
            <div>
                
  <Navbar fixed="top" collapseOnSelect expand="lg" bg="light" variant="light">
    <Navbar.Brand href="/">ShinWatch</Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="/posts">Posts</Nav.Link>
      <Nav.Link href="/products">Products</Nav.Link>
      <Nav.Link href="/requests">Requests</Nav.Link>
    </Nav>
    <Nav >
      <Nav.Link href="/login">Log in</Nav.Link>
      <Nav.Link  href="/register">Sign up</Nav.Link>
    </Nav>
    </Navbar>
    <h1>.</h1>
            </div>
        ) 
    }
}
 
export default Topper;