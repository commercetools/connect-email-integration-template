/**
 * Development Configuration
 * 
 * This file contains configuration and setup instructions for development environment.
 * It's used when NODE_ENV is set to 'development'.
 */

export const devConfig = {
  /**
   * Email Configuration for Development
   * 
   * To use smtp4dev for local email testing:
   * 
   * 1. Start smtp4dev using Docker:
   *    docker run -d -p 25:25 -p 3000:3000 rnwood/smtp4dev
   * 
   * 2. Access the smtp4dev UI at http://localhost:3000
   * 
   * 3. Set these environment variables in your .env file:
   *    NODE_ENV=development
   *    EMAIL_PROVIDER=dev-smtp
   *    DEV_SMTP_HOST=localhost
   *    DEV_SMTP_PORT=25
   * 
   * 4. Install nodemailer:
   *    npm install nodemailer
   * 
   * All emails sent in development will be captured by smtp4dev and can be viewed
   * in the web interface at http://localhost:3000
   */
  email: {
    provider: 'dev-smtp',
    smtp: {
      host: process.env.DEV_SMTP_HOST || 'localhost',
      port: process.env.DEV_SMTP_PORT || 25,
      secure: false,
      tls: {
        rejectUnauthorized: false
      }
    }
  }
}; 