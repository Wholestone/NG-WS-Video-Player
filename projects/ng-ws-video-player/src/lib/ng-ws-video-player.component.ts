import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgClass, NgStyle } from "@angular/common";

import { NgWsVideoPlayerService } from "./ng-ws-video-player.service";

@Component({
  selector: 'ng-ws-video-player',
  standalone: true,
  imports: [NgClass, NgStyle],
  providers: [],
  templateUrl: './ng-ws-video-player.component.html',
  styleUrl: './ng-ws-video-player.component.scss'
})
export class NgWsVideoPlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  private _videoPlayerService: NgWsVideoPlayerService = inject(NgWsVideoPlayerService);

  /** @desc Getting Elements */
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoContainer') videoContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('timelineContainer') timelineContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('currentTimeEl') currentTimeElem!: ElementRef<HTMLDivElement>;
  @ViewChild('totalTimeEl') totalTimeElem!: ElementRef<HTMLDivElement>;
  @ViewChild('speedBtn') speedBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('volumeSlider') volumeSlider!: ElementRef<HTMLInputElement>;

  /** @desc Sources */
  @Input({required: true}) videoSrc: string = '';
  @Input() captionSrc: string = '';
  @Input() captionLangLabel: string = 'English';
  @Input() captionSrcLang: string = 'en';

  /** @desc Classes And Styling */
  @Input() videoPlayerClassesToAdd: string = '';
  @Input() videoContainerClassesToAdd: string = '';
  @Input() videoAccentColor: string = '';

  public static isScrubbing: boolean = false;
  public static wasPaused: boolean = false;

  ngOnInit(): void {
    this.addKeyboardEventsListener();
    this.addOnMouseUpScrubbingHandler();
    this.addOnMouseMoveScrubbingHandler();
  }

  ngAfterViewInit(): void {
    this.addFullScreenChangeListener();
  }

  ngOnDestroy(): void {
    this.removeKeyboardEventsListener();
    this.removeOnMouseUpScrubbingHandler();
    this.removeOnMouseMoveScrubbingHandler();
    this.removeFullScreenChangeListener();
  }

  /** @desc Adding dynamic CSS variable to use in stylesheet
   * (for styling ::after or ::before elements) */
  public setAccentColorVariableForCSS(): Record<string, string> {
    return {'--video-accent-color': this.videoAccentColor};
  }

  /** @desc Video Duration Handling */
  public onVideoDataLoaded(): void {
    this.totalTimeElem.nativeElement.textContent = this._videoPlayerService.formatDuration(this.videoPlayer.nativeElement.duration);
  }

  public onVideoTimeUpdate(): void {
    const videoPlayer: HTMLVideoElement = this.videoPlayer.nativeElement;
    const currentTimeElem: HTMLDivElement = this.currentTimeElem.nativeElement;
    const timelineContainer: HTMLDivElement = this.timelineContainer.nativeElement;

    currentTimeElem.textContent = this._videoPlayerService.formatDuration(videoPlayer.currentTime);
    const percent: number = videoPlayer.currentTime / videoPlayer.duration;
    timelineContainer.style.setProperty("--progress-position", String(percent));
  }

  /** @desc EventListener adders, removers and handlers */
  private FullScreenChangeHandler(): void {
    this.videoContainer.nativeElement.classList.toggle("full-screen", !!document.fullscreenElement);
  }

  public onPictureInPictureEnter(): void {
    this.videoContainer.nativeElement.classList.add("mini-player");
  }

  public onPictureInPictureLeave(): void {
    this.videoContainer.nativeElement.classList.remove("mini-player");
  }

  private addFullScreenChangeListener(): void {
    document.addEventListener("fullscreenchange", this.FullScreenChangeHandler.bind(this));
  }

  private removeFullScreenChangeListener(): void {
    document.removeEventListener("fullscreenchange", this.FullScreenChangeHandler.bind(this));
  }

  private addKeyboardEventsListener(): void {
    document.addEventListener('keydown', this.KeyboardEventsHandler.bind(this));
  }

  private removeKeyboardEventsListener(): void {
    document.removeEventListener('keydown', this.KeyboardEventsHandler.bind(this));
  }

  private KeyboardEventsHandler(e: KeyboardEvent): void {
    const tagName = document!.activeElement!.tagName.toLowerCase();

    if (tagName === 'input' || e.ctrlKey || e.metaKey || e.shiftKey) {
      return;
    }

    switch (e.key.toLowerCase()) {
      case " ":
        if (tagName === 'button') {
          return;
        }
        this.togglePlay();
        break;
      case "k":
        this.togglePlay();
        break
      case "f":
        this.toggleFullScreenMode();
        break
      case "t":
        this.toggleTheaterMode();
        break
      case "i":
        this.toggleMiniPlayerMode();
        break
      case "m":
        this.toggleMute();
        break
      case "arrowleft":
      case "j":
        this._videoPlayerService.skipTime(this.videoPlayer.nativeElement, -5);
        break
      case "arrowright":
      case "l":
        this._videoPlayerService.skipTime(this.videoPlayer.nativeElement, 5);
        break
      case "c":
        this.toggleCaptions();
        break
    }
  }

  private addOnMouseUpScrubbingHandler(): void {
    document.addEventListener('mouseup', this.ScrubbingOnMouseUpHandler.bind(this));
  }

  private removeOnMouseUpScrubbingHandler(): void {
    document.removeEventListener('mouseup', this.ScrubbingOnMouseUpHandler.bind(this));
  }

  private ScrubbingOnMouseUpHandler(e: MouseEvent): void {
    if (NgWsVideoPlayerComponent.isScrubbing) {
      this.toggleScrubbing(e);
    }
  }

  private addOnMouseMoveScrubbingHandler(): void {
    document.addEventListener('mousemove', this.ScrubbingOnMouseMoveHandler.bind(this));
  }

  private removeOnMouseMoveScrubbingHandler(): void {
    document.removeEventListener('mousemove', this.ScrubbingOnMouseMoveHandler.bind(this));
  }

  private ScrubbingOnMouseMoveHandler(e: MouseEvent): void {
    if (NgWsVideoPlayerComponent.isScrubbing) {
      this.timelineUpdateHandler(e);
    }
  }

  public timelineUpdateHandler(e: MouseEvent): void {
    this._videoPlayerService.timelineUpdateHandler(
      this.timelineContainer.nativeElement,
      NgWsVideoPlayerComponent.isScrubbing,
      e
    );
  }

  /** @desc VideoPlayer Controls */
  public toggleScrubbing(e: MouseEvent): void {
    this._videoPlayerService.toggleScrubbing(
      this.timelineContainer.nativeElement,
      this.videoContainer.nativeElement,
      this.videoPlayer.nativeElement,
      e
    );

    this.timelineUpdateHandler(e);
  }

  public togglePlay(): void {
    this._videoPlayerService.togglePlay(this.videoPlayer.nativeElement);
  }

  public toggleFullScreenMode(): void {
    this._videoPlayerService.toggleFullScreenMode(this.videoContainer.nativeElement);
  }

  public toggleTheaterMode(): void {
    this._videoPlayerService.toggleTheaterMode(this.videoContainer.nativeElement);
  }

  public toggleMiniPlayerMode(): void {
    this._videoPlayerService.toggleMiniPlayerMode(
      this.videoContainer.nativeElement,
      this.videoPlayer.nativeElement
    );
  }

  public toggleCaptions(): void {
    this._videoPlayerService.toggleCaptions(
      this.videoContainer.nativeElement,
      this.videoPlayer.nativeElement
    );
  }

  public changePlaybackSpeed(): void {
    this._videoPlayerService.changePlaybackSpeed(
      this.videoPlayer.nativeElement,
      this.speedBtn.nativeElement
    );
  }

  public togglePlayPauseIcon(playingStatus: 'play' | 'pause'): void {
    this._videoPlayerService.togglePlayPauseIcon(this.videoContainer.nativeElement, playingStatus);
  }

  public onVolumeInput(e: Event): void {
    this._videoPlayerService.onVolumeInput(this.videoPlayer.nativeElement, e);
  }

  public onVolumeChange(e: Event): void {
    this._videoPlayerService.onVolumeChange(
      this.videoContainer.nativeElement,
      this.videoPlayer.nativeElement,
      this.volumeSlider.nativeElement,
      e
    );
  }

  public toggleMute(): void {
    this._videoPlayerService.toggleMute(
      this.videoContainer.nativeElement,
      this.videoPlayer.nativeElement,
      this.volumeSlider.nativeElement
    );
  }
}
