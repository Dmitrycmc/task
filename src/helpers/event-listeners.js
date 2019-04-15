export const addListener = (element, event, listener) => {
    element.addEventListener(event, listener, false);
};

export const removeListener = (element, event, listener) => {
    element.removeEventListener(event, listener);
};

export const addDragAndDropListeners = (element, listener) => {
    const getMouseCoords = e => ({ x: e.clientX, y: e.clientY });
    const getTouchCoords = e => ({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
    const getMouseOffset = e => ({ x: e.offsetX, y: e.offsetY });
    const getTouchOffset = e => {
        const box = element.getBoundingClientRect();
        const touchCoords = getTouchCoords(e);
        return {
            x: touchCoords.x - box.left,
            y: touchCoords.y - box.top
        };
    };

    addListener(element, 'mousedown', e => {
        const offset = getMouseOffset(e);

        const onMouseMove = e => {
            if (e.buttons !== 1) {
                removeListener(document.body, 'mousemove', onMouseMove);
                removeListener(document.body, 'mouseup', onMouseUp);
            } else {
                const mouseCoords = getMouseCoords(e);
                const cornerCoords = { x: mouseCoords.x - offset.x, y: mouseCoords.y + offset.y };
                listener(cornerCoords);
            }
        };

        function onMouseUp() {
            removeListener(document.body, 'mousemove', onMouseMove);
            removeListener(document.body, 'mouseup', onMouseUp);
        }

        addListener(document.body, 'mousemove', onMouseMove);
        addListener(document.body, 'mouseup', onMouseUp);
    });

    addListener(element, 'touchstart', e => {
        const offset = getTouchOffset(e);
        const touchId = e.changedTouches[0].identifier;

        const onTouchMove = e => {
            if (e.targetTouches[0].identifier !== touchId) return;
            const touchCoords = getTouchCoords(e);
            const cornerCoords = { x: touchCoords.x - offset.x, y: touchCoords.y + offset.y };
            listener(cornerCoords);
        };

        function onTouchEnd() {
            removeListener(document.body, 'touchmove', onTouchMove);
            removeListener(document.body, 'touchend', onTouchEnd);
            removeListener(document.body, 'touchcancel', onTouchEnd);
        }

        addListener(document.body, 'touchmove', onTouchMove);
        addListener(document.body, 'touchend', onTouchEnd);
        addListener(document.body, 'touchcancel', onTouchEnd);
    });
};
