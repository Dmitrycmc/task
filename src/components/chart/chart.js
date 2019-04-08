import createCheckBox from '../check-box/check-box';
import getLines from './get-lines';
import { createElement, createSvgElement, getSize } from '../../helpers/elements';
import './chart.css';
import { minmax } from '../../helpers/utils';
import { addListener } from '../../helpers/event-listeners';

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
        const lines = getLines(data);

        const keys = Object.keys(colors);

        keys.forEach(key => {
            svg.appendChild(lines[key].node);
            controls.appendChild(createCheckBox(colors[key], names[key], value => lines[key].setVisibility(value)));
        });

        keys.forEach(key => {
            const { min, max } = minmax(
                keys.map(key => lines[key]).map(({ visibility, y0, y1 }) => ({ visible: visibility(), y0, y1 }))
            );
            lines[key].setYChartArea(min, max);
        });

        const updateChart = () => {
            const { w: svgWidth, h: svgHeight } = getSize(svg);
            keys.forEach(key => {
                lines[key].setUserViewport(svgWidth, svgHeight);
            });
        };

        updateChart();

        addListener(window, 'resize', updateChart);
    };

    return {
        node: wrapper,
        init
    };
};
