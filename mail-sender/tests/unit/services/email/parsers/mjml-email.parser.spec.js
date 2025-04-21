import { MJMLEmailParser } from '../../../../../src/services/email/parsers/mjml-email.parser.js';

describe('MJMLEmailParser', () => {
  describe('parse', () => {
    it('should parse MJML template and replace merge tags', () => {
      const mjmlTemplate = `
        <mjml>
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-text>
                  Order #{{order.id}}
                  Customer: {{customer.firstName}} {{customer.lastName}}
                  Total: {{order.totalPrice}}
                  
                  Items:
                  {{#each orderLineItems}}
                  - {{this.productName}} ({{this.productQuantity}})
                  {{/each}}
                </mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `;

      const templateData = {
        order: {
          id: '12345',
          totalPrice: '$99.99'
        },
        customer: {
          firstName: 'John',
          lastName: 'Doe'
        },
        orderLineItems: [
          {
            productName: 'Product 1',
            productQuantity: 2
          },
          {
            productName: 'Product 2',
            productQuantity: 1
          }
        ]
      };

      const result = MJMLEmailParser.parse(mjmlTemplate, templateData);
      
      // The result should be HTML and contain the replaced values
      expect(result).toContain('Order #12345');
      expect(result).toContain('Customer: John Doe');
      expect(result).toContain('Total: $99.99');
      expect(result).toContain('Product 1 (2)');
      expect(result).toContain('Product 2 (1)');
    });

    it('should handle missing data gracefully', () => {
      const mjmlTemplate = `
        <mjml>
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-text>
                  Order #{{order.id}}
                  Customer: {{customer.firstName}} {{customer.lastName}}
                </mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `;

      const templateData = {
        order: {
          id: '12345'
        }
      };

      const result = MJMLEmailParser.parse(mjmlTemplate, templateData);
      
      expect(result).toContain('Order #12345');
      expect(result).toContain('Customer:  ');
    });

    it('should handle empty arrays in iterations', () => {
      const mjmlTemplate = `
        <mjml>
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-text>
                  {{#each orderLineItems}}
                  - {{this.productName}}
                  {{/each}}
                </mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `;

      const templateData = {
        orderLineItems: []
      };

      const result = MJMLEmailParser.parse(mjmlTemplate, templateData);
      
      expect(result).not.toContain('{{this.productName}}');
    });
  });
}); 