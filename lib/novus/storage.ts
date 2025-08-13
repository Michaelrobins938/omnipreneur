// lib/novus/storage.ts - Storage interface and file-based mock implementation
import { NovusSession, NovusTemplate } from './types';
import * as fs from 'fs';
import * as path from 'path';

// Ensure the tmp directory exists
const STORAGE_DIR = path.join(process.cwd(), 'tmp', 'novus');
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

/**
 * Storage interface for NOVUS sessions and templates
 */
export interface NovusStorage {
  // Sessions
  getSessions(userId: string): Promise<NovusSession[]>;
  getSession(userId: string, id: string): Promise<NovusSession | null>;
  createSession(userId: string, session: Omit<NovusSession, 'id' | 'createdAt'>): Promise<NovusSession>;
  updateSession(userId: string, id: string, session: Partial<NovusSession>): Promise<NovusSession | null>;
  deleteSession(userId: string, id: string): Promise<boolean>;
  
  // Templates
  getTemplates(userId: string): Promise<NovusTemplate[]>;
  getTemplate(userId: string, id: string): Promise<NovusTemplate | null>;
  createTemplate(userId: string, template: Omit<NovusTemplate, 'id'>): Promise<NovusTemplate>;
  updateTemplate(userId: string, id: string, template: Partial<NovusTemplate>): Promise<NovusTemplate | null>;
  deleteTemplate(userId: string, id: string): Promise<boolean>;
  
  // Usage
  getUsage(userId: string): Promise<{ remaining: number; limit: number }>;
}

/**
 * File-based storage implementation (fallback/mock)
 */
export class FileBasedStorage implements NovusStorage {
  private getSessionFilePath(userId: string, sessionId: string): string {
    return path.join(STORAGE_DIR, `sessions-${userId}`, `${sessionId}.json`);
  }
  
  private getSessionsDir(userId: string): string {
    return path.join(STORAGE_DIR, `sessions-${userId}`);
  }
  
  private getTemplateFilePath(userId: string, templateId: string): string {
    return path.join(STORAGE_DIR, `templates-${userId}`, `${templateId}.json`);
  }
  
  private getTemplatesDir(userId: string): string {
    return path.join(STORAGE_DIR, `templates-${userId}`);
  }
  
  // Sessions
  async getSessions(userId: string): Promise<NovusSession[]> {
    const sessionsDir = this.getSessionsDir(userId);
    
    if (!fs.existsSync(sessionsDir)) {
      return [];
    }
    
    const files = fs.readdirSync(sessionsDir);
    const sessions: NovusSession[] = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(sessionsDir, file);
          const data = fs.readFileSync(filePath, 'utf-8');
          sessions.push(JSON.parse(data));
        } catch (error) {
          console.error(`Error reading session file ${file}:`, error);
        }
      }
    }
    
    // Sort by createdAt descending
    return sessions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  
  async getSession(userId: string, id: string): Promise<NovusSession | null> {
    const filePath = this.getSessionFilePath(userId, id);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading session ${id}:`, error);
      return null;
    }
  }
  
  async createSession(userId: string, session: Omit<NovusSession, 'id' | 'createdAt'>): Promise<NovusSession> {
    const id = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();
    
    const newSession: NovusSession = {
      id,
      createdAt,
      ...session
    };
    
    const sessionsDir = this.getSessionsDir(userId);
    if (!fs.existsSync(sessionsDir)) {
      fs.mkdirSync(sessionsDir, { recursive: true });
    }
    
    const filePath = this.getSessionFilePath(userId, id);
    fs.writeFileSync(filePath, JSON.stringify(newSession, null, 2));
    
    return newSession;
  }
  
  async updateSession(userId: string, id: string, updates: Partial<NovusSession>): Promise<NovusSession | null> {
    const existing = await this.getSession(userId, id);
    if (!existing) {
      return null;
    }
    
    const updated: NovusSession = {
      ...existing,
      ...updates
    };
    
    const filePath = this.getSessionFilePath(userId, id);
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
    
    return updated;
  }
  
  async deleteSession(userId: string, id: string): Promise<boolean> {
    const filePath = this.getSessionFilePath(userId, id);
    
    if (!fs.existsSync(filePath)) {
      return false;
    }
    
    try {
      fs.unlinkSync(filePath);
      return true;
    } catch (error) {
      console.error(`Error deleting session ${id}:`, error);
      return false;
    }
  }
  
  // Templates
  async getTemplates(userId: string): Promise<NovusTemplate[]> {
    const templatesDir = this.getTemplatesDir(userId);
    
    if (!fs.existsSync(templatesDir)) {
      return [];
    }
    
    const files = fs.readdirSync(templatesDir);
    const templates: NovusTemplate[] = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(templatesDir, file);
          const data = fs.readFileSync(filePath, 'utf-8');
          templates.push(JSON.parse(data));
        } catch (error) {
          console.error(`Error reading template file ${file}:`, error);
        }
      }
    }
    
    return templates;
  }
  
  async getTemplate(userId: string, id: string): Promise<NovusTemplate | null> {
    const filePath = this.getTemplateFilePath(userId, id);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading template ${id}:`, error);
      return null;
    }
  }
  
  async createTemplate(userId: string, template: Omit<NovusTemplate, 'id'>): Promise<NovusTemplate> {
    const id = `tmpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newTemplate: NovusTemplate = {
      id,
      ...template
    };
    
    const templatesDir = this.getTemplatesDir(userId);
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true });
    }
    
    const filePath = this.getTemplateFilePath(userId, id);
    fs.writeFileSync(filePath, JSON.stringify(newTemplate, null, 2));
    
    return newTemplate;
  }
  
  async updateTemplate(userId: string, id: string, updates: Partial<NovusTemplate>): Promise<NovusTemplate | null> {
    const existing = await this.getTemplate(userId, id);
    if (!existing) {
      return null;
    }
    
    const updated: NovusTemplate = {
      ...existing,
      ...updates
    };
    
    const filePath = this.getTemplateFilePath(userId, id);
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
    
    return updated;
  }
  
  async deleteTemplate(userId: string, id: string): Promise<boolean> {
    const filePath = this.getTemplateFilePath(userId, id);
    
    if (!fs.existsSync(filePath)) {
      return false;
    }
    
    try {
      fs.unlinkSync(filePath);
      return true;
    } catch (error) {
      console.error(`Error deleting template ${id}:`, error);
      return false;
    }
  }
  
  // Usage (mock implementation)
  async getUsage(userId: string): Promise<{ remaining: number; limit: number }> {
    // Mock implementation - in a real app, this would check actual usage
    // For now, we'll simulate a free tier limit of 5 runs/day
    const usageFile = path.join(STORAGE_DIR, `usage-${userId}.json`);
    
    if (fs.existsSync(usageFile)) {
      try {
        const data = fs.readFileSync(usageFile, 'utf-8');
        const usage = JSON.parse(data);
        
        // Reset if it's a new day
        const today = new Date().toISOString().split('T')[0];
        if (usage.date !== today) {
          usage.count = 0;
          usage.date = today;
        }
        
        fs.writeFileSync(usageFile, JSON.stringify(usage, null, 2));
        
        return {
          remaining: Math.max(0, 5 - usage.count),
          limit: 5
        };
      } catch (error) {
        console.error('Error reading usage file:', error);
      }
    }
    
    // Default to 5 runs limit
    return {
      remaining: 5,
      limit: 5
    };
  }
  
  // Method to increment usage (for internal use)
  async incrementUsage(userId: string): Promise<void> {
    const usageFile = path.join(STORAGE_DIR, `usage-${userId}.json`);
    const today = new Date().toISOString().split('T')[0];
    
    let usage = {
      count: 0,
      date: today
    };
    
    if (fs.existsSync(usageFile)) {
      try {
        const data = fs.readFileSync(usageFile, 'utf-8');
        usage = JSON.parse(data);
        
        // Reset if it's a new day
        if (usage.date !== today) {
          usage.count = 0;
          usage.date = today;
        }
      } catch (error) {
        console.error('Error reading usage file:', error);
      }
    }
    
    usage.count = (usage.count || 0) + 1;
    fs.writeFileSync(usageFile, JSON.stringify(usage, null, 2));
  }
}

// Export a singleton instance
export const storage = new FileBasedStorage();