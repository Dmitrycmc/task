export const createElement = (className, tag='div') => {
    const node = document.createElement(tag);
    if (className) node.className=className;
    return node;
}