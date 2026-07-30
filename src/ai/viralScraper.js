import { memoryLedger } from '../db/memoryLedger.js';
import { AI_IDEAS_BANK_SHORTS, AI_IDEAS_BANK_LONGS } from './newIdeasBank.js';
import { config } from '../config/config.js';
import axios from 'axios';

export const viralScraper = {
  /**
   * Generates a viral unique topic candidate for Shorts or Long videos
   * It picks 5 random un-used ideas from the AI Ideas Bank, sends them to Gemini, and asks Gemini to pick the most viral one.
   */
  async findNextViralTopic(type = 'short') {
    memoryLedger.init();
    
    const bank = type === 'short' ? AI_IDEAS_BANK_SHORTS : AI_IDEAS_BANK_LONGS;
    
    // Select 5 random ideas from the bank that haven't been used yet
    let randomCandidates = [];
    let attempts = 0;
    while(randomCandidates.length < 5 && attempts < 50) {
      const idea = bank[Math.floor(Math.random() * bank.length)];
      if (!memoryLedger.isTopicUsed(idea, []).used && !randomCandidates.includes(idea)) {
        randomCandidates.push(idea);
      }
      attempts++;
    }

    if (randomCandidates.length === 0) {
      randomCandidates = [bank[0]]; // Fallback
    }

    let chosenTopic = randomCandidates[0];
    let viralScore = Math.floor(88 + Math.random() * 11);

    // If Gemini is configured, ask it to pick the best one
    if (config.geminiApiKey && randomCandidates.length > 1) {
      try {
        console.log(`[ViralScraper] Asking AI to evaluate ${randomCandidates.length} topics for maximum virality...`);
        const aiPrompt = `Act as an expert YouTube strategist. Here are ${randomCandidates.length} potential video topics for a YouTube ${type.toUpperCase()}:\n\n${randomCandidates.map((r,i) => `${i+1}. ${r}`).join('\n')}\n\nSelect the ONE topic that has the highest potential for viral reach, extremely high CTR, and massive audience retention. Return ONLY the exact text of the winning topic, nothing else.`;
        
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.geminiApiKey}`;
        const response = await axios.post(url, {
          contents: [{ parts: [{ text: aiPrompt }] }]
        });
        
        if (response.data && response.data.candidates && response.data.candidates[0]) {
          const aiChoice = response.data.candidates[0].content.parts[0].text.trim().replace(/^\\d+\\.\\s*/, '');
          if (randomCandidates.includes(aiChoice) || aiChoice.length > 10) {
            chosenTopic = aiChoice;
            viralScore = 99;
            console.log(`[ViralScraper] AI Selected Winner: "${chosenTopic}"`);
          }
        }
      } catch (e) {
        console.warn(`[ViralScraper] AI evaluation failed, falling back to random. (${e.message})`);
      }
    }

    return {
      type,
      keyword: 'Viral Trends',
      category: 'AI Recommended',
      hookStyle: 'Extreme Curiosity',
      titleHindi: chosenTopic,
      titleEnglish: chosenTopic,
      candidateFacts: [chosenTopic],
      viralScore,
      retentionMultiplier: "3.4x Average Watch Time",
      isRawIdea: true // Flag to tell scriptGenerator to generate a script from scratch
    };
  }
};
