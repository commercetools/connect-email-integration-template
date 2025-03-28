import edjsHTML from 'editorjs-html';
import { logger } from '../../../utils/logger.utils.js';

export class EditorJSEmailParser {
  /**
   * Parse EditorJS template content to HTML and replace template variables
   * @param {string} content - The EditorJS JSON content to parse
   * @param {Object} templateData - Data to replace in the template
   * @returns {string} HTML content with replaced variables
   */
  static parse(content, templateData) {
    try {
      // Parse the EditorJS JSON content
      const editorData = JSON.parse(content);
      logger.info('Parsed EditorJS data:', JSON.stringify(editorData, null, 2));
      
      // Initialize the parser with default blocks
      const edjsParser = edjsHTML();
      
      // Convert blocks to HTML
      const htmlBlocks = edjsParser.parse(editorData);
      logger.info('Parser output type:', typeof htmlBlocks);
      logger.info('Parser output:', JSON.stringify(htmlBlocks, null, 2));
      
      // Get the HTML content
      let htmlContent = '';
      if (Array.isArray(htmlBlocks)) {
        htmlContent = htmlBlocks.join('\n');
      } else if (typeof htmlBlocks === 'string') {
        htmlContent = htmlBlocks;
      } else {
        throw new Error('Unexpected output format from editorjs-html parser');
      }

      // Replace template variables with actual values
      const processedHtml = this.replaceTemplateVariables(htmlContent, templateData);
      logger.info('Final HTML output with replaced variables:', processedHtml);
      
      return processedHtml;
    } catch (error) {
      logger.error('Error parsing EditorJS template:', error);
      throw new Error('Failed to parse EditorJS template');
    }
  }

  /**
   * Replace template variables with actual values
   * @param {string} html - HTML content with template variables
   * @param {Object} data - Data to replace in the template
   * @returns {string} HTML with replaced variables
   */
  static replaceTemplateVariables(html, data) {
    let processedHtml = html;

    // Handle orderLineItems array iteration
    if (data.orderLineItems && Array.isArray(data.orderLineItems)) {
      // Replace the entire products section with a dynamic one
      const productsSection = this.generateProductsSection(data.orderLineItems);
      processedHtml = processedHtml.replace(
        /{orderLineItems\[\d+\].productName}[\s\S]*?Price: {orderLineItems\[\d+\].productSubTotal}/g,
        productsSection
      );
    }

    // Replace simple variables like {orderNumber}
    processedHtml = processedHtml.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key] || '';
    });

    // Replace remaining nested variables like {orderLineItems[0].productName}
    processedHtml = processedHtml.replace(/\{(\w+)(\[\d+\])?\.(\w+)\}/g, (match, arrayKey, index, property) => {
      if (data[arrayKey] && Array.isArray(data[arrayKey])) {
        const idx = index ? parseInt(index.replace(/[\[\]]/g, '')) : 0;
        return data[arrayKey][idx]?.[property] || '';
      }
      return '';
    });

    return processedHtml;
  }

  /**
   * Generate HTML section for products
   * @param {Array} orderLineItems - Array of order line items
   * @returns {string} HTML section with all products
   */
  static generateProductsSection(orderLineItems) {
    if (!orderLineItems || orderLineItems.length === 0) {
      return '<p>No products in this order.</p>';
    }

    return orderLineItems.map(item => `
      <p>${item.productName} - Quantity: ${item.productQuantity}</p>
      <p>SKU: ${item.productSku}</p>
      <p>Price: ${item.productSubTotal}</p>
      <hr>
    `).join('\n');
  }
} 