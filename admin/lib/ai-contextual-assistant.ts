import type { ParsedUrlQuery } from "querystring";

export interface AIQuickAction {
  id: string;
  label: string;
  description: string;
  prompt: string;
}

export interface AIResolvedPageContext {
  key: string;
  title: string;
  summary: string;
  placeholder: string;
  focusAreas: string[];
  quickActions: AIQuickAction[];
  sessionNamespace: string;
  route: string;
}

interface ResolveContextInput {
  pathname: string;
  asPath: string;
  query: ParsedUrlQuery;
}

const asScalar = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? value[0] ?? "" : value ?? "";

const compactId = (value: string, max = 10) =>
  value.length > max ? `${value.slice(0, max)}...` : value;

const action = (
  id: string,
  label: string,
  description: string,
  prompt: string,
): AIQuickAction => ({
  id,
  label,
  description,
  prompt,
});

const routeWithoutQuery = (asPath: string) => asPath.split("?")[0] || asPath;

const createContext = (
  input: ResolveContextInput,
  context: Omit<AIResolvedPageContext, "route">,
): AIResolvedPageContext => ({
  ...context,
  route: routeWithoutQuery(input.asPath),
});

export const resolveAIPageContext = (
  input: ResolveContextInput,
): AIResolvedPageContext | null => {
  const productId = asScalar(input.query.id);

  if (input.pathname === "/dashboard/ai-insights") {
    return null;
  }

  if (input.pathname === "/dashboard") {
    return createContext(input, {
      key: "dashboard-overview",
      title: "Dashboard",
      sessionNamespace: "page-dashboard",
      summary:
        "Store-wide performance overview across revenue, orders, top products, customer signals, and recent activity.",
      placeholder:
        "Ask about anomalies, forecast risk, or what deserves attention on the dashboard...",
      focusAreas: [
        "Revenue movement",
        "Order volume shifts",
        "Customer behavior changes",
      ],
      quickActions: [
        action(
          "dashboard-anomalies",
          "Find anomalies",
          "Surface the biggest unusual movements on the dashboard.",
          "Identify the most important anomalies visible on the dashboard and explain what likely needs attention first.",
        ),
        action(
          "dashboard-priorities",
          "Set priorities",
          "Turn the overview into a short operating brief.",
          "Summarize today's top operating priorities from the dashboard and recommend the next three actions.",
        ),
        action(
          "dashboard-forecast",
          "Forecast risk",
          "Look ahead using the signals on this page.",
          "Use the dashboard signals to forecast near-term revenue or fulfillment risk and explain the main drivers.",
        ),
      ],
    });
  }

  if (input.pathname === "/orders") {
    return createContext(input, {
      key: "orders-list",
      title: "Orders",
      sessionNamespace: "page-orders",
      summary:
        "Operational orders queue with filters, statuses, pagination, and fulfillment progress.",
      placeholder:
        "Ask about pending clusters, shipping delays, or how to triage this order queue...",
      focusAreas: ["Pending backlog", "Status distribution", "Fulfillment bottlenecks"],
      quickActions: [
        action(
          "orders-backlog",
          "Review backlog",
          "Pinpoint where the queue is piling up.",
          "Analyze the current orders page and identify the biggest backlog or delay patterns by status.",
        ),
        action(
          "orders-fraud",
          "Flag risk",
          "Look for suspicious or unusual order patterns.",
          "Review the current orders context for unusual order behavior, operational risk, or orders that deserve manual review.",
        ),
        action(
          "orders-playbook",
          "Recommend actions",
          "Turn the queue into a short execution plan.",
          "Recommend the next actions the ops team should take on the current orders view to reduce delay and improve throughput.",
        ),
      ],
    });
  }

  if (input.pathname === "/orders/[id]") {
    const orderId = asScalar(input.query.id);
    const title = orderId ? `Order ${compactId(orderId, 12)}` : "Order Details";
    return createContext(input, {
      key: "order-details",
      title,
      sessionNamespace: `page-order-${orderId || "current"}`,
      summary:
        "Single order view with status, payment, customer, and item-level detail for handling edge cases.",
      placeholder:
        "Ask for next-best actions, customer messaging, or order-specific risk assessment...",
      focusAreas: ["Order status", "Payment state", "Customer communication"],
      quickActions: [
        action(
          "order-next-step",
          "Next best step",
          "Work out the safest next action for this order.",
          `Review ${title} and recommend the next best operational action, including any customer communication needed.`,
        ),
        action(
          "order-risk",
          "Assess risk",
          "Check for exceptions before updating the order.",
          `Assess ${title} for fulfillment, payment, or support risk and explain what could go wrong if it is handled incorrectly.`,
        ),
        action(
          "order-summary",
          "Summarize case",
          "Create a short handoff summary.",
          `Summarize ${title} into a concise handoff note for another operator, including open questions and next steps.`,
        ),
      ],
    });
  }

  if (input.pathname === "/products") {
    return createContext(input, {
      key: "products-list",
      title: "Products",
      sessionNamespace: "page-products",
      summary:
        "Catalog management view with product search, stock visibility, categories, and merchandising controls.",
      placeholder:
        "Ask which products need attention, what to restock, or how to optimize this catalog view...",
      focusAreas: ["Catalog health", "Stock posture", "Merchandising opportunities"],
      quickActions: [
        action(
          "products-stock-risk",
          "Stock risk",
          "Spot items likely to hurt availability.",
          "Review the products page and identify which products or stock states look most at risk right now.",
        ),
        action(
          "products-merch",
          "Improve merchandising",
          "Find gaps in assortment or presentation.",
          "Analyze the visible catalog context and recommend merchandising or assortment improvements with the highest upside.",
        ),
        action(
          "products-cleanup",
          "Catalog cleanup",
          "Prioritize catalog fixes.",
          "Recommend the highest-priority catalog cleanup actions from the current products view.",
        ),
      ],
    });
  }

  if (input.pathname === "/products/add-product") {
    return createContext(input, {
      key: "product-create",
      title: "Add Product",
      sessionNamespace: "page-product-create",
      summary:
        "Product creation workflow for crafting titles, descriptions, pricing, and launch-ready metadata.",
      placeholder:
        "Ask for launch-readiness checks, copy help, or missing product information...",
      focusAreas: ["Data completeness", "Launch readiness", "Merchandising copy"],
      quickActions: [
        action(
          "product-create-checklist",
          "Launch checklist",
          "Verify the product is ready to publish.",
          "Give me a launch-readiness checklist for the product I am creating, including the fields I should verify before publishing.",
        ),
        action(
          "product-create-copy",
          "Improve copy",
          "Tighten product naming and messaging.",
          "Suggest how to improve this draft product's title, description, and conversion-oriented messaging.",
        ),
        action(
          "product-create-risk",
          "Catch gaps",
          "Look for missing details that create later work.",
          "Identify the most common product setup mistakes I should avoid on this page before saving.",
        ),
      ],
    });
  }

  if (input.pathname === "/products/[id]/edit") {
    const title = productId
      ? `Edit Product ${compactId(productId, 12)}`
      : "Edit Product";
    return createContext(input, {
      key: "product-edit",
      title,
      sessionNamespace: `page-product-edit-${productId || "current"}`,
      summary:
        "Product editing workflow for refining pricing, content, stock presentation, and publish quality.",
      placeholder:
        "Ask for a sanity check before saving or for changes with the highest impact...",
      focusAreas: ["Publish quality", "Pricing confidence", "Content quality"],
      quickActions: [
        action(
          "product-edit-audit",
          "Audit changes",
          "Check whether this product edit is safe and complete.",
          `Audit ${title} and list the highest-risk mistakes or omissions before I save changes.`,
        ),
        action(
          "product-edit-conversion",
          "Boost conversion",
          "Improve the product presentation.",
          `Review ${title} and suggest the product updates that would most improve conversion.`,
        ),
        action(
          "product-edit-summary",
          "Summarize changes",
          "Generate a short change note.",
          `Create a concise operator-facing summary of what should be changed in ${title} and why.`,
        ),
      ],
    });
  }

  if (input.pathname === "/products/[id]") {
    const title = productId
      ? `Product ${compactId(productId, 12)}`
      : "Product Details";
    return createContext(input, {
      key: "product-details",
      title,
      sessionNamespace: `page-product-${productId || "current"}`,
      summary:
        "Single product detail view for checking price, stock, sales, and performance context.",
      placeholder:
        "Ask why this product is underperforming, whether it needs restock, or what to optimize next...",
      focusAreas: ["Product performance", "Stock health", "Pricing signals"],
      quickActions: [
        action(
          "product-performance",
          "Explain performance",
          "Diagnose this product's current state.",
          `Explain the most important performance and merchandising signals for ${title}.`,
        ),
        action(
          "product-restock",
          "Restock advice",
          "Check if this item needs inventory action.",
          `Assess whether ${title} needs restocking or visibility changes and justify the recommendation.`,
        ),
        action(
          "product-actions",
          "Recommend actions",
          "Turn the product page into a short plan.",
          `Recommend the next concrete actions for ${title} based on what this page is telling us.`,
        ),
      ],
    });
  }

  if (input.pathname === "/customers") {
    return createContext(input, {
      key: "customers-list",
      title: "Customers",
      sessionNamespace: "page-customers",
      summary:
        "Customer directory with status, spend, and search filters for relationship and retention work.",
      placeholder:
        "Ask for segment ideas, churn risks, or what this customer list suggests about retention...",
      focusAreas: ["Customer segmentation", "Retention risk", "Revenue concentration"],
      quickActions: [
        action(
          "customers-segments",
          "Find segments",
          "Turn the customer list into useful cohorts.",
          "Analyze the customer page and suggest the most useful segments or cohorts to act on.",
        ),
        action(
          "customers-churn",
          "Spot churn risk",
          "Look for customers likely to disengage.",
          "Review the current customer context and identify churn or inactivity risks the team should investigate.",
        ),
        action(
          "customers-revenue",
          "Grow revenue",
          "Find the best customer-side opportunities.",
          "Recommend the highest-impact customer-focused actions to grow repeat revenue from this page's context.",
        ),
      ],
    });
  }

  if (input.pathname === "/inventory") {
    return createContext(input, {
      key: "inventory",
      title: "Inventory",
      sessionNamespace: "page-inventory",
      summary:
        "Inventory control view for stock levels, low-stock alerts, threshold health, and operational replenishment.",
      placeholder:
        "Ask which SKUs need urgent attention, what to reorder first, or where thresholds look off...",
      focusAreas: ["Low stock risk", "Threshold quality", "Replenishment priorities"],
      quickActions: [
        action(
          "inventory-triage",
          "Triage stockouts",
          "Prioritize urgent replenishment.",
          "Review the current inventory page and tell me which stock issues should be handled first and why.",
        ),
        action(
          "inventory-thresholds",
          "Check thresholds",
          "Look for inventory settings that need adjustment.",
          "Assess whether the current inventory thresholds look sensible and recommend any changes.",
        ),
        action(
          "inventory-plan",
          "Replenishment plan",
          "Turn the page into a restock plan.",
          "Create a short replenishment plan from the current inventory view, including urgent and medium-priority actions.",
        ),
      ],
    });
  }

  if (input.pathname === "/analytics") {
    return createContext(input, {
      key: "analytics",
      title: "Analytics",
      sessionNamespace: "page-analytics",
      summary:
        "Performance analytics workspace for revenue, orders, traffic, and product contribution trends.",
      placeholder:
        "Ask what changed in the charts, what the strongest trend is, or where to dig deeper...",
      focusAreas: ["Trend interpretation", "Channel performance", "Revenue drivers"],
      quickActions: [
        action(
          "analytics-trends",
          "Explain trends",
          "Turn this dashboard into a plain-English narrative.",
          "Explain the most important trends and inflection points visible on the analytics page.",
        ),
        action(
          "analytics-opps",
          "Find opportunities",
          "Look for upside in the current data.",
          "Identify the most promising growth opportunities from the analytics page and explain the evidence.",
        ),
        action(
          "analytics-risks",
          "Flag risks",
          "Surface weak spots before they worsen.",
          "Review the analytics context and call out the biggest risks or underperforming areas that need follow-up.",
        ),
      ],
    });
  }

  if (input.pathname === "/returns") {
    return createContext(input, {
      key: "returns",
      title: "Returns",
      sessionNamespace: "page-returns",
      summary:
        "Returns and refund operations view for spotting approval bottlenecks, high-return patterns, and cost leakage.",
      placeholder:
        "Ask why returns are rising, which cases deserve escalation, or how to reduce refund leakage...",
      focusAreas: ["Return reasons", "Approval backlog", "Refund leakage"],
      quickActions: [
        action(
          "returns-hotspots",
          "Find hotspots",
          "Surface the biggest return problems.",
          "Review the returns page and identify the biggest hotspots or patterns causing avoidable returns.",
        ),
        action(
          "returns-backlog",
          "Clear backlog",
          "Prioritize the queue.",
          "Recommend how to prioritize the current returns queue to reduce customer pain and refund delays.",
        ),
        action(
          "returns-prevention",
          "Prevent repeats",
          "Translate the returns view into prevention ideas.",
          "Suggest the best operational or merchandising changes to reduce the return issues visible on this page.",
        ),
      ],
    });
  }

  if (input.pathname === "/marketing") {
    return createContext(input, {
      key: "marketing",
      title: "Marketing",
      sessionNamespace: "page-marketing",
      summary:
        "Campaign and coupon performance view for evaluating revenue contribution and allocation quality.",
      placeholder:
        "Ask which campaigns deserve more budget, where discounts are leaking margin, or what to pause...",
      focusAreas: ["Campaign ROI", "Coupon effectiveness", "Budget reallocation"],
      quickActions: [
        action(
          "marketing-roi",
          "Evaluate ROI",
          "Decide where marketing spend should move.",
          "Analyze the marketing page and recommend which campaigns or offers deserve more or less investment.",
        ),
        action(
          "marketing-margin",
          "Protect margin",
          "Look for costly promotions.",
          "Review the current marketing context for promotions or campaigns that may be hurting margin disproportionately.",
        ),
        action(
          "marketing-next-move",
          "Next move",
          "Turn the page into a short plan.",
          "Recommend the next three marketing actions based on the current performance shown on this page.",
        ),
      ],
    });
  }

  if (input.pathname === "/support") {
    return createContext(input, {
      key: "support",
      title: "Support",
      sessionNamespace: "page-support",
      summary:
        "Support operations view for tracking ticket backlog, response performance, and escalation needs.",
      placeholder:
        "Ask where support is slipping, what to escalate, or how to improve response time...",
      focusAreas: ["Ticket backlog", "Escalations", "Response-time risk"],
      quickActions: [
        action(
          "support-triage",
          "Triage tickets",
          "Prioritize the support queue.",
          "Analyze the support page and recommend how the current ticket queue should be triaged.",
        ),
        action(
          "support-escalations",
          "Escalate wisely",
          "Find the cases most likely to go wrong.",
          "Identify which visible support issues are most likely to require escalation and why.",
        ),
        action(
          "support-ops",
          "Improve ops",
          "Reduce future support pressure.",
          "Suggest operational fixes that would reduce the support pain points implied by this page.",
        ),
      ],
    });
  }

  if (input.pathname === "/shipping") {
    return createContext(input, {
      key: "shipping",
      title: "Shipping",
      sessionNamespace: "page-shipping",
      summary:
        "Shipping operations view for monitoring delivery progress, delays, and carrier performance.",
      placeholder:
        "Ask about delivery risk, delay clusters, or which shipments need intervention...",
      focusAreas: ["Delivery delay", "Carrier issues", "Intervention priority"],
      quickActions: [
        action(
          "shipping-delays",
          "Review delays",
          "Find the biggest shipping problems.",
          "Analyze the shipping page and explain the most important delay or delivery risks to address.",
        ),
        action(
          "shipping-carrier",
          "Assess carriers",
          "Spot weak carrier performance.",
          "Review the current shipping context and identify any carrier or workflow weaknesses that deserve attention.",
        ),
        action(
          "shipping-actions",
          "Intervention plan",
          "Turn the shipment view into actions.",
          "Recommend the next operational actions to reduce customer pain from the shipping issues visible here.",
        ),
      ],
    });
  }

  if (input.pathname === "/reviews") {
    return createContext(input, {
      key: "reviews",
      title: "Reviews",
      sessionNamespace: "page-reviews",
      summary:
        "Review moderation and sentiment view for spotting product issues and reputation opportunities.",
      placeholder:
        "Ask what the reviews imply, which issues to fix, or how to respond to sentiment trends...",
      focusAreas: ["Sentiment issues", "Moderation priority", "Product quality signals"],
      quickActions: [
        action(
          "reviews-sentiment",
          "Read sentiment",
          "Summarize what customers are signaling.",
          "Review the current reviews context and summarize the strongest sentiment patterns or complaints.",
        ),
        action(
          "reviews-product-issues",
          "Find product issues",
          "Translate reviews into corrective action.",
          "Identify which product or experience issues are most likely driving the review patterns on this page.",
        ),
        action(
          "reviews-response",
          "Plan response",
          "Recommend follow-up actions.",
          "Recommend the next actions for moderation, product, or support based on the reviews visible here.",
        ),
      ],
    });
  }

  if (input.pathname === "/categories") {
    return createContext(input, {
      key: "categories",
      title: "Categories",
      sessionNamespace: "page-categories",
      summary:
        "Category management view for assortment structure, empty categories, and product linkage quality.",
      placeholder:
        "Ask where category structure is weak, what to clean up, or how to improve merchandising logic...",
      focusAreas: ["Category hygiene", "Assortment structure", "Empty category cleanup"],
      quickActions: [
        action(
          "categories-cleanup",
          "Clean structure",
          "Find category issues worth fixing.",
          "Analyze the category page and identify the structural issues or empty states that should be cleaned up first.",
        ),
        action(
          "categories-merch",
          "Improve taxonomy",
          "Recommend a stronger assortment structure.",
          "Suggest category and taxonomy improvements that would make the catalog easier to browse and manage.",
        ),
        action(
          "categories-priority",
          "Set priorities",
          "Turn the page into a short backlog.",
          "Recommend the highest-priority category management actions from the current page context.",
        ),
      ],
    });
  }

  if (input.pathname === "/activity-logs") {
    return createContext(input, {
      key: "activity-logs",
      title: "Activity Logs",
      sessionNamespace: "page-activity-logs",
      summary:
        "Operational audit trail for tracing user actions, system events, and unusual activity.",
      placeholder:
        "Ask what looks suspicious, what changed recently, or how to summarize notable activity...",
      focusAreas: ["Audit trail review", "Operational anomalies", "Security signals"],
      quickActions: [
        action(
          "logs-anomalies",
          "Find anomalies",
          "Surface unusual activity patterns.",
          "Analyze the activity logs page and call out unusual, suspicious, or operationally important events.",
        ),
        action(
          "logs-summary",
          "Summarize activity",
          "Turn the logs into a short incident brief.",
          "Summarize the most important recent activity from this page into a concise operator brief.",
        ),
        action(
          "logs-follow-up",
          "Recommend follow-up",
          "Decide what deserves investigation.",
          "Recommend which events or patterns on this activity page deserve follow-up and why.",
        ),
      ],
    });
  }

  if (input.pathname === "/settings") {
    return createContext(input, {
      key: "settings",
      title: "Settings",
      sessionNamespace: "page-settings",
      summary:
        "Admin configuration surface for adjusting behavior, guardrails, and store preferences.",
      placeholder:
        "Ask what to verify before changing settings, where misconfiguration risk is highest, or how to roll out safely...",
      focusAreas: ["Configuration safety", "Change impact", "Rollout hygiene"],
      quickActions: [
        action(
          "settings-check",
          "Safety check",
          "Reduce misconfiguration risk.",
          "Review this settings surface and tell me what should be verified before making changes.",
        ),
        action(
          "settings-impact",
          "Assess impact",
          "Understand what a change could affect.",
          "Explain the likely operational impact areas I should think about before changing settings on this page.",
        ),
        action(
          "settings-rollout",
          "Plan rollout",
          "Apply settings changes carefully.",
          "Suggest a safe rollout checklist for configuration changes made from this settings page.",
        ),
      ],
    });
  }

  if (input.pathname === "/profile") {
    return createContext(input, {
      key: "profile",
      title: "Profile",
      sessionNamespace: "page-profile",
      summary:
        "Personal admin profile surface for account details, preferences, and account hygiene.",
      placeholder:
        "Ask what to verify, how to keep the profile secure, or what setup is missing...",
      focusAreas: ["Account hygiene", "Security posture", "Preference completeness"],
      quickActions: [
        action(
          "profile-security",
          "Security check",
          "Verify account hygiene.",
          "Review the profile context and suggest the most important account security or hygiene checks to make.",
        ),
        action(
          "profile-completeness",
          "Check setup",
          "Spot missing profile details.",
          "Identify what profile details or preferences should be completed or verified on this page.",
        ),
        action(
          "profile-summary",
          "Summarize tasks",
          "Turn the page into a quick checklist.",
          "Create a short checklist of actions I should complete from this profile page.",
        ),
      ],
    });
  }

  return null;
};

export const buildContextualPrompt = (
  context: AIResolvedPageContext,
  userPrompt: string,
): string => {
  const focusAreas = context.focusAreas.join("; ");
  const taskFamilies = context.quickActions.map((item) => item.label).join("; ");

  return [
    "[SHOPSWIFT_CONTEXT]",
    "mode=contextual_admin_copilot",
    `page_key=${context.key}`,
    `page_title=${context.title}`,
    `route=${context.route}`,
    `page_summary=${context.summary}`,
    `focus_areas=${focusAreas}`,
    `task_families=${taskFamilies}`,
    "[/SHOPSWIFT_CONTEXT]",
    "",
    "Instructions:",
    "1. Stay grounded in the current admin page and prioritize page-specific actions.",
    "2. Use the most relevant tools for this page when evidence is needed.",
    "3. If the request requires data outside this surface, say so clearly.",
    "4. Keep the answer concise, operational, and immediately actionable.",
    "",
    `User request: ${userPrompt}`,
  ].join("\n");
};
