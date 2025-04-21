import { logger } from '../../../../utils/logger.utils.js';

export class BaseCustomBlock {
  constructor() {
    if (this.constructor === BaseCustomBlock) {
      throw new Error('BaseCustomBlock is an abstract class and cannot be instantiated directly.');
    }
  }

  /**
   * Get the block type identifier
   * @returns {string} The block type identifier
   */
  static get type() {
    throw new Error('type getter must be implemented by child class');
  }

  /**
   * Process the block data and return MJML structure
   * @param {Object} block - The block data
   * @param {Object} templateData - The template data
   * @returns {string} The processed MJML structure
   */
  static process(block, templateData) {
    throw new Error('process method must be implemented by child class');
  }

  /**
   * Get the regex pattern for finding this block in MJML content
   * @returns {RegExp} The regex pattern
   */
  static getMjmlPattern() {
    return new RegExp(`<custom-block[^>]*data-type="${this.type}"[^>]*>([\\s\\S]*?)<\\/custom-block>`, 'g');
  }

  /**
   * Extract data from a custom block match
   * @param {string} content - The block content
   * @returns {Object} The extracted data
   */
  static extractData(content) {
    try {
      const dataMatch = content.match(/data-value="([^"]*)"/);
      if (!dataMatch) return null;
      
      return JSON.parse(decodeURIComponent(dataMatch[1]));
    } catch (error) {
      logger.error(`Error extracting data from ${this.type} block:`, error);
      return null;
    }
  }
} 