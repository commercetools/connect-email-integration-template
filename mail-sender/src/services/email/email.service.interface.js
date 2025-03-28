/**
 * Interface for email service providers
 */
export class EmailServiceInterface {
  /**
   * Send an email using the configured provider
   * @param {Object} params - Email parameters
   * @param {string} params.from - Sender email address
   * @param {string} params.to - Recipient email address
   * @param {string} params.subject - Email subject
   * @param {string} params.body - Email body
   * @param {Object} [params.options] - Additional options specific to the provider
   * @returns {Promise<void>}
   */
  async sendEmail({ from, to, subject, body, options = {} }) {
    throw new Error('Method not implemented');
  }
} 