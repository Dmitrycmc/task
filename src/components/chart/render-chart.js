import {createElement, createSvgElement} from '../../helpers/elements';

export default ({types, columns}) => {
    const svg = createSvgElement('svg', {}, 'ctr_svg');

    const xKey = Object.keys(types).filter(key => types[key] === 'x')[0];
    const xColumn = columns.filter(column => column[0] === xKey)[0];

    const yKeys = Object.keys(types).filter(key => types[key] !== 'x');
    const yColumns = yKeys.reduce((obj, key) => ({...obj, [key]: columns.filter(column => column[0] === key)}), {});

    const circle = createSvgElement('circle', {cx: 15, cy: 15, r: 15});
    svg.appendChild(circle);

    return svg;
};
