/** Admin — Subscription Plans + Stripe Connect onboarding status.
 *  Matches Paper design artboard 2YA-0 ("AD-05 · Suscripciones"). */
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { BsStripe } from "react-icons/bs";
import { useLocale } from "@/i18n/LocaleProvider";
import { adminApi } from "@/lib/api/admin";
import type { SubscriptionPlan, Subscription, PaginationMeta } from "@/lib/types";

/** Map support/analytics keys from the API to i18n feature keys. */
const SUPPORT_KEYS: Record<string, "emailSupport" | "prioritySupport" | "dedicatedSupport"> = {
  email: "emailSupport",
  priority: "prioritySupport",
  dedicated: "dedicatedSupport",
};
const ANALYTICS_KEYS: Record<string, "basicAnalytics" | "advancedAnalytics" | "fullAnalytics"> = {
  basic: "basicAnalytics",
  advanced: "advancedAnalytics",
  full: "fullAnalytics",
};

type FeatureKey = keyof typeof import("@/i18n/dictionary").dictionary.en.admin.subscriptions.features;

/** Build curated feature list from plan features jsonb, returning i18n keys. */
function getPlanFeatureKeys(features: Record<string, unknown>, position: number): FeatureKey[] {
  const list: FeatureKey[] = [];
  const support = features.support as string | undefined;
  const analytics = features.analytics as string | undefined;
  if (support && SUPPORT_KEYS[support]) list.push(SUPPORT_KEYS[support]);
  if (analytics && ANALYTICS_KEYS[analytics]) list.push(ANALYTICS_KEYS[analytics]);
  list.push("hotelAccess");
  list.push("retreatAccess");
  if (position >= 1) list.push("retreatCreation");
  return list;
}

export default function SubscriptionsPage() {
  const { t } = useLocale();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subsMeta, setSubsMeta] = useState<PaginationMeta>({ page: 1, per_page: 20, total: 0, total_pages: 0 });
  const [loading, setLoading] = useState(true);

  // Edit price modal
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [saving, setSaving] = useState(false);

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

  function openEditPrice(plan: SubscriptionPlan) {
    setEditingPlan(plan);
    setEditPrice((plan.price_cents / 100).toString());
  }

  async function handleSavePrice() {
    if (!editingPlan) return;
    setSaving(true);
    try {
      const cents = Math.round(parseFloat(editPrice) * 100);
      if (isNaN(cents) || cents < 0) return;
      await adminApi.updateSubscriptionPlan(editingPlan.id, { price_cents: cents });
      setEditingPlan(null);
      fetchData();
    } catch {
      // handle silently
    } finally {
      setSaving(false);
    }
  }

  /** Format price from cents. */
  function formatPrice(cents: number, currency: string): string {
    const amount = cents / 100;
    if (amount === 0) return t.admin.subscriptions.free;
    return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 0 }).format(amount);
  }

  /** Get tier style. Professional=gold border, Enterprise=dark bg. */
  function getTierStyle(position: number) {
    if (position === 2) return { bg: "bg-white", border: "border-humana-gold", text: "text-humana-ink", muted: "text-humana-muted", line: "border-humana-line", check: "text-humana-gold", commission: "text-humana-gold", btnClass: "border-humana-gold text-humana-gold hover:bg-humana-gold-light" };
    if (position >= 3) return { bg: "bg-humana-ink", border: "border-humana-ink", text: "text-white", muted: "text-white/60", line: "border-white/15", check: "text-humana-gold", commission: "text-humana-gold", btnClass: "border-white/30 bg-white text-humana-ink hover:bg-white/90" };
    return { bg: "bg-white", border: "border-humana-line", text: "text-humana-ink", muted: "text-humana-muted", line: "border-humana-line", check: "text-humana-gold", commission: "text-humana-gold", btnClass: "border-humana-line text-humana-ink hover:border-humana-gold hover:text-humana-gold" };
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
          <BsStripe className="h-5 w-5 text-[#635BFF]" />
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
            const featureKeys = getPlanFeatureKeys(plan.features || {}, plan.position || 0);
            const planKey = plan.slug as "starter" | "professional" | "enterprise";
            const localizedPlan = t.admin.subscriptions[planKey] as { name: string; desc: string } | undefined;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-xl border-2 ${style.border} ${style.bg} p-7 transition-all duration-200 hover:shadow-lg`}
              >
                {/* Plan name eyebrow + Popular badge */}
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
                    {localizedPlan?.name || plan.name}
                  </span>
                  {plan.position === 2 && (
                    <span className="rounded bg-humana-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                      {t.admin.subscriptions.popular}
                    </span>
                  )}
                </div>

                {/* Pricing — hero number */}
                <div className="flex items-baseline gap-1">
                  <span className={`text-[40px] font-light tracking-[-0.02em] ${style.text}`}>
                    {formatPrice(plan.price_cents, plan.currency)}
                  </span>
                  {plan.price_cents > 0 && (
                    <span className={`text-[14px] ${style.muted}`}>{t.admin.subscriptions.perMonth}</span>
                  )}
                </div>

                {/* Description */}
                <p className={`mt-2 text-[13px] ${style.muted}`}>
                  {localizedPlan?.desc || `For ${plan.target_audience} organizations.`}
                </p>

                {/* Divider */}
                <hr className={`my-5 ${style.line}`} />

                {/* Features with checkmarks */}
                <ul className="flex flex-1 flex-col gap-2.5">
                  {featureKeys.map((key) => (
                    <li key={key} className={`flex items-center gap-2.5 text-[13px] ${style.text}`}>
                      <svg className={`h-4 w-4 shrink-0 ${style.check}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {(t.admin.subscriptions.features as Record<string, string>)[key]}
                    </li>
                  ))}
                </ul>

                {/* Commission rate */}
                <div className={`mt-4 flex items-center gap-2 text-[13px] font-semibold ${style.commission}`}>
                  <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                  {Math.round(plan.commission_rate * 100)}% {t.admin.subscriptions.commissionRate}
                </div>

                {/* Edit Plan button */}
                <button
                  onClick={() => openEditPrice(plan)}
                  className={`cursor-pointer mt-5 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] transition-all duration-200 ${style.btnClass}`}
                >
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

      {/* Subscriptions & Payments */}
      <div className="animate-[fade-in-up_0.4s_ease-out_0.2s_both]">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {t.admin.subscriptions.stripeConnect}
            </span>
            <h2 className="mt-1.5 text-[20px] font-semibold tracking-[-0.01em] text-humana-ink">
              {t.admin.subscriptions.paymentOnboarding}
            </h2>
            <p className="mt-1 text-[14px] text-humana-muted">
              {t.admin.subscriptions.paymentOnboardingSubtitle}
            </p>
          </div>
          {subsMeta.total > 0 && (
            <span className="mt-3 text-[12px] text-humana-muted">
              {subsMeta.total} {t.admin.subscriptions.subscribers}
            </span>
          )}
        </div>

        <div className="rounded-xl border border-humana-line bg-white">
          {subscriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-humana-stone">
                <svg className="h-7 w-7 text-humana-subtle" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <p className="text-[15px] font-medium text-humana-ink">{t.admin.subscriptions.noSubs}</p>
              <p className="mt-1.5 max-w-[360px] text-[13px] text-humana-muted">{t.admin.subscriptions.noSubsHint}</p>
            </div>
          ) : (
            <>
              {/* Table header: MEMBER | TYPE | PLAN | STATUS | AMOUNT | ACTION */}
              <div className="grid grid-cols-[2fr_1fr_1fr_1.2fr_1fr_0.8fr] gap-3 border-b border-humana-line px-6 py-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.subscriptions.member}</span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.subscriptions.type}</span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.subscriptions.plan}</span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.subscriptions.status}</span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-humana-muted">{t.admin.subscriptions.amount}</span>
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

                const statusStyles: Record<string, string> = {
                  active: "bg-emerald-50 text-emerald-600",
                  trialing: "bg-amber-50 text-amber-600",
                  cancelled: "bg-red-50 text-red-500",
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
                    {/* Status */}
                    <span className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] ${statusStyles[sub.status] || "bg-humana-stone text-humana-muted"}`}>
                      {sub.status}
                    </span>
                    {/* Amount */}
                    <span className="text-[13px] text-humana-ink">
                      {sub.plan?.price_cents ? `$${(sub.plan.price_cents / 100).toFixed(2)}` : "$0.00"}
                      <span className="text-humana-muted">{t.admin.subscriptions.perMonth}</span>
                    </span>
                    {/* Action */}
                    <button className="cursor-pointer text-[12px] font-medium text-humana-gold transition-colors hover:text-[#c5a030]">
                      {t.admin.subscriptions.view}
                    </button>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* Edit Price Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-[fade-in_0.2s_ease-out]" onClick={() => !saving && setEditingPlan(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 w-full max-w-[400px] rounded-xl bg-white p-8 shadow-2xl animate-[modal-enter_0.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-gold">
              {editingPlan.name}
            </span>
            <h2 className="mt-2 mb-6 text-[18px] font-semibold text-humana-ink">
              {t.admin.subscriptions.editPriceTitle}
            </h2>

            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-humana-muted">
              {t.admin.subscriptions.editPriceLabel}
            </label>
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-humana-muted">$</span>
              <input
                type="number"
                min="0"
                step="1"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                autoFocus
                className="w-full rounded-lg border border-humana-line pl-8 pr-4 py-3 text-[14px] text-humana-ink outline-none transition-colors focus:border-humana-gold"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditingPlan(null)}
                disabled={saving}
                className="flex-1 cursor-pointer rounded-lg border border-humana-line px-5 py-2.5 text-center text-[13px] font-medium text-humana-muted transition-colors hover:bg-humana-stone disabled:opacity-50"
              >
                {t.admin.subscriptions.cancel}
              </button>
              <button
                onClick={handleSavePrice}
                disabled={saving || !editPrice || parseFloat(editPrice) < 0}
                className="flex-1 cursor-pointer rounded-lg bg-humana-ink px-5 py-2.5 text-center text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? t.admin.subscriptions.editPriceSaving : t.admin.subscriptions.editPriceSave}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
