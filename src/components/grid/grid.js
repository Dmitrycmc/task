import { clearChildren, createSvgElement } from '../../helpers/elements';
import './grid.css';
import { absToRel, formatNumber } from '../../helpers/utils';

const ROW_HEIGHT = 18 * 10;
const COL_WIDTH = 18 * 10;

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

    render(x0, x1, y0, y1, factor) {
        const { height, width } = this.node.parentNode.getBoundingClientRect();

        const countV = height / ROW_HEIGHT;
        const countH = width / COL_WIDTH;

        let i = 0;
        while ((y1 - y0) / steps[i] < countV) i++;
        const yStep = steps[i];
        let j = 0;
        while ((x1 - x0) / steps[j] < countH) j++;
        const xStep = steps[j];

        this.transform.setAttribute('transform', `scale(1 ${1 / (y1 - y0)}) translate(0 ${-y0})`);

        clearChildren(this.transform);

        i = Math.ceil(y0 / yStep);
        let yCur = i * yStep;

        clearChildren(this.labels);

        while (yCur <= y1) {
            const line = createSvgElement(
                'line',
                { x1: 0, x2: 1, y1: yCur, y2: yCur, 'vector-effect': 'non-scaling-stroke' },
                'grid_line'
            );
            this.transform.appendChild(line);

            const label = createSvgElement('text', { x: 0, y: -absToRel(yCur, y0, y1) * height });
            label.textContent = formatNumber(yCur * factor);
            this.labels.appendChild(label);

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

            xCur += xStep;
        }
    }
}

const steps = [
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
