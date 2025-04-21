# Email Parsers System

This directory contains the email parsing system that converts different email formats into HTML. The system is designed to be modular and extensible, supporting multiple input formats and custom blocks.

## Parser Types

- `mjml-email.parser.js`: Main parser for MJML templates
- `simple-email.parser.js`: Parser for simple HTML templates
- `editorjs-email.parser.js`: Parser for EditorJS content
- `basic-email.parser.js`: Basic HTML parser

## Custom Blocks System

The custom blocks system allows for extending the email template functionality with custom components. It's particularly useful for creating reusable, complex components like order line items, product grids, or any other custom email sections.

### Structure

```
parsers/
├── blocks/
│   ├── base.block.js      # Base class for all custom blocks
│   ├── line-items.block.js # Example custom block implementation
│   └── index.js           # Block registry and processing utilities
└── mjml-email.parser.js   # Main parser using the blocks system
```

### How Custom Blocks Work

1. **Base Block Class**
   - All custom blocks extend `BaseCustomBlock`
   - Defines the interface and common functionality
   - Ensures consistent implementation across blocks

2. **Block Implementation**
   - Each block must implement:
     - `type`: Block identifier
     - `process`: JSON processing logic

3. **Block Registry**
   - All blocks are registered in `blocks/index.js`
   - Provides centralized processing functions
   - Makes it easy to add new blocks

### Example Block Implementation

```javascript
import { BaseCustomBlock } from './base.block.js';

export class LineItemsBlock extends BaseCustomBlock {
  static get type() {
    return 'line-items';
  }

  static process(block, templateData) {
    // Process block in JSON format
  }

}
```

### Processing Flow

1. **JSON Processing**
   ```
   Input JSON → processBlocksInJson() → JsonToMjml() → MJML
   ```

2. **Template Data**
   - Merge tags are replaced with actual data
   - Supports nested object paths
   - Handles special cases (prices, localized content)

### Adding New Custom Blocks

1. Create a new block file in `blocks/` directory
2. Extend `BaseCustomBlock`
3. Implement required methods
4. Register the block in `blocks/index.js`

Example:
```javascript
// blocks/new-block.block.js
import { BaseCustomBlock } from './base.block.js';

export class NewBlock extends BaseCustomBlock {
  static get type() {
    return 'new-block';
  }

  static process(block, templateData) {
    // Implementation
  }
}

// blocks/index.js
import { NewBlock } from './new-block.block.js';

export const customBlocks = {
  [LineItemsBlock.type]: LineItemsBlock,
  [NewBlock.type]: NewBlock,
};
```

### Block Types

Currently supported custom blocks:
- `line-items`: Renders order line items with customizable styling

### Best Practices

1. **Block Design**
   - Keep blocks focused on a single responsibility
   - Make blocks configurable through attributes and styles
   - Handle errors gracefully

2. **Style Management**
   - Use consistent style naming
   - Provide default styles
   - Allow style overrides

3. **Data Handling**
   - Validate input data
   - Provide fallback values
   - Handle missing data gracefully

4. **Performance**
   - Minimize DOM operations
   - Cache processed results when possible
   - Use efficient string operations

### Integration with easy-email-core

The custom blocks system works alongside easy-email-core:
- Standard blocks are processed by easy-email-core
- Custom blocks are processed by our system
- Both systems can coexist in the same template

Example template using both systems:
```json
{
  "type": "mj-section",
  "children": [
    {
      "type": "mj-column",
      "children": [
        {
          "type": "mj-text",
          "content": "Standard block"
        },
        {
          "type": "line-items",
          "data": {
            "value": {
              "items": []
            }
          }
        }
      ]
    }
  ]
}
``` 