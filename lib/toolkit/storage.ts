import { Session, Template, UsageInfo } from './types';
import * as fs from 'fs';
import * as path from 'path';

export interface ToolkitStorage {
  getSessions(productId: string, userId: string): Promise<Session[]>;
  getSession(productId: string, userId: string, id: string): Promise<Session | null>;
  createSession(productId: string, userId: string, session: Omit<Session, 'id' | 'createdAt'>): Promise<Session>;
  updateSession(productId: string, userId: string, id: string, session: Partial<Session>): Promise<Session | null>;
  deleteSession(productId: string, userId: string, id: string): Promise<boolean>;
  
  getTemplates(productId: string, userId: string): Promise<Template[]>;
  getTemplate(productId: string, userId: string, id: string): Promise<Template | null>;
  createTemplate(productId: string, userId: string, template: Omit<Template, 'id'>): Promise<Template>;
  updateTemplate(productId: string, userId: string, id: string, template: Partial<Template>): Promise<Template | null>;
  deleteTemplate(productId: string, userId: string, id: string): Promise<boolean>;
  
  getUsage(productId: string, userId: string): Promise<UsageInfo>;
  incrementUsage(productId: string, userId: string): Promise<void>;
}

export class FileBasedToolkitStorage implements ToolkitStorage {
  private getStorageDir(productId: string): string {
    const STORAGE_DIR = path.join(process.cwd(), 'tmp', productId);
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }
    return STORAGE_DIR;
  }

  private getSessionFilePath(productId: string, userId: string, sessionId: string): string {
    return path.join(this.getStorageDir(productId), `sessions-${userId}`, `${sessionId}.json`);
  }
  
  private getSessionsDir(productId: string, userId: string): string {
    return path.join(this.getStorageDir(productId), `sessions-${userId}`);
  }
  
  private getTemplateFilePath(productId: string, userId: string, templateId: string): string {
    return path.join(this.getStorageDir(productId), `templates-${userId}`, `${templateId}.json`);
  }
  
  private getTemplatesDir(productId: string, userId: string): string {
    return path.join(this.getStorageDir(productId), `templates-${userId}`);
  }

  async getSessions(productId: string, userId: string): Promise<Session[]> {
    const sessionsDir = this.getSessionsDir(productId, userId);
    
    if (!fs.existsSync(sessionsDir)) {
      return [];
    }
    
    const files = fs.readdirSync(sessionsDir);
    const sessions: Session[] = [];
    
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
    
    return sessions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  
  async getSession(productId: string, userId: string, id: string): Promise<Session | null> {
    const filePath = this.getSessionFilePath(productId, userId, id);
    
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
  
  async createSession(productId: string, userId: string, session: Omit<Session, 'id' | 'createdAt'>): Promise<Session> {
    const id = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();
    
    const newSession: Session = {
      id,
      createdAt,
      ...session
    };
    
    const sessionsDir = this.getSessionsDir(productId, userId);
    if (!fs.existsSync(sessionsDir)) {
      fs.mkdirSync(sessionsDir, { recursive: true });
    }
    
    const filePath = this.getSessionFilePath(productId, userId, id);
    fs.writeFileSync(filePath, JSON.stringify(newSession, null, 2));
    
    return newSession;
  }
  
  async updateSession(productId: string, userId: string, id: string, updates: Partial<Session>): Promise<Session | null> {
    const existing = await this.getSession(productId, userId, id);
    if (!existing) {
      return null;
    }
    
    const updated: Session = {
      ...existing,
      ...updates
    };
    
    const filePath = this.getSessionFilePath(productId, userId, id);
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
    
    return updated;
  }
  
  async deleteSession(productId: string, userId: string, id: string): Promise<boolean> {
    const filePath = this.getSessionFilePath(productId, userId, id);
    
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

  async getTemplates(productId: string, userId: string): Promise<Template[]> {
    const templatesDir = this.getTemplatesDir(productId, userId);
    
    if (!fs.existsSync(templatesDir)) {
      return [];
    }
    
    const files = fs.readdirSync(templatesDir);
    const templates: Template[] = [];
    
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
  
  async getTemplate(productId: string, userId: string, id: string): Promise<Template | null> {
    const filePath = this.getTemplateFilePath(productId, userId, id);
    
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
  
  async createTemplate(productId: string, userId: string, template: Omit<Template, 'id'>): Promise<Template> {
    const id = `tmpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newTemplate: Template = {
      id,
      ...template
    };
    
    const templatesDir = this.getTemplatesDir(productId, userId);
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true });
    }
    
    const filePath = this.getTemplateFilePath(productId, userId, id);
    fs.writeFileSync(filePath, JSON.stringify(newTemplate, null, 2));
    
    return newTemplate;
  }
  
  async updateTemplate(productId: string, userId: string, id: string, updates: Partial<Template>): Promise<Template | null> {
    const existing = await this.getTemplate(productId, userId, id);
    if (!existing) {
      return null;
    }
    
    const updated: Template = {
      ...existing,
      ...updates
    };
    
    const filePath = this.getTemplateFilePath(productId, userId, id);
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
    
    return updated;
  }
  
  async deleteTemplate(productId: string, userId: string, id: string): Promise<boolean> {
    const filePath = this.getTemplateFilePath(productId, userId, id);
    
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
  
  async getUsage(productId: string, userId: string): Promise<UsageInfo> {
    const usageFile = path.join(this.getStorageDir(productId), `usage-${userId}.json`);
    
    if (fs.existsSync(usageFile)) {
      try {
        const data = fs.readFileSync(usageFile, 'utf-8');
        const usage = JSON.parse(data);
        
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
    
    return {
      remaining: 5,
      limit: 5
    };
  }
  
  async incrementUsage(productId: string, userId: string): Promise<void> {
    const usageFile = path.join(this.getStorageDir(productId), `usage-${userId}.json`);
    const today = new Date().toISOString().split('T')[0];
    
    let usage = {
      count: 0,
      date: today
    };
    
    if (fs.existsSync(usageFile)) {
      try {
        const data = fs.readFileSync(usageFile, 'utf-8');
        usage = JSON.parse(data);
        
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

export const toolkitStorage = new FileBasedToolkitStorage();