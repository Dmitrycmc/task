import { createSvgElement } from '../../helpers/elements';
import {absToRel, interpolate, relToAbs} from '../../helpers/utils';

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

    const intersectionLineV = createSvgElement('line', { x1: 0, x2: 0, y0: 0, y1: 1, 'vector-effect': 'non-scaling-stroke' }, 'intersection-line');
    const intersectionLineH = createSvgElement('line', { x1: -1, x2: 1, y0: 0, y1: 0, 'vector-effect': 'non-scaling-stroke' }, 'intersection-line');
    const intersectionPoint0 = createSvgElement('circle', { r: 5, stroke }, 'intersection-point');
    const intersectionPoint1 = createSvgElement('g', {}, '');
    const intersectionPoint2 = createSvgElement('g', {}, 'animated');
    const intersectionPoint3 = createSvgElement('g', {}, '');
    const intersectionPoint4 = createSvgElement('g', {}, 'animated');
    const intersectionPoint5 = createSvgElement('g', {}, '');
    intersectionPoint1.appendChild(intersectionPoint0);
    intersectionPoint2.appendChild(intersectionPoint1);
    intersectionPoint3.appendChild(intersectionPoint2);
    intersectionPoint4.appendChild(intersectionPoint3);
    intersectionPoint5.appendChild(intersectionLineV);
    intersectionPoint3.appendChild(intersectionLineH);
    intersectionPoint5.appendChild(intersectionPoint4);

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
        const x = absToRel(xRel, x0, x1);
        if (x < 0 || x > 1) {
            intersectionPoint5.style.display = 'none';
            return;
        }
        intersectionPoint5.style.display = 'initial';

        const y = interpolate(xColumn, yColumn, xRel);

        intersectionPoint1.setAttribute('transform', `scale(${1 / svgW} ${1 / svgH})`);
        intersectionPoint2.setAttribute('transform', `scale(1 ${y1 - y0})`);
        intersectionPoint3.setAttribute('transform', `translate(0 ${y})`);
        intersectionPoint4.setAttribute('transform', `scale(1 ${1 / (y1 - y0)}) translate(0 ${(-y0)})`);
        intersectionPoint5.setAttribute('transform', `scale(${svgW} ${svgH}) translate(${x} 0) `);

    };

    const visibility = flag => {
        if (flag === undefined) {
            /* reading */
            return visible;
        } else {
            /* writing */
            visible = flag;
            intersectionPoint0.setAttribute('stroke', flag ? stroke : 'transparent');
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
        intersectionPoint: intersectionPoint5,
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
