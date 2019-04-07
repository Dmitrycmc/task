import './global.css';
import createSwitchButton from './components/switch-button/switch-button';
import createCheckBox from './components/check-box/check-box';

const root = document.getElementById('root');

root.appendChild(createCheckBox('red', '#1'));
root.appendChild(createSwitchButton());
