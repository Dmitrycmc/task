export const addListener = (element, event, listener) => {
    element.addEventListener(event, listener, false);
};

export const removeListener = (element, event, listener) => {
    element.removeEventListener(event, listener);
};

export const addDragAndDropListeners = (element, listener) => {
    const mouseCoords = e => ({ x: e.clientX, y: e.clientY });
    const touchCoords = e => ({ x: e.touches[0].clientX, y: e.touches[0].clientY });

    const onMouseMove = e => {
        listener(mouseCoords(e));
    };
    const onTouchMove = e => {
        listener(touchCoords(e));
    };

    function onMouseUp() {
        removeListener(document.body, 'mousemove', onMouseMove);
        removeListener(document.body, 'mouseup', onMouseUp);
    }

    addListener(element, 'mousedown', e => {
        listener(mouseCoords(e));
        addListener(document.body, 'mousemove', onMouseMove);
        addListener(document.body, 'mouseup', onMouseUp);
    });

    function onTouchEnd() {
        removeListener(document.body, 'touchmove', onTouchMove);
        removeListener(document.body, 'touchend', onTouchEnd);
        removeListener(document.body, 'touchcancel', onTouchEnd);
    }

    addListener(element, 'touchstart', e => {
        listener(touchCoords(e));
        addListener(document.body, 'touchmove', onTouchMove);
        addListener(document.body, 'touchend', onTouchEnd);
        addListener(document.body, 'touchcancel', onTouchEnd);
    });
};
