// components/advanced-chat/interactions/index.ts
import { lazy, LazyExoticComponent, ComponentType } from 'react'; // Import required types
import type { InteractionComponentTypeMap } from '@/types/advanced-chat'; // Import the type def

// Import components directly to avoid issues with lazy loading
import ColorPaletteEditor from './ColorPaletteEditor';
import FontPairSelector from './FontPairSelector';
import SiteStructureEditor from './SiteStructureEditor';
import SampleSectionPreview from './SampleSectionPreview';
import MultipleChoiceQuiz from './MultipleChoiceQuiz';

// Define the mapping directly to component references instead of using lazy loading
export const InteractionComponentsMap: InteractionComponentTypeMap = {
    colorPaletteEditor: ColorPaletteEditor,
    fontPairSelector: FontPairSelector,
    siteStructureEditor: SiteStructureEditor,
    sampleSectionPreview: SampleSectionPreview,
    multipleChoice: MultipleChoiceQuiz,
};

// Re-export components
export { ColorPaletteEditor };
export { FontPairSelector };
export { SiteStructureEditor };
export { SampleSectionPreview };
export { MultipleChoiceQuiz };