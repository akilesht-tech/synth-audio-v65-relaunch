const url = String(process.env.SYNTH_PUBLIC_SERVER_URL || '').trim();
const config = {
  appId: 'com.synthaudio.app',
  appName: 'SYNTH AUDIO',
  webDir: 'public'
};
if(url){
  config.server = {url, cleartext: /^http:\/\//i.test(url)};
}
module.exports = config;
