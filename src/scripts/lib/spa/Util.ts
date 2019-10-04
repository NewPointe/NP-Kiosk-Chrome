
/**
 * Removes all children of a Node.
 * @param node The node to clear the children from.
 */
export function clearChildNodes(node: Node) {
    while (node.firstChild) node.removeChild(node.firstChild);
}

/**
 * Applies the `autofocus` attribute in a tree of elements.
 * For most browsers, this must be called inside an event handler
 * and the elements must already be attatched to the current document.
 * @param element The root of the dom tree to search through.
 */
export function applyAutofocus(element: HTMLElement) {
    const focusEl = element.querySelector<HTMLElement>("[autofocus]");
    if (focusEl) focusEl.focus();
}

/**
 * Encodes an invalid css character as "__" + charCode.
 * @param character The character to encode.
 */
function encodeInvalidCssCharacter(character: string) {
    const charCode = character.charCodeAt(0);
    return "__" + charCode.toString(16);
}

/**
 * Transforms the given text into a valid css class.
 * @param text The text to transform.
 */
export function toCssClass(text: string) {
    return text.replace(/[^a-z0-9-_]/g, encodeInvalidCssCharacter);
}
