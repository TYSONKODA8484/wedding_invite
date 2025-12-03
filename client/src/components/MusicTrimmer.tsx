import { useState, useRef, useEffect, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface MusicTrimmerProps {
  audioUrl: string | null;
  audioDuration: number;
  templateDuration: number;
  startTime: number;
  onStartTimeChange: (startTime: number) => void;
  onPreviewPlay?: () => void;
  onPreviewPause?: () => void;
  isPlaying?: boolean;
}

export function MusicTrimmer({
  audioUrl,
  audioDuration,
  templateDuration,
  startTime,
  onStartTimeChange,
  onPreviewPlay,
  onPreviewPause,
  isPlaying = false,
}: MusicTrimmerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [waveformBars, setWaveformBars] = useState<number[]>([]);

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const maxStartTime = Math.max(0, audioDuration - templateDuration);
  const selectionWidthPercent = audioDuration > 0 
    ? Math.min(100, (templateDuration / audioDuration) * 100) 
    : 100;
  const selectionLeftPercent = audioDuration > 0 
    ? (startTime / audioDuration) * 100 
    : 0;

  useEffect(() => {
    const barCount = 60;
    const bars = Array.from({ length: barCount }, () => 
      0.2 + Math.random() * 0.8
    );
    
    for (let i = 1; i < bars.length - 1; i++) {
      bars[i] = (bars[i - 1] + bars[i] + bars[i + 1]) / 3;
    }
    
    setWaveformBars(bars);
  }, [audioUrl]);

  const handleSliderChange = useCallback((value: number[]) => {
    const newStartTime = Math.min(value[0], maxStartTime);
    onStartTimeChange(newStartTime);
  }, [maxStartTime, onStartTimeChange]);

  const handleWaveformClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || audioDuration <= 0) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = clickX / rect.width;
    
    let newStartTime = clickPercent * audioDuration - (templateDuration / 2);
    newStartTime = Math.max(0, Math.min(newStartTime, maxStartTime));
    
    onStartTimeChange(newStartTime);
  }, [audioDuration, templateDuration, maxStartTime, onStartTimeChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current || audioDuration <= 0) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mousePercent = mouseX / rect.width;
    
    let newStartTime = mousePercent * audioDuration - (templateDuration / 2);
    newStartTime = Math.max(0, Math.min(newStartTime, maxStartTime));
    
    onStartTimeChange(newStartTime);
  }, [isDragging, audioDuration, templateDuration, maxStartTime, onStartTimeChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current || audioDuration <= 0) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchPercent = touchX / rect.width;
    
    let newStartTime = touchPercent * audioDuration - (templateDuration / 2);
    newStartTime = Math.max(0, Math.min(newStartTime, maxStartTime));
    
    onStartTimeChange(newStartTime);
  }, [audioDuration, templateDuration, maxStartTime, onStartTimeChange]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleReset = useCallback(() => {
    onStartTimeChange(0);
  }, [onStartTimeChange]);

  const endTime = Math.min(startTime + templateDuration, audioDuration);

  if (!audioUrl || audioDuration <= 0) {
    return (
      <div className="bg-muted/30 rounded-lg p-4 text-center text-muted-foreground text-sm">
        Select or upload music to trim
      </div>
    );
  }

  const showTrimmer = audioDuration > templateDuration;

  return (
    <div className="space-y-4">
      {showTrimmer ? (
        <>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Drag to select which part of your music to use</span>
            <span className="font-medium text-foreground">
              Video duration: {formatTime(templateDuration)}
            </span>
          </div>

          <div 
            ref={containerRef}
            className="relative h-20 bg-muted/30 rounded-lg overflow-hidden cursor-pointer select-none"
            onClick={handleWaveformClick}
            data-testid="music-trimmer-waveform"
          >
            <div className="absolute inset-0 flex items-center justify-center gap-[2px] px-2">
              {waveformBars.map((height, index) => {
                const barPosition = (index / waveformBars.length) * 100;
                const isInSelection = barPosition >= selectionLeftPercent && 
                                      barPosition <= selectionLeftPercent + selectionWidthPercent;
                
                return (
                  <div
                    key={index}
                    className={`flex-1 rounded-full transition-colors ${
                      isInSelection ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                    style={{ 
                      height: `${height * 60}%`,
                      minWidth: '2px',
                      maxWidth: '6px'
                    }}
                  />
                );
              })}
            </div>

            <div
              className="absolute top-0 bottom-0 border-2 border-primary bg-primary/10 rounded cursor-grab active:cursor-grabbing transition-[left] duration-75"
              style={{
                left: `${selectionLeftPercent}%`,
                width: `${selectionWidthPercent}%`,
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              data-testid="music-trimmer-selection"
            >
              <div className="absolute left-1 top-1 bottom-1 w-1 bg-primary rounded-full" />
              <div className="absolute right-1 top-1 bottom-1 w-1 bg-primary rounded-full" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary text-primary-foreground text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                  {formatTime(templateDuration)}
                </div>
              </div>
            </div>

            <div className="absolute bottom-1 left-2 text-[10px] text-muted-foreground font-medium">
              0:00
            </div>
            <div className="absolute bottom-1 right-2 text-[10px] text-muted-foreground font-medium">
              {formatTime(audioDuration)}
            </div>
          </div>

          <div className="px-1">
            <Slider
              value={[startTime]}
              onValueChange={handleSliderChange}
              max={maxStartTime}
              step={0.1}
              className="cursor-pointer"
              data-testid="music-trimmer-slider"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={isPlaying ? onPreviewPause : onPreviewPlay}
                disabled={!audioUrl}
                data-testid="button-trimmer-preview"
              >
                {isPlaying ? (
                  <Pause className="w-3 h-3 mr-1" />
                ) : (
                  <Play className="w-3 h-3 mr-1" />
                )}
                Preview Selection
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={startTime === 0}
                data-testid="button-trimmer-reset"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{formatTime(startTime)}</span>
              <span className="mx-1">-</span>
              <span className="font-medium text-foreground">{formatTime(endTime)}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center gap-[2px] flex-1 h-12">
              {waveformBars.slice(0, 30).map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-primary rounded-full"
                  style={{ 
                    height: `${height * 40}%`,
                    minWidth: '2px',
                    maxWidth: '4px'
                  }}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Music fits within video duration ({formatTime(audioDuration)} / {formatTime(templateDuration)})
          </p>
        </div>
      )}
    </div>
  );
}
