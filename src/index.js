import './global.css';
import createChart from './components/chart/chart';
import createFooter from './components/footer/footer';
import data from './data';
import { createElement } from './helpers/elements';

const charts = createElement();
const root = document.getElementById('root');
root.appendChild(charts);
root.appendChild(createFooter());

data.forEach(chartData => {
    const { node, init } = createChart(chartData, 'Chart #1');
    charts.appendChild(node);
    init();
});
