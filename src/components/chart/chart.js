import createCheckBox from '../check-box/check-box';
import getLines from './get-lines';
import { createElement, createSvgElement, getSize } from '../../helpers/elements';
import './chart.css';
import { minmax } from '../../helpers/utils';
import { addListener } from '../../helpers/event-listeners';

export default (data, title) => {
    const chartSvg = createSvgElement('svg', {}, 'ctr_chart');
    const mapSvg = createSvgElement('svg', {}, 'ctr_map-chart');

    const { colors, names } = data;

    const wrapper = createElement('crt_wrapper');
    const controls = createElement('crt_controls');
    const map = createElement('ctr_map-container');
    const header = createElement();
    header.textContent = title;

    wrapper.appendChild(header);
    wrapper.appendChild(chartSvg);
    wrapper.appendChild(map);
    wrapper.appendChild(controls);
    map.appendChild(mapSvg);

    const init = () => {
        const lines = getLines(data);
        const keys = Object.keys(colors);

        const updateYChartArea = () => {
            keys.forEach(key => {
                const { min, max } = minmax(
                    keys.map(key => lines[key]).map(({ visibility, y0, y1 }) => ({ excluded: !visibility(), y0, y1 }))
                );
                lines[key].setYChartArea(min, max);
            });
        };

        const updateYMapArea = () => {
            keys.forEach(key => {
                const { min, max } = minmax(keys.map(key => lines[key]));
                lines[key].setYMapArea(min, max);
            });
        };

        const updateSvgBounds = () => {
            const { w: svgWidth, h: svgHeight } = getSize(chartSvg);
            const { w: mapWidth, h: mapHeight } = getSize(map);
            keys.forEach(key => {
                lines[key].setUserViewport(svgWidth, svgHeight);
                lines[key].setMapViewport(mapWidth, mapHeight);
            });
        };

        keys.forEach(key => {
            chartSvg.appendChild(lines[key].chartNode);
            mapSvg.appendChild(lines[key].mapNode);
            controls.appendChild(
                createCheckBox(colors[key], names[key], value => {
                    lines[key].visibility(value);
                    updateYChartArea();
                })
            );
        });

        updateYChartArea();
        updateYMapArea();
        updateSvgBounds();

        addListener(window, 'resize', updateSvgBounds);
    };

    return {
        node: wrapper,
        init
    };
};
