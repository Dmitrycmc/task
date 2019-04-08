import createCheckBox from '../check-box/check-box';
import renderChart from './render-chart';
import { createElement, createSvgElement } from '../../helpers/elements';
import './chart.css';

export default (data, title) => {
    const svg = createSvgElement('svg', {}, 'ctr_svg');

    const { colors, names } = data;

    const wrapper = createElement('crt_wrapper');
    const controls = createElement();
    const header = createElement();
    header.textContent = title;

    wrapper.appendChild(header);
    wrapper.appendChild(svg);
    wrapper.appendChild(controls);

    const init = () => {
        const keyToSetterVisibility = renderChart(svg, data);

        Object.keys(colors).forEach(key => {
            controls.appendChild(createCheckBox(colors[key], names[key], value => keyToSetterVisibility[key](value)));
        });
    };

    return {
        node: wrapper,
        init
    };
};
