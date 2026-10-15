import Head from "next/head";
import { AIInsightsWorkspace } from "@/components/dashboard/ai/AIInsightsWorkspace";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

/**
 * Renders the AI Insights route, pairing {@link DashboardSidebar} with the flagship {@link AIInsightsWorkspace}.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * // Route: /dashboard/ai-insights — rendered by the Next.js Pages Router.
 * <AIInsightsPage />
 * ```
 */
const AIInsightsPage = () => {
  return (
    <>
      <Head>
        <title>AI Insights | ShopSwift Admin</title>
        <meta
          name="description"
          content="Flagship AI Insights workspace for admin operations with tool trace diagnostics"
        />
      </Head>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="min-w-0 flex-1">
          <AIInsightsWorkspace />
        </div>
      </div>
    </>
  );
};

export default AIInsightsPage;

/**
 * Server-side admin auth gate for the AI Insights route.
 *
 * @param ctx - Next.js server-side context for the incoming request, including `req`/`res` and cookies.
 * @returns The {@link requireAdmin} result: `props` with the authenticated admin user, or a redirect to `/` / `/?error=admin_required` when the session is missing or not an admin.
 */
export async function getServerSideProps(
  ctx: import("next").GetServerSidePropsContext,
) {
  const { requireAdmin } = await import("@/lib/ssrAuth");
  return requireAdmin(ctx);
}
