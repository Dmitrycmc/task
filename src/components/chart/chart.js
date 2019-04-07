import createCheckBox from '../check-box/check-box';
import { createElement } from '../../helpers/elements';
import './chart.css';

export default (data, title) => {
    const wrapper = createElement('crt_wrapper');

    const header = document.createElement('div');
    header.textContent = title;

    wrapper.appendChild(header);
    wrapper.appendChild(createCheckBox('red', '#1'));

    return wrapper;
};
