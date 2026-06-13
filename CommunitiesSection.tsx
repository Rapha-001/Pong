/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Community, Post, StudentProfile } from '../types';
import { Users, Info, ShieldAlert, Heart, MessageSquare, ArrowLeft, Plus, CheckCircle, Flame, DoorOpen, Image, Camera, Upload, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommunitiesSectionProps {
  currentUser: StudentProfile;
  communities: Community[];
  posts: Post[];
  onUpdateCommunity: (community: Community) => void;
  onUpdatePost: (post: Post) => void;
  onViewProfile?: (userId: string) => void;
  onShowToast: (msg: string, type: 'success' | 'warn') => void;
  onCreateCommunity?: (community: Community) => void;
  onDeleteCommunity?: (communityId: string) => void;
}

const BANNER_PRESETS = [
  { name: 'Modern Tech', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800' },
  { name: 'Cozy Library', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800' },
  { name: 'Creative Hub', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800' },
  { name: 'Social Lounge', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800' },
  { name: 'Business Deck', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800' }
];

const LOGO_PRESETS = ['💻', '⚖️', '🚀', '🎨', '🧠', '📢', '📚', '⚽', '♟️', '🎵', '📸', '🔬', '🌍', '🤝'];

const isImageLogo = (logo: string) => {
  if (!logo) return false;
  return logo.startsWith('data:') || logo.startsWith('http://') || logo.startsWith('https://') || logo.includes('.') || logo.startsWith('/');
};

export default function CommunitiesSection({
  currentUser,
  communities,
  posts,
  onUpdateCommunity,
  onUpdatePost,
  onViewProfile,
  onShowToast,
  onCreateCommunity,
  onDeleteCommunity,
}: CommunitiesSectionProps) {
  // Selected community ID for details slide-in
  const [selectedCommId, setSelectedCommId] = useState<string | null>(null);

  // Filter tab
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Academic' | 'Professional' | 'Hobby' | 'Social'>('All');

  // Creation State
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Creation fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Academic' | 'Professional' | 'Hobby' | 'Social'>('Academic');
  const [selectedBanner, setSelectedBanner] = useState(BANNER_PRESETS[0].url);
  const [customBannerUrl, setCustomBannerUrl] = useState('');
  const [selectedLogo, setSelectedLogo] = useState('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=155');
  const [rules, setRules] = useState([
    'Respect other members and invite constructive feedback.',
    'No spam or irrelevant promotion of outside resources.',
    'Share campus-related tips and support peer learning.'
  ]);

  const selectedCommunity = communities.find(c => c.id === selectedCommId);

  // Compressor utility to convert files to responsive light compressed DataURLs
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const max_size = 800; // compress nicely
          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  // Toggle membership
  const handleToggleJoin = (comm: Community) => {
    const isMember = comm.members.includes(currentUser.id);
    let updatedMembers: string[];
    let change = 0;

    if (isMember) {
      updatedMembers = comm.members.filter(id => id !== currentUser.id);
      change = -1;
    } else {
      updatedMembers = [...comm.members, currentUser.id];
      change = 1;
    }

    onUpdateCommunity({
      ...comm,
      members: updatedMembers,
      membersCount: comm.membersCount + change
    });

    onShowToast(
      isMember 
        ? `Left ${comm.name}. You will no longer receive priority updates.` 
        : `Successfully joined ${comm.name}! Welcome to the fellowship.`,
      'success'
    );
  };

  // Find posts belonging to members of the community
  const getCommunityPosts = (comm: Community) => {
    return posts.filter(post => comm.members.includes(post.authorId));
  };

  const handleRuleChange = (index: number, val: string) => {
    const updated = [...rules];
    updated[index] = val;
    setRules(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onShowToast('Please provide a proper forum name.', 'warn');
      return;
    }
    if (!description.trim()) {
      onShowToast('Please provide a short description for members to read.', 'warn');
      return;
    }

    const finalBanner = customBannerUrl.trim() ? customBannerUrl.trim() : selectedBanner;

    const newCommunity: Community = {
      id: `comm_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      category: category,
      banner: finalBanner,
      logo: selectedLogo,
      membersCount: 1,
      members: [currentUser.id],
      rules: rules.filter(r => r.trim() !== ''),
      creatorId: currentUser.id
    };

    if (onCreateCommunity) {
      onCreateCommunity(newCommunity);
    }
    
    // Reset state & go back
    setIsCreating(false);
    setName('');
    setDescription('');
    setCategory('Academic');
    setSelectedBanner(BANNER_PRESETS[0].url);
    setCustomBannerUrl('');
    setSelectedLogo('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=155');
    setRules([
      'Respect other members and invite constructive feedback.',
      'No spam or irrelevant promotion of outside resources.',
      'Share campus-related tips and support peer learning.'
    ]);
  };

  const filteredCommunities = communities.filter(c => {
    if (categoryFilter === 'All') return true;
    return c.category === categoryFilter;
  });

  return (
    <div className="space-y-6" id="communities-section-workspace">
      <AnimatePresence mode="wait">
        {isCreating ? (
          // CREATION FORM VIEW
          <motion.div
            key="create-community-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 animate-fade-in"
          >
            {/* Nav Back Header */}
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex items-center gap-1 text-xs font-bold text-zinc-650 hover:text-zinc-950 transition bg-zinc-100 hover:bg-zinc-200 px-3.5 py-2 rounded-xl border border-zinc-200 cursor-pointer w-fit"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Discard &amp; Return</span>
              </button>
              
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50/80 px-2.5 py-1 rounded-full border border-indigo-100">
                  New Channel Blueprint
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Core forum specifications */}
              <div className="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm">
                <div>
                  <h3 className="text-xl font-extrabold text-zinc-950 tracking-tight">Establish an Elite Campus Forum</h3>
                  <p className="text-zinc-500 text-xs mt-1">Initiate a micro-community to discuss academic goals, share project checklists, or build special teams.</p>
                </div>

                <div className="space-y-4">
                  {/* Forum Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="forum-name" className="block text-xs font-black uppercase text-zinc-500 tracking-wider">
                      Forum Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="forum-name"
                      type="text"
                      required
                      placeholder="e.g. UniUyo Chess Masters, Economics Debate Guild"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-50 text-zinc-950 px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  {/* Category select */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label htmlFor="forum-category" className="block text-xs font-black uppercase text-zinc-500 tracking-wider">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="forum-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full bg-zinc-50 text-zinc-950 px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                      >
                        <option value="Academic">Academic</option>
                        <option value="Professional">Professional</option>
                        <option value="Hobby">Hobby</option>
                        <option value="Social">Social</option>
                      </select>
                    </div>

                    {/* Replaced Logo Emoji Selector with Real Image Selector */}
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <span className="block text-xs font-black uppercase text-zinc-500 tracking-wider">
                        Forum Logo Image <span className="text-red-500">*</span>
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-zinc-100 rounded-2xl border border-zinc-250 flex items-center justify-center overflow-hidden shadow-inner shrink-0 relative">
                          {isImageLogo(selectedLogo) ? (
                            <img
                              src={selectedLogo}
                              alt="Forum logo preview"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Camera className="w-5 h-5 text-zinc-400" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <input
                            type="file"
                            id="forum-logo-picker"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const base64 = await compressImage(file);
                                  setSelectedLogo(base64);
                                } catch (err) {
                                  onShowToast("Could not process logo image file.", "warn");
                                }
                              }
                            }}
                          />
                          <label
                            htmlFor="forum-logo-picker"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-black uppercase rounded-lg shadow-sm transition cursor-pointer select-none"
                          >
                            <Camera className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Pick Logo</span>
                          </label>
                          <p className="text-[9px] text-zinc-400 mt-0.5 leading-none font-medium">Select a square logo file.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Logo selection list */}
                  <div className="space-y-1.5 bg-zinc-50 p-3.5 rounded-xl border border-zinc-200/80">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-zinc-400">
                      Or Choose a Premium preset Logo icon
                    </span>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      {[
                        { title: 'Academic', url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=150' },
                        { title: 'Tech', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=150' },
                        { title: 'Creative', url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=150' },
                        { title: 'Social', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=150' }
                      ].map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => setSelectedLogo(preset.url)}
                          className={`group relative w-12 h-12 rounded-xl overflow-hidden transition border cursor-pointer ${
                            selectedLogo === preset.url
                              ? 'border-indigo-505 ring-2 ring-indigo-500/30 ring-offset-1'
                              : 'border-zinc-200 hover:border-zinc-400'
                          }`}
                          title={`Logo preset: ${preset.title}`}
                        >
                          <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150">
                            <span className="text-[8px] text-white font-extrabold uppercase">{preset.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tagline description */}
                  <div className="space-y-1.5">
                    <label htmlFor="forum-description" className="block text-xs font-black uppercase text-zinc-500 tracking-wider">
                      Forum Description &amp; Summary <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="forum-description"
                      rows={3}
                      required
                      placeholder="Write a clear summary about who this channel is for, what kind of threads are posted here, and goals of this group..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-zinc-50 text-zinc-950 px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  {/* Channel Regulations */}
                  <div className="space-y-2.5">
                    <div>
                      <span className="block text-xs font-black uppercase text-zinc-400 tracking-wider">
                        Channel Regulations / Rules (Optional)
                      </span>
                      <p className="text-[10px] text-zinc-400">Establish standard community guidelines to keep discussions organized and healthy.</p>
                    </div>

                    <div className="space-y-2">
                      {rules.map((rule, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <span className="text-xs font-bold text-zinc-400 bg-zinc-100 rounded-lg w-6 h-6 flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            placeholder="Add rule content here"
                            value={rule}
                            onChange={(e) => handleRuleChange(idx, e.target.value)}
                            className="w-full bg-zinc-50 text-zinc-950 px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Covers and submits */}
              <div className="space-y-6">
                {/* Visual Banner picker panel */}
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
                  <span className="block text-xs font-black uppercase text-zinc-500 tracking-wider">
                    Background Cover Preview
                  </span>

                  {/* Banner live mockup card */}
                  <div className="h-28 rounded-xl bg-zinc-100 relative overflow-hidden border border-zinc-200">
                    <img
                      src={customBannerUrl.trim() ? customBannerUrl.trim() : selectedBanner}
                      alt="Current chosen banner cover"
                      className="w-full h-full object-cover opacity-90"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = BANNER_PRESETS[0].url;
                      }}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 p-1 px-2.2 rounded-lg text-xs font-extrabold shadow border border-zinc-100 flex items-center gap-1.5">
                      {isImageLogo(selectedLogo) ? (
                        <img
                          src={selectedLogo}
                          alt="logo"
                          className="w-5 h-5 rounded-md object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-sm">{selectedLogo}</span>
                      )}
                      <span className="text-[11px] font-sans font-extrabold text-zinc-950 max-w-[130px] truncate">{name || "Forum Preview"}</span>
                    </div>
                  </div>

                  {/* Preset catalog list */}
                  <div className="space-y-2">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-zinc-400">
                      Choose Preset Backgrounds
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      {BANNER_PRESETS.map((bp) => (
                        <button
                          key={bp.name}
                          type="button"
                          onClick={() => {
                            setSelectedBanner(bp.url);
                            setCustomBannerUrl('');
                          }}
                          className={`group relative h-16 rounded-lg overflow-hidden border transition cursor-pointer ${
                            selectedBanner === bp.url && !customBannerUrl
                              ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                              : 'border-zinc-200 shadow-inner'
                          }`}
                        >
                          <img
                            src={bp.url}
                            alt={bp.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                            <span className="text-[9px] font-bold text-white tracking-wide truncate">{bp.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Banner Upload + link */}
                  <div className="space-y-2 pt-2 border-t border-zinc-100">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-zinc-400">
                      Or Upload/Paste Custom Banner Cover
                    </span>

                    <input
                      type="file"
                      id="forum-banner-picker"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const base64 = await compressImage(file);
                            setCustomBannerUrl(base64);
                          } catch (err) {
                            onShowToast("Could not process banner cover file.", "warn");
                          }
                        }
                      }}
                    />

                    <div className="flex gap-2">
                      <label
                        htmlFor="forum-banner-picker"
                        className="flex-1 flex items-center justify-center gap-1 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-750 text-[10px] font-black uppercase py-2 rounded-xl shadow-xs cursor-pointer select-none"
                      >
                        <Upload className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Upload file</span>
                      </label>

                      <input
                        id="custom-banner"
                        type="text"
                        placeholder="Or paste banner image link"
                        value={customBannerUrl.startsWith('data:') ? '' : customBannerUrl}
                        onChange={(e) => setCustomBannerUrl(e.target.value)}
                        className="flex-1 bg-zinc-50 text-zinc-950 px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* Confirm Action trigger */}
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-3">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Launch Forum Channel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="w-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 font-extrabold text-xs py-2.5 px-3 rounded-xl transition cursor-pointer text-center"
                  >
                    Cancel Blueprint
                  </button>

                  <div className="flex gap-2 p-2 rounded-xl bg-zinc-50 border border-zinc-100 text-[10.5px] text-zinc-500 leading-normal font-medium">
                    <Info className="w-3.5 h-3.5 text-zinc-405 shrink-0 mt-0.5" />
                    <span>Creating this community forum joins you automatically as its founding member and adds <strong>+25 points</strong> to your leaderboard rating.</span>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        ) : !selectedCommId ? (
          // GRID VIEW: Browse Communities
          <motion.div
            key="grid-communities-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 animate-fade-in"
          >
            {/* Header row with filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-none sm:rounded-2xl border-y sm:border border-x-0 border-zinc-200">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-900 tracking-tight">University Forums &amp; Fellowships</h3>
                <p className="text-zinc-500 text-xs">Mini student-run networks grouped by academic faculty and daily focus interests.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-wrap gap-1">
                  {(['All', 'Academic', 'Professional', 'Hobby', 'Social'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                          : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-650 border-zinc-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="h-6 w-px bg-zinc-200 hidden md:block" />

                <button
                  onClick={() => setIsCreating(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold py-1.5 px-3 rounded-xl transition flex items-center gap-1 cursor-pointer shadow-sm ml-auto"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>Create Forum</span>
                </button>
              </div>
            </div>

            {/* Communities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredCommunities.map((comm) => {
                const isMember = comm.members.includes(currentUser.id);
                return (
                  <div
                    key={comm.id}
                    className="bg-white rounded-none sm:rounded-2xl border-y sm:border border-x-0 border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group h-full"
                  >
                    {/* Banner cover */}
                    <div className="h-28 bg-zinc-100 relative">
                      <img
                        src={comm.banner}
                        alt={comm.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-1.5 rounded-xl text-lg shadow-sm border border-zinc-100 w-10 h-10 flex items-center justify-center font-bold overflow-hidden">
                        {isImageLogo(comm.logo) ? (
                          <img
                            src={comm.logo}
                            alt="logo"
                            className="w-full h-full object-cover rounded-lg"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span>{comm.logo}</span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 shrink-0">
                        <span className="bg-zinc-900/80 backdrop-blur-sm text-zinc-100 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                          {comm.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="font-extrabold text-zinc-950 text-base group-hover:text-indigo-600 transition tracking-tight">
                          {comm.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-zinc-500 font-medium mt-1">
                          <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span>{comm.membersCount} student members</span>
                        </div>
                        <p className="text-zinc-600 text-xs mt-3 leading-relaxed line-clamp-2">
                          {comm.description}
                        </p>
                      </div>

                      {/* Controls Footer */}
                      <div className="flex gap-2.5 pt-2">
                        <button
                          onClick={() => setSelectedCommId(comm.id)}
                          className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold py-2 px-3 rounded-xl transition text-center cursor-pointer"
                        >
                          Discover Forum
                        </button>

                        <button
                          onClick={() => handleToggleJoin(comm)}
                          className={`flex items-center justify-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                            isMember
                              ? 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-red-600 hover:bg-red-50/50 hover:border-red-200'
                              : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                          }`}
                        >
                          {isMember ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Joined</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 shrink-0" />
                              <span>Join Group</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          // DETAILED INDIVIDUAL COMMUNITY VIEW
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Nav Back Button */}
            <button
              onClick={() => setSelectedCommId(null)}
              className="flex items-center gap-1 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200 cursor-pointer w-fit"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Forums Index</span>
            </button>

            {selectedCommunity && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Col 1 & 2: Main Area (Header, Restricted Comm Feed) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Detailed Banner Deck */}
                  <div className="bg-white rounded-none sm:rounded-2xl border-y sm:border border-x-0 border-zinc-200 overflow-hidden shadow-sm">
                    <div className="h-44 relative bg-zinc-800">
                      <img
                        src={selectedCommunity.banner}
                        alt={selectedCommunity.name}
                        className="w-full h-full object-cover opacity-85"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-white p-2 shadow border border-zinc-100 font-bold w-14 h-14 flex items-center justify-center overflow-hidden rounded-2xl">
                        {isImageLogo(selectedCommunity.logo) ? (
                          <img
                            src={selectedCommunity.logo}
                            alt="logo"
                            className="w-full h-full object-cover rounded-xl"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span>{selectedCommunity.logo}</span>
                        )}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 pb-4 border-b border-zinc-100">
                        <div>
                          <h2 className="text-2xl font-extrabold text-zinc-950 tracking-tight">
                            {selectedCommunity.name}
                          </h2>
                          <div className="flex items-center gap-3 text-xs text-zinc-500 font-bold mt-1 uppercase">
                            <span className="bg-zinc-100 px-2 py-0.5 rounded text-zinc-700">
                              {selectedCommunity.category} Channel
                            </span>
                            <span>•</span>
                            <span>{selectedCommunity.membersCount} connected Students</span>
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          {selectedCommunity.creatorId === currentUser.id && onDeleteCommunity && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this forum? This is permanent and deletes all members and threads.")) {
                                  onDeleteCommunity(selectedCommunity.id);
                                  setSelectedCommId(null);
                                }
                              }}
                              className="px-4 py-2.5 rounded-xl text-xs font-bold text-red-650 bg-red-50 hover:bg-red-100 border border-red-200 transition cursor-pointer flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Forum</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleToggleJoin(selectedCommunity)}
                            className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                              selectedCommunity.members.includes(currentUser.id)
                                ? 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-red-600 hover:bg-red-50/50 hover:border-red-200'
                                : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                            }`}
                          >
                            {selectedCommunity.members.includes(currentUser.id) ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Joined Community</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 shrink-0" />
                                <span>Join Fellowship</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <p className="text-zinc-700 text-sm leading-relaxed">
                        {selectedCommunity.description}
                      </p>
                    </div>
                  </div>

                  {/* Restrict Community Feed */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-sm font-bold text-zinc-800 uppercase tracking-widest pl-1">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span>Fellowship Feed Stream ({getCommunityPosts(selectedCommunity).length})</span>
                    </div>

                    {getCommunityPosts(selectedCommunity).length > 0 ? (
                      getCommunityPosts(selectedCommunity).map((post) => (
                        <div
                          key={post.id}
                          className="bg-white rounded-none sm:rounded-2xl border-y sm:border border-x-0 border-zinc-200 p-5 shadow-sm space-y-4"
                        >
                          <div 
                            onClick={() => onViewProfile && onViewProfile(post.authorId)}
                            className="flex gap-3 items-start cursor-pointer group select-none"
                            title="Click to view student profile"
                          >
                            <img
                              src={post.authorAvatar}
                              alt={post.authorName}
                              className="w-9 h-9 rounded-xl object-cover shrink-0 group-hover:ring-2 group-hover:ring-indigo-500/40 transition-all duration-200"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span className="font-extrabold text-zinc-950 text-sm block group-hover:text-indigo-600 transition-colors duration-150">
                                {post.authorName}
                              </span>
                              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-700 transition-colors block">
                                {post.authorRole} • {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-zinc-700 leading-normal">
                            {post.content}
                          </p>

                          {post.image && (
                            <div className="rounded-xl overflow-hidden max-h-60 bg-zinc-100">
                              <img
                                src={post.image}
                                alt="community dynamic post detail"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-zinc-400 font-bold border-t border-zinc-100 pt-3">
                            <span>{(post.likes || []).length} Likes</span>
                            <span>•</span>
                            <span>{(post.comments || []).length} Comments</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-zinc-50 text-center rounded-2xl py-10 px-5 border border-dashed border-zinc-200">
                        <Users className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                        <p className="text-zinc-700 text-xs font-bold">No posts by this group members yet</p>
                        <p className="text-zinc-400 text-[10px] mt-0.5">As members write on the main stream, their feeds appear here automatically!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Col 3: Sidebar rules, member checklist */}
                <div className="space-y-6">
                  {/* Community Rules Panel */}
                  {selectedCommunity.rules && (
                    <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm space-y-3.5">
                      <div className="flex items-center gap-1 text-xs font-extrabold text-zinc-800 uppercase tracking-widest pb-2 border-b border-zinc-100">
                        <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>Channel Regulations</span>
                      </div>

                      <ol className="list-decimal pl-4.5 space-y-2 text-xs text-zinc-600 font-medium">
                        {selectedCommunity.rules.map((rule, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {rule}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* connected student list checklist */}
                  <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-1 text-xs font-extrabold text-zinc-800 uppercase tracking-widest pb-2 border-b border-zinc-100">
                      <Users className="w-4 h-4 text-zinc-400 shrink-0" />
                      <span>Roster Members ({selectedCommunity.membersCount})</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-100 text-center col-span-2">
                        <span className="block text-xl font-black text-indigo-600">{selectedCommunity.membersCount}</span>
                        <span className="block text-[9px] font-bold uppercase text-zinc-400">Total Joined Student Representatives</span>
                      </div>
                    </div>
                    
                    <p className="text-[11px] text-zinc-500 leading-normal">
                      Students who are in this forum can swap tips, collaborate on shared hackathons, and post projects.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
