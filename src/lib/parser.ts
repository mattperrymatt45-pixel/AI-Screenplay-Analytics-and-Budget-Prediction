import { ParsedScript, ScriptElement } from '../types';
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Parse a Fountain format screenplay
 * Fountain is a plain-text markup language for screenwriting
 */
function parseFountain(text: string): ParsedScript {
  const lines = text.split('\n');
  const elements: ScriptElement[] = [];
  let title = 'Untitled';
  let author = 'Unknown';
  let inTitlePage = true;
  let sceneCount = 0;

  // Parse title page
  for (let i = 0; i < Math.min(lines.length, 30); i++) {
    const line = lines[i].trim();
    if (line.toLowerCase().startsWith('title:')) {
      title = line.replace(/^title:\s*/i, '').replace(/^_|_$/g, '').trim();
    } else if (line.toLowerCase().startsWith('author:') || line.toLowerCase().startsWith('credit:')) {
      author = line.replace(/^(author|credit):\s*/i, '').trim();
    }
    if (line === '' && i > 5) {
      inTitlePage = false;
    }
  }

  let i = inTitlePage ? 0 : 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (trimmed === '') {
      i++;
      continue;
    }

    // Scene heading detection
    if (/^(INT\.|EXT\.|INT\.\/EXT\.|I\/E\.|EST\.)\s/i.test(trimmed) || trimmed.startsWith('.') && trimmed.length > 1 && !trimmed.startsWith('..')) {
      sceneCount++;
      elements.push({
        type: 'scene_heading',
        text: trimmed.startsWith('.') ? trimmed.substring(1) : trimmed,
        sceneNumber: sceneCount,
      });
      i++;
      continue;
    }

    // Transition
    if (/^(FADE IN:|FADE OUT\.|FADE TO:|CUT TO:|SMASH CUT TO:|DISSOLVE TO:|MATCH CUT TO:|IRIS OUT\.)$/i.test(trimmed) || (trimmed.endsWith('TO:') && trimmed === trimmed.toUpperCase())) {
      elements.push({ type: 'transition', text: trimmed });
      i++;
      continue;
    }

    // Page break
    if (trimmed === '===') {
      elements.push({ type: 'page_break', text: '' });
      i++;
      continue;
    }

    // Section
    if (trimmed.startsWith('#')) {
      elements.push({ type: 'section', text: trimmed.replace(/^#+\s*/, '') });
      i++;
      continue;
    }

    // Synopsis
    if (trimmed.startsWith('=') && !trimmed.startsWith('===')) {
      elements.push({ type: 'synopsis', text: trimmed.substring(1).trim() });
      i++;
      continue;
    }

    // Note
    if (trimmed.startsWith('[[') && trimmed.endsWith(']]')) {
      elements.push({ type: 'note', text: trimmed.slice(2, -2) });
      i++;
      continue;
    }

    // Character name (all caps, possibly with (V.O.) or (O.S.))
    if (/^[A-Z][A-Z0-9 .'-]+(\s*\(.*\))?$/.test(trimmed) && trimmed.length < 60 && !trimmed.startsWith('INT') && !trimmed.startsWith('EXT')) {
      const charName = trimmed.replace(/\s*\(.*\)/, '').trim();
      elements.push({ type: 'character', text: charName });

      // Look ahead for parenthetical and dialogue
      i++;
      while (i < lines.length) {
        const nextLine = lines[i].trim();
        if (nextLine === '') break;

        if (nextLine.startsWith('(') && nextLine.endsWith(')')) {
          elements.push({ type: 'parenthetical', text: nextLine });
        } else {
          elements.push({ type: 'dialogue', text: nextLine });
        }
        i++;
      }
      continue;
    }

    // Default: action
    elements.push({ type: 'action', text: trimmed });
    i++;
  }

  return { title, author, elements, format: 'fountain' };
}

/**
 * Parse FDX (Final Draft XML) format
 */
function parseFDX(text: string): ParsedScript {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');
  const elements: ScriptElement[] = [];
  let title = 'Untitled';
  let author = 'Unknown';
  let sceneCount = 0;

  // Try to get title page info
  const titlePageNodes = doc.querySelectorAll('TitlePage Content Paragraph');
  titlePageNodes.forEach(p => {
    const textContent = p.textContent?.trim() || '';
    if (textContent.toLowerCase().includes('written by') || textContent.toLowerCase().includes('by')) {
      // Next paragraph might be author
    }
  });

  // Parse paragraphs
  const paragraphs = doc.querySelectorAll('Content Paragraph');
  paragraphs.forEach(p => {
    const pType = p.getAttribute('Type') || '';
    const textParts: string[] = [];
    p.querySelectorAll('Text').forEach(t => {
      textParts.push(t.textContent || '');
    });
    const fullText = textParts.join('').trim();

    if (!fullText) return;

    switch (pType) {
      case 'Scene Heading':
        sceneCount++;
        elements.push({ type: 'scene_heading', text: fullText, sceneNumber: sceneCount });
        break;
      case 'Action':
        elements.push({ type: 'action', text: fullText });
        break;
      case 'Character':
        elements.push({ type: 'character', text: fullText });
        break;
      case 'Dialogue':
        elements.push({ type: 'dialogue', text: fullText });
        break;
      case 'Parenthetical':
        elements.push({ type: 'parenthetical', text: fullText });
        break;
      case 'Transition':
        elements.push({ type: 'transition', text: fullText });
        break;
      default:
        elements.push({ type: 'action', text: fullText });
    }
  });

  // Try to extract title from header or first page info
  const headerContent = doc.querySelector('HeaderAndFooter Header Paragraph Text');
  if (headerContent?.textContent) {
    title = headerContent.textContent.trim();
  }

  return { title, author, elements, format: 'fdx' };
}

/**
 * Parse plain text / PDF text as screenplay
 */
function parsePlainText(text: string): ParsedScript {
  // Treat as fountain-like format
  return { ...parseFountain(text), format: 'text' };
}

/**
 * Check if extracted PDF text looks like a screenplay
 */
function looksLikeScreenplay(text: string): { isScreenplay: boolean; confidence: number; warning?: string } {
  const lines = text.split('\n').filter(l => l.trim());
  
  // Look for screenplay indicators
  const sceneHeadingPattern = /^(INT\.|EXT\.|INT\.\/EXT\.|I\/E\.)\s/im;
  const hasSceneHeadings = sceneHeadingPattern.test(text);
  
  const allCapsLines = lines.filter(l => l.trim() === l.trim().toUpperCase() && l.trim().length > 2 && l.trim().length < 40);
  const allCapsRatio = allCapsLines.length / lines.length;
  
  const dialoguePattern = /^\s{20,}[A-Z]/m;
  const hasDialogueIndentation = dialoguePattern.test(text);
  
  const fadePattern = /FADE (IN|OUT|TO)/i;
  const hasFade = fadePattern.test(text);
  
  let confidence = 0;
  if (hasSceneHeadings) confidence += 0.4;
  if (allCapsRatio > 0.1) confidence += 0.2;
  if (hasDialogueIndentation) confidence += 0.2;
  if (hasFade) confidence += 0.2;
  
  const isScreenplay = confidence >= 0.4;
  
  return {
    isScreenplay,
    confidence,
    warning: !isScreenplay 
      ? 'This PDF may not be a properly formatted screenplay. The analysis may be less accurate. Consider using a .fountain or .fdx file for best results.'
      : undefined
  };
}

/**
 * Extract text from PDF using pdf.js
 */
async function parsePDF(arrayBuffer: ArrayBuffer): Promise<{ script: ParsedScript; warning?: string }> {
  try {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Extract text items and try to preserve layout
      const items = textContent.items as Array<{ str: string; transform: number[] }>;
      
      // Sort by Y position (descending) then X position (ascending)
      items.sort((a, b) => {
        const yDiff = b.transform[5] - a.transform[5];
        if (Math.abs(yDiff) > 5) return yDiff;
        return a.transform[4] - b.transform[4];
      });
      
      let lastY = -1;
      let pageText = '';
      
      for (const item of items) {
        const y = Math.round(item.transform[5]);
        const x = Math.round(item.transform[4]);
        
        if (lastY !== -1 && Math.abs(y - lastY) > 10) {
          pageText += '\n';
          // Add extra newline for larger gaps (scene breaks, etc.)
          if (Math.abs(y - lastY) > 20) {
            pageText += '\n';
          }
        } else if (lastY === y && pageText.length > 0 && !pageText.endsWith(' ')) {
          // Same line, add space if needed
          pageText += ' ';
        }
        
        // Try to preserve indentation for character names and dialogue
        if (lastY !== y && x > 150) {
          pageText += '                    '; // Approximate center indentation
        }
        
        pageText += item.str;
        lastY = y;
      }
      
      fullText += pageText + '\n\n';
    }
    
    // Check if it looks like a screenplay
    const validation = looksLikeScreenplay(fullText);
    
    // Clean up the text
    fullText = fullText
      .replace(/\r\n/g, '\n')
      .replace(/\n{4,}/g, '\n\n\n')
      .trim();
    
    const script = parseFountain(fullText);
    script.format = 'text'; // Mark as text since it came from PDF
    
    return {
      script,
      warning: validation.warning
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF. Please ensure the file is a valid PDF document.');
  }
}

/**
 * Detect file format and parse accordingly
 */
export function parseScript(content: string, filename: string): ParsedScript {
  const ext = filename.toLowerCase().split('.').pop() || '';

  switch (ext) {
    case 'fountain':
    case 'spmd':
      return parseFountain(content);
    case 'fdx':
      return parseFDX(content);
    case 'txt':
      return parsePlainText(content);
    default:
      // Try to detect format from content
      if (content.trim().startsWith('<?xml') || content.trim().startsWith('<FinalDraft')) {
        return parseFDX(content);
      }
      return parsePlainText(content);
  }
}

/**
 * Parse script from file (handles both text and binary formats like PDF)
 */
export async function parseScriptFromFile(file: File): Promise<{ script: ParsedScript; warning?: string }> {
  const ext = file.name.toLowerCase().split('.').pop() || '';
  
  if (ext === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    return parsePDF(arrayBuffer);
  }
  
  // For text-based formats
  const text = await file.text();
  return { script: parseScript(text, file.name) };
}
