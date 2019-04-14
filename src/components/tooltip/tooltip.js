import { createSvgElement } from '../../helpers/elements';
import './tooltip.css';
import { tooltipDate } from '../../helpers/date-time';

const MARGIN = 20;
const PADDING = 10;
const WIDTH = 180;
const LINE_HEIGHT = 18;

export default class Tooltip {
    constructor(parentNode) {
        this.transformY = createSvgElement('g', {}, 'tt_wrapper');
        this.transformX = createSvgElement('g', {}, 'tt_wrapper');
        this.rect = createSvgElement(
            'rect',
            { x: MARGIN, y: MARGIN, rx: 15, ry: 15, width: WIDTH, transform: 'scale(1 -1)' },
            'tt_rect'
        );
        this.text = createSvgElement('text', {
            x: MARGIN + PADDING,
            y: MARGIN + PADDING + LINE_HEIGHT,
            transform: 'scale(1 -1)'
        });
        this.transformY.appendChild(this.transformX);
        this.transformX.appendChild(this.rect);
        this.transformX.appendChild(this.text);
        parentNode.appendChild(this.transformY);
    }

    resize() {
        const svgBox = this.transformY.parentNode.getBoundingClientRect();
        this.transformY.setAttribute('transform', `translate(0 ${svgBox.height})`);
    }

    render(xRel, xAbs, data, percentage) {
        if (!data || xRel < 0 || xRel > 1) {
            this.transformY.setAttribute('opacity', '0');
            return;
        }

        this.transformY.setAttribute('opacity', '1');
        this.rect.setAttribute('height', (data.length + 1) * LINE_HEIGHT + 2 * PADDING);

        const svgBox = this.transformY.parentNode.getBoundingClientRect();

        while (this.text.childNodes.length) {
            this.text.removeChild(this.text.childNodes[0]);
        }

        const xText = createSvgElement('tspan', {}, 'tt_bold');
        xText.textContent = tooltipDate(xAbs);
        this.text.appendChild(xText);

        data.forEach(({ y, color, name }) => {
            const yName = createSvgElement('tspan', { x: MARGIN + PADDING, dy: LINE_HEIGHT });
            yName.textContent = `${name}: `;
            const yVal = createSvgElement(
                'tspan',
                { fill: color, 'text-anchor': 'end', x: MARGIN + WIDTH - PADDING },
                'tt_bold'
            );
            yVal.textContent = percentage ? `${(100 * y).toFixed(2)}%` : (+y).toFixed(2);
            this.text.appendChild(yName);
            this.text.appendChild(yVal);
        });

        if (xRel < 0.5) {
            this.transformX.setAttribute('transform', `translate(${xRel * svgBox.width} 0)`);
        } else {
            this.transformX.setAttribute('transform', `translate(${xRel * svgBox.width - 2 * MARGIN - WIDTH} 0)`);
        }
    }
}
