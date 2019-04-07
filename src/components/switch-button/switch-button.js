import './switch-button.css';

import { addListener } from "../../helpers/event-listeners";

const node = document.getElementById("switch-button");

const nightLabel = "Switch to Day Mode";
const dayLabel = "Switch to Night Mode";

let night = false;

const switchToNight = () => {
    node.textContent=nightLabel;
    document.body.className="night";
    night = true;
};

const switchToDay = () => {
    node.textContent=dayLabel;
    document.body.className="";
    night = false;
};

export default () => {
    node.textContent=dayLabel;

    addListener(node, 'click', () => {
        if (night) {
            switchToDay();
        } else {switchToNight();}
    });
};