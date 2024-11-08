import { TextFormats, TextFormatAction } from "@/types/editor";

export const applyFormatting = (element: Element, action: TextFormatAction): void => {
    if (!element) return;

    const applyClass = (className: string) => {
        if (element.classList.contains(className)) {
            element.classList.remove(className);
        } else {
            element.classList.add(className);
        }
    };

    switch (action.type) {
        case 'bold':
            applyClass('font-bold');
            break;
        case 'italic':
            applyClass('italic');
            break;
        case 'underline':
            applyClass('underline');
            break;
        case 'align':
            // Remove existing alignment classes
            element.classList.remove('text-left', 'text-center', 'text-right');
            // Add new alignment
            if (action.value) {
                element.classList.add(`text-${action.value}`);
            }
            break;
    }
};

export const getElementFormatting = (element: Element): TextFormats => {
    return {
        bold: element.classList.contains('font-bold'),
        italic: element.classList.contains('italic'),
        underline: element.classList.contains('underline'),
        alignment: getAlignment(element),
    };
};

export const getFormatBarPosition = (element: Element) => {
    const rect = element.getBoundingClientRect();
    const iframeRect = (element.ownerDocument as any).defaultView.frameElement.getBoundingClientRect();

    return {
        x: rect.left + iframeRect.left,
        y: Math.max(rect.top + iframeRect.top - 45, 10)
    };
};

const getAlignment = (element: Element): 'left' | 'center' | 'right' => {
    if (element.classList.contains('text-center')) return 'center';
    if (element.classList.contains('text-right')) return 'right';
    return 'left';
};

// Update the highlight functions
export const highlightElement = (element: Element) => {
    // Only remove highlights from non-active elements
    document.querySelectorAll('.text-highlight').forEach(el => {
        if (!el.classList.contains('text-highlight-active')) {
            el.classList.remove('text-highlight');
        }
    });

    if (element && !element.classList.contains('text-highlight-active')) {
        element.classList.add('text-highlight');
    }
};

export const setActiveHighlight = (element: Element) => {
    // Remove all hover highlights first
    const doc = element.ownerDocument;
    doc.querySelectorAll('.text-highlight').forEach(el => {
        el.classList.remove('text-highlight');
    });

    // Remove active highlight from other elements
    doc.querySelectorAll('.text-highlight-active').forEach(el => {
        el.classList.remove('text-highlight-active');
    });

    element.classList.add('text-highlight-active');
};

// Add this new function
export const applyFormattingToSelection = (element: Element, action: TextFormatAction): void => {
    const selection = element.ownerDocument?.getSelection();
    if (!selection || selection.rangeCount === 0) {
        // If no selection, apply to whole element
        applyFormatting(element, action);
        return;
    }

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
        // If cursor is just placed without selection, apply to whole element
        applyFormatting(element, action);
        return;
    }

    // Create a span with the formatting
    const span = element.ownerDocument.createElement('span');
    switch (action.type) {
        case 'bold':
            span.classList.add('font-bold');
            break;
        case 'italic':
            span.classList.add('italic');
            break;
        case 'underline':
            span.classList.add('underline');
            break;
    }

    // If it's alignment, apply to the whole element instead
    if (action.type === 'align') {
        applyFormatting(element, action);
        return;
    }

    // Wrap the selected content in the formatted span
    const fragment = range.extractContents();
    span.appendChild(fragment);
    range.insertNode(span);

    // Restore the selection
    selection.removeAllRanges();
    selection.addRange(range);
}; 