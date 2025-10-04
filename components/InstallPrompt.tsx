import React, { useEffect, useState } from 'react';

/**
 * A component that provides a custom user interface for installing the PWA.
 * It listens for the `beforeinstallprompt` event, which is fired by the browser
 * when the app is installable. It then displays a custom button to trigger the
 * installation prompt at a time controlled by the application.
 * After a successful installation, it attempts to put the app into fullscreen mode.
 *
 * @returns {JSX.Element | null} A button to trigger the PWA install prompt, or null if the prompt is not available.
 */
const InstallPrompt: React.FC = () => {
  const [deferred, setDeferred] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const ready = (e: any) => {
      e.preventDefault();
      setDeferred(e);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', ready);
    return () => window.removeEventListener('beforeinstallprompt', ready);
  }, []);

  const handleInstall = async () => {
    if (!deferred) return;
    setVisible(false);
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === 'accepted') {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    }
    setDeferred(null);
  };

  if (!visible) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-neo-dark-2 text-white px-4 py-2 rounded shadow-lg z-50">
      <button onClick={handleInstall}>نصب برنامه</button>
    </div>
  );
};

export default InstallPrompt;
