export class BasicEmailParser {
  /**
   * Parse email content using basic regex patterns
   * @param {string} content - The email content to parse
   * @returns {Object} Parsed email data
   */
  static parse(content) {
    const result = {
      orderNumber: null,
      customerEmail: null,
      totalAmount: null,
      items: [],
      date: null
    };

    // Extract order number (assuming format: Order #123456)
    const orderMatch = content.match(/Order\s*#(\d+)/i);
    if (orderMatch) {
      result.orderNumber = orderMatch[1];
    }

    // Extract email address
    const emailMatch = content.match(/[\w.-]+@[\w.-]+\.\w+/i);
    if (emailMatch) {
      result.customerEmail = emailMatch[0];
    }

    // Extract total amount (assuming format: Total: $123.45)
    const totalMatch = content.match(/Total:\s*\$?(\d+\.?\d*)/i);
    if (totalMatch) {
      result.totalAmount = parseFloat(totalMatch[1]);
    }

    // Extract date (assuming format: Date: MM/DD/YYYY)
    const dateMatch = content.match(/Date:\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/i);
    if (dateMatch) {
      result.date = dateMatch[1];
    }

    // Extract items (assuming format: Item Name - $XX.XX)
    const itemMatches = content.matchAll(/([^-\n]+)\s*-\s*\$?(\d+\.?\d*)/g);
    for (const match of itemMatches) {
      result.items.push({
        name: match[1].trim(),
        price: parseFloat(match[2])
      });
    }

    return result;
  }
} 