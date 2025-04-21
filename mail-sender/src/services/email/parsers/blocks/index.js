import { LineItemsBlock } from './line-items.block.js';

// Registry of all available custom blocks
export const customBlocks = {
  [LineItemsBlock.type]: LineItemsBlock,
};

// Helper function to process all blocks in JSON content
export function processBlocksInJson(content, templateData) {
  const processedContent = JSON.parse(JSON.stringify(content));
  processNode(processedContent, templateData);
  return processedContent;
}

// Recursive function to process nodes in JSON content
function processNode(node, templateData, parentArray = null, indexInParent = null) {
  if (!node || typeof node !== 'object') return;

  // Check if the node is a custom block
  const blockType = node.type;
  if (blockType && customBlocks[blockType]) {
    const processedBlock = customBlocks[blockType].process(node, templateData);
    if (parentArray && indexInParent !== null) {
      // If the processed block is an array, replace the current node with all items in the array
      if (Array.isArray(processedBlock)) {
        // Remove the current node
        parentArray.splice(indexInParent, 1);
        // Insert all items from the processed block at the same position
        parentArray.splice(indexInParent, 0, ...processedBlock);
      } else {
        // Otherwise, just replace the current node with the processed block
        parentArray[indexInParent] = processedBlock;
      }
    }
    return;
  }

  // Process arrays and objects recursively
  if (Array.isArray(node)) {
    node.forEach((child, index) => {
      processNode(child, templateData, node, index);
    });
  } else {
    for (const key in node) {
      if (Array.isArray(node[key])) {
        node[key].forEach((child, index) => {
          processNode(child, templateData, node[key], index);
        });
      } else if (typeof node[key] === 'object') {
        processNode(node[key], templateData);
      }
    }
  }
} 