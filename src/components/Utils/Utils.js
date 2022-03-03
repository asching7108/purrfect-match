import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faEdit,
  faEnvelope,
  faGlobe,
  faHeart,
  faHouseUser,
  faLocationArrow,
  faPhone,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthService from '../../services/authService';
import UsersService from '../../services/usersService';
import './Utils.css'

// page container
export function Section({ className, ...props }) {
  return (
    <section className={['container mt-3 mb-3', className].join(' ')} {...props} />
  );
}

export function FormGroup({ className, ...props }) {
  return (
    <div className={['form-group', className].join(' ')} {...props} />
  );
}

export function Input({ className, type, ...props }) {
  return (
    <input className={['form-control', className].join(' ')} type={type || 'text'} {...props} />
  );
}

export function Checkbox({ className, ...props }) {
  return (
    <input className={['form-check-input', className].join(' ')} type='checkbox' {...props} />
  );
}

export function Select({ className, ...props }) {
  return (
    <select className={['form-control form-select', className].join(' ')} {...props} />
  );
}

export function TextArea({ className, ...props }) {
  return (
    <textarea className={['form-control', className].join(' ')} {...props} />
  );
}

export function PrimaryButton({ className, ...props }) {
  return (
    <button className={['btn btn-info btn-block', className].join(' ')} {...props} />
  );
}

export function SecondaryButton({ className, ...props }) {
  return (
    <button className={['btn btn-outline-info btn-block', className].join(' ')} {...props} />
  );
}

export function isShelterAdmin(shelterID) {
  return AuthService.getShelterIDFromToken() === shelterID;
}

export function renderFavoriteIcon(petID, isFavorite, callback) {
  if (AuthService.isLoggedIn()) {
    if (isFavorite) {
      return (
        <span className='favorite-selected' onClick={(e) => { unfavoriteButtonClick(e, petID, callback) }}>
          <FontAwesomeIcon className='heart' icon='heart' />
        </span>
      );
    }
  }
  // return nothing if shelter admin
  if (AuthService.isShelterAdmin()) {
    return (<></>);
  }
  return (
    <span className='favorite-not-selected' onClick={(e) => { favoriteButtonClick(e, petID, callback) }}>
      <FontAwesomeIcon className='heart-outline' icon={['far', 'heart']} />
    </span>
  );
}

async function favoriteButtonClick(e, petID, callback) {
  e.stopPropagation()
  try {
    if (!AuthService.isLoggedIn()) {
      const currentLocation = window.location.pathname;
      window.location.replace('/login?redirect=' + currentLocation);
    }
    await UsersService.addUserFavorite(AuthService.getUserIDFromToken(), petID)
    callback();
  } catch (err) {
    console.log(err)
  }
}

async function unfavoriteButtonClick(e, petID, callback) {
  e.stopPropagation()
  try {
    await UsersService.removeUserFavorite(AuthService.getUserIDFromToken(), petID)
    callback();
  } catch (err) {
    console.log(err)
  }
}

export function registerIcons() {
  library.add(
    faEdit,
    faEnvelope,       // email
    faGlobe,          // website
    faHeart,          // favorites
    faHouseUser,      // shelter
    faPhone,          // phone
    faLocationArrow,  // address
    faTrashAlt,
    far,
    fab
  );
}
