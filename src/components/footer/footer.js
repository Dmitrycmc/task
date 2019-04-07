import createSwitchButton from '../switch-button/switch-button';
import './footer.css';

export default () => {
    const footer = document.createElement('div');
    footer.id = 'footer';
    footer.appendChild(createSwitchButton());
    return footer;
};
