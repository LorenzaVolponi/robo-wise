import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Older versions of iOS Safari only support addListener/removeListener.
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange)
    } else {
      mql.addListener(onChange)
    }

    // Update on initial load and on resize/orientation changes.
    onChange()
    window.addEventListener("resize", onChange)

    return () => {
      if (typeof mql.removeEventListener === "function") {
        mql.removeEventListener("change", onChange)
      } else {
        mql.removeListener(onChange)
      }
      window.removeEventListener("resize", onChange)
    }
  }, [])

  return !!isMobile
}
