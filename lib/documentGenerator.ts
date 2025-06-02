/**
 * Prepares the raw Markdown content for attachment as a .md text file.
 * Currently, this function is a pass-through but can be used for any 
 * final formatting or validation of the markdown string if needed before attachment.
 * 
 * @param markdownContent The raw Markdown string from Gemini.
 * @returns The same Markdown string, ready to be buffered for an attachment.
 */
export function prepareMarkdownDocument(markdownContent: string): string {
  // For now, just return the content as is.
  // Future enhancements could include: 
  //  - Adding a header/footer specific to the .md file
  //  - Linting/validating the markdown
  //  - Ensuring consistent line endings
  return markdownContent;
}

/**
 * Converts the Markdown string to a Buffer for email attachment.
 * 
 * @param markdownContent The Markdown string.
 * @returns A Buffer containing the UTF-8 encoded Markdown content.
 */
export function getMarkdownBuffer(markdownContent: string): Buffer {
  return Buffer.from(markdownContent, 'utf-8');
} 