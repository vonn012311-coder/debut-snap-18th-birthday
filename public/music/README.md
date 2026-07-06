# Background Music

Place your background music file here as `background.mp3`.

## How to add music:
1. Convert your preferred song to MP3 format
2. Name it `background.mp3`
3. Place it in this folder (`public/music/background.mp3`)
4. The music player will automatically appear in the bottom-right corner

## Recommended tools for conversion:
- [CloudConvert](https://cloudconvert.com/mp3-converter) (online, free)
- [Audacity](https://www.audacityteam.org/) (desktop app, free)
- FFmpeg: `ffmpeg -i input.m4a -codec:a libmp3lame -qscale:a 2 background.mp3`

## Recommended file size:
- Keep under 10MB for fast loading
- Use 128kbps bitrate for a good balance

## Disable music entirely:
In `config/event.config.ts`, set:
```typescript
features: {
  enableMusic: false,
}
```
