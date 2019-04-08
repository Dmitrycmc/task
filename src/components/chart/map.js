import { createElement, createSvgElement } from '../../helpers/elements';

export default () => {
    const mapSvg = createSvgElement('svg', {}, 'ctr_map-chart');
    const map = createElement('ctr_map-container');
    const mapViewportTransform = createSvgElement('g');

    map.appendChild(mapSvg);
    mapSvg.appendChild(mapViewportTransform);

    const mapOverlayLeft = createSvgElement('rect', { x: 0, y: 0, width: 0, height: 1 }, 'crt_map-overlay');
    const mapOverlayRight = createSvgElement('rect', { x: 1, y: 0, width: 0, height: 1 }, 'crt_map-overlay');
    const mapWindow = createElement('crt_map-window', 'div');
    const windowLeftEdge = createElement('crt_map-left-edge', 'div');
    const windowRightEdge = createElement('crt_map-right-edge', 'div');

    mapViewportTransform.append(mapOverlayLeft);
    mapViewportTransform.append(mapOverlayRight);
    map.append(mapWindow);
    mapWindow.append(windowLeftEdge);
    mapWindow.append(windowRightEdge);

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
        mapWindow.style.left = `${x0 * mapWidth - 10}px`;
        mapWindow.style.width = `${(x1 - x0) * mapWidth + 20}px`;
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
