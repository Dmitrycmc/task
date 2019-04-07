import './switch-button.css';
import { addListener } from '../../helpers/event-listeners';

const nightLabel = 'Switch to Day Mode';
const dayLabel = 'Switch to Night Mode';

export default () => {
    const btn = document.createElement('div');
    btn.id = 'btn-switch';

    let night = false;
    btn.textContent = dayLabel;

    const switchToNight = () => {
        btn.textContent = nightLabel;
        document.body.className = 'night';
        night = true;
    };

    const switchToDay = () => {
        btn.textContent = dayLabel;
        document.body.className = '';
        night = false;
    };

    addListener(btn, 'click', () => {
        if (night) {
            switchToDay();
        } else {
            switchToNight();
        }
    });

    return btn;
};
