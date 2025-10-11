/**
 * Billing and Subscription Helpers
 * 
 * Centralized subscription verification for Whop integration
 */

import { auth } from '@clerk/nextjs';

export type SubscriptionStatus = {
  active: boolean;
  plan?: string;
  expiresAt?: Date;
};

/**
 * Verify if user has an active subscription
 * Throws error if no active subscription found
 * 
 * @param userId - Clerk user ID
 * @throws Error if no active subscription
 */
export async function verifyActiveSubscription(userId: string): Promise<void> {
  const subscription = await getUserActiveSubscription(userId);
  
  if (!subscription?.active) {
    throw new Error('An active subscription is required to use this feature. Please upgrade your plan.');
  }
}

/**
 * Get user's active subscription status
 * 
 * @param userId - Clerk user ID
 * @returns Subscription status object
 */
export async function getUserActiveSubscription(userId: string): Promise<SubscriptionStatus | null> {
  // TODO: Implement actual Whop API integration
  // For now, return a mock active subscription for development
  
  console.log(`[BILLING] Checking subscription for user: ${userId}`);
  
  // Mock implementation - replace with actual Whop API call
  return {
    active: true, // For development, always return active
    plan: 'pro',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  };
  
  /* 
  // Real implementation would look like:
  try {
    const whop = new WhopSDK(process.env.WHOP_API_KEY!);
    const membership = await whop.memberships.retrieve(userId);
    
    return {
      active: membership.status === 'active',
      plan: membership.plan.id,
      expiresAt: new Date(membership.expires_at * 1000),
    };
  } catch (error) {
    console.error('[BILLING] Error checking subscription:', error);
    return null;
  }
  */
}

/**
 * Validate Whop entitlement for a specific feature
 * Throws error if user is not entitled
 * 
 * @param userId - Clerk user ID
 * @param feature - Feature name (optional)
 * @throws Error if not entitled
 */
export async function validateWhopEntitlement(userId: string, feature?: string): Promise<void> {
  await verifyActiveSubscription(userId);
  
  // Additional feature-specific checks can be added here
  if (feature) {
    console.log(`[BILLING] Validated entitlement for feature: ${feature}`);
  }
}

