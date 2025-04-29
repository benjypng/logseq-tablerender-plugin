import showdown from 'showdown'
import { removeLsAttributes } from '../libs/process-content/remove-ls-attributes'

// 临时解决 logseq 未定义的问题
declare const logseq: any;

const converter = new showdown.Converter()

// Helper function to get YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)(?:[&?].*)?/;
  const match = url.match(youtubeRegex);
  // Ensure match exists and has the capture group
  return match && match[1] ? match[1] : null;
}

export const checkCell = async (
  _path: string,
  graphName: string,
  content: string,
): Promise<JSX.Element> => {
  let processedContent = removeLsAttributes(content).trim()
  let htmlOutput = ''

  // 1. Check for {{video ...}} macro
  const videoMacroRegex = /\{\{video (.*?)\}\}/i;
  const videoMatch = processedContent.match(videoMacroRegex);
  if (videoMatch && videoMatch[1]) {
    const videoUrl = videoMatch[1].trim();
    const videoId = getYouTubeVideoId(videoUrl);
    if (videoId) {
      // Generate YouTube embed iframe using inline styles (16:9 ratio, height 215px)
      htmlOutput = `<iframe style="width: 382px; height: 215px;" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    } else {
      // Fallback for non-YouTube videos or if ID extraction fails: show link
       htmlOutput = `<a href="${videoUrl}" target="_blank">${videoUrl}</a>`;
    }
    // Early return if video macro is processed
    const finalDiv: JSX.Element = <div dangerouslySetInnerHTML={{ __html: htmlOutput }} />;
    return finalDiv;
  }

  // 2. Check for <iframe> tag
  if (processedContent.toLowerCase().startsWith('<iframe')) {
    // Assume it's a valid iframe, pass it through directly
    htmlOutput = processedContent;
     // Early return if iframe is found
    return <div dangerouslySetInnerHTML={{ __html: htmlOutput }} />;
  }

  // 3. Process Logseq Links (Page and Block Refs) - Apply to original cleaned content
  // Process page references [[Page Name]]
  const pageRefRegex = /\[\[(.*?)\]\]/g;
   processedContent = processedContent.replace(pageRefRegex, (_match, pageName) => {
       return `<a href="logseq://graph/${graphName}?page=${encodeURIComponent(pageName)}">${pageName}</a>`;
   });

  // Process block references ((block-uuid))
  const blockRefRegex = /\(\((.*?)\)\)/g;
  const blockMatches = Array.from(processedContent.matchAll(blockRefRegex));

  // Asynchronously replace block references
  // We need to process them sequentially or in parallel with Promise.all
  // Using a simple sequential approach for clarity here
  for (const match of blockMatches) {
      const blockUUID = match[1];
      try {
          const block = await logseq.Editor.getBlock(blockUUID);
          if (block) {
              const blockContentText = removeLsAttributes(block.content).split('\n')[0] || blockUUID; // Use first line or UUID as text
              const replacement = `<a href="logseq://graph/${graphName}?block-id=${blockUUID}">${blockContentText}</a>`;
              processedContent = processedContent.replace(match[0], replacement);
          } else {
               // Keep original if block not found
               console.warn(`Block not found for UUID: ${blockUUID}`);
          }
      } catch (error) {
          console.error(`Error fetching block ${blockUUID}:`, error);
          // Keep original on error
      }
  }


  // 4. Convert remaining content from Markdown to HTML
  // Only convert if it wasn't an iframe or video macro handled above
  htmlOutput = converter.makeHtml(processedContent);


  // 5. Handle potential simple HTTPS links (after markdown conversion)
  // This logic might need refinement depending on showdown's output
  if (htmlOutput.startsWith('<p>https://') && htmlOutput.endsWith('</p>')) {
     const url = htmlOutput.substring(3, htmlOutput.length - 4); // Extract URL from <p> tags
     htmlOutput = `<a href="${url}" target="_blank">${url}</a>`;
  }


  // 6. Return the final HTML
  // Explicitly type the return value as JSX.Element although full resolution needs project setup
  const finalDiv: JSX.Element = <div dangerouslySetInnerHTML={{ __html: htmlOutput }} />;
  return finalDiv;
}
