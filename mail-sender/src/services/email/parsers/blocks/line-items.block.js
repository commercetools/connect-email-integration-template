import { BaseCustomBlock } from './base.block.js';
import { logger } from '../../../../utils/logger.utils.js';

export class LineItemsBlock extends BaseCustomBlock {
  static get type() {
    return 'line-items';
  }

  static process(block, templateData) {
    try {
      const lineItems = block.data?.value?.items || templateData.order?.orderLineItems || [];
      const styles = block.styles || block.data?.value?.styles || {};
      const attributes = block.attributes || {};
      const text = block.data?.value?.text || block.text || 'Order Items';

      const headerSection = {
        type: 'section',
        data: { value: {} },
        attributes: {
          'background-color': attributes['background-color'] || '#ffffff',
          'padding': styles.section?.padding || '20px',
          'border-radius': styles.section?.borderRadius || '0px'
        },
        children: [
          {
            type: 'column',
            data: { value: {} },
            attributes: {
              'padding': '0px',
              'border': 'none',
              'vertical-align': 'top'
            },
            children: [
              {
                type: 'text',
                data: {
                  value: {
                    content: text
                  }
                },
                attributes: {
                  'color': attributes['text-color'] || '#000000',
                  'font-size': styles.header?.text?.['font-size'] || '20px',
                  'font-weight': styles.header?.text?.['font-weight'] || 'bold',
                  'padding-bottom': styles.header?.text?.padding?.split(' ')[0] || '10px',
                  'border-bottom': styles.header?.text?.['border-bottom'] || '1px solid #e0e0e0'
                },
                children: []
              }
            ]
          }
        ]
      };

      const itemSections = lineItems.map(item => ({
        type: 'section',
        data: { value: { noWrap: false } },
        attributes: {
          'padding': styles.item?.section?.padding || '10px 0',
          'border-bottom': styles.item?.section?.['border-bottom'] || '1px solid #f0f0f0',
          'background-repeat': 'repeat',
          'background-size': 'auto',
          'background-position': 'top center',
          'border': 'none',
          'direction': 'ltr',
          'text-align': 'center'
        },
        children: [
          {
            type: 'column',
            data: { value: {} },
            attributes: {
              'padding': '0px',
              'border': 'none',
              'vertical-align': 'top'
            },
            children: [
              {
                type: 'text',
                data: {
                  value: {
                    content: item.productName || ''
                  }
                },
                attributes: {
                  'color': attributes['text-color'] || '#000000',
                  'font-size': styles.item?.productName?.['font-size'] || '16px',
                  'font-weight': styles.item?.productName?.['font-weight'] || 'bold',
                  'padding': styles.item?.productName?.padding || '0 0 5px 0',
                  'align': styles.item?.productName?.align || 'left'
                },
                children: []
              },
              {
                type: 'text',
                data: {
                  value: {
                    content: `Quantity: ${item.productQuantity || 0} | Subtotal: ${item.productSubTotal || '0.00'}`
                  }
                },
                attributes: {
                  'color': attributes['text-color'] || '#000000',
                  'font-size': styles.item?.details?.quantity?.['font-size'] || '14px',
                  'padding': styles.item?.details?.quantity?.padding || '0',
                  'align': styles.item?.details?.quantity?.align || 'left'
                },
                children: []
              }
            ]
          }
        ]
      }));

      return [headerSection, ...itemSections];
    } catch (error) {
      logger.error('Error processing line items block:', error);
      return [{
        type: 'text',
        data: {
          value: {
            content: 'Error processing line items'
          }
        },
        attributes: {},
        children: []
      }];
    }
  }
  
} 