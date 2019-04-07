import './global.css';
import createChart from './components/chart/chart';
import createFooter from './components/footer/footer';
import data from './data';
import { createElement } from './helpers/elements';
import renderChart from './components/chart/render-chart';

const root = document.getElementById('root');

const charts = createElement();

data.forEach((chartData, i) => charts.appendChild(createChart(chartData, 'Chart #1', i)));

root.appendChild(charts);
root.appendChild(createFooter());

data.forEach((chartData, i) => renderChart(document.getElementById('chart' + i), chartData));
