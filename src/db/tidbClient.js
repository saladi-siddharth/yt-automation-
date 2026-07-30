import mysql from 'mysql2/promise';
import { config } from '../config/config.js';

let pool = null;

export const tidbClient = {
  getPool() {
    if (!pool) {
      const host = process.env.TIDB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com';
      const port = parseInt(process.env.TIDB_PORT || '4000', 10);
      const user = process.env.TIDB_USER || '3nJk91QWyZmR22H.root';
      const password = process.env.TIDB_PASSWORD || '';
      const database = process.env.TIDB_DATABASE || 'sys';

      console.log(`[TiDBCloud] Connecting pool to ${host}:${port} (db: ${database})...`);

      pool = mysql.createPool({
        host,
        port,
        user,
        password,
        database,
        ssl: {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: false
        },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    }
    return pool;
  },

  async initTable() {
    try {
      const db = this.getPool();
      await db.query(`
        CREATE TABLE IF NOT EXISTS yt_videos (
          id VARCHAR(64) PRIMARY KEY,
          type VARCHAR(16),
          title_hindi TEXT,
          title_english TEXT,
          viral_score INT,
          output_id VARCHAR(128),
          video_url VARCHAR(512),
          thumbnail_url VARCHAR(512),
          script_transcript TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('[TiDBCloud] Table `yt_videos` initialized successfully!');
      return true;
    } catch (e) {
      console.warn('[TiDBCloud] Table init info:', e.message);
      return false;
    }
  },

  /**
   * Save video record into TiDB Cloud Database
   */
  async saveVideoRecord(record) {
    try {
      const db = this.getPool();
      await this.initTable();

      const query = `
        INSERT INTO yt_videos 
        (id, type, title_hindi, title_english, viral_score, output_id, video_url, thumbnail_url, script_transcript)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        title_hindi = VALUES(title_hindi),
        viral_score = VALUES(viral_score);
      `;

      const values = [
        record.id || `vid_${Date.now()}`,
        record.type || 'short',
        record.titleHindi || '',
        record.titleEnglish || '',
        record.viralScore || 90,
        record.outputId || '',
        record.videoUrl || '',
        record.thumbnailUrl || '',
        record.transcript || ''
      ];

      await db.query(query, values);
      console.log(`[TiDBCloud] Video record successfully persisted to TiDB Cloud Database -> ${record.titleHindi}`);
      return true;
    } catch (e) {
      console.warn('[TiDBCloud] Save video record failed:', e.message);
      return false;
    }
  },

  /**
   * Retrieve all stored videos from TiDB Cloud Database
   */
  async getAllVideos() {
    try {
      const db = this.getPool();
      const [rows] = await db.query('SELECT * FROM yt_videos ORDER BY created_at DESC LIMIT 50');
      return rows;
    } catch (e) {
      console.warn('[TiDBCloud] Fetch videos failed:', e.message);
      return [];
    }
  }
};
