import { createElement, createSvgElement } from '../../helpers/elements';
import './map.css';

export default () => {
    const mapSvg = createSvgElement('svg', {}, 'map-chart');
    const map = createElement('map-container');
    const svgWrapper = createElement('map-svg-wrapper');
    const mapViewportTransform = createSvgElement('g');

    svgWrapper.appendChild(mapSvg);
    map.appendChild(svgWrapper);
    mapSvg.appendChild(mapViewportTransform);

    const mapOverlayLeft = createSvgElement('rect', { x: 0, y: 0, width: 0, height: 1 }, 'map-overlay');
    const mapOverlayRight = createSvgElement('rect', { x: 1, y: 0, width: 0, height: 1 }, 'map-overlay');
    const mapWindow = createElement('map-window', 'div');
    const windowLeftEdge = createElement('map-left-edge', 'div');
    const windowRightEdge = createElement('map-right-edge', 'div');

    mapViewportTransform.append(mapOverlayLeft);
    mapViewportTransform.append(mapOverlayRight);
    map.append(mapWindow);
    map.append(windowLeftEdge);
    map.append(windowRightEdge);

    const setMapViewport = (w, h) => {
        mapViewportTransform.setAttribute('transform', `scale(${w} ${h})`);
    };

    const appendBeforeOverlay = node => {
        mapViewportTransform.insertBefore(node, mapOverlayLeft);
    };

    const setMapWindow = (x0, x1) => {
        mapOverlayLeft.setAttribute('width', x0);
        mapOverlayRight.setAttribute('x', x1);
        mapOverlayRight.setAttribute('width', 1 - x1);

        const mapWidth = map.getBoundingClientRect().width;
        mapWindow.style.left = `${x0 * mapWidth}px`;
        mapWindow.style.width = `${(x1 - x0) * mapWidth}px`;
        windowLeftEdge.style.left = `${x0 * mapWidth - 10}px`;
        windowRightEdge.style.left = `${x1 * mapWidth - 1}px`;
    };

    return {
        mapNode: map,
        appendBeforeOverlay,
        setMapViewport,
        setMapWindow,
        windowLeftEdge,
        windowRightEdge,
        mapWindow
    };
};
