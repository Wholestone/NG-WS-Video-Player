import { Injectable } from '@angular/core';

import { NgWsVideoPlayerComponent } from "./ng-ws-video-player.component";

@Injectable({
  providedIn: 'root'
})
export class NgWsVideoPlayerService {
  /** @desc Video duration formatter */
  public formatDuration(time: number): string {
    const seconds: number = Math.floor(time % 60);
    const minutes: number = Math.floor(time / 60) % 60;
    const hours: number = Math.floor(time / 3600);
    const leadingZeroFormatter: Intl.NumberFormat = new Intl.NumberFormat('en-US', {
      minimumIntegerDigits: 2,
    });

    if (hours === 0) {
      return `${ minutes }:${ leadingZeroFormatter.format(seconds) }`;
    } else {
      return `${ hours }:${ leadingZeroFormatter.format(
        minutes
      ) }:${ leadingZeroFormatter.format(seconds) }`;
    }
  }

  /** @desc Updates video progress bar */
  public timelineUpdateHandler(
    timelineContainer: HTMLDivElement,
    isScrubbing: boolean,
    e: MouseEvent
  ): void {
    const rect = timelineContainer.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

    if (isScrubbing) {
      e.preventDefault()
      timelineContainer.style.setProperty("--progress-position", String(percent));
    }
  }

  /** @desc Video controls functionality */
  public skipTime(videoPlayer: HTMLVideoElement, duration: number): void {
    videoPlayer.currentTime += duration;
  }

  public togglePlay(videoPlayer: HTMLVideoElement): void {
    videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause();
  }

  public toggleFullScreenMode(videoContainer: HTMLDivElement): void {
    if (document.fullscreenElement == null) {
      videoContainer.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  public toggleTheaterMode(videoContainer: HTMLDivElement): void {
    if (document.fullscreenElement !== null) {
      return;
    }

    videoContainer.classList.toggle("theater");
  }

  public toggleMiniPlayerMode(videoContainer: HTMLDivElement, videoPlayer: HTMLVideoElement): void {
    if (document.fullscreenElement !== null) {
      return;
    }

    if (videoContainer.classList.contains("mini-player")) {
      document.exitPictureInPicture();
    } else {
      videoPlayer.requestPictureInPicture();
    }
  }

  public toggleCaptions(videoContainer: HTMLDivElement, videoPlayer: HTMLVideoElement): void {
    const captions = videoPlayer.textTracks[0];

    if (captions.mode === 'disabled' || captions.mode === 'hidden') {
      captions.mode = 'showing';
    } else {
      captions.mode = 'hidden';
    }

    const isActive: boolean = captions.mode === "showing";
    videoContainer.classList.toggle("captions", isActive);
  }

  public changePlaybackSpeed(videoPlayer: HTMLVideoElement, speedBtn: HTMLButtonElement): void {
    let newPlaybackRate: number = videoPlayer.playbackRate + 0.25;

    if (newPlaybackRate > 2) {
      newPlaybackRate = 0.25;
    }

    videoPlayer.playbackRate = newPlaybackRate;
    speedBtn.textContent = `${ newPlaybackRate }x`;
  }

  public togglePlayPauseIcon(videoContainer: HTMLDivElement, playingStatus: 'play' | 'pause'): void {
    playingStatus === 'play' ?
      videoContainer.classList.remove('paused') :
      videoContainer.classList.add('paused');
  }

  public toggleMute(
    videoContainer: HTMLDivElement,
    videoPlayer: HTMLVideoElement,
    volumeSlider: HTMLInputElement
  ): void {
    videoPlayer.muted = !videoPlayer.muted;

    const volumeLevel: string = videoPlayer.muted ? 'muted' : 'high';
    volumeSlider.value = videoPlayer.muted ? '0' : '1';
    videoContainer.dataset['volumeLevel'] = volumeLevel;
  }

  public toggleScrubbing(
    timelineContainer: HTMLDivElement,
    videoContainer: HTMLDivElement,
    videoPlayer: HTMLVideoElement,
    e: MouseEvent
  ): void {
    const rect = timelineContainer.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

    NgWsVideoPlayerComponent.isScrubbing = (e.buttons & 1) === 1;
    videoContainer.classList.toggle("scrubbing", NgWsVideoPlayerComponent.isScrubbing);

    if (NgWsVideoPlayerComponent.isScrubbing) {
      NgWsVideoPlayerComponent.wasPaused = videoPlayer.paused;
      videoPlayer.pause();
    } else {
      videoPlayer.currentTime = percent * videoPlayer.duration;
      if (!NgWsVideoPlayerComponent.wasPaused) {
        videoPlayer.play();
      }
    }
  }

  /** @desc Volume change handlers */
  public onVolumeInput(videoPlayer: HTMLVideoElement, e: Event): void {
    videoPlayer.volume = +(e.target as HTMLInputElement).value;
    videoPlayer.muted = +(e.target as HTMLInputElement).value === 0;
  }

  public onVolumeChange(
    videoContainer: HTMLDivElement,
    videoPlayer: HTMLVideoElement,
    volumeSlider: HTMLInputElement,
    e: Event
  ): void {
    volumeSlider.value = (e.target as HTMLInputElement).value;
    videoPlayer.volume = +volumeSlider.value;

    let volumeLevel: string = '';

    if (videoPlayer.muted || videoPlayer.volume === 0) {
      volumeSlider.value = '0';
      volumeLevel = "muted";
    } else if (videoPlayer.volume >= 0.5) {
      volumeLevel = "high";
    } else {
      volumeLevel = "low";
    }

    videoContainer.dataset['volumeLevel'] = volumeLevel;
  }
}
