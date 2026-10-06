import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title") || "ShopSwift — Premium E-Commerce";
    const price = searchParams.get("price");
    const category = searchParams.get("category") || "Store";
    const badge = searchParams.get("badge") || "Fast & Free Delivery";
    const image = searchParams.get("image");

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#090d16",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, #1a2333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a2333 2%, transparent 0%), radial-gradient(circle at 90% 10%, rgba(99, 102, 241, 0.25) 0%, transparent 40%), radial-gradient(circle at 10% 90%, rgba(236, 72, 153, 0.2) 0%, transparent 40%)",
            backgroundSize: "100px 100px, 100px 100px, 100% 100%, 100% 100%",
            padding: "60px 70px",
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  boxShadow: "0 10px 25px rgba(99, 102, 241, 0.4)",
                }}
              >
                🛒
              </div>
              <span
                style={{
                  fontSize: "30px",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                ShopSwift
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 18px",
                borderRadius: "999px",
                background: "rgba(99, 102, 241, 0.15)",
                border: "1px solid rgba(99, 102, 241, 0.35)",
                fontSize: "16px",
                fontWeight: 600,
                color: "#a5b4fc",
              }}
            >
              {category.toUpperCase()}
            </div>
          </div>

          {/* Main Body */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "40px",
              margin: "auto 0",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                maxWidth: image ? "680px" : "1060px",
              }}
            >
              <div
                style={{
                  fontSize: title.length > 50 ? "46px" : "56px",
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                  color: "#f8fafc",
                }}
              >
                {title}
              </div>

              {price ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "16px",
                    marginTop: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "44px",
                      fontWeight: 800,
                      color: "#34d399",
                    }}
                  >
                    {price}
                  </span>
                  <span
                    style={{
                      fontSize: "18px",
                      color: "#94a3b8",
                      fontWeight: 500,
                    }}
                  >
                    Best Price Guaranteed
                  </span>
                </div>
              ) : null}
            </div>

            {image ? (
              <div
                style={{
                  display: "flex",
                  width: "280px",
                  height: "280px",
                  borderRadius: "24px",
                  overflow: "hidden",
                  border: "2px solid rgba(255, 255, 255, 0.12)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "24px",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#94a3b8",
                fontSize: "18px",
                fontWeight: 500,
              }}
            >
              <span>⚡</span>
              <span>{badge}</span>
            </div>

            <div
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#818cf8",
              }}
            >
              shopswift.vercel.app
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to generate OG image";
    return new Response(message, { status: 500 });
  }
}
