/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { X, Mail, MapPin, Award, Link2, ExternalLink, ShieldCheck, Sparkles, Star, Check, UserPlus, UserCheck, Copy, Share2, Handshake } from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileViewModalProps {
  profile: StudentProfile | null;
  onClose: () => void;
  onShowToast: (msg: string, type: 'success' | 'warn') => void;
  currentUser: StudentProfile;
  theme?: 'light' | 'dark';
  onAddNotification?: (notif: {
    userId: string;
    type: 'post_interaction' | 'event_rsvp' | 'mentorship_request' | 'announcement';
    title: string;
    message: string;
    senderName: string;
    senderAvatar: string;
    targetId?: string;
  }) => void;
}

export default function ProfileViewModal({
  profile,
  onClose,
  onShowToast,
  currentUser,
  theme = 'light',
  onAddNotification
}: ProfileViewModalProps) {
  const [connectedIds, setConnectedIds] = useState<string[]>(['student_chidi', 'student_emem']);
  const [mentorshipRequested, setMentorshipRequested] = useState<boolean>(false);

  if (!profile) return null;

  const isSelf = profile.id === currentUser.id;
  const isConnected = connectedIds.includes(profile.id);

  const toggleConnection = () => {
    if (isConnected) {
      setConnectedIds(prev => prev.filter(id => id !== profile.id));
      onShowToast(`Disconnected with ${profile.name}`, 'warn');
    } else {
      setConnectedIds(prev => [...prev, profile.id]);
      onShowToast(`Successfully connected with ${profile.name}!`, 'success');
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    onShowToast("Email address copied to clipboard!", "success");
  };

  const shareProfile = () => {
    const text = `Connect with ${profile.name} (${profile.role} at UniUyo) on UniUyo Connect! Department: ${profile.department}.`;
    navigator.clipboard.writeText(text);
    onShowToast("Profile details summary copied to clipboard!", "success");
  };

  // Determine dark mode class
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" id="profile-view-modal-portal">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-zinc-950/75 transition-opacity"
      />

      {/* Frame Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
        className={`relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border ${
          isDark 
            ? 'bg-zinc-900 border-zinc-800 text-zinc-100' 
            : 'bg-white border-zinc-200 text-zinc-800'
        } z-10 my-4`}
        id={`modal-card-${profile.id}`}
      >
        {/* Cover Image or Gradient */}
        <div className="h-36 w-full relative bg-zinc-800 overflow-hidden shrink-0">
          {profile.coverImage ? (
            <img
              src={profile.coverImage}
              alt="Profile Cover Background"
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80"></div>
          )}

          {/* Close button inside cover */}
          <button
            onClick={onClose}
            className={`absolute top-3 right-3 p-1.5 rounded-full transition shadow-xs ${
              isDark 
                ? 'bg-zinc-950/60 text-zinc-300 hover:text-white hover:bg-zinc-950/90' 
                : 'bg-white/90 text-zinc-700 hover:text-zinc-950 hover:bg-white'
            }`}
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Role badge */}
          <span className="absolute bottom-3 right-3 bg-zinc-950/85 text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-md uppercase">
            {profile.role}
          </span>
        </div>

        {/* Card Body content */}
        <div className="px-5 sm:px-6 pb-6 relative flex-1 overflow-y-auto no-scrollbar">
          
          {/* Avatar and Info Header wrapper */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-4 gap-3">
            <div className="relative inline-block">
              <img
                src={profile.avatar}
                alt={profile.name}
                className={`w-24 h-24 rounded-2xl object-cover shadow-md border-4 ${
                  isDark ? 'border-zinc-900 bg-zinc-800' : 'border-white bg-zinc-100'
                }`}
                referrerPolicy="no-referrer"
              />
              {profile.verified && (
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 p-0.5 rounded-full shadow-xs border border-zinc-200 dark:border-zinc-800">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 fill-indigo-100 dark:fill-indigo-950 shrink-0" />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-1.5 sm:pt-0">
              {/* Connection Buttons */}
              {!isSelf && (
                <>
                  <button
                    type="button"
                    onClick={toggleConnection}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer shadow-xs ${
                      isConnected
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 hover:border-red-200'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold border border-indigo-600'
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Connect Peer</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (mentorshipRequested) {
                        onShowToast(`Mentorship already requested with ${profile.name}`, "warn");
                        return;
                      }
                      setMentorshipRequested(true);
                      onShowToast(`Mentorship request dispatched to ${profile.name}!`, "success");
                      
                      if (onAddNotification) {
                        onAddNotification({
                          userId: currentUser.id,
                          type: 'mentorship_request',
                          title: 'Mentorship Dispatched',
                          message: `Your mentoring request on research scaling has successfully been logged for ${profile.name}.`,
                          senderName: profile.name,
                          senderAvatar: profile.avatar,
                          targetId: profile.id
                        });
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer shadow-xs ${
                      mentorshipRequested
                        ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200'
                        : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-705 text-white border border-zinc-905'
                    }`}
                  >
                    {mentorshipRequested ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-amber-500" />
                        <span>Pending Approval</span>
                      </>
                    ) : (
                      <>
                        <Handshake className="w-3.5 h-3.5" />
                        <span>Request Mentorship</span>
                      </>
                    )}
                  </button>
                </>
              )}

              {/* Share details */}
              <button
                type="button"
                onClick={shareProfile}
                className={`p-2 rounded-xl border transition cursor-pointer flex items-center justify-center ${
                  isDark
                    ? 'border-zinc-800 bg-zinc-800/40 text-zinc-300 hover:text-white hover:bg-zinc-800'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-650 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
                title="Share Student Profile info"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* User Meta Information */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  {profile.name}
                </h3>
                {profile.verified && (
                  <span className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-150 dark:border-indigo-900 text-indigo-700 dark:text-indigo-400 text-[10px] font-black uppercase py-0.5 px-2 rounded-md h-5 flex items-center gap-0.5 select-none font-mono">
                    <Star className="w-2.5 h-2.5 fill-indigo-600" /> Rep
                  </span>
                )}
                {isSelf && (
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                    You
                  </span>
                )}
              </div>

              {/* Department levels */}
              <div className={`mt-1 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-150 dark:border-zinc-800/60 p-3 rounded-xl flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{profile.department} ({profile.level})</span>
                </span>
                <span className="inline-block w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full"></span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Faculty of {profile.faculty}</span>
                </span>
                <span className="inline-block w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full"></span>
                <button
                  onClick={copyEmail}
                  className="flex items-center gap-1.5 group hover:text-indigo-600 transition cursor-pointer select-none"
                  title="Click to copy email address"
                >
                  <Mail className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-500" />
                  <span className="underline decoration-zinc-300/60 decoration-dashed underline-offset-2">{profile.email}</span>
                  <Copy className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition" />
                </button>
              </div>
            </div>

            {/* Biography section */}
            <div className="space-y-1.5">
              <h4 className={`text-[10px] font-black uppercase tracking-wider font-mono flex items-center gap-1 ${
                isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> Biography Summary
              </h4>
              <p className={`text-xs leading-relaxed p-3.5 rounded-xl border border-dashed text-left ${
                isDark 
                  ? 'bg-zinc-950/30 border-zinc-800 text-zinc-300' 
                  : 'bg-zinc-50/50 border-zinc-200 text-zinc-700'
              }`}>
                {profile.bio || `${profile.name} has not authored an introductory biography yet.`}
              </p>
            </div>

            {/* Social channels connect block if exist */}
            {profile.socials && (profile.socials.linkedin || profile.socials.twitter || profile.socials.github || profile.socials.website) && (
              <div className="space-y-1.5">
                <h4 className={`text-[10px] font-black uppercase tracking-wider font-mono ${
                  isDark ? 'text-zinc-400' : 'text-zinc-500'
                }`}>
                  Student Digital Portfolios
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.socials.linkedin && (
                    <a
                      href={profile.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                        isDark 
                          ? 'bg-zinc-800/40 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700' 
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:border-zinc-300'
                      }`}
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                      <ExternalLink className="w-3 h-3 text-zinc-400 shrink-0" />
                    </a>
                  )}
                  {profile.socials.twitter && (
                    <a
                      href={profile.socials.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                        isDark 
                          ? 'bg-zinc-800/40 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700' 
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:border-zinc-300'
                      }`}
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Twitter X</span>
                      <ExternalLink className="w-3 h-3 text-zinc-400 shrink-0" />
                    </a>
                  )}
                  {profile.socials.github && (
                    <a
                      href={profile.socials.github}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                        isDark 
                          ? 'bg-zinc-800/40 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700' 
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:border-zinc-300'
                      }`}
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3 text-zinc-400 shrink-0" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Specialties and skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <h4 className={`text-[10px] font-black uppercase tracking-wider font-mono ${
                  isDark ? 'text-zinc-400' : 'text-zinc-500'
                }`}>
                  Core Specializations
                </h4>
                {profile.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.map(skill => (
                      <span
                        key={skill}
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border ${
                          isDark
                            ? 'bg-indigo-950/20 text-indigo-400 border-indigo-950/50'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-400 text-xs italic">No special skills listed.</p>
                )}
              </div>

              <div className="space-y-1.5">
                <h4 className={`text-[10px] font-black uppercase tracking-wider font-mono ${
                  isDark ? 'text-zinc-400' : 'text-zinc-500'
                }`}>
                  Interactions & Interests
                </h4>
                {profile.interests && profile.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {profile.interests.map(interest => (
                      <span
                        key={interest}
                        className={`text-[11px] font-medium px-2.5 py-0.5 rounded-lg border ${
                          isDark
                            ? 'bg-zinc-800/60 text-zinc-300 border-zinc-800'
                            : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                        }`}
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-400 text-xs italic">No interests listed.</p>
                )}
              </div>
            </div>

            {/* Gamification, Badges and Points panel */}
            <div className={`mt-5 p-4 rounded-xl border ${
              isDark 
                ? 'bg-zinc-950/20 border-zinc-800' 
                : 'bg-indigo-50/50 border-indigo-100'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-[10px] font-black uppercase tracking-wider font-mono flex items-center gap-1.5 ${
                  isDark ? 'text-zinc-300' : 'text-zinc-800'
                }`}>
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>UniUyo Scholar Metrics</span>
                </h4>
                <span className={`text-xs font-black font-sans px-2.5 py-1 rounded-full ${
                  isDark ? 'bg-amber-950/40 text-amber-400' : 'bg-amber-100 text-amber-800'
                }`}>
                  {profile.points || 0} Points
                </span>
              </div>
              
              <div className="space-y-1.5 text-left">
                <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Earned Credentials Badges</span>
                {profile.badges && profile.badges.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.badges.map(badge => (
                      <span
                        key={badge}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5 ${
                          isDark 
                            ? 'bg-zinc-800 text-zinc-300 border border-zinc-700/55' 
                            : 'bg-white text-zinc-700 border border-zinc-200 shadow-3xs'
                        }`}
                      >
                        🌟 {badge}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-zinc-400 text-[11px] italic">No merit badges unlocked yet.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action controls footer */}
        <div className={`px-6 py-4 flex justify-between items-center border-t ${
          isDark ? 'bg-zinc-950/40 border-zinc-800' : 'bg-zinc-50 border-zinc-150'
        }`}>
          <span className="text-[10px] text-zinc-400 font-mono tracking-wider">
            ID: {profile.id}
          </span>
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-1.5 font-bold text-xs rounded-xl transition cursor-pointer ${
              isDark 
                ? 'bg-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-700' 
                : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-250 hover:text-zinc-950'
            }`}
          >
            Close View
          </button>
        </div>
      </motion.div>
    </div>
  );
}
