import { createSvgElement } from '../../helpers/elements';
import { absToRel, findClosestIndex } from '../../helpers/utils';

const INTERSECTION_LINES_COLOR = 'gray';

const generatePoints = (area, x, y) => {
    const length = x.length;

    let xMin = x[1],
        dx = x[length - 1] - xMin;
    let points = `0,${y[1]} `;

    for (let i = 2; i < length; i++) {
        points += `${(x[i] - xMin) / dx},${y[i]} `;
    }

    return area ? `0,0 ${points} 1,0` : points;
};

export default class Line {
    get visible() {
        return this._visible;
    }

    set visible(val) {
        this._visible = val;
        this._intersectionPoint0.setAttribute('opacity', +val);
        this._chartLine.setAttribute('opacity', +val);
        this._mapLine.setAttribute('opacity', +val);
        this._intersectionLineH.setAttribute('stroke', val ? INTERSECTION_LINES_COLOR : 'transparent');
    }

    set yMapArea([y0, y1]) {
        this.mapNode.setAttribute('transform', `scale(1 ${1 / (y1 - y0)}) translate(0 ${-y0})`);
    }

    set yChartArea([y0, y1]) {
        this.node.setAttribute('transform', `scale(1 ${1 / (y1 - y0)}) translate(0 ${-y0})`);
    }

    constructor(area, keys, xColumn, yColumn, color) {
        this._visible = true;
        this._color = color;
        this._xColumn = xColumn;
        this._yColumn = yColumn;

        const points = generatePoints(area, xColumn, yColumn);
        this._chartLine = createSvgElement(
            area ? 'polygon' : 'polyline',
            {
                'stroke-linejoin': 'round',
                'vector-effect': 'non-scaling-stroke',
                points,
                stroke: area ? 'none' : color,
                fill: area ? color : 'none'
            },
            'chart-line'
        );
        this._mapLine = createSvgElement(
            'polyline',
            {
                'stroke-linejoin': 'round',
                'vector-effect': 'non-scaling-stroke',
                points,
                stroke: area ? 'none' : color,
                fill: area ? color : 'none'
            },
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
            let x = absToRel(xRel, x0, x1);
            if (x < 0 || x > 1) {
                this.intersectionPoint.style.display = 'none';
                return;
            }
            this.intersectionPoint.style.display = 'initial';

            const i = findClosestIndex(this._xColumn, xRel);
            const y = this._yColumn[i];
            x = absToRel(this._xColumn[i], this._xColumn[1], this._xColumn[this._xColumn.length - 1]);

            intersectionPoint1.setAttribute('transform', `scale(${1 / svgW} ${1 / svgH})`);
            intersectionPoint2.setAttribute('transform', `scale(1 ${y1 - y0})`);
            intersectionPoint3.setAttribute('transform', `translate(0 ${y})`);
            intersectionPoint4.setAttribute('transform', `scale(1 ${1 / (y1 - y0)}) translate(0 ${-y0})`);
            this.intersectionPoint.setAttribute(
                'transform',
                `scale(${svgW} ${svgH}) translate(${absToRel(x, x0, x1)} 0) `
            );
        };

        this.mapNode = createSvgElement('g', {}, 'animated');
        this.mapNode.appendChild(this._mapLine);

        this.node = createSvgElement('g', {}, 'animated');
        this.node.appendChild(this._chartLine);
    }
}
