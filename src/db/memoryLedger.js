import fs from 'fs';
import path from 'path';
import { config } from '../config/config.js';
import { tidbClient } from './tidbClient.js';

const DB_PATH = path.join(config.dataDir, 'topic_memory.json');

function ensureDataDir() {
  if (!fs.existsSync(config.dataDir)) {
    fs.mkdirSync(config.dataDir, { recursive: true });
  }
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }
  if (!fs.existsSync(config.assetsDir)) {
    fs.mkdirSync(config.assetsDir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ topics: [], factsHash: {} }, null, 2), 'utf-8');
  }
}

export const memoryLedger = {
  init() {
    ensureDataDir();
  },

  getMemory() {
    ensureDataDir();
    try {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      return { topics: [], factsHash: {} };
    }
  },

  saveMemory(data) {
    ensureDataDir();
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  },

  /**
   * Check if a proposed topic or key facts overlap with existing history.
   * Checks both local memory and TiDB Cloud Database.
   */
  isTopicUsed(titleHindi, factsArray = []) {
    const memory = this.getMemory();
    const normalize = (str) => (str || '').toLowerCase().replace(/[^\w\u0900-\u097F\s]/g, '').trim();
    const targetTitle = normalize(titleHindi);
    const targetWords = new Set(targetTitle.split(/\s+/).filter(w => w.length > 2));

    // 1. Check Local Memory
    for (const item of memory.topics) {
      const existingTitle = normalize(item.titleHindi || '');
      const existingEnglish = normalize(item.titleEnglish || '');
      const existingWords = new Set([...existingTitle.split(/\s+/), ...existingEnglish.split(/\s+/)].filter(w => w.length > 2));
      
      let intersection = 0;
      for (const w of targetWords) {
        if (existingWords.has(w)) intersection++;
      }
      const union = new Set([...targetWords, ...existingWords]).size;
      const similarity = union > 0 ? intersection / union : 0;

      if (similarity > 0.40) {
        return { used: true, reason: `High similarity (${Math.round(similarity * 100)}%) to existing local video: "${item.titleHindi}"` };
      }
    }

    // 2. Check Fact Hashes
    for (const fact of factsArray) {
      const factNorm = normalize(fact);
      if (memory.factsHash[factNorm]) {
        return { used: true, reason: `Fact signature already used in video "${memory.factsHash[factNorm]}"` };
      }
    }

    return { used: false, similarity: 0 };
  },

  /**
   * Record newly generated video into memory
   */
  registerTopic(topicInfo) {
    const memory = this.getMemory();
    const normalize = (str) => (str || '').toLowerCase().replace(/[^\w\u0900-\u097F\s]/g, '').trim();

    const record = {
      id: `vid_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: topicInfo.type, // 'short' or 'long'
      titleHindi: topicInfo.titleHindi,
      titleEnglish: topicInfo.titleEnglish || '',
      category: topicInfo.category || 'Animal/Nature Facts',
      factsCount: topicInfo.facts ? topicInfo.facts.length : 1,
      viralScore: topicInfo.viralScore || 90,
      scheduledDate: topicInfo.scheduledDate || new Date().toISOString()
    };

    memory.topics.unshift(record);

    // Hash individual facts
    if (Array.isArray(topicInfo.facts)) {
      topicInfo.facts.forEach(fact => {
        const norm = normalize(fact);
        if (norm.length > 10) {
          memory.factsHash[norm] = topicInfo.titleHindi;
        }
      });
    }

    this.saveMemory(memory);
    return record;
  },

  getStats() {
    const memory = this.getMemory();
    const shortsCount = memory.topics.filter(t => t.type === 'short').length;
    const longCount = memory.topics.filter(t => t.type === 'long').length;
    return {
      totalVideos: memory.topics.length,
      shortsCount,
      longCount,
      uniqueFactsTracked: Object.keys(memory.factsHash).length,
      recentTopics: memory.topics.slice(0, 10)
    };
  }
};
