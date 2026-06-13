import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Video, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Trash2, 
  Tv, 
  Check, 
  Monitor, 
  Moon, 
  Sun, 
  Sparkles, 
  Database,
  Volume2,
  VolumeX,
  Layers,
  Laptop
} from 'lucide-react';
import { StudentProfile } from '../types';

interface SettingsSectionProps {
  currentUser: StudentProfile;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onShowToast: (msg: string, type?: 'success' | 'warn') => void;
  offlineQueueCount: number;
  onSyncOfflineQueue: () => void;
  displayMode: 'standard' | 'fullscreen';
  onChangeDisplayMode: (mode: 'standard' | 'fullscreen') => void;
}

export default function SettingsSection({
  currentUser,
  theme,
  toggleTheme,
  onShowToast,
  offlineQueueCount,
  onSyncOfflineQueue,
  displayMode,
  onChangeDisplayMode
}: SettingsSectionProps) {
  // Autoplay setting (Defaults to FALSE)
  const [autoplay, setAutoplay] = useState<boolean>(() => {
    try {
      return localStorage.getItem('uniuyo_settings_autoplay') === 'true';
    } catch {
      return false;
    }
  });

  // Browser HTML5 window fullscreen tracker state
  const [isWindowFullscreen, setIsWindowFullscreen] = useState<boolean>(false);

  // Read current browser window fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsWindowFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Set initial video autoplay setting
  const toggleAutoplaySetting = () => {
    const newVal = !autoplay;
    setAutoplay(newVal);
    try {
      localStorage.setItem('uniuyo_settings_autoplay', String(newVal));
      onShowToast(
        newVal 
          ? 'Video autoplay enabled. Feed videos will stream automatically.' 
          : 'Video autoplay disabled. Tap video cards to control playback.', 
        'success'
      );
    } catch (e) {
      console.warn('LocalStorage blocked:', e);
    }
  };

  // Set physical responsive container margins
  const changeLayoutModeSetting = (mode: 'standard' | 'fullscreen') => {
    onChangeDisplayMode(mode);
    try {
      localStorage.setItem('uniuyo_settings_display_mode', mode);
      onShowToast(
        mode === 'fullscreen' 
          ? 'Wide-view Full Screen layout enabled! Enjoy edge-to-edge campus feed spaces.' 
          : 'Standard Boxed layout enabled (centered 1280px canvas).', 
        'success'
      );
      // Trigger temporary window resize event to force re-render standard graphs and charts
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    } catch (e) {
      console.warn('LocalStorage blocked:', e);
    }
  };

  // Toggle true browser fullscreen window status
  const toggleBrowserFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsWindowFullscreen(true);
        onShowToast('Entered full screen desktop dashboard environment! 🖥️', 'success');
      } else {
        await document.exitFullscreen();
        setIsWindowFullscreen(false);
        onShowToast('Restored window standard layout framework.', 'success');
      }
    } catch (err) {
      onShowToast('Fullscreen viewport restricted by browser framing structures.', 'warn');
      console.warn('Fullscreen execution error:', err);
    }
  };

  // Dangerous option: clear indexedDB and localStorage records
  const handleClearDatabaseCache = () => {
    if (confirm('Are you sure you want to reset UniUyo Connect local data storage? This will clear all offline drafts, direct messages, and system settings, reloading pristine defaults.')) {
      try {
        localStorage.clear();
        onShowToast('Database cache cleared successfully. Refreshing page...', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (e) {
        onShowToast('Standard cache purge failed.', 'warn');
      }
    }
  };

  return (
    <div className="w-full max-w-none space-y-6" id="settings-section-container">
      {/* Settings Intro Header Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-zinc-900 border-y sm:border border-x-0 border-zinc-150 dark:border-zinc-800 p-5 rounded-none sm:rounded-2xl shadow-3xs">
        <div>
          <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Universal Application Settings</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Configure system rendering guidelines, feed playback states, responsive viewport structures, and persistent student profile caches below.
          </p>
        </div>
        <span className="text-[10px] bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-lg">
          v1.4 Config Core
        </span>
      </div>

      {/* Primary configuration grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Videos Playback Settings Card */}
        <div className="bg-white dark:bg-zinc-900 border-y sm:border border-x-0 border-zinc-150 dark:border-zinc-800 rounded-none sm:rounded-2xl p-5 shadow-3xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100 dark:border-zinc-850">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-405 flex items-center justify-center">
                <Video className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-300 font-sans">
                  Video Feed Playback
                </h3>
                <p className="text-[11px] text-zinc-400">Manage stream settings and auto-loading cycles</p>
              </div>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
                    Disable Autoplay by Default
                  </span>
                  <span className="text-[11px] text-zinc-450 dark:text-zinc-400 leading-relaxed block">
                    Prevent high-bandwidth video attachments from loading automatically in the campus feed. Recommended for network efficiency.
                  </span>
                </div>
                
                {/* Custom Toggle Switch */}
                <button
                  type="button"
                  onClick={toggleAutoplaySetting}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                    !autoplay ? 'bg-indigo-600' : 'bg-zinc-255 dark:bg-zinc-800 border border-zinc-300/40 dark:border-zinc-700/40'
                  }`}
                  aria-checked={!autoplay}
                  role="checkbox"
                >
                  <span 
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm ${
                      !autoplay ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Autoplay Status Indicator HUD */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-850 rounded-xl flex items-center gap-3 text-xs text-zinc-550 dark:text-zinc-350">
                {!autoplay ? (
                  <>
                    <VolumeX className="w-4 h-4 text-emerald-650 shrink-0" />
                    <span><strong>Current Mode:</strong> Tap-to-Play manual mode active. Videos will hold static thumbnails until started actively. Saves cell metrics.</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-indigo-505 shrink-0" />
                    <span><strong>Current Mode:</strong> Autoplay streaming active. Videos will play muted in continuous loops inside feed headers automatically.</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-150 dark:border-zinc-850 text-[10px] text-zinc-400 font-mono">
            *Applied directly to inline multimedia elements and secondary galleries.
          </div>
        </div>

        {/* Display and App Dimensions Sizing Card */}
        <div className="bg-white dark:bg-zinc-900 border-y sm:border border-x-0 border-zinc-150 dark:border-zinc-800 rounded-none sm:rounded-2xl p-5 shadow-3xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100 dark:border-zinc-850">
              <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-emerald-950/30 text-green-600 dark:text-emerald-450 flex items-center justify-center">
                <Tv className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-300 font-sans">
                  Workspace Sizing &amp; Layout
                </h3>
                <p className="text-[11px] text-zinc-400">Regulate desktop grid spans and page margin spacing</p>
              </div>
            </div>

            <div className="py-4 space-y-4">
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
                  Canvas Layout Dimension Mode
                </span>
                
                {/* Layout Mode Grid Selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => changeLayoutModeSetting('fullscreen')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition flex flex-col gap-1.5 ${
                      displayMode === 'fullscreen'
                        ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/15'
                        : 'border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-850'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Layers className="w-4 h-4 text-indigo-500" />
                      {displayMode === 'fullscreen' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold text-zinc-850 dark:text-zinc-150 block">Wide Full Screen View</span>
                      <span className="text-[9px] text-zinc-400 leading-none">Fluid edge-to-edge desktop scope (Default)</span>
                    </div>
                  </button>

                  <button
                    onClick={() => changeLayoutModeSetting('standard')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition flex flex-col gap-1.5 ${
                      displayMode === 'standard'
                        ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/15'
                        : 'border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-850'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Monitor className="w-4 h-4 text-zinc-500" />
                      {displayMode === 'standard' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold text-zinc-850 dark:text-zinc-150 block">Boxed Small Screen</span>
                      <span className="text-[9px] text-zinc-400 leading-none">Centered max-w-7xl column layout</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dedicated Full Screen Button Option */}
              <div className="pt-2">
                <button
                  onClick={toggleBrowserFullscreen}
                  className="w-full py-2.5 px-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-150 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isWindowFullscreen ? (
                    <>
                      <Minimize2 className="w-4 h-4 text-zinc-505" />
                      <span>Exit Browser Window Full Screen</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Enter Browser Window Full Screen</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-150 dark:border-zinc-850 text-[10px] text-zinc-400 font-mono">
            *Allows toggling fluid side structures on premium high dpi monitors.
          </div>
        </div>

        {/* Brand Theme Adjustments and Sync Systems */}
        <div className="bg-white dark:bg-zinc-900 border-y sm:border border-x-0 border-zinc-150 dark:border-zinc-800 rounded-none sm:rounded-2xl p-5 shadow-3xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100 dark:border-zinc-850">
              <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-450 flex items-center justify-center">
                <Sun className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-300 font-sans">
                  Aesthetic Skin &amp; Color
                </h3>
                <p className="text-[11px] text-zinc-400">Select standard styling themes for UI widgets</p>
              </div>
            </div>

            <div className="py-4 space-y-3">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
                Visual Palette Preset
              </span>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition flex flex-col items-center gap-15 ${
                    theme === 'light'
                      ? 'border-indigo-600 bg-indigo-50/10'
                      : 'border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-850'
                  }`}
                >
                  <Sun className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-zinc-750 dark:text-zinc-300 mt-1">Light Glow</span>
                </button>

                <button
                  type="button"
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition flex flex-col items-center gap-15 ${
                    theme === 'dark'
                      ? 'border-indigo-650 bg-indigo-950/15'
                      : 'border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-100'
                  }`}
                >
                  <Moon className="w-4.5 h-4.5 text-indigo-400 fill-indigo-400" />
                  <span className="text-xs font-bold text-zinc-750 dark:text-zinc-300 mt-1">Slate Shadow</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-150 dark:border-zinc-850 text-[10px] text-zinc-400 font-mono">
            *Light Glow provides generous contrast. Slate Shadow offers dark protection.
          </div>
        </div>

        {/* Cache Diagnostics & Purge operations */}
        <div className="bg-white dark:bg-zinc-900 border-y sm:border border-x-0 border-zinc-150 dark:border-zinc-800 rounded-none sm:rounded-2xl p-5 shadow-3xs flex flex-col justify-between" id="cache-mgmt-card">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100 dark:border-zinc-850">
              <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-450 flex items-center justify-center">
                <Database className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-300 font-sans">
                  Storage &amp; Sync Diagnostics
                </h3>
                <p className="text-[11px] text-zinc-400">Audit in-memory states and synchronization queues</p>
              </div>
            </div>

            <div className="py-4 space-y-3.5">
              <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-850 p-2.5 rounded-xl text-xs">
                <span className="text-zinc-500 font-bold">Unsynchronized Drafts</span>
                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                  offlineQueueCount > 0 ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-zinc-200 text-zinc-650 dark:bg-zinc-705 dark:text-zinc-350'
                }`}>
                  {offlineQueueCount} operations pending
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onSyncOfflineQueue}
                  disabled={offlineQueueCount === 0}
                  className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-750 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:dark:bg-zinc-800/55 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-3xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${offlineQueueCount > 0 ? 'animate-spin' : ''}`} />
                  <span>Sync Queue</span>
                </button>
                <button
                  onClick={handleClearDatabaseCache}
                  className="py-2 px-4 border border-red-200 dark:border-red-950 hover:bg-red-50 hover:dark:bg-red-950/25 text-red-650 dark:text-red-405 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Purge Local Cache"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Cache</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-150 dark:border-zinc-850 text-[10px] text-red-500 font-mono font-bold">
            *WARNING: Reset Cache irreversibly wipes active localStorage registers.
          </div>
        </div>

      </div>
    </div>
  );
}
