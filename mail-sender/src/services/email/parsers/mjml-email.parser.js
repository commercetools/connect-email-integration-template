import mjml2html from 'mjml';
import { logger } from '../../../utils/logger.utils.js';
import { JsonToMjml } from 'easy-email-core';
import { processBlocksInJson } from './blocks/index.js';

export class MJMLEmailParser {
  /**
   * Parse MJML template content to HTML and replace template variables
   * @param {string} content - The MJML content to parse (can be JSON string or MJML markup)
   * @param {Object} templateData - Data to replace in the template
   * @returns {string} HTML content with replaced variables
   */
  static parse(content, templateData) {
    try {
      // Try to parse as JSON first
      const parsedContent = JSON.parse(content);
      
      // Process custom blocks before converting to MJML
      const processedJson = processBlocksInJson(parsedContent, templateData);
      
      // // Convert JSON to MJML using easy-email-core
      const mjmlContent = JsonToMjml({
        data: processedJson,
        mode: 'production',
      });
      
      // Replace merge tags in the MJML content
      const processedContent = this.replaceMergeTags(mjmlContent, templateData);
      
      // Convert MJML to HTML
      const { html } = mjml2html(processedContent);
      
      return html;
    } catch (e) {
      logger.info("Error parsing MJML, falluteo", e);  
    }
  }
  
  /**
   * Replace merge tags with actual values from templateData
   * @param {string} content - The MJML content with merge tags
   * @param {Object} data - Data to replace in the template
   * @returns {string} MJML content with replaced variables
   */
  static replaceMergeTags(content, data) {
    let processedContent = content;

    // Handle nested object paths (e.g., order.totalPrice)
    const replaceNestedValue = (path) => {
      const keys = path.split('.');
      let value = data;
      for (const key of keys) {
        if (value && typeof value === 'object') {
          value = value[key];
        } else {
          return '';
        }
      }
      return value || '';
    };

    // Replace simple variables like {{order.id}}
    processedContent = processedContent.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return replaceNestedValue(key);
    });

    // Replace nested variables like {{order.totalPrice}}
    processedContent = processedContent.replace(/\{\{(\w+(\.\w+)*)\}\}/g, (match, path) => {
      return replaceNestedValue(path);
    });

    // Handle array iterations like {{#each lineItems}}
    processedContent = processedContent.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayKey, template) => {
      // Map template keys to actual data keys
      const keyMap = {
        'orderLineItems': 'lineItems',
        'productName': 'name',
        'productQuantity': 'quantity',
        'productSubTotal': 'totalPrice',
        'productPrice': 'price',
        'productId': 'productId',
        'productKey': 'productKey'
      };
      
      // Use the mapped key or the original key if no mapping exists
      const actualArrayKey = keyMap[arrayKey] || arrayKey;
      
      if (!data[actualArrayKey] || !Array.isArray(data[actualArrayKey])) {
        return '';
      }

      return data[actualArrayKey].map(item => {
        let itemTemplate = template;
        
        // Replace item properties in the template
        itemTemplate = itemTemplate.replace(/\{\{this\.(\w+)\}\}/g, (m, prop) => {
          // Use the mapped property name or the original if no mapping exists
          const actualProp = keyMap[prop] || prop;
          
          // Handle nested properties
          if (actualProp.includes('.')) {
            return replaceNestedValue(actualProp);
          }
          
          // Handle special cases for price objects
          if (actualProp === 'totalPrice' && item[actualProp]) {
            return `${(item[actualProp].centAmount / 100).toFixed(2)} ${item[actualProp].currencyCode}`;
          }
          
          if (actualProp === 'price' && item[actualProp]) {
            return `${(item[actualProp].centAmount / 100).toFixed(2)} ${item[actualProp].currencyCode}`;
          }
          
          // Handle name object which might be localized
          if (actualProp === 'name' && item[actualProp] && typeof item[actualProp] === 'object') {
            return item[actualProp].en || JSON.stringify(item[actualProp]);
          }
          
          return item[actualProp] || '';
        });
        
        return itemTemplate;
      }).join('');
    });

    // Handle currency formatting for price objects
    processedContent = processedContent.replace(/\{\{(\w+(\.\w+)*)\.formatted\}\}/g, (match, path) => {
      const value = replaceNestedValue(path);
      if (value && typeof value === 'object' && value.centAmount !== undefined) {
        return `${(value.centAmount / 100).toFixed(2)} ${value.currencyCode}`;
      }
      return value || '';
    });

    return processedContent;
  }
} 