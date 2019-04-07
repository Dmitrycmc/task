import './global.css';
import createChart from './components/chart/chart';
import createFooter from './components/footer/footer';
import data from './data';
import { createElement } from './helpers/elements';

const root = document.getElementById('root');

const charts = createElement();
data.forEach(chartData => charts.appendChild(createChart(chartData, 'Chart #1')));

root.appendChild(charts);
root.appendChild(createFooter());
