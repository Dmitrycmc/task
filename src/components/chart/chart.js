import createCheckBox from '../check-box/check-box';
import { createElement } from '../../helpers/elements';
import renderChart from './render-chart';
import './chart.css';

export default (data, title) => {
    const wrapper = createElement('crt_wrapper');
    const controls = createElement();
    const header = createElement();
    header.textContent = title;

    const cnv = renderChart(data);

    const { colors, names } = data;

    Object.keys(colors).forEach(key => {
        controls.appendChild(createCheckBox(colors[key], names[key], value => alert(key + ' ' + value)));
    });

    wrapper.appendChild(header);
    wrapper.appendChild(cnv);
    wrapper.appendChild(controls);

    return wrapper;
};
