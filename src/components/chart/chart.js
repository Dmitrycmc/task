import createCheckBox from '../check-box/check-box';
import getLines from './line';
import { createElement, createSvgElement } from '../../helpers/elements';
import './chart.css';
import { absToRel, boundBy, calcYBounds, getColumns, interpolate, minmax, relToAbs } from '../../helpers/utils';
import { addDragAndDropListeners, addListener, removeListener } from '../../helpers/event-listeners';
import createMap from '../map/map';
import Tooltip from '../tooltip/tooltip';

const MIN_WIN_WIDTH = 0.05;

export default (data, title) => {
    const chartSvg = createSvgElement('svg', {}, 'ctr_chart');

    const { colors, names, types, columns } = data;

    const { xColumn, yColumns, keys } = getColumns(types, columns);

    let x0 = 0;
    let x1 = 1;
    let y0 = 0;
    let y1 = 1;
    let mouseX = null;
    let mouseXFixed = false;

    let keyToYBound = {};
    const getYBounds = key => keyToYBound[key] || (keyToYBound[key] = calcYBounds(xColumn, yColumns[key], x0, x1));
    const resetYBoundsCash = () => (keyToYBound = {});

    const chartViewportTransform = createSvgElement('g');
    const chartAreaXTransform = createSvgElement('g');

    const wrapper = createElement('crt_wrapper');
    const controls = createElement('crt_controls');
    const header = createElement();
    header.textContent = title;

    wrapper.appendChild(header);
    wrapper.appendChild(chartSvg);
    chartSvg.appendChild(chartViewportTransform);
    chartViewportTransform.appendChild(chartAreaXTransform);
    wrapper.appendChild(controls);
    const tooltip = new Tooltip(chartSvg);
    const init = () => {
        const lines = getLines(keys, xColumn, yColumns, colors);
        const {
            mapNode,
            setMapViewport,
            appendBeforeOverlay,
            setMapWindow,
            windowLeftEdge,
            windowRightEdge,
            mapWindow
        } = createMap();

        const initYMapArea = () => {
            const { min, max } = minmax(keys.map(key => getYBounds(key)));

            keys.forEach(key => {
                lines[key].setYMapArea(min, max);
            });
        };

        const updateIntersections = xRel => {
            const { width, height } = chartSvg.getBoundingClientRect();
            if (xRel !== undefined) mouseX = xRel;

            const tooltipData =
                mouseX &&
                keys
                    .filter(key => lines[key].visibility())
                    .map(key => ({
                        y: interpolate(xColumn, yColumns[key], mouseX),
                        color: colors[key],
                        name: names[key]
                    }));
            tooltip.render(
                'sdf',
                absToRel(mouseX, x0, x1),
                relToAbs(mouseX, xColumn[1], xColumn[xColumn.length - 1]),
                tooltipData
            );

            keys.forEach(key => lines[key].setIntersectionX(mouseX, x0, x1, y0, y1, width, height));
        };

        const updateYArea = () => {
            const { min, max } = minmax(keys.filter(key => lines[key].visibility()).map(key => getYBounds(key)));

            keys.forEach(key => {
                lines[key].setYChartArea(min, max);
            });

            y0 = min;
            y1 = max;
            updateIntersections();
        };

        const deepUpdateYArea = () => {
            resetYBoundsCash();
            updateYArea();
        };

        const setUserViewport = (w, h) => {
            chartViewportTransform.setAttribute('transform', `scale(${w} ${h})`);
        };

        const setXChartArea = (x0, x1) => {
            chartAreaXTransform.setAttribute(
                'transform',
                `
                    scale(${1 / (x1 - x0)} 1) 
                    translate(${-x0} 0)
                `
            );
            deepUpdateYArea();
        };

        const updateXBounds = (a, b) => {
            x0 = a;
            x1 = b;
            setXChartArea(x0, x1);
            setMapWindow(x0, x1);
            updateIntersections();
        };

        const onResize = () => {
            const { width: svgWidth, height: svgHeight } = chartSvg.getBoundingClientRect();
            const { width: mapWidth, height: mapHeight } = mapNode.getBoundingClientRect();
            setUserViewport(svgWidth, svgHeight);
            setMapViewport(mapWidth, mapHeight);

            tooltip.resize();
            setMapWindow(x0, x1);
            updateIntersections();
        };

        const mount = () => {
            wrapper.insertBefore(mapNode, controls);

            keys.forEach(key => {
                chartAreaXTransform.appendChild(lines[key].chartLineNode);

                chartSvg.insertBefore(lines[key].intersectionPoint, tooltip.transformY);

                appendBeforeOverlay(lines[key].mapLineNode);
                controls.appendChild(
                    createCheckBox(colors[key], names[key], value => {
                        lines[key].visibility(value);
                        updateYArea();
                    })
                );
            });
        };

        mount();
        initYMapArea();
        deepUpdateYArea();
        onResize();
        addListener(window, 'resize', onResize);

        const getMapX = x => {
            const rect = mapNode.getBoundingClientRect();
            return (x - rect.left) / rect.width;
        };

        const getChartX = x => {
            const rect = chartSvg.getBoundingClientRect();
            return (x - rect.left) / rect.width;
        };

        addDragAndDropListeners(mapWindow, coords => {
            const width = x1 - x0;
            const left = getMapX(coords.x);
            const right = left + width;
            updateXBounds(boundBy(left, 0, 1 - width), boundBy(right, width, 1));
        });
        addDragAndDropListeners(windowLeftEdge, coords => {
            const left = getMapX(coords.x + 10);
            updateXBounds(boundBy(left, 0, x1 - MIN_WIN_WIDTH), x1);
        });
        addDragAndDropListeners(windowRightEdge, coords => {
            const right = getMapX(coords.x);
            updateXBounds(x0, boundBy(right, x0 + MIN_WIN_WIDTH, 1));
        });

        const onMouseMove = e => updateIntersections(x0 + (x1 - x0) * getChartX(e.clientX));
        addListener(chartSvg, 'mousemove', onMouseMove);
        addListener(chartSvg, 'touchmove', e => updateIntersections(x0 + (x1 - x0) * getChartX(e.touches[0].clientX)));
        addListener(chartSvg, 'mousedown', () => {
            if (mouseXFixed) {
                addListener(chartSvg, 'mousemove', onMouseMove);
            } else {
                removeListener(chartSvg, 'mousemove', onMouseMove);
            }
            mouseXFixed = !mouseXFixed;
        });
    };

    return {
        node: wrapper,
        init
    };
};
