import {chatTool} from './chat.js';
import {codeGenerationTool} from './codeGeneration.js';
import {codeExplanationTool} from './codeExplanation.js';
import {codeReviewTool} from './codeReview.js';
import {documentAnalysisTool} from './documentAnalysis.js';
import {dataAnalysisTool} from './dataAnalysis.js';
import {suggestionsTool} from './suggestions.js';
import {autocompleteTool} from './autocomplete.js';

export const tools = [
    chatTool,
    codeGenerationTool,
    codeExplanationTool,
    codeReviewTool,
    documentAnalysisTool,
    dataAnalysisTool,
    suggestionsTool,
    autocompleteTool
];
