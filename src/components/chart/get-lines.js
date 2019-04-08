import { createSvgElement } from '../../helpers/elements';

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

const getLine = (points, stroke) => {
    let visible = true;

    const chartLine = createSvgElement(
        'polyline',
        { 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke', points, stroke },
        'chart-line'
    );

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

    const visibility = flag => {
        if (flag === undefined) {
            /* reading */
            return visible;
        } else {
            /* writing */
            visible = flag;
            chartLine.setAttribute('stroke', flag ? stroke : 'transparent');
            mapLine.setAttribute('stroke', flag ? stroke : 'transparent');
        }
    };

    return {
        chartLineNode: chartAreaYTransform,
        setYChartArea,
        mapLineNode: mapAreaYTransform,
        setYMapArea,
        visibility
    };
};

export default (keys, xColumn, yColumns, colors) => {
    const keysToLines = keys.reduce((obj, key) => {
        const points = generatePoints(xColumn, yColumns[key]);
        const line = getLine(points, colors[key]);
        return {
            ...obj,
            [key]: line
        };
    }, {});

    return keysToLines;
};
