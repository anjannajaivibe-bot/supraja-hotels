const MOBILE_OR_TABLET_RE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i;

export function isMobileOrTabletUserAgent(userAgent: string | null | undefined) {
  return MOBILE_OR_TABLET_RE.test(userAgent ?? "");
}
