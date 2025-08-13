// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * DELETE /api/keys/[id]
 * Delete an API key
 */
export const DELETE = requireAuth(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const user = (request as any).user;
    const keyId = params.id;

    // Verify the key belongs to the user
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: keyId,
        userId: user.userId
      }
    });

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'API key not found' }
      }, { status: 404 });
    }

    // Delete the API key
    await prisma.apiKey.delete({
      where: { id: keyId }
    });

    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully'
    });

  } catch (error: any) {
    console.error('API key deletion error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'DELETION_ERROR', message: 'Failed to delete API key' }
    }, { status: 500 });
  }
});

/**
 * PUT /api/keys/[id]
 * Update an API key (name, description, scopes)
 */
export const PUT = requireAuth(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const user = (request as any).user;
    const keyId = params.id;
    const body = await request.json();
    const { name, description, scopes } = body;

    // Verify the key belongs to the user
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: keyId,
        userId: user.userId
      }
    });

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'API key not found' }
      }, { status: 404 });
    }

    // Update the API key
    const updatedKey = await prisma.apiKey.update({
      where: { id: keyId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(scopes && { scopes: JSON.stringify(scopes) })
      },
      select: {
        id: true,
        name: true,
        description: true,
        scopes: true,
        keyPrefix: true,
        expiresAt: true,
        createdAt: true,
        lastUsed: true
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedKey
    });

  } catch (error: any) {
    console.error('API key update error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'UPDATE_ERROR', message: 'Failed to update API key' }
    }, { status: 500 });
  }
});