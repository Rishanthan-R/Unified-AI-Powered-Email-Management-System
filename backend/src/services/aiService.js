const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class AIService {
  async analyzeEmail(emailBody, subject) {
    try {
      const prompt = `Analyze the following email and provide:
1. Intent (inquiry, complaint, request, feedback, order, etc.)
2. Sentiment (positive, neutral, negative)
3. Priority (low, medium, high, urgent)
4. A brief summary

Email Subject: ${subject}
Email Body: ${emailBody}

Respond in JSON format:
{
  "intent": "...",
  "sentiment": "...",
  "priority": "...",
  "summary": "..."
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500
      });

      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error('Failed to parse AI response');
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return {
        intent: 'unknown',
        sentiment: 'neutral',
        priority: 'medium',
        summary: 'Analysis failed'
      };
    }
  }

  async generateAutoReply(emailBody, subject, products = []) {
    try {
      let productContext = '';
      if (products.length > 0) {
        productContext = `\n\nAvailable Products/Services:\n${products.map(p => 
          `- ${p.productName}: ${p.description} (${p.availability ? 'Available' : 'Out of stock'})`
        ).join('\n')}`;
      }

      const prompt = `Generate a professional and helpful reply to the following email.
Make it polite, concise, and actionable. If products are mentioned, include relevant product information.${productContext}

Email Subject: ${subject}
Email Body: ${emailBody}

Generate a professional reply:`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 800
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Auto-reply Generation Error:', error);
      return 'Thank you for your email. We have received your message and will respond shortly.';
    }
  }

  async detectProductMentions(emailBody, products = []) {
    if (products.length === 0) return [];

    try {
      const productNames = products.map(p => p.productName).join(', ');
      const prompt = `Given this email body: "${emailBody}"
      
And these product names: ${productNames}

Which products (if any) are mentioned or relevant? Return only the product names as a JSON array.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 200
      });

      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        const mentionedNames = JSON.parse(jsonMatch[0]);
        return products.filter(p => mentionedNames.includes(p.productName));
      }

      return [];
    } catch (error) {
      console.error('Product Detection Error:', error);
      return [];
    }
  }
}

module.exports = new AIService();
