import icon from './check-icon.svg';
import { createElement } from '../../helpers/elements';

export default () => {
    const img = createElement('icon', 'img');
    img.setAttribute('src', icon);
    return img;
};
