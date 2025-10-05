'use server';

import { auth } from '@clerk/nextjs/server';
import { SelectProfile } from '@/db/schema';

export interface ActionState<T> {
  isSuccess: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export async function getProfileByUserIdAction(userId: string): Promise<ActionState<SelectProfile>> {
  try {
    const { userId: authUserId } = auth();
    if (!authUserId || authUserId !== userId) {
      return {
        isSuccess: false,
        message: 'Unauthorized',
        error: 'User ID mismatch'
      };
    }

    // Mock profile for now
    const mockProfile: SelectProfile = {
      id: userId,
      userId,
      email: 'user@example.com',
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: null,
      membership: 'free',
      paymentProvider: null,
      whopUserId: null,
      whopMembershipId: null,
      status: 'active',
      planDuration: null,
      billingCycleStart: null,
      billingCycleEnd: null,
      nextCreditRenewal: null,
      credits: null,
      usageCredits: 5,
      usedCredits: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return {
      isSuccess: true,
      data: mockProfile,
      message: 'Profile retrieved successfully'
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: 'Failed to retrieve profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function checkPaymentFailedAction(userId: string): Promise<ActionState<boolean>> {
  try {
    const { userId: authUserId } = auth();
    if (!authUserId || authUserId !== userId) {
      return {
        isSuccess: false,
        message: 'Unauthorized',
        error: 'User ID mismatch'
      };
    }

    // Mock payment check - always return false for now
    return {
      isSuccess: true,
      data: false,
      message: 'Payment status checked'
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: 'Failed to check payment status',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
