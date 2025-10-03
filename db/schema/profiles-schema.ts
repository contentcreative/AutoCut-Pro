import { pgEnum, pgTable, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const membershipEnum = pgEnum("membership", ["free", "pro"]);
export const paymentProviderEnum = pgEnum("payment_provider", ["stripe", "whop"]);

export const profilesTable = pgTable("profiles", {
  userId: text("user_id").primaryKey().notNull(),
  email: text("email"),
  membership: membershipEnum("membership").notNull().default("free"),
  paymentProvider: paymentProviderEnum("payment_provider").default("whop"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  whopUserId: text("whop_user_id"),
  whopMembershipId: text("whop_membership_id"),
  planDuration: text("plan_duration"), // "monthly" or "yearly"
  // Billing cycle tracking
  billingCycleStart: timestamp("billing_cycle_start"),
  billingCycleEnd: timestamp("billing_cycle_end"),
  // Credit renewal tracking (separate from billing cycle for yearly plans)
  nextCreditRenewal: timestamp("next_credit_renewal"),
  // Usage credits tracking
  usageCredits: integer("usage_credits").default(0),
  usedCredits: integer("used_credits").default(0),
  // Subscription status tracking
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
}, (table) => {
  return {
    // Enable RLS on this table
    rls: sql`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`,
  };
});

export type InsertProfile = typeof profilesTable.$inferInsert;
export type SelectProfile = typeof profilesTable.$inferSelect;