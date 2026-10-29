import { ImageResponse } from "next/og"
import OgImage from "@/components/seo/og-image"
import {
  OG_IMAGE_ALT,
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
} from "@/lib/seo"

export const alt = OG_IMAGE_ALT
export const size = OG_IMAGE_SIZE
export const contentType = OG_IMAGE_CONTENT_TYPE

export default function Image() {
  return new ImageResponse(<OgImage />, { ...OG_IMAGE_SIZE })
}
