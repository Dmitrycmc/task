import './check-box.css';
import { createElement } from '../../helpers/elements';
import { addListener } from '../../helpers/event-listeners';
import createCheckIcon from '../icons/checkbox-icon';

export default (color, text, onChange, onClear) => {
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

    const toggle = flag => {
        checked = flag === undefined ? !checked : flag;
        onChange && onChange(checked);
        wrapper.style.backgroundColor = checked ? color : 'transparent';
        label.style.color = checked ? 'white' : color;
        mark.style.opacity = +checked;
    };

    const onclick = () => toggle();
    addListener(wrapper, 'mousedown', onclick);
    addListener(wrapper, 'touchcancel', onclick);

    let timeoutId = null;
    const clear = () => {
        onClear && onClear();
    };
    const onStartHolding = () => {
        timeoutId = setTimeout(clear, 1000);
    };
    const onEndHolding = () => {
        clearTimeout(timeoutId);
    };
    addListener(wrapper, 'touchstart', onStartHolding);
    addListener(wrapper, 'mousedown', onStartHolding);
    addListener(wrapper, 'touchend', onEndHolding);
    addListener(wrapper, 'mouseup', onEndHolding);

    return { node: wrapper, toggle };
};
