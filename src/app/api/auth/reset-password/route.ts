import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Request password reset
 * POST /api/auth/reset-password
 * Body: { email: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      console.log(`[Password Reset] No user found for email: ${email}`);
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token in database (using a simple approach - in production use a separate table)
    // For now, we'll use the session table as a workaround
    // In production, you'd want a proper PasswordReset model

    // Create a session-like entry for password reset
    const resetSession = await db.session.create({
      data: {
        id: `reset_${resetToken}`,
        sessionToken: resetToken,
        userId: user.id,
        expires: resetTokenExpiry,
      },
    });

    // In production, send email here
    // For now, log the reset link
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    console.log(`[Password Reset] Reset link for ${email}: ${resetUrl}`);

    // TODO: Send email with reset link
    // await sendEmail({
    //   to: email,
    //   subject: 'Wachtwoord resetten - Helder',
    //   html: `<p>Klik <a href="${resetUrl}">hier</a> om uw wachtwoord te resetten.</p>`,
    // });

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a reset link has been sent.',
      // Only include in development
      ...(process.env.NODE_ENV === 'development' && { resetUrl }),
    });
  } catch (error) {
    console.error('[Password Reset] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

/**
 * Complete password reset
 * PUT /api/auth/reset-password
 * Body: { token: string, password: string }
 */
export async function PUT(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Find reset session
    const resetSession = await db.session.findFirst({
      where: {
        sessionToken: token,
        id: { startsWith: 'reset_' },
        expires: { gt: new Date() },
      },
      include: {
        User: true,
      },
    });

    if (!resetSession) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    await db.user.update({
      where: { id: resetSession.userId },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    // Delete reset session
    await db.session.delete({
      where: { id: resetSession.id },
    });

    console.log(`[Password Reset] Password updated for user: ${resetSession.User.email}`);

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    console.error('[Password Reset] Error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
