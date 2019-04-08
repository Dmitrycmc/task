import { createSvgElement } from '../../helpers/elements';

const generatePathAndFindMinMaxY = (x, y) => {
    const length = x.length;

    let xMin = x[1],
        dx = x[length - 1] - xMin,
        y0 = y[1],
        y1 = y[1];
    let d = 'M ' + (x[1] - xMin) / dx + ' ' + y[1] + ' ';

    for (let i = 2; i < length; i++) {
        d += 'L ' + (x[i] - xMin) / dx + ' ' + y[i] + ' ';
        y0 = Math.min(y[i], y0);
        y1 = Math.max(y[i], y1);
    }

    return { d, y0, y1 };
};

const getLine = (d, stroke) => {
    let visible = true;

    const chartLine = createSvgElement(
        'path',
        { 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke', d, stroke },
        'line'
    );

    const mapLine = createSvgElement('path', { 'vector-effect': 'non-scaling-stroke', d, stroke }, 'line');

    const mapAreaYTransformation = createSvgElement('g');
    const mapViewportTransformation = createSvgElement('g');

    mapAreaYTransformation.appendChild(mapLine);
    mapViewportTransformation.appendChild(mapAreaYTransformation);

    const chartAreaXTransformation = createSvgElement('g');
    const chartAreaYTransformation = createSvgElement('g', {}, 'animated');
    const userViewportTransformation = createSvgElement('g');

    chartAreaXTransformation.appendChild(chartLine);
    chartAreaYTransformation.appendChild(chartAreaXTransformation);
    userViewportTransformation.appendChild(chartAreaYTransformation);

    const setUserViewport = (w, h) => {
        setViewport(userViewportTransformation, w, h);
    };

    const setMapViewport = (w, h) => {
        setViewport(mapViewportTransformation, w, h);
    };

    const setViewport = (element, w, h) => {
        element.setAttribute(
            'transform',
            `  
            scale(${w} ${h})
        `
        );
    };

    const setXChartArea = (x0, x1) => {
        chartAreaXTransformation.setAttribute(
            'transform',
            `
            scale(${1 / (x1 - x0)} 1) 
            translate(${-x0} 0)
        `
        );
    };

    const setYChartArea = (y0, y1) => {
        chartAreaYTransformation.setAttribute(
            'transform',
            `
            scale(1 ${1 / (y1 - y0)}) 
            translate(0 ${-y0})
        `
        );
    };

    const setYMapArea = (y0, y1) => {
        mapAreaYTransformation.setAttribute(
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
        }
    };

    return {
        chartNode: userViewportTransformation,
        setUserViewport,
        setXChartArea,
        setYChartArea,
        mapNode: mapViewportTransformation,
        setMapViewport,
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
