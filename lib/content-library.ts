import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ContentLibrarySearchOptions {
  userId: string;
  query?: string;
  contentType?: string;
  tags?: string[];
  folderId?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'qualityScore' | 'userRating' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface CreateContentLibraryItemData {
  userId: string;
  title: string;
  content: string;
  contentType: string;
  productSource: string;
  tags?: string[];
  keywords?: string[];
  targetAudience?: string;
  niche?: string;
  originalPrompt?: string;
  contextData?: any;
  folderId?: string;
  qualityScore?: number;
}

export interface ContentLibraryStats {
  totalItems: number;
  totalByType: Record<string, number>;
  averageQualityScore: number;
  mostUsedTags: Array<{ tag: string; count: number }>;
  recentActivity: Array<{
    id: string;
    title: string;
    action: string;
    timestamp: Date;
  }>;
}

export class ContentLibraryService {
  /**
   * Auto-save generated content to library
   */
  static async autoSaveContent(data: CreateContentLibraryItemData) {
    try {
      // Check if similar content already exists to avoid duplicates
      const existingContent = await prisma.contentLibraryItem.findFirst({
        where: {
          userId: data.userId,
          title: data.title,
          contentType: data.contentType as any,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Within last 24 hours
          }
        }
      });

      if (existingContent) {
        // Update existing content instead of creating duplicate
        return await prisma.contentLibraryItem.update({
          where: { id: existingContent.id },
          data: {
            content: data.content,
            tags: data.tags || [],
            keywords: data.keywords || [],
            targetAudience: data.targetAudience,
            niche: data.niche,
            originalPrompt: data.originalPrompt,
            contextData: data.contextData,
            qualityScore: data.qualityScore,
            updatedAt: new Date(),
            lastAccessedAt: new Date()
          }
        });
      }

      // Create new content library item
      const contentItem = await prisma.contentLibraryItem.create({
        data: {
          userId: data.userId,
          title: data.title,
          content: data.content,
          contentType: data.contentType as any,
          productSource: data.productSource,
          tags: data.tags || [],
          keywords: data.keywords || [],
          targetAudience: data.targetAudience,
          niche: data.niche,
          originalPrompt: data.originalPrompt,
          contextData: data.contextData,
          folderId: data.folderId,
          qualityScore: data.qualityScore,
          lastAccessedAt: new Date()
        }
      });

      // Track usage
      await prisma.event.create({
        data: {
          userId: data.userId,
          event: 'content_library_auto_save',
          metadata: {
            contentId: contentItem.id,
            contentType: data.contentType,
            productSource: data.productSource
          }
        }
      });

      return contentItem;
    } catch (error) {
      console.error('Error auto-saving content:', error);
      throw new Error('Failed to save content to library');
    }
  }

  /**
   * Search and filter content library
   */
  static async searchContent(options: ContentLibrarySearchOptions) {
    try {
      const {
        userId,
        query,
        contentType,
        tags,
        folderId,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        limit = 20,
        offset = 0
      } = options;

      const where: any = {
        userId,
        isArchived: false
      };

      // Add filters
      if (contentType) {
        where.contentType = contentType;
      }

      if (folderId) {
        where.folderId = folderId;
      }

      if (tags && tags.length > 0) {
        where.tags = {
          hasSome: tags
        };
      }

      // Text search across title, content, and tags
      if (query) {
        where.OR = [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } },
          { keywords: { hasSome: [query] } }
        ];
      }

      // Get total count for pagination
      const total = await prisma.contentLibraryItem.count({ where });

      // Get content items
      const items = await prisma.contentLibraryItem.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip: offset,
        include: {
          folder: {
            select: { id: true, name: true, color: true }
          }
        }
      });

      // Update last accessed time for viewed items
      await prisma.contentLibraryItem.updateMany({
        where: { id: { in: items.map(item => item.id) } },
        data: { lastAccessedAt: new Date() }
      });

      return {
        items,
        total,
        hasMore: offset + items.length < total
      };
    } catch (error) {
      console.error('Error searching content:', error);
      throw new Error('Failed to search content library');
    }
  }

  /**
   * Get content library statistics
   */
  static async getStats(userId: string): Promise<ContentLibraryStats> {
    try {
      // Total items
      const totalItems = await prisma.contentLibraryItem.count({
        where: { userId, isArchived: false }
      });

      // Items by type
      const itemsByType = await prisma.contentLibraryItem.groupBy({
        by: ['contentType'],
        where: { userId, isArchived: false },
        _count: { contentType: true }
      });

      const totalByType = itemsByType.reduce((acc, item) => {
        acc[item.contentType] = item._count.contentType;
        return acc;
      }, {} as Record<string, number>);

      // Average quality score
      const qualityStats = await prisma.contentLibraryItem.aggregate({
        where: { 
          userId, 
          isArchived: false,
          qualityScore: { not: null }
        },
        _avg: { qualityScore: true }
      });

      // Most used tags
      const allItems = await prisma.contentLibraryItem.findMany({
        where: { userId, isArchived: false },
        select: { tags: true }
      });

      const tagCounts: Record<string, number> = {};
      allItems.forEach(item => {
        item.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });

      const mostUsedTags = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Recent activity
      const recentItems = await prisma.contentLibraryItem.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          updatedAt: true,
          createdAt: true
        }
      });

      const recentActivity = recentItems.map(item => ({
        id: item.id,
        title: item.title,
        action: item.updatedAt > item.createdAt ? 'updated' : 'created',
        timestamp: item.updatedAt
      }));

      return {
        totalItems,
        totalByType,
        averageQualityScore: qualityStats._avg.qualityScore || 0,
        mostUsedTags,
        recentActivity
      };
    } catch (error) {
      console.error('Error getting content library stats:', error);
      throw new Error('Failed to get content library statistics');
    }
  }

  /**
   * Update content item (rating, tags, etc.)
   */
  static async updateContent(
    contentId: string, 
    userId: string, 
    updates: Partial<CreateContentLibraryItemData>
  ) {
    try {
      // Filter out undefined values and only include allowed fields
      const updateData: any = {
        updatedAt: new Date()
      };
      
      // Only include fields that are allowed to be updated
      const allowedFields = [
        'title', 'content', 'contentType', 'productSource', 'tags', 
        'keywords', 'targetAudience', 'niche', 'originalPrompt', 
        'contextData', 'folderId', 'qualityScore', 'userRating', 
        'isFavorited', 'isArchived'
      ];
      
      Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key) && (updates as any)[key] !== undefined) {
          (updateData as any)[key] = (updates as any)[key];
        }
      });

      const contentItem = await prisma.contentLibraryItem.update({
        where: { 
          id: contentId,
          userId // Ensure user owns the content
        },
        data: updateData
      });

      // Track update
      await prisma.event.create({
        data: {
          userId,
          event: 'content_library_update',
          metadata: {
            contentId,
            updates: Object.keys(updates)
          }
        }
      });

      return contentItem;
    } catch (error) {
      console.error('Error updating content:', error);
      throw new Error('Failed to update content');
    }
  }

  /**
   * Delete content item
   */
  static async deleteContent(contentId: string, userId: string) {
    try {
      await prisma.contentLibraryItem.delete({
        where: { 
          id: contentId,
          userId // Ensure user owns the content
        }
      });

      // Track deletion
      await prisma.event.create({
        data: {
          userId,
          event: 'content_library_delete',
          metadata: { contentId }
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting content:', error);
      throw new Error('Failed to delete content');
    }
  }

  /**
   * Create or manage folders
   */
  static async createFolder(userId: string, name: string, color?: string, parentId?: string) {
    try {
      const folder = await prisma.contentFolder.create({
        data: {
          userId,
          name,
          color,
          parentId
        }
      });

      return folder;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw new Error('Failed to create folder');
    }
  }

  /**
   * Get user's folder structure
   */
  static async getFolders(userId: string) {
    try {
      const folders = await prisma.contentFolder.findMany({
        where: { userId },
        include: {
          children: true,
          _count: {
            select: { content: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return folders;
    } catch (error) {
      console.error('Error getting folders:', error);
      throw new Error('Failed to get folders');
    }
  }

  /**
   * Track content interaction (copy, share, etc.)
   */
  static async trackInteraction(contentId: string, userId: string, action: 'copy' | 'share' | 'view') {
    try {
      const updateData: any = {};
      
      switch (action) {
        case 'copy':
          updateData.copyCount = { increment: 1 };
          break;
        case 'share':
          updateData.shareCount = { increment: 1 };
          break;
        case 'view':
          updateData.viewCount = { increment: 1 };
          updateData.lastAccessedAt = new Date();
          break;
      }

      await prisma.contentLibraryItem.update({
        where: { 
          id: contentId,
          userId 
        },
        data: updateData
      });

      // Track event
      await prisma.event.create({
        data: {
          userId,
          event: `content_library_${action}`,
          metadata: { contentId }
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error tracking interaction:', error);
      throw new Error('Failed to track interaction');
    }
  }

  /**
   * Get content recommendations based on user patterns
   */
  static async getRecommendations(userId: string, limit: number = 5) {
    try {
      // Get user's most used content types and tags
      const userStats = await this.getStats(userId);
      const topTags = userStats.mostUsedTags.slice(0, 5).map(t => t.tag);
      
      // Find highly rated content with similar tags
      const recommendations = await prisma.contentLibraryItem.findMany({
        where: {
          userId,
          isArchived: false,
          qualityScore: { gte: 0.7 },
          OR: [
            { tags: { hasSome: topTags } },
            { userRating: { gte: 4 } }
          ]
        },
        orderBy: [
          { qualityScore: 'desc' },
          { userRating: 'desc' },
          { viewCount: 'desc' }
        ],
        take: limit
      });

      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }
}