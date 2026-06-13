/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Event, StudentProfile } from '../types';
import { Calendar, MapPin, Clock, Users, Plus, ArrowLeft, Heart, CheckCircle2, Star, Megaphone, Camera, Trash2, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EventsSectionProps {
  currentUser: StudentProfile;
  events: Event[];
  onAddEvent: (evt: Event) => void;
  onUpdateEvent: (evt: Event) => void;
  offlineMode: boolean;
  onShowToast: (msg: string, type: 'success' | 'warn') => void;
  onDeleteEvent?: (eventId: string) => void;
  onAddNotification?: (notif: {
    userId: string;
    type: 'post_interaction' | 'event_rsvp' | 'mentorship_request' | 'announcement';
    title: string;
    message: string;
    senderName: string;
    senderAvatar: string;
    targetId: string;
  }) => void;
}

export default function EventsSection({
  currentUser,
  events,
  onAddEvent,
  onUpdateEvent,
  offlineMode,
  onShowToast,
  onDeleteEvent,
  onAddNotification,
}: EventsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>('All');
  
  // Create state overlay
  const [showCreator, setShowCreator] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('2026-06-25');
  const [time, setTime] = useState('11:00 AM');
  const [venue, setVenue] = useState('');
  const [category, setCategory] = useState<'Tech' | 'Social' | 'Academic' | 'Gathering' | 'Religious'>('Tech');
  const [banner, setBanner] = useState('');

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

  const categories = ['All', 'Academic', 'Social', 'Tech', 'Gathering'];

  const handleToggleRSVP = (evt: Event) => {
    const isAttending = evt.rsvps.includes(currentUser.id);
    let updatedRSVPs: string[];

    if (isAttending) {
      updatedRSVPs = evt.rsvps.filter(id => id !== currentUser.id);
      onShowToast(`RSVP retrieved for ${evt.title}. Seats released.`, 'success');
    } else {
      updatedRSVPs = [...evt.rsvps, currentUser.id];
      onShowToast(`Reservation confirmed for ${evt.title}! See you there.`, 'success');
      
      // Dispatch real-time local state notification alert
      if (onAddNotification) {
        onAddNotification({
          userId: currentUser.id,
          type: 'event_rsvp',
          title: 'Event RSVP Confirmed',
          message: `Your reservation seat has been confirmed for "${evt.title}".`,
          senderName: evt.hostName,
          senderAvatar: evt.hostAvatar,
          targetId: evt.id
        });
      }
    }

    onUpdateEvent({
      ...evt,
      rsvps: updatedRSVPs
    });
  };

  const handlePublishEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venue.trim() || !desc.trim()) {
      onShowToast('Please fill in Title, Venue, and description!', 'warn');
      return;
    }

    // Default stock photos
    const defaultIllustrations: { [cat: string]: string } = {
      Tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
      Academic: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
      Social: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
      Gathering: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'
    };

    const finalBanner = banner.trim() 
      ? banner.trim() 
      : defaultIllustrations[category] || defaultIllustrations.Gathering;

    const newEvt: Event = {
      id: `evt_${Date.now()}`,
      title: title.trim(),
      description: desc.trim(),
      hostId: currentUser.id,
      hostName: currentUser.name,
      hostAvatar: currentUser.avatar,
      date,
      time,
      venue: venue.trim(),
      category,
      banner: finalBanner,
      rsvps: [currentUser.id], // Auto reserve for host
      createdAt: new Date().toISOString()
    };

    onAddEvent(newEvt);

    // Reset fields
    setTitle('');
    setDesc('');
    setVenue('');
    setBanner('');
    setShowCreator(false);
    onShowToast(offlineMode ? 'Event compiled to offline cache!' : 'Campus forum announced!', 'success');
  };

  const filteredEvents = events.filter((evt) => {
    if (activeTab === 'All') return true;
    return evt.category === activeTab;
  });

  return (
    <div className="space-y-6" id="events-section-workspace">
      <AnimatePresence mode="wait">
        {!showCreator ? (
          // MAIN STATE: Calendar listings
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header section layout */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-none sm:rounded-xl border-y sm:border border-x-0 border-zinc-200">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-950 tracking-tight">University Calendar &amp; Meetups</h3>
                <p className="text-zinc-500 text-xs">RSVP and secure seats to local hackathons, fellowships, department programs, and photo walks.</p>
              </div>

              <button
                onClick={() => setShowCreator(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>BroadCast Event</span>
              </button>
            </div>

            {/* Category tabs filters */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveTab(c)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition border cursor-pointer shrink-0 ${
                    activeTab === c
                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                  }`}
                >
                  {c === 'All' ? '📅 All Meetups' : `${c} Series`}
                </button>
              ))}
            </div>

            {/* Grid display layouts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((evt) => {
                const isAttending = evt.rsvps.includes(currentUser.id);
                return (
                  <div
                    key={evt.id}
                    className="bg-white rounded-none sm:rounded-2xl border-y sm:border border-x-0 border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between h-full"
                  >
                    {/* Cover Photo */}
                    <div className="h-36 bg-zinc-800 relative">
                      <img
                        src={evt.banner}
                        alt={evt.title}
                        className="w-full h-full object-cover opacity-85"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                        <span className="bg-zinc-900/80 backdrop-blur-sm text-zinc-100 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                          {evt.category}
                        </span>

                        {evt.hostId === currentUser.id && onDeleteEvent && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to cancel and delete "${evt.title}"?`)) {
                                onDeleteEvent(evt.id);
                              }
                            }}
                            className="p-1.5 bg-zinc-900/80 hover:bg-red-600 rounded-full text-white transition hover:scale-105 shadow-sm border border-white/10 shrink-0 cursor-pointer"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content Panel */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <h4 className="font-extrabold text-zinc-950 text-sm tracking-tight leading-snug line-clamp-2">
                          {evt.title}
                        </h4>

                        {/* Event coordinates labels */}
                        <div className="space-y-1 text-[11px] text-zinc-500 font-semibold bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span>Date: {evt.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span>Time: {evt.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="truncate">Venue: {evt.venue}</span>
                          </div>
                        </div>

                        <p className="text-zinc-650 text-[11px] leading-relaxed line-clamp-3">
                          {evt.description}
                        </p>
                      </div>

                      {/* Footer attending checks */}
                      <div className="flex items-center justify-between border-t border-zinc-100 pt-3 mt-1.5">
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold">
                          <Users className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{evt.rsvps.length} Stud RSVPs</span>
                        </div>

                        <button
                          onClick={() => handleToggleRSVP(evt)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition border cursor-pointer ${
                            isAttending
                              ? 'bg-teal-50 border-teal-200 text-teal-800'
                              : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {isAttending ? 'Reservation Sloted ✓' : 'Reserve Seat'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          // CREATOR PANEL FORM ENVELOPE
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm max-w-2xl mx-auto space-y-6"
          >
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <button
                onClick={() => setShowCreator(false)}
                className="p-1 px-2.5 bg-zinc-100 hover:bg-zinc-200 rounded text-xs font-bold transition text-zinc-700 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <h3 className="font-extrabold text-base text-zinc-950 tracking-tight flex items-center gap-2 ml-2 animate-bounce">
                <Megaphone className="w-4 h-4 text-orange-500" />
                <span>Broadcasting Student Gatherings</span>
              </h3>
            </div>

            <form onSubmit={handlePublishEvent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">Event Title*</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:outline-none"
                    placeholder="e.g., Moot Court Sparring Cup"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">Meetup Category*</label>
                  <select
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs bg-white focus:outline-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                  >
                    <option value="Tech">Tech / Coding Hack</option>
                    <option value="Social">Social / Entertainment</option>
                    <option value="Academic">Academic Class / Debate</option>
                    <option value="Gathering">General Group Gathering</option>
                    <option value="Religious">Fellowship / Prayers</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">Target Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:outline-none"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">Target Time</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:outline-none"
                    placeholder="e.g., 04:30 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">Specific Venue*</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:outline-none"
                    placeholder="e.g., Moot Court Block, Town Campus"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">Event promotional details</label>
                <textarea
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:outline-none"
                  placeholder="Tell students what to expect. Stipulate the agenda, whether certificates/meals are provided, or list maximum seat caps..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest">Cover/Banner Image Source (Optional)</label>
                <input
                  type="file"
                  id="event-banner-picker"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const base64 = await compressImage(file);
                        setBanner(base64);
                        onShowToast("Promo flyer image attached successfully!", "success");
                      } catch (err) {
                        onShowToast("Could not process flyer image file.", "warn");
                      }
                    }
                  }}
                />
                
                <div className="flex gap-2.5">
                  <label
                    htmlFor="event-banner-picker"
                    className="flex items-center justify-center gap-1 bg-white hover:bg-zinc-50 border border-zinc-250 text-zinc-750 text-[10px] font-black uppercase px-3.5 py-2.5 rounded-xl shadow-xs cursor-pointer select-none shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Upload flyer</span>
                  </label>

                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Or paste custom flyer link"
                    value={banner.startsWith('data:') ? '' : banner}
                    onChange={(e) => setBanner(e.target.value)}
                  />
                </div>

                {banner && (
                  <div className="h-20 w-40 rounded-lg overflow-hidden border border-zinc-200 mt-2 relative">
                    <img src={banner} className="w-full h-full object-cover" alt="Banner preview" />
                    <button
                      type="button"
                      onClick={() => setBanner('')}
                      className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full text-white hover:bg-black/80"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                <span className="block text-[10px] text-zinc-400">If left blank, our engine will automatically attach beautiful high-resolution campus graphics matching the category.</span>
              </div>

              <div className="flex justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreator(false)}
                  className="px-4 py-2 border border-zinc-300 hover:bg-zinc-100 rounded-xl font-bold text-xs cursor-pointer text-zinc-700"
                >
                  Cancel Listing
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-sm"
                >
                  Announce Gathering
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
