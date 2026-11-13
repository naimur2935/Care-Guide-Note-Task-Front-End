import { initials } from '../api.js';
import { tw } from '../tw.js';

export default function Avatar({ name, small = false }) {
  return <span className={tw('avatar', small && 'avatar-small')}>{initials(name)}</span>;
}
