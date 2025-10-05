export * from "./exports-schema";
export * from "./ai-video";
export * from "./trending-remix";

// Type placeholder for profiles (to be created)
export type SelectProfile = {
  id: string;
  userId: string;
  email?: string;
  stripeCustomerId?: string;
  subscriptionStatus?: string;
  membership?: "free" | "pro";
  credits?: number;
  createdAt?: Date;
  updatedAt?: Date;
};