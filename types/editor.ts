export interface TextFormats {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    alignment: 'left' | 'center' | 'right';
}

export type TextFormatAction = {
    type: 'bold' | 'italic' | 'underline' | 'align';
    value?: string;
} 