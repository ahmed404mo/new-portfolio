import { defaultLocale, localeContent } from "@/lib/i18n"
import {
  LOGO_DOT_COLOR,
  LOGO_DOT_PATH,
  LOGO_PATH,
  LOGO_VIEWBOX,
} from "@/lib/logo"
import { siteConfig } from "@/lib/site"

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_VIEWBOX}"><path d="${LOGO_PATH}" fill="#F1E9EB"/><path d="${LOGO_DOT_PATH}" fill="${LOGO_DOT_COLOR}"/></svg>`

const LOGO_SRC = `data:image/svg+xml;base64,${btoa(LOGO_SVG)}`

export default function OgImage() {
  const content = localeContent[defaultLocale]
  const host = siteConfig.url.replace(/^https?:\/\//, "")

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0D0709",
        padding: "64px 72px",
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -240,
          right: -160,
          width: 660,
          height: 660,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(224,112,127,0.26) 0%, rgba(13,7,9,0) 68%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -300,
          left: -200,
          width: 680,
          height: 680,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(163,38,63,0.32) 0%, rgba(13,7,9,0) 70%)",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <img
          src={LOGO_SRC}
          alt=""
          width={260}
          height={100}
          style={{ width: 260, height: 100 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            borderLeft: "1px solid rgba(241,233,235,0.14)",
            paddingLeft: 28,
          }}
        >
          <span style={{ fontSize: 28, color: "#F1E9EB", fontWeight: 700 }}>
            {siteConfig.name}
          </span>
          <span style={{ fontSize: 18, color: "#9A8B8E" }}>
            Portfolio · {host}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <span
          style={{
            fontSize: 72,
            lineHeight: 1.05,
            color: "#F1E9EB",
            fontWeight: 800,
            letterSpacing: -2,
            maxWidth: 980,
          }}
        >
          Full Stack Software Engineer
        </span>
        <span style={{ fontSize: 30, color: "#E0707F", fontWeight: 600 }}>
          MERN · Next.js · React · Node.js
        </span>
        <span
          style={{
            fontSize: 23,
            color: "#9A8B8E",
            lineHeight: 1.45,
            maxWidth: 900,
          }}
        >
          {content.shortDescription}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(241,233,235,0.14)",
          paddingTop: 24,
        }}
      >
        <span style={{ fontSize: 20, color: "#9A8B8E" }}>
          {siteConfig.email}
        </span>
        <span style={{ fontSize: 20, color: "#E0707F", fontWeight: 600 }}>
          GitHub · LinkedIn · Facebook
        </span>
      </div>
    </div>
  )
}
