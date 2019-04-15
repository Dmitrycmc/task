import './check-box.css';
import { createElement } from '../../helpers/elements';
import { addListener, removeListener } from '../../helpers/event-listeners';
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

    let timeoutId = null;
    const clear = () => {
        onClear && onClear();
        removeListener(wrapper, 'touchend', onEndHolding);
        removeListener(wrapper, 'mouseup', onEndHolding);
    };
    const onStartHolding = () => {
        timeoutId = setTimeout(clear, 1000);
        addListener(wrapper, 'touchend', onEndHolding);
        addListener(wrapper, 'mouseup', onEndHolding);
    };
    const onEndHolding = () => {
        clearTimeout(timeoutId);
        toggle();
    };
    addListener(wrapper, 'touchstart', onStartHolding);
    addListener(wrapper, 'mousedown', onStartHolding);

    return { node: wrapper, toggle };
};
