import './global.css';
import createChart from './components/chart/chart';
import createFooter from './components/footer/footer';
import data1 from './data/1/overview';
import data2 from './data/2/overview';
import data3 from './data/3/overview';
import data4 from './data/4/overview';
import data5 from './data/5/overview';
import { createElement } from './helpers/elements';

const charts = createElement();
const root = document.getElementById('root');
root.appendChild(charts);
root.appendChild(createFooter());

[data1].forEach(chartData => {
    const { node, init } = createChart(chartData, 'Chart #1');
    charts.appendChild(node);
    init();
});

[data2].forEach(chartData => {
    const { node, init } = createChart(chartData, 'Chart #2');
    charts.appendChild(node);
    init();
});


[data3].forEach(chartData => {
    const { node, init } = createChart(chartData, 'Chart #3');
    charts.appendChild(node);
    init();
});


[data4].forEach(chartData => {
    const { node, init } = createChart(chartData, 'Chart #4');
    charts.appendChild(node);
    init();
});


[data5].forEach(chartData => {
    const { node, init } = createChart(chartData, 'Chart #5');
    charts.appendChild(node);
    init();
});
