export * from "./exports-schema";
export * from "./ai-video";
export * from "./trending-remix";

// Type placeholder for profiles (to be created)
export type SelectProfile = {
  id: string;
  userId: string;
  email?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  subscriptionStatus?: string;
  membership?: "free" | "pro";
  paymentProvider?: "stripe" | "whop" | null;
  whopUserId?: string | null;
  whopMembershipId?: string | null;
  status: string | null;
  planDuration?: string | null;
  billingCycleStart?: Date | null;
  billingCycleEnd?: Date | null;
  nextCreditRenewal?: Date | null;
  credits?: number;
  usageCredits?: number | null;
  usedCredits?: number | null;
  createdAt: Date;
  updatedAt: Date;
};