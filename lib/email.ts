import nodemailer from 'nodemailer';

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env['SMTP_HOST'],
  port: parseInt(process.env['SMTP_PORT'] || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env['SMTP_USER'],
    pass: process.env['SMTP_PASS'],
  },
});

// Email templates
const emailTemplates = {
  welcome: (userName: string, plan: string) => ({
    subject: `Welcome to Omnipreneur ${plan.charAt(0).toUpperCase() + plan.slice(1)}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a; text-align: center;">Welcome to Omnipreneur!</h1>
        <p>Hi ${userName},</p>
        <p>Welcome to the future of AI-powered entrepreneurship! You've just joined the elite ${plan} tier.</p>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h2>Your ${plan.charAt(0).toUpperCase() + plan.slice(1)} Benefits:</h2>
          <ul>
            <li>Unlimited Claude Rewrite Engine access</li>
            <li>100+ Content Spawner generations</li>
            <li>Premium Bundle Builder tools</li>
            <li>Advanced Affiliate Portal features</li>
            <li>Priority support & updates</li>
          </ul>
        </div>
        <p>Ready to start? <a href="${process.env['NEXT_PUBLIC_BASE_URL']}/dashboard" style="color: #667eea;">Access your dashboard</a></p>
        <p>Best regards,<br>The Omnipreneur Team</p>
      </div>
    `
  }),

  paymentSuccess: (userName: string, amount: number, plan: string) => ({
    subject: 'Payment Successful - Omnipreneur',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a; text-align: center;">Payment Successful!</h1>
        <p>Hi ${userName},</p>
        <p>Your payment of $${amount} for the ${plan} plan has been processed successfully.</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3>Payment Details:</h3>
          <p><strong>Amount:</strong> $${amount}</p>
          <p><strong>Plan:</strong> ${plan.charAt(0).toUpperCase() + plan.slice(1)}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p>Your account has been upgraded and you now have access to all ${plan} features.</p>
        <p><a href="${process.env['NEXT_PUBLIC_BASE_URL']}/dashboard" style="color: #667eea;">Go to Dashboard</a></p>
        <p>Best regards,<br>The Omnipreneur Team</p>
      </div>
    `
  }),

  paymentFailed: (userName: string, amount: number, plan: string) => ({
    subject: 'Payment Failed - Omnipreneur',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc3545; text-align: center;">Payment Failed</h1>
        <p>Hi ${userName},</p>
        <p>We were unable to process your payment of $${amount} for the ${plan} plan.</p>
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3>What happened?</h3>
          <p>This could be due to:</p>
          <ul>
            <li>Insufficient funds</li>
            <li>Card expired</li>
            <li>Bank declined the transaction</li>
            <li>Incorrect card details</li>
          </ul>
        </div>
        <p><a href="${process.env['NEXT_PUBLIC_BASE_URL']}/billing" style="color: #667eea;">Update Payment Method</a></p>
        <p>Need help? Contact our support team.</p>
        <p>Best regards,<br>The Omnipreneur Team</p>
      </div>
    `
  }),

  subscriptionCancelled: (userName: string, plan: string) => ({
    subject: 'Subscription Cancelled - Omnipreneur',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a; text-align: center;">Subscription Cancelled</h1>
        <p>Hi ${userName},</p>
        <p>Your ${plan} subscription has been cancelled as requested.</p>
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3>What happens next?</h3>
          <p>You'll continue to have access to your current features until the end of your billing period.</p>
          <p>After that, your account will be downgraded to the free plan.</p>
        </div>
        <p>Changed your mind? <a href="${process.env['NEXT_PUBLIC_BASE_URL']}/billing" style="color: #667eea;">Reactivate your subscription</a></p>
        <p>Best regards,<br>The Omnipreneur Team</p>
      </div>
    `
  }),

  usageLimitWarning: (userName: string, feature: string, current: number, limit: number) => ({
    subject: 'Usage Limit Warning - Omnipreneur',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ffc107; text-align: center;">Usage Limit Warning</h1>
        <p>Hi ${userName},</p>
        <p>You're approaching your usage limit for ${feature}.</p>
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3>Current Usage:</h3>
          <p><strong>${feature}:</strong> ${current} / ${limit}</p>
          <p>You have ${limit - current} uses remaining.</p>
        </div>
        <p>Consider upgrading to unlock unlimited access to all features.</p>
        <p><a href="${process.env['NEXT_PUBLIC_BASE_URL']}/pricing" style="color: #667eea;">View Plans</a></p>
        <p>Best regards,<br>The Omnipreneur Team</p>
      </div>
    `
  }),

  passwordReset: (userName: string, resetToken: string) => ({
    subject: 'Password Reset Request - Omnipreneur',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a; text-align: center;">Password Reset</h1>
        <p>Hi ${userName},</p>
        <p>You requested a password reset for your Omnipreneur account.</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
          <a href="${process.env['NEXT_PUBLIC_BASE_URL']}/reset-password?token=${resetToken}" 
             style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Omnipreneur Team</p>
      </div>
    `
  })
};

// Simple email sending function
export async function sendSimpleEmail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const mailOptions = {
      from: `"Omnipreneur AI Suite" <${process.env['SMTP_USER']}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Email sending functions
export async function sendEmail(to: string, template: keyof typeof emailTemplates, data: any) {
  try {
    const emailTemplate = emailTemplates[template];
    
    // Handle different template signatures properly
    let templateResult: { subject: string; html: string };
    if (template === 'welcome') {
      templateResult = (emailTemplate as (a: string, b: string) => { subject: string; html: string })(data.userName || data.name, data.plan);
    } else if (template === 'paymentSuccess' || template === 'paymentFailed') {
      templateResult = (emailTemplate as (a: string, b: number, c: string) => { subject: string; html: string })(data.userName || data.name, data.amount, data.plan);
    } else if (template === 'subscriptionCancelled') {
      templateResult = (emailTemplate as (a: string, b: string) => { subject: string; html: string })(data.userName || data.name, data.plan);
    } else if (template === 'usageLimitWarning') {
      templateResult = (emailTemplate as (a: string, b: string, c: number, d: number) => { subject: string; html: string })(data.userName || data.name, data.feature, data.current, data.limit);
    } else if (template === 'passwordReset') {
      templateResult = (emailTemplate as (a: string, b: string) => { subject: string; html: string })(data.userName || data.name, data.resetToken);
    } else {
      // Fallback for other templates
      templateResult = (emailTemplate as (a: string) => { subject: string; html: string })(data.userName || data.name);
    }
    
    const { subject, html } = templateResult;

    const mailOptions = {
      from: process.env['SMTP_FROM'] || 'noreply@omnipreneur.com',
      to,
      subject,
      html
    };

    const result = await transporter.sendMail(mailOptions);
    // Email sent successfully - logging removed for production
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(userData: { email: string; name: string; plan: string }) {
  return sendEmail(userData.email, 'welcome', userData);
}

export async function sendPaymentSuccessEmail(userData: { email: string; name: string; amount: number; plan: string }) {
  return sendEmail(userData.email, 'paymentSuccess', userData);
}

export async function sendPaymentFailedEmail(userData: { email: string; name: string; amount: number; plan: string }) {
  return sendEmail(userData.email, 'paymentFailed', userData);
}

export async function sendSubscriptionCancelledEmail(userData: { email: string; name: string; plan: string }) {
  return sendEmail(userData.email, 'subscriptionCancelled', userData);
}

export async function sendUsageLimitWarning(userData: { email: string; name: string; feature: string; current: number; limit: number }) {
  return sendEmail(userData.email, 'usageLimitWarning', userData);
}

export async function sendPasswordResetEmail(userData: { email: string; name: string; resetToken: string }) {
  return sendEmail(userData.email, 'passwordReset', userData);
}

// Bulk email function for marketing campaigns
export async function sendBulkEmail(recipients: string[], subject: string, html: string) {
  try {
    const mailOptions = {
      from: process.env['SMTP_FROM'] || 'noreply@omnipreneur.com',
      bcc: recipients,
      subject,
      html
    };

    const result = await transporter.sendMail(mailOptions);
    // Bulk email sent successfully - logging removed for production
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending bulk email:', error);
    throw error;
  }
}

// Email verification
export async function sendVerificationEmail(userData: { email: string; name: string; verificationToken: string }) {
  const template = {
    subject: 'Verify Your Email - Omnipreneur',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a; text-align: center;">Verify Your Email</h1>
        <p>Hi ${userData.name},</p>
        <p>Please verify your email address to complete your Omnipreneur account setup.</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
          <a href="${process.env['NEXT_PUBLIC_BASE_URL']}/verify-email?token=${userData.verificationToken}" 
             style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>The Omnipreneur Team</p>
      </div>
    `
  };

  const mailOptions = {
    from: process.env['SMTP_FROM'] || 'noreply@omnipreneur.com',
    to: userData.email,
    subject: template.subject,
    html: template.html,
  };

  const result = await transporter.sendMail(mailOptions);
  return { success: true, messageId: result.messageId };
} 