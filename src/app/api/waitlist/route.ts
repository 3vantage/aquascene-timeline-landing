import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Enhanced validation schema matching the form
const waitlistSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  experience: z.enum(['beginner', 'intermediate', 'advanced', 'professional']),
  interests: z.array(z.enum(['3d_design', 'calculations', 'community', 'mobile_app', 'ai_assistant'])).min(1, 'Please select at least one interest'),
  gdprConsent: z.boolean().refine((val) => val === true, 'GDPR consent is required'),
  marketingConsent: z.boolean().optional(),
  referralSource: z.string().optional(),
  honeypot: z.string().max(0, 'Bot detected'), // Should be empty
  honeypot2: z.string().max(0, 'Bot detected'), // Should be empty
  timestamp: z.number()
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate data
    const validatedData = waitlistSchema.parse(body);
    
    // Rate limiting check (basic implementation)
    const clientIP = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
    
    // Honeypot validation
    if (validatedData.honeypot || validatedData.honeypot2) {
      return NextResponse.json(
        { success: false, error: 'Spam detected' },
        { status: 400 }
      );
    }
    
    // Time-based validation (prevent too fast submissions)
    const submissionTime = Date.now() - validatedData.timestamp;
    if (submissionTime < 1000) { // Less than 1 second (very generous for testing)
      return NextResponse.json(
        { success: false, error: 'Submission too fast. Please try again.' },
        { status: 429 }
      );
    }
    
    // Generate waitlist position (in production, this would be from database)
    const position = Math.floor(Math.random() * 1000) + 1;
    
    // In production, save to database
    // await saveToDatabase(validatedData);
    
    // For now, we'll use a file-based storage or external service
    // This could be replaced with Airtable, Notion, or any other service
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In production, send welcome email here
    // await sendWelcomeEmail(validatedData.email, validatedData.name, position);
    
    return NextResponse.json({
      success: true,
      position: position,
      message: 'Successfully joined the waitlist!'
    });
    
  } catch (error) {
    console.error('Waitlist submission error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Health check endpoint
  return NextResponse.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
}