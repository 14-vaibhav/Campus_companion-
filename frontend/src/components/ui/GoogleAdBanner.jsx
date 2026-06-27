import { useEffect, useRef, useState } from 'react';

/**
 * GoogleAdBanner
 * 
 * Props:
 *   slot       – Your AdSense ad unit slot ID  (e.g. "1234567890")
 *   format     – "auto" | "rectangle" | "horizontal" (default: "auto")
 *   responsive – true/false (default: true)
 *   style      – override wrapper styles
 * 
 * To activate:
 *   1. Replace ca-pub-XXXXXXXXXXXXXXXX in index.html with your Publisher ID
 *   2. Pass your slot ID as the `slot` prop
 *   3. Make sure your site is approved on adsense.google.com
 */
export default function GoogleAdBanner({
  slot = '0000000000',
  format = 'auto',
  responsive = true,
  style = {},
}) {
  const adRef = useRef(null);
  const pushed = useRef(false);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    // Detect placeholder vs real AdSense
    const script = document.querySelector('script[src*="pagead2"]');
    const hasRealId = script?.src?.includes('ca-pub-') && !script?.src?.includes('XXXXXXXX');
    setIsDev(!hasRealId);

    if (hasRealId && !pushed.current) {
      try {
        // eslint-disable-next-line no-undef
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch { /* silent */ }
    }
  }, []);

  if (isDev) {
    // Beautiful dev placeholder — shows exactly where/how the ad will appear
    return (
      <div style={{
        borderRadius: 'var(--radius-lg)',
        border: '1.5px dashed var(--color-outline-variant)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(244,250,253,0.8) 100%)',
        backdropFilter: 'blur(8px)',
        padding: '14px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        minHeight: 80,
        ...style,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #4285f4, #34a853)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="white"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-on-surface)' }}>
              Google Ads Slot
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-outline)', marginTop: 1 }}>
              Add your Publisher ID in <code style={{ fontSize: 11, background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: 4 }}>index.html</code> to activate
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
            padding: '3px 8px', borderRadius: 99,
            background: 'rgba(66,133,244,0.12)', color: '#4285f4',
          }}>Ad</span>
          <span style={{ fontSize: 11, color: 'var(--color-outline)' }}>320×100</span>
        </div>
      </div>
    );
  }

  // Real AdSense unit
  return (
    <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-lg)', ...style }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
