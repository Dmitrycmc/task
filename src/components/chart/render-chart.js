import {createSvgElement, getSize} from '../../helpers/elements';

const generatePathAndFindMinMaxY = (x, y) => {
    const length = x.length;

    let xMin = x[1],
        dx = x[length - 1] - xMin,
        y0 = y[1],
        y1 = y[1];
    let d = 'M ' + (x[1] - xMin) / dx + ' ' + y[1] + ' ';

    for (let i = 2; i < length; i++) {
        d += 'L ' + ((x[i] - xMin) / dx) + ' ' + y[i] + ' ';
        y0 = Math.min(y[i], y0);
        y1 = Math.max(y[i], y1);
    }

    return {d, y0, y1};
};

const renderLine = (d, stroke) => {
    const line = createSvgElement(
        'path',
        { 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke', d, stroke },
        'line'
    );
    const chartViewport = createSvgElement('g');
    const userViewport = createSvgElement('g');

    chartViewport.appendChild(line);
    userViewport.appendChild(chartViewport);

    const setUserViewport = (w, h) => {
        userViewport.setAttribute('transform', `  
            scale(${w} ${h})
        `);
    };

    const setChartViewport = ([x0, x1], [y0, y1]) => {
        chartViewport.setAttribute('transform', `
            scale(${1 / (x1 - x0)} ${1 / (y1 - y0)}) 
            translate(${-x0} ${-y0})
        `);
    };

    return {
        node: userViewport,
        setUserViewport,
        setChartViewport
    };
};

export default (svg, { types, columns, colors }) => {
    const xKey = Object.keys(types).filter(key => types[key] === 'x')[0];
    const xColumn = columns.filter(column => column[0] === xKey)[0];

    const yKeys = Object.keys(types).filter(key => types[key] !== 'x');
    const yColumns = yKeys.reduce(
        (obj, key) => ({ ...obj, [key]: columns.filter(column => column[0] === key)[0] }),
        {}
    );

    const {w: svgWidth, h: svgHeight} = getSize(svg);

    let yMin = null;
    let yMax = null;
    const yKeyToSetterChartViewport = {};


    yKeys.forEach(yKey => {
        const {d, y0, y1} = generatePathAndFindMinMaxY(xColumn, yColumns[yKey]);
        const {node, setUserViewport, setChartViewport} = renderLine(d, colors[yKey]);

        yMin=Math.min(yMin || y0, y0);
        yMax=Math.max(yMax || y1, y1);

        yKeyToSetterChartViewport[yKey] = setChartViewport;
        setUserViewport(svgWidth, svgHeight);
        svg.appendChild(node);

    });

    yKeys.forEach(yKey => {
        yKeyToSetterChartViewport[yKey]([0, 1], [yMin, yMax]);
    });
};
