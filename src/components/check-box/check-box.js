import './check-box.css';
import { createElement } from '../../helpers/elements';
import { addListener } from '../../helpers/event-listeners';
import createCheckIcon from '../icons/checkbox-icon';

export default (color, text, onChange) => {
    let checked = true;

    const wrapper = createElement('cb_wrapper');
    wrapper.style.backgroundColor = color;
    wrapper.style.borderColor = color;

    const mark = createElement('mark');

    const label = createElement('cb_label');
    label.textContent = text;

    wrapper.appendChild(mark);
    wrapper.appendChild(label);

    mark.appendChild(createCheckIcon());

    addListener(wrapper, 'click', () => {
        checked = !checked;
        onChange && onChange(checked);
        wrapper.style.backgroundColor = checked ? color : 'transparent';
        label.style.color = checked ? 'white' : color;
        mark.style.opacity = +checked;
    });

    return wrapper;
};
