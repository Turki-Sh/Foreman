/* eslint-disable @remotion/no-background-image -- Specular images are synchronous generated data URLs, with no network loading. */
// Adapted from LeonardSEO/liquid-glass-react (MIT); see LICENSE.
import {
  type CSSProperties,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  Children,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  buildDisplacementMap,
  buildInteriorMask,
  buildSpecularMap,
  imageDataToUrl,
  type SurfaceProfile,
} from "./maps"

export type LiquidGlassProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode
  /** Corner radius in px. Use a large value (e.g. 999) for a pill/circle. */
  radius?: number
  /** Width of the curved, light-bending rim in px. Default: derived from the element size. */
  bezel?: number
  /** Glass height in px - higher = stronger refraction at the rim. Default: 1.5 x bezel. */
  thickness?: number
  /** Glass tint: "light", "dark", or any CSS color. */
  tint?: "light" | "dark" | (string & {})
  /** Index of refraction (glass ≈ 1.5). */
  ior?: number
  /** Rim surface profile. Apple uses a squircle. */
  profile?: SurfaceProfile
  /** Extra multiplier on the physical refraction strength. */
  refraction?: number
  /** Chromatic dispersion: fraction of extra/less bend for red/blue. 0 disables. */
  dispersion?: number
  /** Frost blur of the backdrop in px. 0 = perfectly clear glass. */
  blur?: number
  /** Backdrop saturation multiplier. */
  saturation?: number
  /** Specular rim strength 0..1. */
  specular?: number
  /** Light direction for the specular rim, degrees (-90 = top, -135 = top-left). */
  lightAngle?: number
  /** Press-to-grow + touch glow, like iOS controls. */
  interactive?: boolean
}

// useLayoutEffect warns during SSR on React 18; fall back to useEffect there.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

let chromiumCache: boolean | undefined
function supportsSvgBackdrop(): boolean {
  if (chromiumCache !== undefined) return chromiumCache
  if (typeof navigator === "undefined") return false
  const ua = navigator.userAgent
  // Only Blink renders SVG filters referenced from backdrop-filter. WebKit
  // (Safari, and every iOS browser - CriOS/FxiOS) and Gecko do not.
  chromiumCache = /Chrome\/\d+/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)
  return chromiumCache
}

const mapCache = new Map<string, Maps>()

type Maps = { displacement: string; specular: string; mask: string; scale: number; width: number; height: number }

export function LiquidGlass({
  children,
  radius = 32,
  bezel: bezelProp,
  thickness: thicknessProp,
  tint = "light",
  ior = 1.5,
  profile = "squircle",
  refraction = 1,
  dispersion = 0.025,
  blur = 1.4,
  saturation = 1.25,
  specular = 1,
  lightAngle = -135,
  interactive = false,
  className,
  style,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
  ...rest
}: LiquidGlassProps) {
  const ref = useRef<HTMLDivElement>(null)
  const filterId = "lg-" + useId().replace(/[^a-zA-Z0-9_-]/g, "")
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  const [svgSupported, setSvgSupported] = useState(false)
  const [pressed, setPressed] = useState(false)

  useIsoLayoutEffect(() => {
    setSvgSupported(supportsSvgBackdrop())
    const el = ref.current
    if (!el) return
    const update = (w: number, h: number) => {
      w = Math.round(w)
      h = Math.round(h)
      setSize((s) => (s && s.w === w && s.h === h ? s : { w, h }))
    }
    // Measure synchronously so the filter exists on first paint (and in
    // background tabs, where ResizeObserver may not fire until visible).
    const measure = () => update(el.offsetWidth, el.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el, { box: "border-box" })
    return () => ro.disconnect()
  }, [])

  const maps = useMemo<Maps | null>(() => {
    if (!size || size.w < 2 || size.h < 2) return null
    const minSide = Math.min(size.w, size.h)
    // Apple's rim is roughly a quarter of the short side, capped for big panels.
    const bezel = bezelProp ?? Math.max(6, Math.min(minSide * 0.25, Math.min(radius, minSide / 2), 56))
    const thickness = thicknessProp ?? bezel * 1.5
    const dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1)
    const key = [size.w, size.h, radius, bezel, thickness, ior, profile, lightAngle, dpr].join("|")
    let base = mapCache.get(key)
    if (!base) {
      const shape = { width: size.w, height: size.h, radius }
      const disp = buildDisplacementMap(shape, { bezel, thickness, ior, profile })
      const spec = buildSpecularMap(shape, { angle: lightAngle, rimWidth: 1.2, glowWidth: Math.min(20, Math.max(4, bezel * 0.6)) }, dpr)
      base = {
        displacement: imageDataToUrl(disp),
        specular: imageDataToUrl(spec),
        mask: imageDataToUrl(buildInteriorMask(shape, bezel, 1)),
        scale: disp.scale,
        width: disp.width,
        height: disp.height,
      }
      mapCache.set(key, base)
      // Small LRU: identical controls (buttons, pills) share one set of maps.
      if (mapCache.size > 64) mapCache.delete(mapCache.keys().next().value!)
    }
    return { ...base, scale: base.scale * refraction }
  }, [size, radius, bezelProp, thicknessProp, ior, profile, refraction, lightAngle])

  const setPointer = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--lg-px", `${((e.clientX - r.left) / r.width) * 100}%`)
    el.style.setProperty("--lg-py", `${((e.clientY - r.top) / r.height) * 100}%`)
  }, [])

  const useSvg = svgSupported && maps !== null
  const backdrop = useSvg
    ? `blur(${blur}px) url(#${filterId}) saturate(${saturation}) brightness(1.04)`
    : `blur(${Math.max(blur, 8)}px) saturate(${saturation}) brightness(1.05)`

  const s = maps?.scale ?? 0
  const rootStyle = {
    ...style,
    borderRadius: radius,
    "--lg-specular-opacity": specular,
    ...(tint !== "light" && tint !== "dark" ? { "--lg-tint": tint } : null),
    // backdrop-filter lives on the root on purpose: children that use
    // mix-blend-mode turn their parent into a "backdrop root", so a
    // backdrop-filter on a child layer would only see an empty backdrop.
    backdropFilter: backdrop,
    WebkitBackdropFilter: backdrop,
  } as CSSProperties

  return (
    <div
      ref={ref}
      className={["lg", tint === "dark" && "lg--dark", interactive && "lg--interactive", pressed && "lg--pressed", !useSvg && "lg--fallback", className]
        .filter(Boolean)
        .join(" ")}
      style={rootStyle}
      onPointerDown={(e) => {
        if (interactive) {
          setPointer(e)
          setPressed(true)
        }
        onPointerDown?.(e)
      }}
      onPointerMove={(e) => {
        if (interactive) setPointer(e)
        onPointerMove?.(e)
      }}
      onPointerUp={(e) => {
        setPressed(false)
        onPointerUp?.(e)
      }}
      onPointerLeave={(e) => {
        setPressed(false)
        onPointerLeave?.(e)
      }}
      onPointerCancel={(e) => {
        setPressed(false)
        onPointerCancel?.(e)
      }}
      {...rest}
    >
      <div
        className="lg__tint"
        style={maps ? { maskImage: `url(${maps.mask})`, WebkitMaskImage: `url(${maps.mask})` } : undefined}
      />
      {maps && <div className="lg__specular" style={{ backgroundImage: `url(${maps.specular})` }} />}
      <div className="lg__glow" />
      <div className="lg__content">{Children.map(children, child => typeof child === "string" || typeof child === "number" ? <span>{child}</span> : child)}</div>

      {useSvg && maps && (
        <svg className="lg__defs" aria-hidden="true" focusable="false" width="0" height="0">
          <filter
            id={filterId}
            x="0"
            y="0"
            width={maps.width}
            height={maps.height}
            filterUnits="userSpaceOnUse"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={maps.displacement}
              x="0"
              y="0"
              width={maps.width}
              height={maps.height}
              preserveAspectRatio="none"
              result="map"
            />
            {dispersion > 0 ? (
              <>
                <feDisplacementMap in="SourceGraphic" in2="map" scale={s * (1 + dispersion)} xChannelSelector="R" yChannelSelector="G" result="dispR" />
                <feColorMatrix in="dispR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
                <feDisplacementMap in="SourceGraphic" in2="map" scale={s} xChannelSelector="R" yChannelSelector="G" result="dispG" />
                <feColorMatrix in="dispG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
                <feDisplacementMap in="SourceGraphic" in2="map" scale={s * (1 - dispersion)} xChannelSelector="R" yChannelSelector="G" result="dispB" />
                <feColorMatrix in="dispB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
                <feComposite in="r" in2="g" operator="arithmetic" k2="1" k3="1" result="rg" />
                <feComposite in="rg" in2="b" operator="arithmetic" k2="1" k3="1" />
              </>
            ) : (
              <feDisplacementMap in="SourceGraphic" in2="map" scale={s} xChannelSelector="R" yChannelSelector="G" />
            )}
          </filter>
        </svg>
      )}
    </div>
  )
}
