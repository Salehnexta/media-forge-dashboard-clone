
import DOMPurify from 'dompurify';

interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
  stripTags?: boolean;
}

export class InputSanitizer {
  static sanitizeHTML(input: string, options: SanitizeOptions = {}): string {
    const config = {
      ALLOWED_TAGS: options.allowedTags || ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: options.allowedAttributes || [],
      KEEP_CONTENT: !options.stripTags
    };
    
    return DOMPurify.sanitize(input, config);
  }

  static sanitizeText(input: string): string {
    return input
      .replace(/[<>'"&]/g, (char) => {
        const entities: { [key: string]: string } = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return entities[char] || char;
      })
      .trim();
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  static validateURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9\.\-_]/g, '_')
      .replace(/\.{2,}/g, '.')
      .substring(0, 255);
  }
}
