import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import AuthService from '../services/authService';

export default class Header extends Component {
  static contextType = AuthContext;

  handleLogoutClick = () => {
    localStorage.removeItem('token')
    this.context.setLoggedInState(false);
    this.context.setShelterAdminState(false);
  }

  renderLoginLinks() {
    return (
      <>
        <Link
          className='btn btn-outline-light my-2 my-sm-0 mr-2'
          to='/login'>
          Log in
        </Link>
        <Link
          className='btn btn-outline-light my-2 my-sm-0'
          to='/login/shelter'>
          Shelter log in
        </Link>
      </>
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

  renderShelterNavItems() {
    return (
      <>
        <li className='nav-item active'>
          <Link className='nav-link' to={`/shelters/${AuthService.getShelterIDFromToken()}`}>
            Shelter
          </Link>
        </li>
        <li className='nav-item active'><Link className='nav-link' to='/pets/create'>Add Pets</Link></li>
      </>
    );
  }

  renderUserNavItems() {
    return (
      <>
        <li className='nav-item active'><Link className='nav-link' to='/pets'>Pets</Link></li>
        <li className='nav-item active'><Link className='nav-link' to='/profile'>My Profile</Link></li>
        <li className='nav-item active'><Link className='nav-link' to='/favorites'>Favorites</Link></li>
      </>
    );
  }

  render() {
    return (
      <nav className='navbar navbar-expand-sm navbar-fixed-top navbar-dark bg-info'>
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
            {this.context.isShelterAdmin
              ? this.renderShelterNavItems()
              : this.renderUserNavItems()}
          </ul>
          {this.context.isLoggedIn
            ? this.renderLogoutLink()
            : this.renderLoginLinks()}
        </div>
      </nav>
    );
  }
}
