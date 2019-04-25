import React, { Component } from 'react';
class Footer extends Component {
    render() { 
        return (  
            <footer className="bg-dark text-white mt-4 p-4 text-center" style={{fontFamily: 'Leitura News' , fontStyle: 'italic'}}> 
    Copyright &copy; {new Date().getFullYear()} ShinWatch
  </footer>
        );
    }
}
 
export default Footer;