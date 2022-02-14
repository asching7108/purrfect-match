import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faEnvelope,
  faGlobe,
  faHeart,
  faLocationArrow,
  faPhone
} from '@fortawesome/free-solid-svg-icons';

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
    <button className={['btn btn-primary btn-block', className].join(' ')} {...props} />
  );
}

export function SecondaryButton({ className, ...props }) {
  return (
    <button className={['btn btn-outline-primary btn-block', className].join(' ')} {...props} />
  );
}

export function registerIcons() {
  library.add(
    faEnvelope,       // email
    faGlobe,          // website
    faHeart,          // favorites
    faPhone,          // phone
    faLocationArrow,  // address
    far,
    fab
  );
}
