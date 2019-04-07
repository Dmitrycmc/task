import './check-box.css';
import { createElement } from '../../helpers/elements';
import { addListener } from '../../helpers/event-listeners';
import createCheckIcon from '../icons/checkbox-icon';

const uncheckedMark = 'cb_unchecked-mark';
const checkedMark = 'cb_checked-mark';

export default (color, text, onChange) => {
    let checked = true;

    const wrapper = createElement('cb_wrapper');

    const mark = createElement(checkedMark);
    mark.style.color = color;

    const label = createElement('cb_label');
    label.textContent = text;

    wrapper.appendChild(mark);
    wrapper.appendChild(label);

    mark.appendChild(createCheckIcon());

    addListener(wrapper, 'click', () => {
        checked = !checked;
        onChange && onChange(checked);
        mark.className = checked ? checkedMark : uncheckedMark;
    });

    return wrapper;
};