import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faCog,
  faHeart
} from '@fortawesome/free-solid-svg-icons';

export function registerIcons() {
  library.add(
    faCog,    // settings
    faHeart,  // favorites
    far,
    fab
  );
}
