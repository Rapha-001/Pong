/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Wifi, WifiOff, CloudLightning, Database, Sparkles, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OfflineIndicatorProps {
  offlineMode: boolean;
  setOfflineMode: (offline: boolean) => void;
  queueCount: number;
  syncQueue: () => void;
}

export default function OfflineIndicator({
  offlineMode,
  setOfflineMode,
  queueCount,
  syncQueue,
}: OfflineIndicatorProps) {
  const [showDemoInfo, setShowDemoInfo] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncClick = () => {
    setIsSyncing(true);
    setTimeout(() => {
      syncQueue();
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <div className="relative w-full z-40 bg-zinc-50 border-b border-zinc-200" id="pwa-offline-system">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs md:text-sm">
        <div className="flex items-center gap-2">
          {offlineMode ? (
            <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200 font-medium">
              <WifiOff className="w-3.5 h-3.5 animate-pulse" />
              <span>PWA Offline Mode Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200 font-medium">
              <Wifi className="w-3.5 h-3.5" />
              <span>Connected to UniUyo Cloud</span>
            </div>
          )}
          <span className="hidden md:inline text-zinc-500">|</span>
          <span className="hidden md:inline text-zinc-500 font-mono">Status: localCache.durable: synced</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Offline switch */}
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!offlineMode}
              onChange={(e) => setOfflineMode(!e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-amber-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-zinc-300 dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-emerald-600"></div>
            <span className="ml-2 text-xs font-semibold text-zinc-700">
              {offlineMode ? 'Go Online' : 'Simulate Offline Client'}
            </span>
          </label>

          {queueCount > 0 && (
            <button
              onClick={handleSyncClick}
              disabled={isSyncing || offlineMode}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition font-semibold ${
                offlineMode
                  ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
              }`}
            >
              <CloudLightning className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : `Sync ${queueCount} Offline Action(s)`}</span>
            </button>
          )}

          <button
            onClick={() => setShowDemoInfo(!showDemoInfo)}
            className="text-zinc-500 hover:text-zinc-800 transition underline cursor-pointer text-xs font-medium"
          >
            How offline works?
          </button>
        </div>
      </div>

      {/* Dynamic Offline Warnings */}
      <AnimatePresence>
        {offlineMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-200/50 text-amber-900"
          >
            <div className="max-w-7xl mx-auto px-4 py-2 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Durable Local Caching:</strong> You can still publish posts, comment, RSVP to events, apply to internships, and upvote projects. They are saved instantly to <code>localStorage</code> and queued safely.
                </span>
              </div>
              {queueCount > 0 && (
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold animate-pulse shrink-0">
                  {queueCount} pending syncs
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDemoInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-indigo-50 border-b border-indigo-100 overflow-hidden"
          >
            <div className="max-w-4xl mx-auto px-4 py-4 text-xs md:text-sm text-indigo-950 space-y-2">
              <div className="flex items-center gap-1 text-indigo-700 font-bold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>PWA & Offline Simulation Design</span>
              </div>
              <p>
                UniUyo Connect functions like a real Native Progressive Web App. It features fully offline-capable client-side synchronization:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-600">
                <li>
                  <strong className="text-zinc-800">State Hydration:</strong> Data resolves first from high-performance <code>localStorage</code> cache. If the database is unreachable, it remains responsive.
                </li>
                <li>
                  <strong className="text-zinc-800">Offline Queue:</strong> Actions created offline (posts, likes, RSVP clicks) are recorded in an internal queue inside <code>localStorage</code>.
                </li>
                <li>
                  <strong className="text-zinc-800">Background Syncing:</strong> Once you slide the simulator to <strong className="text-zinc-800">"Go Online"</strong>, you can click "Sync Cache" to bundle and merge offline records back to the campus network pool safely.
                </li>
              </ul>
              <button
                onClick={() => setShowDemoInfo(false)}
                className="mt-2 bg-indigo-600 text-white font-semibold px-3 py-1 rounded hover:bg-slate-800 cursor-pointer text-xs"
              >
                Got it, dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
