// Translation service with multiple providers
export interface TranslationProvider {
  name: string;
  translate: (text: string, from: string, to: string) => Promise<string>;
}

// Google Translate API (requires API key)
export class GoogleTranslateProvider implements TranslationProvider {
  name = 'Google Translate';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async translate(text: string, from: string, to: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Google Translate API key is required');
    }

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            source: from,
            target: to,
            format: 'text',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      throw error;
    }
  }
}

// LibreTranslate (free, self-hosted option)
export class LibreTranslateProvider implements TranslationProvider {
  name = 'LibreTranslate';
  private apiUrl: string;
  private apiKey?: string;

  constructor(apiUrl: string = 'https://libretranslate.de', apiKey?: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async translate(text: string, from: string, to: string): Promise<string> {
    try {
      const body: any = {
        q: text,
        source: from,
        target: to,
        format: 'text',
      };

      if (this.apiKey) {
        body.api_key = this.apiKey;
      }

      const response = await fetch(`${this.apiUrl}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`LibreTranslate API error: ${response.status}`);
      }

      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      throw error;
    }
  }
}

// Microsoft Translator (requires API key)
export class MicrosoftTranslateProvider implements TranslationProvider {
  name = 'Microsoft Translator';
  private apiKey: string;
  private region: string;

  constructor(apiKey: string, region: string = 'global') {
    this.apiKey = apiKey;
    this.region = region;
  }

  async translate(text: string, from: string, to: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Microsoft Translator API key is required');
    }

    try {
      const response = await fetch(
        `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${from}&to=${to}`,
        {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': this.apiKey,
            'Ocp-Apim-Subscription-Region': this.region,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([{ text }]),
        }
      );

      if (!response.ok) {
        throw new Error(`Microsoft Translator API error: ${response.status}`);
      }

      const data = await response.json();
      return data[0].translations[0].text;
    } catch (error) {
      throw error;
    }
  }
}

// Main translation service
export class AutoTranslationService {
  private provider: TranslationProvider;
  private cache: Map<string, string> = new Map();

  constructor(provider: TranslationProvider) {
    this.provider = provider;
  }

  private getCacheKey(text: string, from: string, to: string): string {
    return `${from}-${to}-${text}`;
  }

  async translateText(text: string, from: string, to: string): Promise<string> {
    // Return original text if same language
    if (from === to) {
      return text;
    }

    // Check cache first
    const cacheKey = this.getCacheKey(text, from, to);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const translatedText = await this.provider.translate(text, from, to);
      
      // Cache the result
      this.cache.set(cacheKey, translatedText);
      
      return translatedText;
    } catch (error) {
      return text; // Return original text on error
    }
  }

  async translateObject(obj: any, from: string, to: string): Promise<any> {
    if (typeof obj === 'string') {
      return await this.translateText(obj, from, to);
    }

    if (Array.isArray(obj)) {
      const translatedArray = [];
      for (const item of obj) {
        translatedArray.push(await this.translateObject(item, from, to));
      }
      return translatedArray;
    }

    if (typeof obj === 'object' && obj !== null) {
      const translatedObj: any = {};
      for (const [key, value] of Object.entries(obj)) {
        translatedObj[key] = await this.translateObject(value, from, to);
      }
      return translatedObj;
    }

    return obj;
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

// Factory function to create translation service with environment variables
export function createTranslationService(): AutoTranslationService {
  // Check for Google Translate API key
  if (process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY) {
    return new AutoTranslationService(
      new GoogleTranslateProvider(process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY)
    );
  }

  // Check for Microsoft Translator API key
  if (process.env.NEXT_PUBLIC_MICROSOFT_TRANSLATOR_API_KEY) {
    return new AutoTranslationService(
      new MicrosoftTranslateProvider(
        process.env.NEXT_PUBLIC_MICROSOFT_TRANSLATOR_API_KEY,
        process.env.NEXT_PUBLIC_MICROSOFT_TRANSLATOR_REGION
      )
    );
  }

  // Default to LibreTranslate (free)
  return new AutoTranslationService(
    new LibreTranslateProvider(
      process.env.NEXT_PUBLIC_LIBRETRANSLATE_URL,
      process.env.NEXT_PUBLIC_LIBRETRANSLATE_API_KEY
    )
  );
}
