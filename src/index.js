import './global.css';
import createSwitchButton from './components/switch-button/switch-button';
import createChart from './components/chart/chart';
import data from './data';
import { createElement } from './helpers/elements';

const root = document.getElementById('root');

const charts = createElement();

data.forEach(chartData => charts.appendChild(createChart(chartData, 'Chart #1')));

const footer = createElement('footer');
footer.appendChild(createSwitchButton());

root.appendChild(charts);
root.appendChild(footer);
