import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

export default class Header extends Component {
  static contextType = AuthContext;

  handleLogoutClick = () => {
    // TODO: log user out
    this.context.setLoggedInState(false);
    this.context.setShelterAdminState(false);
  }

  renderLoginLink() {
    return (
      <Link
        className='btn btn-outline-light my-2 my-sm-0'
        to='/login'>
        Log in
      </Link>
    );
  }

  renderLogoutLink() {
    return (
      <Link
        className='btn btn-outline-light my-2 my-sm-0'
        onClick={this.handleLogoutClick}
        to='/'>
        Log out
      </Link>
    );
  }

  render() {
    return (
      <nav className='navbar navbar-expand-sm navbar-fixed-top navbar-dark bg-primary'>
        <Link className='navbar-brand' to='/'>Purrfect Match</Link>
        <button
          className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          data-target='#navbarSupportedContent'
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav mr-auto'>
            <li className='nav-item active'><Link className='nav-link' to='/pets'>Pets</Link></li>
            <li className='nav-item active'><Link className='nav-link' to='/favorites'>Favorites</Link></li>
          </ul>
          {this.context.isLoggedIn
            ? this.renderLogoutLink()
            : this.renderLoginLink()}
        </div>
      </nav>
    );
  }
}
