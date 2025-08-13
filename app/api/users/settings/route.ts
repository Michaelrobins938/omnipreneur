import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import prisma from '@/lib/db';
import { z } from 'zod';

// Validation schemas for different settings sections
const NotificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  securityAlerts: z.boolean(),
  productUpdates: z.boolean(),
  usageReports: z.boolean(),
  weeklyDigest: z.boolean().optional(),
  aiInsights: z.boolean().optional(),
  maintenanceUpdates: z.boolean().optional(),
  billingReminders: z.boolean().optional()
});

const SecuritySettingsSchema = z.object({
  twoFactorEnabled: z.boolean(),
  loginAlerts: z.boolean(),
  sessionTimeout: z.number().min(5).max(480), // 5 minutes to 8 hours
  ipWhitelist: z.array(z.string()).optional(),
  dataRetention: z.number().min(30).max(365), // 30 days to 1 year
  downloadPersonalData: z.boolean().optional(),
  deleteAccount: z.boolean().optional()
});

const PrivacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'private', 'team']),
  analyticsTracking: z.boolean(),
  performanceTracking: z.boolean(),
  usageStatistics: z.boolean(),
  marketingOptIn: z.boolean(),
  dataSharing: z.boolean()
});

const AppearanceSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
  sidebarCompact: z.boolean(),
  animations: z.boolean(),
  soundEffects: z.boolean(),
  fontSize: z.enum(['small', 'medium', 'large'])
});

const SettingsSchema = z.object({
  section: z.enum(['notifications', 'security', 'privacy', 'appearance']),
  data: z.union([
    NotificationSettingsSchema,
    SecuritySettingsSchema,
    PrivacySettingsSchema,
    AppearanceSettingsSchema
  ])
});

/**
 * POST /api/users/settings
 * 
 * Save user settings for a specific section
 * Validates settings and stores them in the database
 * 
 * Body:
 * {
 *   section: 'notifications' | 'security' | 'privacy' | 'appearance',
 *   data: { ...settings }
 * }
 */
export const POST = requireAuth(withRateLimit(withCsrfProtection(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    
    // Validate input
    const { section, data } = SettingsSchema.parse(body);

    // Validate section-specific data
    let validatedData;
    switch (section) {
      case 'notifications':
        validatedData = NotificationSettingsSchema.parse(data);
        break;
      case 'security':
        validatedData = SecuritySettingsSchema.parse(data);
        break;
      case 'privacy':
        validatedData = PrivacySettingsSchema.parse(data);
        break;
      case 'appearance':
        validatedData = AppearanceSettingsSchema.parse(data);
        break;
      default:
        throw new Error('Invalid settings section');
    }

    // Get current user preferences or create new
    let userPreferences = await prisma.userPreference.findFirst({
      where: { userId: user.userId }
    });

    if (!userPreferences) {
      userPreferences = await prisma.userPreference.create({
        data: {
          userId: user.userId,
          preferences: {}
        }
      });
    }

    // Update the specific section
    const currentPreferences = userPreferences.preferences as any || {};
    const updatedPreferences = {
      ...currentPreferences,
      [section]: validatedData
    };

    // Save to database
    const updated = await prisma.userPreference.update({
      where: { id: userPreferences.id },
      data: {
        preferences: updatedPreferences,
        updatedAt: new Date()
      }
    });

    // Handle special security settings
    if (section === 'security') {
      // If 2FA is being enabled/disabled, we might need additional logic
      if (validatedData.twoFactorEnabled !== undefined) {
        await prisma.user.update({
          where: { id: user.userId },
          data: { 
            twoFactorEnabled: validatedData.twoFactorEnabled,
            updatedAt: new Date()
          }
        });
      }
    }

    // Log the settings change
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'SETTINGS_UPDATED',
        metadata: {
          section,
          timestamp: new Date().toISOString(),
          changedFields: Object.keys(validatedData)
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        section,
        settings: validatedData,
        updatedAt: updated.updatedAt
      }
    });

  } catch (error: any) {
    console.error('Settings update error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid settings data',
            details: error.errors 
          } 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'SETTINGS_ERROR', 
          message: 'Failed to save settings' 
        } 
      },
      { status: 500 }
    );
  }
}), {
  windowMs: 60 * 1000, // 1 minute
  max: 10 // 10 setting updates per minute
}, (req: NextRequest) => {
  const userId = (req as any).user?.userId;
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  return `settings-update:${userId}:${ip}`;
}));

/**
 * GET /api/users/settings
 * 
 * Retrieve user settings for all sections or a specific section
 */
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    // Get user preferences
    const userPreferences = await prisma.userPreference.findFirst({
      where: { userId: user.userId }
    });

    const preferences = userPreferences?.preferences as any || {};

    // Return specific section or all settings
    if (section && ['notifications', 'security', 'privacy', 'appearance'].includes(section)) {
      return NextResponse.json({
        success: true,
        data: {
          section,
          settings: preferences[section] || getDefaultSettings(section)
        }
      });
    }

    // Return all settings with defaults
    const allSettings = {
      notifications: preferences.notifications || getDefaultSettings('notifications'),
      security: preferences.security || getDefaultSettings('security'),
      privacy: preferences.privacy || getDefaultSettings('privacy'),
      appearance: preferences.appearance || getDefaultSettings('appearance')
    };

    return NextResponse.json({
      success: true,
      data: allSettings
    });

  } catch (error: any) {
    console.error('Settings retrieval error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'RETRIEVAL_ERROR', 
          message: 'Failed to retrieve settings' 
        } 
      },
      { status: 500 }
    );
  }
});

/**
 * Get default settings for a section
 */
function getDefaultSettings(section: string) {
  switch (section) {
    case 'notifications':
      return {
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: true,
        securityAlerts: true,
        productUpdates: true,
        usageReports: false,
        weeklyDigest: true,
        aiInsights: true,
        maintenanceUpdates: true,
        billingReminders: true
      };
    
    case 'security':
      return {
        twoFactorEnabled: false,
        loginAlerts: true,
        sessionTimeout: 30,
        ipWhitelist: [],
        dataRetention: 90,
        downloadPersonalData: false,
        deleteAccount: false
      };
    
    case 'privacy':
      return {
        profileVisibility: 'private',
        analyticsTracking: true,
        performanceTracking: true,
        usageStatistics: true,
        marketingOptIn: false,
        dataSharing: false
      };
    
    case 'appearance':
      return {
        theme: 'dark',
        accentColor: '#3B82F6',
        sidebarCompact: false,
        animations: true,
        soundEffects: false,
        fontSize: 'medium'
      };
    
    default:
      return {};
  }
}