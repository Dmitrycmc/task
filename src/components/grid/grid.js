import { clearChildren, createSvgElement } from '../../helpers/elements';
import './grid.css';
import { absToRel, numberFormat, relToAbs } from '../../helpers/utils';
import { dateFormat, DAY } from '../../helpers/date-time';

const ROW_HEIGHT = 18 * 10;
const COL_WIDTH = 18 * 8;

export default class Grid {
    constructor(parentNode) {
        this.node = createSvgElement('g', {});
        this.transform = createSvgElement('g', {}, 'grid_wrapper');

        this.labels = createSvgElement('g', { transform: 'scale (1 -1)' });
        parentNode.appendChild(this.node);
        parentNode.appendChild(this.labels);
        this.node.appendChild(this.transform);
        this.resize();
    }

    resize() {
        const { width, height } = this.node.parentNode.getBoundingClientRect();
        this.node.setAttribute('transform', `scale(${width} ${height})`);
    }

    render(x0, x1, y0, y1, factor, xData, colors, bars, percentage, convertPoint, show0, show1) {
        const { height, width } = this.node.parentNode.getBoundingClientRect();

        const countV = height / ROW_HEIGHT;
        const countH = width / COL_WIDTH;

        let i = 0;
        while ((y1 - y0) / ySteps[i] < countV) i++;
        const yStep = ySteps[i];

        let j = 0;
        const len = xData.length - (bars ? 0 : 1);
        while (((x1 - x0) * len) / xSteps[j] < countH) j++;
        const xStep = xSteps[j] / len;

        this.transform.setAttribute('transform', `scale(1 ${1 / (y1 - y0)}) translate(0 ${-y0})`);

        clearChildren(this.transform);

        i = Math.ceil(y0 / yStep);
        let yCur = i * yStep;

        clearChildren(this.labels);

        while (yCur <= y1) {
            const line = createSvgElement(
                'line',
                { x1: 0, x2: 1, y1: yCur, y2: yCur, 'vector-effect': 'non-scaling-stroke' },
                'grid_line '
            );
            this.transform.appendChild(line);

            let label;

            if (!convertPoint || show0) {
                label = createSvgElement(
                    'text',
                    {
                        fill: convertPoint ? colors.y0 : '',
                        'alignment-baseline': 'middle',
                        x: 0,
                        y: -absToRel(yCur, y0, y1) * height
                    },
                    `grid_labels ${convertPoint ? '' : 'grid_labelsDefaultColor'}`
                );
                label.textContent = numberFormat((percentage ? 100 : 1) * yCur * factor);
                this.labels.appendChild(label);
            }

            if (convertPoint && show1) {
                label = createSvgElement(
                    'text',
                    {
                        fill: colors.y1,
                        'alignment-baseline': 'middle',
                        'text-anchor': 'end',
                        x: width,
                        y: -absToRel(yCur, y0, y1) * height
                    },
                    `grid_labels`
                );
                label.textContent = numberFormat(
                    (percentage ? 100 : 1) * (convertPoint ? convertPoint(yCur) : yCur) * factor
                );
                this.labels.appendChild(label);
            }

            yCur += yStep;
        }

        j = Math.ceil(x0 / xStep);
        let xCur = j * xStep;

        while (xCur <= x1) {
            const line = createSvgElement(
                'line',
                {
                    y1: y0,
                    y2: y1,
                    x1: absToRel(xCur, x0, x1),
                    x2: absToRel(xCur, x0, x1),
                    'vector-effect': 'non-scaling-stroke'
                },
                'grid_line'
            );
            this.transform.appendChild(line);

            const label = createSvgElement(
                'text',
                { 'text-anchor': bars ? 'start' : 'middle', y: -10, x: absToRel(xCur, x0, x1) * width },
                `grid_labels grid_labelsDefaultColor`
            );
            label.textContent = dateFormat(relToAbs(xCur, xData[0], xData[xData.length - 1] + DAY), false);
            this.labels.appendChild(label);

            xCur += xStep;
        }
    }
}

const xSteps = [365, 180, 120, 60, 30, 15, 7, 3, 2, 1];

const ySteps = [
    100000000,
    50000000,
    20000000,
    10000000,
    5000000,
    2000000,
    1000000,
    500000,
    200000,
    100000,
    50000,
    20000,
    10000,
    5000,
    2000,
    1000,
    500,
    200,
    100,
    50,
    20,
    10,
    5,
    2,
    1,
    0.5,
    0.2,
    0.1,
    0.05,
    0.02,
    0.01
];
