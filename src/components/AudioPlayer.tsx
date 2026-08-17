/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  Disc,
  SkipForward,
  SkipBack,
  ListMusic,
} from "lucide-react";

export const AUDIO_TRACKS = [
  {
    id: "sai-live-radio",
    title: "Shirdi Sai Baba (24/7 Live Mandir Broadcast)",
    url: "https://stream.zeno.fm/4vbechp31u8uv",
    isLive: true,
  },
  {
    id: "sai-flute-morning",
    title: "Morning Spiritual Awakening (Calming Flute)",
    url: "https://www.flutetunes.com/tunes/morning-has-broken.mp3",
    isLive: false,
  },
  {
    id: "sai-flute-vande",
    title: "Vande Mataram Traditional (Symphonic Temple Flute)",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Vande_Mataram_-_Instrumental_-_Flute.mp3",
    isLive: false,
  },
];

// Shared global audio element to sync desktop and mobile controllers perfectly
let sharedAudio: HTMLAudioElement | null = null;
let currentTrackIdx = 0;
const listeners = new Set<() => void>();

const getSharedAudio = () => {
  if (typeof window === "undefined") return null;
  if (!sharedAudio) {
    sharedAudio = new Audio(AUDIO_TRACKS[0].url);
    sharedAudio.loop = true;
    sharedAudio.volume = 0.3; // Default sweet background volume level

    // Wire up listeners to notify any mounted AudioPlayer component
    sharedAudio.addEventListener("play", () => notifyListeners());
    sharedAudio.addEventListener("pause", () => notifyListeners());
    sharedAudio.addEventListener("timeupdate", () => notifyListeners());
    sharedAudio.addEventListener("loadedmetadata", () => notifyListeners());
    sharedAudio.addEventListener("volumechange", () => notifyListeners());
  }
  return sharedAudio;
};

const notifyListeners = () => {
  listeners.forEach((l) => l());
};

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [trackIndex, setTrackIndex] = useState(currentTrackIdx);
  const [showTrackList, setShowTrackList] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  useEffect(() => {
    const audio = getSharedAudio();
    if (!audio) return;

    // Synchronize local states with global audio instance
    const syncState = () => {
      setIsPlaying(!audio.paused);
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
      setVolume(audio.volume);
      setIsMuted(audio.muted);
      setTrackIndex(currentTrackIdx);
    };

    // Initial sync
    syncState();

    // Register this component instance to receive updates on audio changes
    listeners.add(syncState);

    return () => {
      listeners.delete(syncState);
    };
  }, []);

  const handlePlayPause = () => {
    const audio = getSharedAudio();
    if (!audio) return;

    setPlaybackError(null);
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.warn("Audio playback blocked by browser: ", err);
        setPlaybackError(
          "Playback blocked or interrupted. Tap play to try again.",
        );
      });
    }
  };

  const handleTrackChange = (idx: number) => {
    const audio = getSharedAudio();
    if (!audio) return;

    setPlaybackError(null);
    currentTrackIdx = idx;
    setTrackIndex(idx);

    // Preserve playing state if it was playing, or just change source
    const wasPlaying = isPlaying;
    audio.src = AUDIO_TRACKS[idx].url;

    // Wrap seeking/time in a try-catch since live streams do not support resetting currentTime
    if (!AUDIO_TRACKS[idx].isLive) {
      try {
        audio.currentTime = 0;
      } catch (err) {
        console.warn("Could not reset audio time: ", err);
      }
    }

    if (wasPlaying) {
      audio.play().catch((err) => {
        console.warn("Audio error during track transition: ", err);
      });
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
    setShowTrackList(false);
  };

  const handleNextTrack = () => {
    const nextIdx = (trackIndex + 1) % AUDIO_TRACKS.length;
    handleTrackChange(nextIdx);
  };

  const handlePrevTrack = () => {
    const prevIdx =
      (trackIndex - 1 + AUDIO_TRACKS.length) % AUDIO_TRACKS.length;
    handleTrackChange(prevIdx);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = getSharedAudio();
    if (!audio) return;
    const value = parseFloat(e.target.value);
    try {
      audio.currentTime = value;
      setCurrentTime(value);
    } catch (err) {
      console.warn("Seeking failed: ", err);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = getSharedAudio();
    if (!audio) return;
    const value = parseFloat(e.target.value);
    audio.volume = value;
    audio.muted = false;
    setVolume(value);
    setIsMuted(false);
  };

  const handleToggleMute = () => {
    const audio = getSharedAudio();
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === Infinity) return "--:--";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const activeTrack = AUDIO_TRACKS[trackIndex];

  return (
    <div
      className="mx-4 p-3 bg-[#110605] border border-slate-200 rounded-xl flex flex-col gap-2 relative shadow-lg select-none"
      id="sidebar-devotional-player"
    >
      {/* Track Title & Visual Indicator */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0 flex items-center justify-center">
            {/* Spinning Disc / Notes */}
            <Disc
              className={`w-5 h-5 text-amber-500/80 ${isPlaying ? "animate-spin" : ""}`}
              style={{ animationDuration: "4s" }}
            />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff7a00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff7a00]"></span>
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="text-[10px] text-[#ff7a00]/90 font-black uppercase tracking-widest leading-none mb-1">
              MANDIR RADIO
            </div>
            <div className="text-[11px] font-bold text-slate-800 truncate tracking-wide leading-none">
              {activeTrack.title}
            </div>
          </div>
        </div>

        {/* Action Toggle buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowTrackList(!showTrackList)}
            className={`p-1 rounded-md transition-colors border hover:bg-[#20100f] ${showTrackList ? "text-[#ff7a00] border-[#ff7a00]/30 bg-[#160b0a]" : "text-slate-500 border-[#251210]"}`}
            title="Choose Hymn"
          >
            <ListMusic className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dynamic Soundwave Visualizer when playing */}
      {isPlaying && (
        <div
          className="flex items-center justify-center gap-0.5 h-2.5 my-0.5"
          id="audio-soundwave-framer"
        >
          <div
            className="w-[2px] bg-amber-500 rounded-full animate-[soundwave_0.8s_ease-in-out_infinite]"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-[2px] bg-[#ff7a00] rounded-full animate-[soundwave_0.8s_ease-in-out_infinite]"
            style={{ animationDelay: "0.3s" }}
          ></div>
          <div
            className="w-[2px] bg-orange-400 rounded-full animate-[soundwave_0.8s_ease-in-out_infinite]"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="w-[2px] bg-amber-500 rounded-full animate-[soundwave_0.8s_ease-in-out_infinite]"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-[2px] bg-orange-600 rounded-full animate-[soundwave_0.8s_ease-in-out_infinite]"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      )}

      {/* Playback Error Toast Alert */}
      {playbackError && (
        <div className="text-[9px] bg-red-950/85 border border-red-900/60 text-red-300 rounded px-2 py-1 leading-normal font-medium">
          {playbackError}
        </div>
      )}

      {/* Track Selection Overlay Menu */}
      {showTrackList && (
        <div className="absolute top-[38px] left-2 right-2 bg-[#0d0403] border border-[#ff7a00]/25 rounded-lg p-1.5 z-50 shadow-2xl flex flex-col gap-1.5 animate-in fade-in duration-150">
          <div className="text-[9px] uppercase font-black text-slate-500 px-1 pb-1 border-b border-slate-200 tracking-wider">
            Devotional Selection
          </div>
          {AUDIO_TRACKS.map((t, index) => (
            <button
              key={t.id}
              onClick={() => handleTrackChange(index)}
              className={`w-full text-left font-sans text-[11px] font-bold px-2 py-1.5 rounded-md transition-all flex items-center justify-between ${
                trackIndex === index
                  ? "bg-[#ff7a00]/10 text-[#ff7a00] border border-[#ff7a00]/20 font-semibold"
                  : "text-stone-300 hover:bg-[#1c0e0d] hover:text-white border border-transparent"
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Music className="w-3.5 h-3.5 text-[#ff7a00]" />
                <span className="truncate">{t.title}</span>
              </div>
              <span className="text-[9px] text-slate-500/80 font-mono">
                {t.isLive ? "LIVE" : `CH ${index + 1}`}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Playback Progress Seeking Slider or Live Indicator */}
      {activeTrack.isLive ? (
        <div className="flex items-center gap-2 py-2 px-1.5 bg-[#1a0c0b] rounded-lg border border-[#301614] my-1">
          <span className="flex h-2 w-2 relative ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          <span className="text-[10px] text-stone-300 font-bold tracking-wide">
            Mandir Broadcast Station
          </span>
          <span className="ml-auto text-[8px] font-black tracking-wider text-red-500 animate-pulse bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/25">
            24/7 LIVE
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-1 mt-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-[#ff7a00] bg-[#22100f] h-1 rounded-lg cursor-pointer appearance-none focus:outline-none"
            title="Playback Seek"
          />
          <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono leading-none">
            <span>{formatTime(currentTime)}</span>
            <span>
              {duration && duration !== Infinity
                ? formatTime(duration)
                : "--:--"}
            </span>
          </div>
        </div>
      )}

      {/* Player Primary Action Triggers */}
      <div className="flex items-center justify-between gap-1.5 mt-0.5">
        {/* Seek buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevTrack}
            className="p-1 px-1.5 text-slate-500 hover:bg-white hover:text-slate-800 rounded-md border border-transparent transition-colors cursor-pointer"
            title="Previous Hymn"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handlePlayPause}
            className="p-1.5 bg-[#ff7a00]/10 hover:bg-[#ff7a00] text-[#ff7a00] hover:text-white rounded-full transition-all border border-[#ff7a00]/20 cursor-pointer shadow-md inline-flex items-center justify-center shrink-0"
            title={isPlaying ? "Pause Hymn" : "Play Devotional Music"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={handleNextTrack}
            className="p-1 px-1.5 text-slate-500 hover:bg-white hover:text-slate-800 rounded-md border border-transparent transition-colors cursor-pointer"
            title="Next Hymn"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Volume & Mute Area */}
        <div className="flex items-center gap-1.5 shrink-0 max-w-[80px]">
          <button
            onClick={handleToggleMute}
            className="p-1 text-slate-500 hover:bg-[#1d0f0e] hover:text-slate-800 rounded-md transition-colors cursor-pointer shrink-0"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-stone-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-12 accent-[#ff7a00] bg-[#22100f] h-1 rounded-lg cursor-pointer appearance-none transition-all"
            title={`Volume: ${Math.round(volume * 100)}%`}
          />
        </div>
      </div>
    </div>
  );
}
