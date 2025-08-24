import React, { useEffect } from 'react';

const AdsenseComponent = ({ adSlot, adFormat = "auto", adClient }) => {
  useEffect(() => {
    // Load the AdSense script
    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    // Push the ad request
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }

    // Clean up the script when the component is unmounted
    return () => {
      document.body.removeChild(script);
    };
  }, [adClient]); // Re-run effect if adClient changes

  return (
    <div style={{ margin: '20px 0', textAlign: 'center' }}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdsenseComponent;