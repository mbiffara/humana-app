/** Admin — Subscription Plans + Stripe Connect onboarding status.
 *  Matches Paper design artboard 2YA-0 ("AD-05 · Suscripciones"). */
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { adminApi } from "@/lib/api/admin";
import type { SubscriptionPlan, Subscription, PaginationMeta } from "@/lib/types";

/** Feature labels for display. */
const FEATURE_LABELS: Record<string, string> = {
  booking_access: "Up to 10 bookings/month",
  basic_dashboard: "Basic dashboard",
  email_support: "Email support",
  unlimited_bookings: "Unlimited bookings",
  inventory_management: "Inventory management",
  client_crm: "Client CRM",
  priority_support: "Priority support",
  retreat_creation: "Retreat Creation",
  analytics_dashboard: "Everything in Professional",
  custom_branding: "White-label booking widget",
  api_access: "API access",
  dedicated_account_manager: "Dedicated account manager",
  multi_user: "Multi-User Access",
  white_label: "White Label",
};

export default function SubscriptionsPage() {
  const { t } = useLocale();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subsMeta, setSubsMeta] = useState<PaginationMeta>({ page: 1, per_page: 20, total: 0, total_pages: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [plansRes, subsRes] = await Promise.all([
        adminApi.listSubscriptionPlans().catch(() => ({ subscription_plans: [] })),
        adminApi.listSubscriptions({ per_page: 20 }).catch(() => ({ subscriptions: [], meta: { page: 1, per_page: 20, total: 0, total_pages: 0 } })),
      ]);
      setPlans(plansRes.subscription_plans);
      setSubscriptions(subsRes.subscriptions);
      setSubsMeta(subsRes.meta);
    } catch {
      // API unavailable
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /** Format price from cents. */
  function formatPrice(cents: number, currency: string): string {
    const amount = cents / 100;
    if (amount === 0) return "Free";
    return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 0 }).format(amount);
  }

  /** Get tier style. Professional=gold border, Enterprise=dark border. */
  function getTierStyle(position: number): { border: string; btnClass: string } {
    if (position === 2) return { border: "border-humana-gold", btnClass: "border-humana-gold text-humana-gold hover:bg-humana-gold-light" };
    if (position >= 3) return { border: "border-humana-ink/20", btnClass: "border-humana-ink bg-humana-ink text-white hover:bg-humana-ink/90" };
    return { border: "border-humana-line", btnClass: "border-humana-line text-humana-ink hover:border-humana-gold hover:text-humana-gold" };
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-humana-line border-t-humana-gold" />
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-humana-muted">
            {t.common.loading}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-16 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-[12px] animate-[fade-in-up_0.4s_ease-out]">
        <Link href="/admin/dashboard" className="cursor-pointer font-medium text-humana-muted transition-colors hover:text-humana-ink">
          Dashboard
        </Link>
        <span className="text-humana-subtle">&rsaquo;</span>
        <span className="font-medium text-humana-ink">{t.admin.nav.subscriptions}</span>
      </nav>

      {/* Header with Stripe Dashboard button */}
      <div className="mb-10 flex items-start justify-between animate-[fade-in-up_0.4s_ease-out_0.05s_both]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
            {t.admin.subscriptions.eyebrow}
          </span>
          <h1 className="mt-2 text-[28px] font-light tracking-[-0.01em] text-humana-ink">
            {t.admin.subscriptions.title}
          </h1>
          <p className="mt-1 text-[14px] text-humana-muted">
            {t.admin.subscriptions.subtitle}
          </p>
        </div>
        <button className="cursor-pointer mt-4 inline-flex items-center gap-2 rounded-lg border border-humana-line bg-white px-4 py-2.5 text-[13px] font-medium text-humana-ink transition-colors hover:border-humana-gold/30 hover:shadow-sm">
          <svg className="h-4 w-4 text-humana-muted" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          Stripe Dashboard
        </button>
      </div>

      {/* Plan cards — 3 columns per Paper */}
      {plans.length === 0 ? (
        <div className="mb-12 rounded-xl border border-humana-line bg-white p-12 text-center animate-[fade-in-up_0.4s_ease-out_0.1s_both]">
          <svg className="mx-auto mb-3 h-10 w-10 text-humana-line" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
          <p className="text-[14px] text-humana-muted">{t.admin.subscriptions.noPlans}</p>
        </div>
      ) : (
        <div className="mb-12 grid grid-cols-3 gap-5 animate-[fade-in-up_0.4s_ease-out_0.1s_both]">
          {plans.map((plan) => {
            const style = getTierStyle(plan.position || 1);
            const featureKeys = Object.entries(plan.features || {}).filter(([, v]) => v).map(([k]) => k);
            const planKey = plan.slug as "starter" | "professional" | "enterprise";
            const localizedPlan = t.admin.subscriptions[planKey] as { name: string; desc: string } | undefined;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-xl border-2 ${style.border} bg-white p-7 transition-all duration-200 hover:shadow-lg`}
              >
                {/* Plan name eyebrow + Popular badge */}
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                    {localizedPlan?.name || plan.name}
                  </span>
                  {plan.position === 2 && (
                    <span className="rounded bg-humana-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                      Popular
                    </span>
                  )}
                </div>

                {/* Pricing — hero number */}
                <div className="flex items-baseline gap-1">
                  <span className="text-[40px] font-light tracking-[-0.02em] text-humana-ink">
                    {formatPrice(plan.price_cents, plan.currency)}
                  </span>
                  {plan.price_cents > 0 && (
                    <span className="text-[14px] text-humana-muted">{t.admin.subscriptions.perMonth}</span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-2 text-[13px] text-humana-muted">
                  {localizedPlan?.desc || `For ${plan.target_audience} organizations.`}
                </p>

                {/* Divider */}
                <hr className="my-5 border-humana-line" />

                {/* Features — plain text list (no checkmarks, per Paper) */}
                <ul className="flex flex-1 flex-col gap-2.5">
                  {featureKeys.map((key) => (
                    <li key={key} className="text-[13px] text-humana-ink">
                      {FEATURE_LABELS[key] || key.replace(/_/g, " ")}
                    </li>
                  ))}
                </ul>

                {/* Commission rate */}
                <p className="mt-4 text-[13px] text-humana-gold">
                  {plan.commission_percent} {t.admin.subscriptions.commissionRate}
                </p>

                {/* Active members count */}
                <p className="mt-2 text-[13px] font-medium text-humana-gold">
                  {t.admin.subscriptions.activeMembers}
                </p>

                {/* Edit Plan button */}
                <button className={`cursor-pointer mt-5 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] transition-all duration-200 ${style.btnClass}`}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  {t.admin.subscriptions.editPlan}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Stripe Connect — Payment onboarding status */}
      <div className="animate-[fade-in-up_0.4s_ease-out_0.2s_both]">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {t.admin.subscriptions.stripeConnect}
            </span>
            <h2 className="mt-1.5 text-[20px] font-semibold tracking-[-0.01em] text-humana-ink">
              {t.admin.subscriptions.paymentOnboarding}
            </h2>
          </div>
          {subsMeta.total > 0 && (
            <span className="mt-3 text-[12px] text-humana-muted">
              {subsMeta.total} {t.admin.subscriptions.subscribers}
            </span>
          )}
        </div>

        <div className="rounded-xl border border-humana-line bg-white">
          {subscriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="mb-3 h-10 w-10 text-humana-line" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
              <p className="text-[14px] text-humana-muted">{t.admin.subscriptions.noSubs}</p>
            </div>
          ) : (
            <>
              {/* Table header — per Paper: MEMBER | TYPE | PLAN | STRIPE STATUS | MRR | ACTION */}
              <div className="grid grid-cols-[2fr_1fr_1fr_1.2fr_1fr_0.8fr] gap-3 border-b border-humana-line px-6 py-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.subscriptions.member}</span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.subscriptions.type}</span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.subscriptions.plan}</span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.subscriptions.stripeStatus}</span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">MRR</span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.subscriptions.action}</span>
              </div>

              {/* Table rows */}
              {subscriptions.map((sub) => {
                const initials = (sub.organization?.name || "--")
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                const stripeStatus = sub.stripe_subscription_id ? "connected" : sub.status === "trialing" ? "pending" : "incomplete";
                const statusStyles: Record<string, string> = {
                  connected: "bg-emerald-50 text-emerald-600",
                  pending: "bg-amber-50 text-amber-600",
                  incomplete: "bg-red-50 text-red-500",
                };
                const actionLabels: Record<string, string> = {
                  connected: "View",
                  pending: "Resend invite",
                  incomplete: "Remind",
                };

                return (
                  <div key={sub.id} className="grid grid-cols-[2fr_1fr_1fr_1.2fr_1fr_0.8fr] gap-3 items-center border-b border-humana-line/50 px-6 py-4 transition-colors hover:bg-humana-stone/30">
                    {/* Member */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-humana-gold-light text-[12px] font-semibold text-humana-gold">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-humana-ink">{sub.organization?.name || "--"}</p>
                        <p className="truncate text-[11px] text-humana-muted">
                          {sub.organization?.city || ""}{sub.organization?.country ? `, ${sub.organization.country}` : ""}
                        </p>
                      </div>
                    </div>
                    {/* Type */}
                    <span className="text-[13px] text-humana-ink capitalize">{sub.organization?.kind || "--"}</span>
                    {/* Plan */}
                    <span className="text-[13px] text-humana-ink">{sub.plan?.name || "--"}</span>
                    {/* Stripe Status */}
                    <span className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] ${statusStyles[stripeStatus] || statusStyles.incomplete}`}>
                      {stripeStatus}
                    </span>
                    {/* MRR */}
                    <span className="text-[13px] text-humana-ink">
                      {sub.plan?.price_cents ? `$${(sub.plan.price_cents / 100).toFixed(2)}` : "$0.00"}
                    </span>
                    {/* Action */}
                    <button className="cursor-pointer text-[12px] font-medium text-humana-gold transition-colors hover:text-[#c5a030]">
                      {actionLabels[stripeStatus] || "View"}
                    </button>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
