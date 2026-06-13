/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Post, StudentProfile, Poll } from '../types';
import { Image, X, PlusCircle, Sparkles, Megaphone, FileText, Send, Eye, Share2, HelpCircle, Play } from 'lucide-react';
import MediaPickerBottomSheet from './MediaPickerBottomSheet';

const isVideoSource = (src: string) => {
  if (!src) return false;
  return src.startsWith('data:video/') || 
         src.endsWith('.mp4') || 
         src.endsWith('.webm') || 
         src.endsWith('.ogg') || 
         src.endsWith('.mov') ||
         src.includes('video/mp4') ||
         src.toLowerCase().includes('video');
};

interface CreatePostSectionProps {
  currentUser: StudentProfile;
  onAddPost: (post: Post) => void;
  onShowToast: (msg: string, type: 'success' | 'warn') => void;
  setActiveTab: (tab: any) => void;
  theme?: 'light' | 'dark';
}

export default function CreatePostSection({
  currentUser,
  onAddPost,
  onShowToast,
  setActiveTab,
  theme = 'light',
}: CreatePostSectionProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Discussions' | 'Experiences' | 'Questions' | 'Announcements' | 'Opinions'>('Discussions');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [isPollEnabled, setIsPollEnabled] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const categories = ['Discussions', 'Experiences', 'Questions', 'Announcements', 'Opinions'] as const;

  const removeUploadedImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    onShowToast("Image removed from attachments draft.", "success");
  };

  const handleCreatePost = () => {
    if (!content.trim()) {
      onShowToast("Please enter some text to describe your post.", "warn");
      return;
    }

    let pollData: Poll | undefined = undefined;
    if (isPollEnabled && pollQuestion.trim()) {
      const validOptions = pollOptions.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        onShowToast("A poll must contain at least 2 non-empty options.", "warn");
        return;
      }
      pollData = {
        question: pollQuestion.trim(),
        options: validOptions.map((opt, i) => ({
          id: `opt-${Date.now()}-${i}`,
          text: opt.trim(),
          votes: []
        }))
      };
    }

    // Compose final post record matching types
    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      authorTag: currentUser.department ? `${currentUser.department} student` : undefined,
      content: content.trim(),
      // Primary image matches first item if uploaded, otherwise undefined
      image: uploadedImages.length > 0 ? uploadedImages[0] : undefined,
      images: uploadedImages.length > 0 ? uploadedImages : undefined,
      category,
      likes: [],
      comments: [],
      poll: pollData,
      createdAt: new Date().toISOString()
    };

    onAddPost(newPost);
    setContent('');
    setUploadedImages([]);
    setPollQuestion('');
    setPollOptions(['', '']);
    setIsPollEnabled(false);
    onShowToast("Your student thread is now live on UniUyo feeds!", "success");
    setActiveTab('Feed');
  };

  const isDark = theme === 'dark';

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="dedicated-post-composer">
      {/* Editor Panel */}
      <div className={`xl:col-span-7 rounded-none sm:rounded-2xl border-y sm:border border-x-0 p-5 sm:p-6 shadow-sm transition-colors duration-205 ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
      }`}>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`font-extrabold text-base tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Campus Hub Composer
            </h2>
            <p className={`text-[11px] font-medium leading-none ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Draft a beautiful thread or interactive poll for student library records
            </p>
          </div>
        </div>

        {/* Content input */}
        <div className="space-y-4">
          <div>
            <label className={`text-[10px] font-black uppercase tracking-wider block mb-2 font-mono ${
              isDark ? 'text-zinc-400' : 'text-zinc-650'
            }`}>
              Feed Thread Content
            </label>
            <div className="relative">
              <textarea
                className={`w-full text-sm rounded-xl p-3.5 pb-11 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium ${
                  isDark 
                    ? 'bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-650' 
                    : 'bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400'
                }`}
                rows={5}
                placeholder="What is happening around campus? Share academic ideas, student gigs, or news..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBottomSheetOpen(true)}
                  className="p-1.5 bg-zinc-100 dark:bg-zinc-850 hover:bg-indigo-650 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white text-zinc-500 dark:text-zinc-400 rounded-lg transition-all flex items-center justify-center cursor-pointer border border-zinc-200 dark:border-zinc-750"
                  title="Attach Campus Media 📎"
                >
                  <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
                <span className={`text-[9.5px] font-mono select-none font-black uppercase ${
                  uploadedImages.length > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500'
                }`}>
                  {uploadedImages.length > 0 ? `📎 ${uploadedImages.length}/4 Attached` : 'Attach Media'}
                </span>
                <span className="text-[8.5px] text-zinc-400 font-mono hidden sm:inline">• 15-50MB Max</span>
              </div>
            </div>
          </div>

          {/* Interactive Poll toggler */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-black uppercase tracking-wider font-mono ${
                isDark ? 'text-zinc-400' : 'text-zinc-650'
              }`}>
                Add Interactive Campus Poll
              </span>
              <button
                onClick={() => setIsPollEnabled(!isPollEnabled)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                  isPollEnabled
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-zinc-800 dark:text-emerald-400 border border-emerald-200 dark:border-zinc-700'
                    : isDark
                    ? 'bg-zinc-950 text-zinc-500 hover:text-zinc-300'
                    : 'bg-zinc-100 text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {isPollEnabled ? '✓ Enabled' : '+ Add Poll'}
              </button>
            </div>

            {isPollEnabled && (
              <div className={`p-4 rounded-xl space-y-3.5 border ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200/50'
              }`}>
                <div>
                  <input
                    type="text"
                    placeholder="E.g., Which department has the best tech ecosystem in UniUyo?"
                    className={`w-full text-xs font-semibold rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 ${
                      isDark ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-white border border-zinc-250 text-zinc-900'
                    }`}
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-zinc-400 font-mono w-4">{idx + 1}.</span>
                      <input
                        type="text"
                        placeholder={`Option ${idx + 1}`}
                        className={`flex-1 text-xs font-medium rounded-lg p-2 outline-none focus:ring-1 focus:ring-indigo-500 ${
                          isDark ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-white border border-zinc-250 text-zinc-900'
                        }`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...pollOptions];
                          updated[idx] = e.target.value;
                          setPollOptions(updated);
                        }}
                      />
                      {pollOptions.length > 2 && (
                        <button
                          onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {pollOptions.length < 5 && (
                    <button
                      onClick={() => setPollOptions([...pollOptions, ''])}
                      className="text-[10px] font-extrabold text-indigo-650 hover:text-indigo-850 dark:text-indigo-400 font-mono"
                    >
                      + Add another option option
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Multiple Image Allowance Upload console */}
          <div>
            <MediaPickerBottomSheet
              isOpen={isBottomSheetOpen}
              onClose={() => setIsBottomSheetOpen(false)}
              onSelectMediaBatch={(urls) => {
                setUploadedImages((prev) => [...prev, ...urls].slice(0, 4));
              }}
              onShowToast={onShowToast}
              maxFiles={4}
              currentFilesCount={uploadedImages.length}
              theme={theme}
            />

            {/* Thumbnail previews for multiple images with delete toggles */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5">
                {uploadedImages.map((img, idx) => {
                  const isVideo = isVideoSource(img);
                  return (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50 shadow-sm flex items-center justify-center p-0.5">
                      {isVideo ? (
                        <div className="relative w-full h-full bg-zinc-950 rounded-lg overflow-hidden flex items-center justify-center">
                          <video
                            src={img}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                            <div className="w-8 h-8 rounded-full bg-white/95 dark:bg-zinc-900/95 flex items-center justify-center shadow-md">
                              <Play className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400 ml-0.5" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={img}
                          alt={`Upload selection preview ${idx}`}
                          className="w-full h-full object-cover rounded-lg"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <button
                        onClick={() => removeUploadedImage(idx)}
                        className="absolute top-1.5 right-1.5 p-1 bg-red-650 hover:bg-red-750 text-white rounded-full transition shadow-md z-10"
                        title="Remove attachment"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-indigo-600 text-[8px] text-white py-0.5 px-2 rounded-md font-bold tracking-wider uppercase z-10">
                          Primary Cover
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Trigger publisher */}
          <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-850 flex items-center justify-between">
            <p className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-455'}`}>
              Posting securely as @{currentUser.name}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('Feed')}
                className={`text-xs font-black uppercase tracking-wider py-2.5 px-5 rounded-xl transition ${
                  isDark ? 'bg-zinc-950 text-zinc-400 hover:bg-zinc-800' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-250'
                }`}
              >
                Cancel Compose
              </button>
              <button
                onClick={handleCreatePost}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest py-2.5 px-6 rounded-xl flex items-center gap-1.5 transition shadow-md cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Thread</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Live Mobile Device Preview Panel */}
      <div className="xl:col-span-5 space-y-4">
        <div className={`p-4 border rounded-2xl flex items-center gap-2 ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
        }`}>
          <Eye className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest font-mono">Live Identity Layout Feed View</span>
        </div>

        {/* Dynamic Card Preview */}
        <div className={`rounded-none sm:rounded-2xl border-y sm:border border-x-0 overflow-hidden p-5 space-y-4 shadow-sm relative ${
          isDark ? 'bg-zinc-900 border-zinc-850 text-white' : 'bg-white border-zinc-200 text-zinc-900'
        }`}>
          {/* Post item category badge absolute */}
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-xl object-cover shrink-0 border border-zinc-200"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black truncate">{currentUser.name}</h4>
                  <span className="bg-indigo-50 dark:bg-zinc-800 text-indigo-750 dark:text-indigo-400 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                    OP
                  </span>
                </div>
                <p className="text-[9px] text-zinc-500 font-medium leading-none mt-0.5">
                  @{currentUser.department || 'Academic'} Student Representative
                </p>
              </div>
            </div>
            <span className="bg-indigo-50 dark:bg-zinc-800 text-indigo-750 dark:text-indigo-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-indigo-100 dark:border-zinc-700">
              {category}
            </span>
          </div>

          {/* Body Content Preview with markup placeholder */}
          <div className="space-y-3.5">
            <p className={`text-xs leading-normal font-medium whitespace-pre-wrap ${
              content.trim() ? '' : 'italic opacity-60'
            }`}>
              {content.trim() || "Type campus insights inside the Hub composer on the left to view a pixel-perfect rendering of your thread card..."}
            </p>

            {/* Render Multiple allowance image gallery collage! */}
            {uploadedImages.length > 0 && (
              <div className="rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850">
                {/* Custom grid based on upload length */}
                <div className={`grid gap-1 ${
                  uploadedImages.length === 1 
                    ? 'grid-cols-1' 
                    : uploadedImages.length === 2 
                    ? 'grid-cols-2' 
                    : 'grid-cols-3'
                }`}>
                  {uploadedImages.map((src, i) => (
                    <div 
                      key={i} 
                      className={`relative overflow-hidden bg-zinc-100 flex items-center justify-center ${
                        uploadedImages.length === 3 && i === 2 ? 'col-span-3 aspect-video' : 'aspect-square'
                      }`}
                    >
                      <img
                        src={src}
                        alt="Preview visual"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-zinc-100 dark:border-zinc-850 bg-white dark:bg-zinc-900 text-[10px] font-bold tracking-tight text-center text-zinc-500">
                  📸 Student Media Pack ({uploadedImages.length} asset{uploadedImages.length !== 1 ? 's' : ''} saved)
                </div>
              </div>
            )}

            {/* Poll visualizer placeholder */}
            {isPollEnabled && pollQuestion.trim() && (
              <div className={`rounded-xl p-4 space-y-3 border ${
                isDark ? 'bg-zinc-950 border-zinc-850' : 'bg-zinc-50 border-zinc-200/50'
              }`}>
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <p className="text-[11px] font-extrabold leading-tight text-indigo-750 dark:text-indigo-400">
                    {pollQuestion}
                  </p>
                </div>
                <div className="space-y-1.5">
                  {pollOptions.filter(opt => opt.trim()).map((opt, i) => (
                    <div key={i} className={`p-2.5 rounded-lg border text-[10px] font-bold flex items-center justify-between ${
                      isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-250'
                    }`}>
                      <span className="truncate">{opt}</span>
                      <span className="text-[9px] font-mono opacity-60">0% (preview)</span>
                    </div>
                  ))}
                  {pollOptions.filter(opt => opt.trim()).length === 0 && (
                    <p className="text-[10px] text-zinc-400 italic">Configure choice options on the left dashboard.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Social micro action bar */}
          <div className="flex items-center justify-around pt-3.5 border-t border-zinc-150/80 dark:border-zinc-800 text-[11px] font-black text-zinc-400 font-mono">
            <span>❤ 0 Likes</span>
            <span>✉ 0 Replies</span>
            <span className="flex items-center gap-1">⎋ Instant Sync</span>
          </div>
        </div>

        {/* Quick Tips */}
        <div className={`p-4 rounded-2xl border text-[11px] leading-relaxed font-bold ${
          isDark ? 'bg-zinc-950 border-zinc-850 text-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-550'
        }`}>
          <span className="text-indigo-600 block mb-0.5 uppercase tracking-wider font-mono">Student Publishing standards:</span>
          <span>Be respectful. Make sure your graphics aren't copyright infringed, or obscene materials or advertisements for external non-affiliated entities. All posts get permanently cataloged into the campus offline cache directory.</span>
        </div>
      </div>
    </div>
  );
}
