import { createSvgElement } from '../../helpers/elements';

const generatePathAndFindMinMaxY = (x, y) => {
    const length = x.length;

    let xMin = x[1],
        dx = x[length - 1] - xMin,
        y0 = y[1],
        y1 = y[1];
    let d = '' + (x[1] - xMin) / dx + ',' + y[1] + ' ';

    for (let i = 2; i < length; i++) {
        d += '' + (x[i] - xMin) / dx + ',' + y[i] + ' ';
        y0 = Math.min(y[i], y0);
        y1 = Math.max(y[i], y1);
    }

    return { d, y0, y1 };
};

const getLine = (points, stroke) => {
    let visible = true;

    const chartLine = createSvgElement(
        'polyline',
        { 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke', points, stroke },
        'line'
    );

    const mapLine = createSvgElement(
        'polyline',
        { 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke', points, stroke },
        'line'
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

export default ({ types, columns, colors }) => {
    const xKey = Object.keys(types).filter(key => types[key] === 'x')[0];
    const xColumn = columns.filter(column => column[0] === xKey)[0];

    const yKeys = Object.keys(types).filter(key => types[key] !== 'x');
    const yColumns = yKeys.reduce(
        (obj, key) => ({ ...obj, [key]: columns.filter(column => column[0] === key)[0] }),
        {}
    );

    const yKeysToLines = yKeys.reduce((obj, yKey) => {
        const { d, y0, y1 } = generatePathAndFindMinMaxY(xColumn, yColumns[yKey]);
        const line = getLine(d, colors[yKey]);
        return {
            ...obj,
            [yKey]: {
                y0,
                y1,
                ...line
            }
        };
    }, {});

    return yKeysToLines;
};
