# SYNTH AUDIO V65 — clean playback repair build

This build is based on the complete V62 application tree and was rebuilt as a clean V65 submission. It does not use a simplified replacement app.

## Playback repairs
- Unified immediate pointer/click touch activation for song rows and cards.
- Preserved independent Favorite, Download, and More buttons.
- Automatic next-track transition keeps the mini-player mounted and synchronized.
- Browser Media Session metadata/actions remain enabled.
- Native Android playback now explicitly enables background music/notification playback.
- Added a real Fast Sync action that reads the active playback engine state and synchronizes Media Session + player UI.
- Recently Played and song templates contain no track-number markup; no CSS hiding workaround is used.
- Existing playlists, downloads/offline playback, favorites, queue, admin, display name, mini-player, and native bridge are preserved.
- Entry animations and reduced-motion support are retained.

## Run
```cmd
npm install
npm start
```
Then open `http://localhost:3000/`.

For mobile on the same Wi-Fi, use the laptop LAN address, for example `http://10.90.82.78:3000/`.
