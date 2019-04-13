import { createSvgElement } from '../../helpers/elements';
import { absToRel, findClosestIndex } from '../../helpers/utils';

const generatePoints = (area, x, y, yBase = []) => {
    const length = x.length;

    const yVal = i => (yBase[i] || 0) + y[i];

    let xMin = x[1],
        dx = x[length - 1] - xMin,
        points = `0,${yVal(1)} `;

    for (let i = 2; i < length; i++) {
        points += `${(x[i] - xMin) / dx},${yVal(i)} `;
    }

    return area ? `0,0 ${points} 1,0` : points;
};

export default class Line {
    get visible() {
        return this._visible;
    }

    set visible(val) {
        this._visible = val;
        if (!this._area) {
            this._intersectionPoint0.setAttribute('opacity', +val);
            this._intersectionLineH.setAttribute('opacity', +val);
        }
        this._chartLine.setAttribute('opacity', +val);
        this._mapLine.setAttribute('opacity', +val);
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
        this._area = area;

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
            { x1: 0, x2: 0, y0: 0, y1: 1, 'vector-effect': 'non-scaling-stroke' },
            'intersection-line'
        );

        this.intersectionPoint = createSvgElement('g', {}, '');
        this.intersectionPoint.appendChild(intersectionLineV);

        if (!area) {
            this._intersectionLineH = createSvgElement(
                'line',
                {
                    x1: -1,
                    x2: 1,
                    y0: 0,
                    y1: 0,
                    'vector-effect': 'non-scaling-stroke'
                },
                'intersection-line'
            );

            this._intersectionPoint0 = createSvgElement(
                'circle',
                { r: 5, stroke: color, fill: 'white' },
                'intersection-point'
            );
            this._intersectionPoint1 = createSvgElement('g', {}, '');
            this._intersectionPoint2 = createSvgElement('g', {}, 'animated');
            this._intersectionPoint3 = createSvgElement('g', {}, '');
            this._intersectionPoint4 = createSvgElement('g', {}, 'animated');
            this._intersectionPoint1.appendChild(this._intersectionPoint0);
            this._intersectionPoint2.appendChild(this._intersectionPoint1);
            this._intersectionPoint3.appendChild(this._intersectionLineH);
            this._intersectionPoint3.appendChild(this._intersectionPoint2);
            this._intersectionPoint4.appendChild(this._intersectionPoint3);
            this.intersectionPoint.appendChild(this._intersectionPoint4);
        }

        this.mapNode = createSvgElement('g', {}, 'animated');
        this.mapNode.appendChild(this._mapLine);

        this.node = createSvgElement('g', {}, 'animated');
        this.node.appendChild(this._chartLine);
    }

    onChange = yColumnBase => {
        this._yColumnBase = yColumnBase;
        const points = generatePoints(this._area, this._xColumn, this._yColumn, yColumnBase);
        this._chartLine.setAttribute('points', points);
        this._mapLine.setAttribute('points', points);
    };

    onMouseMove(xRel, x0, x1, y0, y1, svgW, svgH) {
        let x = absToRel(xRel, x0, x1);
        if (x < 0 || x > 1) {
            this.intersectionPoint.style.display = 'none';
            return;
        }

        this.intersectionPoint.style.display = 'initial';
        const i = findClosestIndex(this._xColumn, xRel);
        x = absToRel(this._xColumn[i], this._xColumn[1], this._xColumn[this._xColumn.length - 1]);
        this.intersectionPoint.setAttribute('transform', `scale(${svgW} ${svgH}) translate(${absToRel(x, x0, x1)} 0) `);

        if (!this._area) {
            const y = this._yColumn[i];

            this._intersectionPoint1.setAttribute('transform', `scale(${1 / svgW} ${1 / svgH})`);
            this._intersectionPoint2.setAttribute('transform', `scale(1 ${y1 - y0})`);
            this._intersectionPoint3.setAttribute('transform', `translate(0 ${y})`);
            this._intersectionPoint4.setAttribute('transform', `scale(1 ${1 / (y1 - y0)}) translate(0 ${-y0})`);
        }
    }
}
