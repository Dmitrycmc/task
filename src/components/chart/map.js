import {createElement, createSvgElement} from "../../helpers/elements";



export default () => {


    const mapSvg = createSvgElement('svg', {}, 'ctr_map-chart');
    const map = createElement('ctr_map-container');
    const mapViewportTransform = createSvgElement('g');


    map.appendChild(mapSvg);
    mapSvg.appendChild(mapViewportTransform);

    const mapOverlayLeft = createSvgElement('rect', {x: 0, y: 0, width: 0, height: 1}, 'crt_map-overlay');
    const mapOverlayRight = createSvgElement('rect', {x: 1, y: 0, width: 0, height: 1}, 'crt_map-overlay');
    mapViewportTransform.append(mapOverlayLeft);
    mapViewportTransform.append(mapOverlayRight);


    const setMapViewport = (w, h) => {
        mapViewportTransform.setAttribute('transform', `scale(${w} ${h})`);
    };

    const appendBeforeOverlay = node => {
        mapViewportTransform.insertBefore(node, mapOverlayLeft);
    }

    const setMapWindow = (x0, x1) => {
        mapOverlayLeft.setAttribute('width', x0);
        mapOverlayRight.setAttribute('x', x1);
        mapOverlayRight.setAttribute('width', 1 - x1);
    }

    return {
        mapNode: map,
        appendBeforeOverlay,
        setMapViewport,
        setMapWindow
    };
};

