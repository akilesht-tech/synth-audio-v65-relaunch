// Native Capacitor routing. Set SYNTH_PUBLIC_SERVER_URL at build time or change synthServerUrl locally.
const currentOrigin = (typeof window !== 'undefined' && window.location?.origin && !window.location.origin.includes('localhost') && !window.location.origin.includes('capacitor://') && !window.location.origin.includes('127.0.0.1')) ? window.location.origin : 'https://synth-audio-v65.vercel.app';
window.SYNTH_SERVER_URL = window.SYNTH_PUBLIC_SERVER_URL || localStorage.getItem('synthServerUrl') || currentOrigin;
