export interface TextFormats {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    alignment: 'left' | 'center' | 'right';
    fontSize: string;
}

export type TextFormatAction = {
    type: 'bold' | 'italic' | 'underline' | 'align' | 'size';
    value?: string;
} 