import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini AI Service for educational chat functionality
 * Provides text generation, streaming, and context-aware responses
 */
class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Generates a text response based on user input
   * @param {string} prompt - The user's input prompt
   * @returns {Promise<string>} The generated text
   */
  async generateText(prompt) {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error in text generation:', error);
      throw new Error('Failed to generate response. Please try again.');
    }
  }

  /**
   * Streams a text response chunk by chunk
   * @param {string} prompt - The user's input prompt
   * @param {Function} onChunk - Callback to handle each streamed chunk
   */
  async streamText(prompt, onChunk) {
    try {
      const result = await this.model.generateContentStream(prompt);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          onChunk(text);
        }
      }
    } catch (error) {
      console.error('Error in streaming text generation:', error);
      throw new Error('Failed to stream response. Please try again.');
    }
  }

  /**
   * Manages a chat session with history for educational context
   * @param {string} prompt - The user's input prompt
   * @param {Array} history - The chat history
   * @returns {Promise<{response: string, updatedHistory: Array}>} The response and updated history
   */
  async chatWithHistory(prompt, history = []) {
    try {
      // Add educational context to enhance responses
      const educationalContext = `You are an AI assistant helping with student performance analytics and educational data. 
      Provide helpful, accurate, and educational insights. Focus on being supportive and constructive in your responses.`;
      
      const contextualHistory = history.length === 0 ? 
        [{ role: 'user', parts: [{ text: educationalContext }] }, { role: 'model', parts: [{ text: 'I understand. I\'m here to help with educational analytics and student performance insights.' }] }] : 
        history;

      const chat = this.model.startChat({ history: contextualHistory });
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();

      const updatedHistory = [
        ...contextualHistory,
        { role: 'user', parts: [{ text: prompt }] },
        { role: 'model', parts: [{ text }] },
      ];

      return { response: text, updatedHistory };
    } catch (error) {
      console.error('Error in chat session:', error);
      throw new Error('Failed to process chat message. Please try again.');
    }
  }

  /**
   * Enhanced streaming chat with history
   * @param {string} prompt - The user's input prompt
   * @param {Array} history - The chat history
   * @param {Function} onChunk - Callback to handle each streamed chunk
   * @returns {Promise<Array>} Updated history
   */
  async streamChatWithHistory(prompt, history = [], onChunk) {
    try {
      const educationalContext = `You are an AI assistant helping with student performance analytics and educational data. 
      Provide helpful, accurate, and educational insights. Focus on being supportive and constructive in your responses.`;
      
      const contextualHistory = history.length === 0 ? 
        [{ role: 'user', parts: [{ text: educationalContext }] }, { role: 'model', parts: [{ text: 'I understand. I\'m here to help with educational analytics and student performance insights.' }] }] : 
        history;

      const chat = this.model.startChat({ history: contextualHistory });
      const result = await chat.sendMessageStream(prompt);

      let fullResponse = '';
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          fullResponse += text;
          onChunk(text);
        }
      }

      const updatedHistory = [
        ...contextualHistory,
        { role: 'user', parts: [{ text: prompt }] },
        { role: 'model', parts: [{ text: fullResponse }] },
      ];

      return updatedHistory;
    } catch (error) {
      console.error('Error in streaming chat session:', error);
      throw new Error('Failed to process streaming chat message. Please try again.');
    }
  }

  /**
   * Validates if the API key is configured
   * @returns {boolean} True if API key is available
   */
  isConfigured() {
    return !!import.meta.env.VITE_GEMINI_API_KEY;
  }
}

export default new GeminiService();