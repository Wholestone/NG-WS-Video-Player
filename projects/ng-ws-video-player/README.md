# NgWsVideoPlayer

This Video Player is a customizable video player component for Angular 17 applications. It provides a rich set of features and controls for playback, including timeline scrubbing, volume control, playback speed adjustment, and more.

## Features

- Playback speed adjustment
- Full-screen mode 
- Theater mode
- Mini-player mode
- Captions support
- Keyboard shortcuts for various controls
- Customization

## Keyboard Shortcuts

- Space / K - Play/Pause
- F - Toggle full-screen mode
- T - Toggle theater mode
- I - Toggle mini-player mode
- M - Toggle mute
- Left Arrow / J - Seek backward (5 seconds)
- Right Arrow / L - Seek forward (5 seconds)
- C - Toggle captions

## Usage

```angular17html
<ng-ws-video-player
    [videoSrc]="'path/to/your/video.mp4'"
    [captionSrc]="'path/to/your/captions.vtt'"
    [captionLangLabel]="'English'"
    [captionSrcLang]="'en'"
    [videoPlayerClassesToAdd]="'class1 class2 class3'"
    [videoContainerClassesToAdd]="'class1 class2 class3'"
    [videoAccentColor]="'#ff0000'"
/>
```
## Inputs

The component accepts the following inputs:

| Input | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `videoSrc` | string | Yes | '' | Path to the video file |
| `captionSrc` | string | No | '' | Path to the captions file |
| `captionLangLabel` | string | No | 'English' | Label for the caption language |
| `captionSrcLang` | string | No | 'en' | Source language code for captions |
| `videoPlayerClassesToAdd` | string | No | '' | Additional classes to add to the video player element |
| `videoContainerClassesToAdd` | string | No | '' | Additional classes to add to the video container |
| `videoAccentColor` | string | No | '' | Accent color for the video player controls |

## Customization
You can customize the appearance of the video player by modifying the provided SCSS file or overriding the CSS classes in your application.
Dependencies
This component is designed for Angular and uses Angular's built-in features. Make sure you have Angular installed in your project.

## Installation

1. Install the component in your Angular project:

```bash
npm i ng-ws-video-player
```

2. Install the whole library, and it will come with it:

```bash
npm i ng-ws-ui
```
