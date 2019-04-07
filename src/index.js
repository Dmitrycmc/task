import './global.css';
import initSwitchButton from './components/switch-button/switch-button';
import createCheckBox from './components/check-box/check-box';

initSwitchButton();
document.body.appendChild(createCheckBox('red', '#1'));

