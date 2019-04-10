import { createSvgElement } from '../../helpers/elements';
import {interpolate, relToAbs} from "../../helpers/utils";

const generatePoints = (x, y) => {
    const length = x.length;

    let xMin = x[1],
        dx = x[length - 1] - xMin;
    let points = '' + 0 + ',' + y[1] + ' ';

    for (let i = 2; i < length; i++) {
        points += '' + (x[i] - xMin) / dx + ',' + y[i] + ' ';
    }

    return points;
};

const getLine = (xColumn, yColumn, stroke) => {
    let visible = true;
    const points = generatePoints(xColumn, yColumn);

    const chartLine = createSvgElement(
        'polyline',
        { 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke', points, stroke },
        'chart-line'
    );

    const intersectionPoint = createSvgElement('circle', { r: 5, stroke }, 'intersection-point');
    const intersectionPoint1 = createSvgElement('g', {}, 'animated');
    const intersectionPoint2 = createSvgElement('g');
    const intersectionPoint3 = createSvgElement('g', {}, 'animated');
    intersectionPoint1.appendChild(intersectionPoint);
    intersectionPoint2.appendChild(intersectionPoint1);
    intersectionPoint3.appendChild(intersectionPoint2);

    const mapLine = createSvgElement(
        'polyline',
        { 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke', points, stroke },
        'map-line'
    );

    const mapAreaYTransform = createSvgElement('g', {}, 'animated');
    mapAreaYTransform.appendChild(mapLine);

    const chartAreaYTransform = createSvgElement('g', {}, 'animated');
    chartAreaYTransform.appendChild(chartLine);

    const setYChartArea = (y0, y1) => {
        chartAreaYTransform.setAttribute(
            'transform',
            `
            scale(1 ${1 / (y1 - y0)}) 
            translate(0 ${-y0})
        `
        );
    };

    const setYMapArea = (y0, y1) => {
        mapAreaYTransform.setAttribute(
            'transform',
            `
            scale(1 ${1 / (y1 - y0)}) 
            translate(0 ${-y0})
        `
        );
    };

    const setIntersectionX = (xRel, x0, x1, y0, y1, svgW, svgH) => {
        const x = relToAbs(xRel, x0, x1);
        const y = interpolate(xColumn, yColumn, x);

        intersectionPoint1.setAttribute('transform', `scale(1 ${y1 - y0})`);
        intersectionPoint2.setAttribute('transform', `translate(${xRel* svgW} ${y * svgH})`);
        intersectionPoint3.setAttribute('transform', `scale(1 ${1/(y1 - y0)}) translate(0 ${-y0 * svgH})`);
    };

    const visibility = flag => {
        if (flag === undefined) {
            /* reading */
            return visible;
        } else {
            /* writing */
            visible = flag;
            intersectionPoint.setAttribute('stroke', flag ? stroke : 'transparent');
            chartLine.setAttribute('stroke', flag ? stroke : 'transparent');
            mapLine.setAttribute('stroke', flag ? stroke : 'transparent');
        }
    };

    return {
        chartLineNode: chartAreaYTransform,
        setYChartArea,
        mapLineNode: mapAreaYTransform,
        setYMapArea,
        visibility,
        intersectionPoint : intersectionPoint3,
        setIntersectionX
    };
};

export default (keys, xColumn, yColumns, colors) => {
    const keysToLines = keys.reduce((obj, key) => {
        const line = getLine(xColumn, yColumns[key], colors[key]);
        return {
            ...obj,
            [key]: line
        };
    }, {});

    return keysToLines;
};
