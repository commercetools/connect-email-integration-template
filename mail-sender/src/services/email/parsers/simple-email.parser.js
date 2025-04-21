export class SimpleEmailParser {
  /**
   * Parse simple text template with variable substitution
   * @param {string} content - The text content to parse
   * @param {Object} templateData - Data to replace in the template
   * @returns {string} Text with replaced variables
   */
  static parse(content, templateData) {
    if (!content || typeof content !== 'string') {
      return '';
    }

    let processedContent = content;

    // Replace simple variables like {{orderNumber}}
    processedContent = processedContent.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return templateData[key] || '';
    });

    // Replace nested variables like {{order.totalPrice.centAmount}}
    processedContent = processedContent.replace(/\{\{(\w+)(\.\w+)*\}\}/g, (match, ...keys) => {
      let value = templateData;
      for (const key of keys) {
        if (value && typeof value === 'object') {
          value = value[key];
        } else {
          return '';
        }
      }
      return value || '';
    });

    return processedContent;
  }
} 