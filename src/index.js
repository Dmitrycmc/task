import './global.css';
import createSwitchButton from './components/switch-button/switch-button';
import createChart from './components/chart/chart';

const root = document.getElementById('root');

root.appendChild(createChart('', 'Chart #1'));
root.appendChild(createChart('', 'Chart #2'));
root.appendChild(createChart('', 'Chart #3'));
root.appendChild(createChart('', 'Chart #4'));
root.appendChild(createChart('', 'Chart #5'));
root.appendChild(createChart('', 'Chart #6'));
root.appendChild(createSwitchButton());
