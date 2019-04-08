import createCheckBox from '../check-box/check-box';
import getLines from './get-lines';
import { createElement, createSvgElement, getSize } from '../../helpers/elements';
import './chart.css';
import { minmax } from '../../helpers/utils';
import { addListener } from '../../helpers/event-listeners';
import createMap from './map';

export default (data, title) => {
    const chartSvg = createSvgElement('svg', {}, 'ctr_chart');

    const chartViewportTransform = createSvgElement('g');
    const chartAreaXTransform = createSvgElement('g');

    const { colors, names } = data;

    const wrapper = createElement('crt_wrapper');
    const controls = createElement('crt_controls');
    const header = createElement();
    header.textContent = title;

    wrapper.appendChild(header);
    wrapper.appendChild(chartSvg);
    chartSvg.appendChild(chartViewportTransform);
    chartViewportTransform.appendChild(chartAreaXTransform);
    wrapper.appendChild(controls);

    const init = () => {
        const lines = getLines(data);
        const { mapNode, setMapViewport, appendBeforeOverlay, setMapWindow } = createMap();

        const keys = Object.keys(colors);

        const updateYChartArea = () => {
            keys.forEach(key => {
                const { min, max } = minmax(
                    keys.map(key => lines[key]).map(({ visibility, y0, y1 }) => ({ excluded: !visibility(), y0, y1 }))
                );
                lines[key].setYChartArea(min, max);
                lines[key].setYMapArea(min, max);
            });
        };

        const setUserViewport = (w, h) => {
            chartViewportTransform.setAttribute('transform', `scale(${w} ${h})`);
        };

        const setXChartArea = (x0, x1) => {
            chartAreaXTransform.setAttribute(
                'transform', `
                    scale(${1 / (x1 - x0)} 1) 
                    translate(${-x0} 0)
                `
            );
        };

        const updateSvgBounds = () => {
            const { w: svgWidth, h: svgHeight } = getSize(chartSvg);
            const { w: mapWidth, h: mapHeight } = getSize(mapNode);
            setUserViewport(svgWidth, svgHeight);
            setMapViewport(mapWidth, mapHeight);
        };

        const mount = () => {
            wrapper.insertBefore(mapNode, controls);

            keys.forEach(key => {
                chartAreaXTransform.appendChild(lines[key].chartLineNode);
                appendBeforeOverlay(lines[key].mapLineNode);
                controls.appendChild(
                    createCheckBox(colors[key], names[key], value => {
                        lines[key].visibility(value);
                        updateYChartArea();
                    })
                );
            });
        };

        mount();
        updateYChartArea();
        updateSvgBounds();
        setXChartArea(0.5, 0.75);
        setMapWindow(0.5, 0.75);
        addListener(window, 'resize', updateSvgBounds);
    };

    return {
        node: wrapper,
        init
    };
};
