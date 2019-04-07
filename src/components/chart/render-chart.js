import { createElement } from '../../helpers/elements';

export default data => {
    const cnv = createElement('ctr_canvas', 'canvas');
    const ctx = cnv.getContext('2d');

    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, 150, 75);

    return cnv;
};
