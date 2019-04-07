import createCheckBox from '../check-box/check-box';
import { createElement, createSvgElement } from '../../helpers/elements';
import './chart.css';

export default ({ colors, names }, title, key) => {
    const wrapper = createElement('crt_wrapper');
    const controls = createElement();
    const header = createElement();
    header.textContent = title;

    Object.keys(colors).forEach(key => {
        controls.appendChild(createCheckBox(colors[key], names[key], value => alert(key + ' ' + value)));
    });

    const svg = createSvgElement('svg', { id: 'chart' + key }, 'ctr_svg');

    wrapper.appendChild(header);
    wrapper.appendChild(svg);
    wrapper.appendChild(controls);

    return wrapper;
};
