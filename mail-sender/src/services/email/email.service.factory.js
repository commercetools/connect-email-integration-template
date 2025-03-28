import { EmailServiceInterface } from './email.service.interface.js';
import { logger } from '../../utils/logger.utils.js';

/**
 * Factory for creating email service instances
 */
export class EmailServiceFactory {
  /**
   * Create an instance of the configured email service
   * @param {string} provider - The email provider to use
   * @returns {Promise<EmailServiceInterface>} An instance of the email service
   */
  static async createService(provider) {
    try {
      // Import the provider implementation dynamically
      const providerModule = await import(`./providers/${provider}.provider.js`);
      const ProviderClass = providerModule.default;
      
      if (!ProviderClass || !(ProviderClass.prototype instanceof EmailServiceInterface)) {
        throw new Error(`Invalid email provider implementation: ${provider}`);
      }

      return new ProviderClass();
    } catch (error) {
      logger.error(`Failed to create email service for provider ${provider}:`, error);
      throw new Error(`Unsupported email provider: ${provider}`);
    }
  }
} 