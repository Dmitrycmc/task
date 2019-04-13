import { createSvgElement } from '../../helpers/elements';
import { calcOpacityColor } from '../../helpers/utils';

const generatePoints = (x, y, yBase) => {
    // unused x
    const length = x.length - 1;

    if (!yBase) {
        let points = `0,0 0,${y[1]} `;

        for (let i = 2; i <= length; i++) {
            points += `${(i - 1) / length},${y[i - 1]} ${(i - 1) / length},${y[i]} `;
        }
        points += `1,${y[length]} 1,0`;

        return points;
    } else {
        let points = `0,0 0,${yBase[1] + y[1]} `;

        for (let i = 2; i <= length; i++) {
            points += `${(i - 1) / length},${yBase[i - 1] + y[i - 1]} ${(i - 1) / length},${yBase[i] + y[i]} `;
        }
        points += `1,${yBase[length] + y[length]} 1,0`;

        return points;
    }
};

export default class Line {
    get visible() {
        return this._visible;
    }

    set visible(val) {
        this._visible = val;
        this._chartLine.setAttribute('fill', val ? this._color : 'transparent');
        this._mapLine.setAttribute('fill', val ? this._color : 'transparent');
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

        this._chartLine = createSvgElement(
            'polygon',
            { 'vector-effect': 'non-scaling-stroke', 'stroke-width': 0, fill: color },
            'chart-bar'
        );
        this._selectedBar = createSvgElement(
            'rect',
            { 'vector-effect': 'non-scaling-stroke', 'stroke-width': 0, fill: color },
            'chart-bar'
        );
        this._mapLine = createSvgElement(
            'polygon',
            { 'vector-effect': 'non-scaling-stroke', 'stroke-width': 0, fill: color },
            'map-bar'
        );

        this.mapNode = createSvgElement('g', {}, 'animated');
        this.mapNode.appendChild(this._mapLine);

        this.node = createSvgElement('g', {}, 'animated');
        this.node.appendChild(this._chartLine);
        this.node.appendChild(this._selectedBar);
    }

    onChange = yColumnBase => {
        this._yColumnBase = yColumnBase;
        const points = generatePoints(this._xColumn, this._yColumn, yColumnBase);
        this._chartLine.setAttribute('points', points);
        this._mapLine.setAttribute('points', points);
    };

    onMouseMove(xMouse) {
        if (!xMouse) {
            this._chartLine.setAttribute('fill', this._visible ? this._color : 'transparent');
            this._selectedBar.setAttribute('fill', 'transparent');
            return;
        }

        if (this._visible) {
            const step = 1 / (this._xColumn.length - 1);
            const i = Math.ceil(xMouse / step);
            this._selectedBar.setAttribute('x', (i - 1) * step);
            this._selectedBar.setAttribute('y', this._yColumnBase ? this._yColumnBase[i] : 0);
            this._selectedBar.setAttribute('width', step);
            this._selectedBar.setAttribute('height', this._yColumn[i]);
            this._selectedBar.setAttribute('fill', this._color);
            const background = window.getComputedStyle(document.body).backgroundColor;
            this._chartLine.setAttribute('fill', calcOpacityColor(this._color, background, 0.6));
        }
    }
}
