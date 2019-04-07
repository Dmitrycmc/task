export const addListener = (element, event, listener) => {
    element.addEventListener(event, listener, false);
};

export const removeListener = (element, event, listener) => {
    element.removeEventListener(event, listener);
};
