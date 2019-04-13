import './global.css';
import createChart from './components/chart/chart';
import createFooter from './components/footer/footer';
import { createElement } from './helpers/elements';

const charts = createElement();
const root = document.getElementById('root');
root.appendChild(charts);
root.appendChild(createFooter());

const getData = dataNum =>
    import(/* webpackChunkName: "data" */ `./data/${dataNum}/overview.json`).then(({ default: data }) => data);


let dataPromise = new Promise(e => e());
[1, 2, 3, 4, 5].forEach(chartNum => {
    dataPromise = dataPromise.then(() => getData(chartNum))
        .then(data => {
            const { node, init } = createChart(data, 'Chart #' + chartNum);
            charts.appendChild(node);
            init();
        })
});