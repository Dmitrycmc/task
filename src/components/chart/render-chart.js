import { createSvgElement } from '../../helpers/elements';

const render = (x, y, svgWidth, svgHeight, stroke) => {

    const length = x.length;

    let xMin = x[1],
        dx = x[length - 1] - xMin,
        yMin = y[1],
        yMax = y[1];
    let d = 'M ' + (x[1] - xMin) / dx + ' ' + y[1] + ' ';

    for (let i = 2; i < length; i++) {
        d += 'L ' + ((x[i] - xMin) / dx) + ' ' + y[i] + ' ';
        yMin = Math.min(y[i], yMin);
        yMax = Math.max(y[i], yMax);
    }

    const dy = yMax - yMin;

    const x0 = 0;
    const x1 = 1;

    const g = createSvgElement('g', {
        'vector-effect': 'non-scaling-stroke',
        transform: `
            scale(${svgWidth} ${svgHeight})
            scale(${1 / (x1 - x0)} ${1 / dy}) 
            translate(${-x0} ${-yMin})
        `
    });

    g.appendChild(
        createSvgElement(
            'path',
            { 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke', d, stroke },
            'line'
        )
    );

    return g;
};

export default (svg, { types, columns, colors }) => {
    const xKey = Object.keys(types).filter(key => types[key] === 'x')[0];
    const xColumn = columns.filter(column => column[0] === xKey)[0];

    const yKeys = Object.keys(types).filter(key => types[key] !== 'x');
    const yColumns = yKeys.reduce(
        (obj, key) => ({ ...obj, [key]: columns.filter(column => column[0] === key)[0] }),
        {}
    );

    const style = window.getComputedStyle(svg);
    const svgWidth = parseFloat(style.width);
    const svgHeight = parseFloat(style.height);

    yKeys.forEach(yKey => svg.appendChild(render(xColumn, yColumns[yKey], svgWidth, svgHeight, colors[yKey])));
};
