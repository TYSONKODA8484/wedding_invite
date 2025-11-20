import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  videoUrl: string;
  className?: string;
  style?: React.CSSProperties;
}

export function VideoPlayer({ videoUrl, className = "", style }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSliderDragging, setIsSliderDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('VideoPlayer loaded with URL:', videoUrl);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      if (!isSliderDragging) {
        setCurrentTime(video.currentTime);
      }
    };

    const updateDuration = () => {
      console.log('Video duration loaded:', video.duration);
      if (!isNaN(video.duration)) {
        setDuration(video.duration);
        setError(null);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = (e: Event) => {
      console.error('Video error event:', e);
      const videoError = video.error;
      if (videoError) {
        const errorMessage = `Video error: Code ${videoError.code} - ${videoError.message}`;
        console.error(errorMessage);
        setError(errorMessage);
      }
    };

    const handleLoadStart = () => {
      console.log('Video load started');
    };

    const handleCanPlay = () => {
      console.log('Video can play');
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('durationchange', updateDuration);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('durationchange', updateDuration);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [isSliderDragging]);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const skipForward = () => {
    if (!videoRef.current || isNaN(videoRef.current.duration)) return;
    const newTime = Math.min(videoRef.current.currentTime + 10, videoRef.current.duration);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipBackward = () => {
    if (!videoRef.current) return;
    const newTime = Math.max(videoRef.current.currentTime - 10, 0);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSliderChange = (value: number[]) => {
    if (!videoRef.current) return;
    const newTime = value[0];
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSliderCommit = () => {
    setIsSliderDragging(false);
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative ${className}`} style={style}>
      {/* Video Element */}
      <div className="relative aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-black/5 dark:ring-white/10">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          preload="metadata"
          playsInline
          onClick={togglePlay}
          data-testid="video-player"
        />

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-4">
            <div className="text-center max-w-md">
              <p className="text-white text-sm mb-2">Video Loading Error</p>
              <p className="text-white/70 text-xs">{error}</p>
              <p className="text-white/50 text-xs mt-2">Video file may need codec conversion (H.264/AAC)</p>
            </div>
          </div>
        )}

        {/* Play/Pause Overlay (shows when paused and no error) */}
        {!isPlaying && !error && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
            onClick={togglePlay}
          >
            <div className="w-20 h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center hover-elevate transition-all">
              <Play className="w-10 h-10 text-primary-foreground fill-current ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Custom Video Controls */}
      <div className="mt-4 space-y-3 bg-card p-4 rounded-lg border border-border">
        {/* Timeline Slider */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSliderChange}
            onPointerDown={() => setIsSliderDragging(true)}
            onPointerUp={handleSliderCommit}
            className="cursor-pointer"
            data-testid="video-timeline-slider"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span data-testid="current-time">{formatTime(currentTime)}</span>
            <span data-testid="total-duration">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-2">
          {/* Skip Backward */}
          <Button
            variant="outline"
            size="icon"
            onClick={skipBackward}
            disabled={currentTime <= 0}
            aria-label="Skip backward 10 seconds"
            data-testid="button-skip-back"
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          {/* Play/Pause */}
          <Button
            variant="default"
            size="icon"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            data-testid="button-play-pause"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>

          {/* Skip Forward */}
          <Button
            variant="outline"
            size="icon"
            onClick={skipForward}
            disabled={isNaN(duration) || currentTime >= duration}
            aria-label="Skip forward 10 seconds"
            data-testid="button-skip-forward"
          >
            <SkipForward className="w-4 h-4" />
          </Button>

          {/* Mute/Unmute */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            data-testid="button-mute"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>

          {/* Fullscreen */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            data-testid="button-fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Decorative corner accents */}
      <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-primary/20 rounded-tl-lg pointer-events-none" />
      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-primary/20 rounded-br-lg pointer-events-none" />
    </div>
  );
}
