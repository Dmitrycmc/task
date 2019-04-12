import { createSvgElement } from '../../helpers/elements';
import { absToRel, interpolate } from '../../helpers/utils';

const INTERSECTION_LINES_COLOR = 'gray';

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

export default class Line {
    get visible() {
        return this._visible;
    }

    set visible(val) {
        this._visible = val;
        this._intersectionPoint0.setAttribute('stroke', val ? this._color : 'transparent');
        this._intersectionPoint0.setAttribute('fill', val ? 'white' : 'transparent');
        this._chartLine.setAttribute('stroke', val ? this._color : 'transparent');
        this._mapLine.setAttribute('stroke', val ? this._color : 'transparent');
        this._intersectionLineH.setAttribute('stroke', val ? INTERSECTION_LINES_COLOR : 'transparent');
    }

    set yMapArea([y0, y1]) {
        this.mapNode.setAttribute('transform', `scale(1 ${1 / (y1 - y0)}) translate(0 ${-y0})`);
    }

    set yChartArea([y0, y1]) {
        this.node.setAttribute('transform', `scale(1 ${1 / (y1 - y0)}) translate(0 ${-y0})`);
    }

    constructor(keys, xColumn, yColumn, color) {
        this._visible = true;
        this._color = color;
        this._xColumn = xColumn;
        this._yColumn = yColumn;

        const points = generatePoints(xColumn, yColumn);
        this._chartLine = createSvgElement(
            'polyline',
            { 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke', points, stroke: color },
            'chart-line'
        );
        this._mapLine = createSvgElement(
            'polyline',
            { 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke', points, stroke: color },
            'map-line'
        );

        const intersectionLineV = createSvgElement(
            'line',
            { x1: 0, x2: 0, y0: 0, y1: 1, 'vector-effect': 'non-scaling-stroke', stroke: INTERSECTION_LINES_COLOR },
            'intersection-line'
        );

        this._intersectionLineH = createSvgElement(
            'line',
            { x1: -1, x2: 1, y0: 0, y1: 0, 'vector-effect': 'non-scaling-stroke', stroke: INTERSECTION_LINES_COLOR },
            'intersection-line'
        );

        this._intersectionPoint0 = createSvgElement(
            'circle',
            { r: 5, stroke: color, fill: 'white' },
            'intersection-point'
        );
        const intersectionPoint1 = createSvgElement('g', {}, '');
        const intersectionPoint2 = createSvgElement('g', {}, 'animated');
        const intersectionPoint3 = createSvgElement('g', {}, '');
        const intersectionPoint4 = createSvgElement('g', {}, 'animated');
        this.intersectionPoint = createSvgElement('g', {}, '');
        intersectionPoint1.appendChild(this._intersectionPoint0);
        intersectionPoint2.appendChild(intersectionPoint1);
        intersectionPoint3.appendChild(this._intersectionLineH);
        intersectionPoint3.appendChild(intersectionPoint2);
        intersectionPoint4.appendChild(intersectionPoint3);
        this.intersectionPoint.appendChild(intersectionLineV);
        this.intersectionPoint.appendChild(intersectionPoint4);

        this.setIntersectionX = (xRel, x0, x1, y0, y1, svgW, svgH) => {
            const x = absToRel(xRel, x0, x1);
            if (x < 0 || x > 1) {
                this.intersectionPoint.style.display = 'none';
                return;
            }
            this.intersectionPoint.style.display = 'initial';

            const y = interpolate(this._xColumn, this._yColumn, xRel);

            intersectionPoint1.setAttribute('transform', `scale(${1 / svgW} ${1 / svgH})`);
            intersectionPoint2.setAttribute('transform', `scale(1 ${y1 - y0})`);
            intersectionPoint3.setAttribute('transform', `translate(0 ${y})`);
            intersectionPoint4.setAttribute('transform', `scale(1 ${1 / (y1 - y0)}) translate(0 ${-y0})`);
            this.intersectionPoint.setAttribute('transform', `scale(${svgW} ${svgH}) translate(${x} 0) `);
        };

        this.mapNode = createSvgElement('g', {}, 'animated');
        this.mapNode.appendChild(this._mapLine);

        this.node = createSvgElement('g', {}, 'animated');
        this.node.appendChild(this._chartLine);
    }
}
