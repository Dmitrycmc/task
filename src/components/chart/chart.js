import createCheckBox from '../check-box/check-box';
import { createElement } from '../../helpers/elements';
import './chart.css';

export default (data, title) => {
    const wrapper = createElement('crt_wrapper');
    const controls = createElement();
    const header = createElement();
    const cnv = createElement('ctr_canvas', 'canvas');
    header.textContent = title;

    controls.appendChild(createCheckBox('red', '#1'));
    controls.appendChild(createCheckBox('green', '#2'));

    wrapper.appendChild(header);
    wrapper.appendChild(cnv);
    wrapper.appendChild(controls);

    return wrapper;
};
