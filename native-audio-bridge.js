(() => {
  function tryRegisterBridge() {
    try {
      const cap = window.Capacitor;
      if (!cap || typeof cap.registerPlugin !== 'function' || !cap.isNativePlatform?.()) return false;
      const plugin = cap.registerPlugin('AudioPlayer');
      if (plugin) {
        window.SYNTH_NATIVE_AUDIO = plugin;
        return true;
      }
    } catch (e) {
      console.error('SYNTH AUDIO native audio bridge initialization failed', e);
    }
    return false;
  }
  if (!tryRegisterBridge()) {
    window.addEventListener('DOMContentLoaded', tryRegisterBridge, { once: true });
    document.addEventListener('deviceready', tryRegisterBridge, { once: true });
  }
})();
