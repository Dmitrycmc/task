import { createSvgElement } from '../../helpers/elements';
import './tooltip.css';

const MARGIN = 10;
const PADDING = 10;
const WIDTH = 250;
const HEIGHT = 150;

export default class Tooltip {
    constructor(parentNode) {
        this.transformY = createSvgElement('g', {}, 'tt_wrapper');
        this.transformX = createSvgElement('g', {}, 'tt_wrapper');
        this.rect = createSvgElement(
            'rect',
            { x: MARGIN, y: MARGIN, rx: 15, ry: 15, width: WIDTH, height: HEIGHT, transform: 'scale(1 -1)' },
            'tt_rect'
        );
        this.text = createSvgElement('text', {
            x: MARGIN + PADDING,
            y: MARGIN + PADDING + 18,
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

    render(text, x) {
        const svgBox = this.transformY.parentNode.getBoundingClientRect();
        this.text.textContent = text;
        if (x < 0.5) {
            this.transformX.setAttribute('transform', `translate(${x * svgBox.width} 0)`);
        } else {
            this.transformX.setAttribute('transform', `translate(${x * svgBox.width - 2 * MARGIN - WIDTH} 0)`);
        }
    }
}
