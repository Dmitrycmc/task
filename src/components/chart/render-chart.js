import {createElement, createSvgElement} from '../../helpers/elements';

export default ({types, columns}) => {
    const svg = createSvgElement('svg', {}, 'ctr_svg');

    const xKey = Object.entries(types).find(([key, type]) => type === 'x')[0];
    const xColumn = columns.find(column => column[0] === xKey)

    const yKeys = Object.entries(types).filter(([key, type]) => type !== 'x').map(([key]) => key);
    const yColumns = yKeys.reduce((obj, key) => ({...obj, [key]: columns.filter(column => column[0] === key)}), {});


    const circle = createSvgElement('circle', {cx: 15, cy: 15, r: 15});
    svg.appendChild(circle);


    return svg;
};
