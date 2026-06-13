/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProfile, Community, Opportunity, Event, Project } from '../types';
import { Search, Users, Sparkles, UserCheck, UserPlus, BookOpen, ExternalLink, Calendar, Briefcase, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DiscoverySectionProps {
  currentUser: StudentProfile;
  profiles: StudentProfile[];
  communities: Community[];
  opportunities: Opportunity[];
  events: Event[];
  projects: Project[];
  onViewProfile?: (userId: string) => void;
  onShowToast: (msg: string, type: 'success' | 'warn') => void;
}

export default function DiscoverySection({
  currentUser,
  profiles,
  communities,
  opportunities,
  events,
  projects,
  onViewProfile,
  onShowToast,
}: DiscoverySectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'People' | 'Forums' | 'Opportunities' | 'Events' | 'Projects'>('People');

  // Follow/Connect Simulated State
  const [followingIds, setFollowingIds] = useState<string[]>(['student_chidi']);

  const toggleFollow = (profile: StudentProfile) => {
    const isFollowing = followingIds.includes(profile.id);
    if (isFollowing) {
      setFollowingIds(followingIds.filter(id => id !== profile.id));
      onShowToast(`Disconnected with ${profile.name}`, 'success');
    } else {
      setFollowingIds([...followingIds, profile.id]);
      onShowToast(`Connected successfully with ${profile.name}!`, 'success');
    }
  };

  // Filter lists based on search term
  const getFilteredPeople = () => {
    return profiles.filter(p => 
      p.id !== currentUser.id && (
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.bio.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const getFilteredCommunities = () => {
    return communities.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getFilteredOpportunities = () => {
    return opportunities.filter(o => 
      o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getFilteredEvents = () => {
    return events.filter(e => 
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getFilteredProjects = () => {
    return projects.filter(pr => 
      pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const tabCount = {
    People: getFilteredPeople().length,
    Forums: getFilteredCommunities().length,
    Opportunities: getFilteredOpportunities().length,
    Events: getFilteredEvents().length,
    Projects: getFilteredProjects().length,
  };

  return (
    <div className="space-y-6" id="discovery-section-workspace">
      {/* Search Bar Block */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-4">
        <div>
          <h3 className="font-extrabold text-lg text-zinc-950 tracking-tight">Active Intelligent Discovery</h3>
          <p className="text-zinc-500 text-xs">Instantly scan across multiple campus resource layers: classmates, events, study directories, and portfolios.</p>
        </div>

        <div className="relative">
          <Search className="absolute top-3.5 left-4 text-zinc-400 w-4 h-4 shrink-0" />
          <input
            type="text"
            className="w-full text-sm text-zinc-900 placeholder-zinc-400 border border-zinc-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-zinc-50/50"
            placeholder={`Search department, roll, project titles or fellowships...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Directory Tab Switches */}
        <div className="flex gap-2 overflow-x-auto border-t border-zinc-150 pt-4 no-scrollbar">
          {(['People', 'Forums', 'Opportunities', 'Events', 'Projects'] as const).map(tab => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition border cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300'
                }`}
              >
                <span>{tab}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-indigo-700 text-indigo-50' : 'bg-zinc-250 text-zinc-500'}`}>
                  {tabCount[tab]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory Stream Results Grid */}
      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* TABS 1: PEOPLE */}
            {activeTab === 'People' && (
              getFilteredPeople().length > 0 ? (
                getFilteredPeople().map((profile) => {
                  const isFollowing = followingIds.includes(profile.id);
                  return (
                    <div
                      key={profile.id}
                      className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-4">
                        {/* Person Identity Header */}
                        <div 
                          onClick={() => onViewProfile && onViewProfile(profile.id)}
                          className="flex gap-3 items-center cursor-pointer group select-none"
                          title="Click to view full student profile details"
                        >
                          <img
                            src={profile.avatar}
                            alt={profile.name}
                            className="w-12 h-12 rounded-xl object-cover border border-zinc-100 group-hover:ring-2 group-hover:ring-indigo-500/40 transition-all duration-200 animate-none"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-extrabold text-zinc-950 text-sm block tracking-tight group-hover:text-indigo-650 transition-colors duration-150">
                              {profile.name}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-indigo-600 block">
                              {profile.role}
                            </span>
                          </div>
                        </div>

                        {/* Department Label */}
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between text-zinc-500 font-medium">
                            <span>Faculty:</span>
                            <span className="text-zinc-800">{profile.faculty}</span>
                          </div>
                          <div className="flex justify-between text-zinc-500 font-medium">
                            <span>Dept:</span>
                            <span className="text-zinc-800 truncate max-w-[150px]">{profile.department}</span>
                          </div>
                          <div className="flex justify-between text-zinc-500 font-medium">
                            <span>Level Label:</span>
                            <b className="text-zinc-800">{profile.level}</b>
                          </div>
                        </div>

                        {/* Bio summary */}
                        <p className="text-zinc-600 text-xs leading-relaxed line-clamp-2">
                          {profile.bio || "No biography details published."}
                        </p>

                        {/* Skill Pills */}
                        {profile.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {profile.skills.slice(0, 3).map(skill => (
                              <span key={skill} className="bg-zinc-100 text-zinc-700 text-[10px] px-2 py-0.5 rounded font-medium">
                                {skill}
                              </span>
                            ))}
                            {profile.skills.length > 3 && (
                              <span className="text-[9px] text-zinc-400 pt-0.5">+{profile.skills.length - 3} more</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Follow back buttons */}
                      <button
                        onClick={() => toggleFollow(profile)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer mt-4 ${
                          isFollowing
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-neutral-100 hover:text-zinc-800'
                            : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5 shrink-0" />
                            <span>Connected</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5 shrink-0" />
                            <span>Connect Peer</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 col-span-full">
                  <p className="text-zinc-400 text-xs">No students found matching "{searchTerm}"</p>
                </div>
              )
            )}

            {/* TAB 2: FORUMS */}
            {activeTab === 'Forums' && (
              getFilteredCommunities().length > 0 ? (
                getFilteredCommunities().map((comm) => (
                  <div
                    key={comm.id}
                    className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex gap-2.5 items-center">
                        <span className="bg-zinc-100 border border-zinc-200 p-1 rounded-lg text-lg">{comm.logo}</span>
                        <div>
                          <span className="font-extrabold text-zinc-950 text-sm tracking-tight block">{comm.name}</span>
                          <span className="text-[10px] text-zinc-400 block">{comm.membersCount} student members</span>
                        </div>
                      </div>
                      <p className="text-zinc-600 text-xs mt-3 leading-relaxed line-clamp-3">{comm.description}</p>
                    </div>

                    <div className="text-right">
                      <span className="bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                        {comm.category} Channel
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 col-span-full">
                  <p className="text-zinc-400 text-xs">No forums found matching "{searchTerm}"</p>
                </div>
              )
            )}

            {/* TAB 3: OPPORTUNITIES */}
            {activeTab === 'Opportunities' && (
              getFilteredOpportunities().length > 0 ? (
                getFilteredOpportunities().map((opp) => (
                  <div
                    key={opp.id}
                    className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-bold text-sm text-zinc-950 block tracking-tight line-clamp-1">{opp.title}</span>
                        <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded text-[9px] uppercase shrink-0">
                          {opp.type}
                        </span>
                      </div>
                      <span className="font-bold text-zinc-500 text-xs block pb-2 border-b border-zinc-100">{opp.company}</span>
                      <p className="text-zinc-600 text-xs mt-2 leading-relaxed line-clamp-3">{opp.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-2 font-medium">
                      <span>Posted by {opp.postedByName}</span>
                      <span className="text-red-600">Deadline: {opp.deadline}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 col-span-full">
                  <p className="text-zinc-400 text-xs">No internships or roles found matching "{searchTerm}"</p>
                </div>
              )
            )}

            {/* TAB 4: EVENTS */}
            {activeTab === 'Events' && (
              getFilteredEvents().length > 0 ? (
                getFilteredEvents().map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1.5">
                        <span className="font-extrabold text-sm text-zinc-950 block tracking-tight line-clamp-1">{evt.title}</span>
                        <span className="bg-red-50 border border-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-[9px] uppercase shrink-0">
                          {evt.category}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-bold space-y-0.5">
                        <p>Date: {evt.date} @ {evt.time}</p>
                        <p>Venue: {evt.venue}</p>
                      </div>
                      <p className="text-zinc-600 text-xs mt-3 leading-relaxed line-clamp-2">{evt.description}</p>
                    </div>

                    <div className="text-xs font-bold text-indigo-600">
                      {evt.rsvps.length} Student RSVPs
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 col-span-full">
                  <p className="text-zinc-400 text-xs">No events found matching "{searchTerm}"</p>
                </div>
              )
            )}

            {/* TAB 5: PROJECTS */}
            {activeTab === 'Projects' && (
              getFilteredProjects().length > 0 ? (
                getFilteredProjects().map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1">
                        <span className="font-extrabold text-sm text-zinc-900 block tracking-tight line-clamp-1">{proj.title}</span>
                        <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded text-[9px] uppercase shrink-0">
                          {proj.stage}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-bold block pb-2 border-b border-zinc-100">by {proj.creatorName}</span>
                      <p className="text-zinc-600 text-xs mt-2.5 leading-relaxed line-clamp-3">{proj.description}</p>
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold mt-2">
                      <span className="bg-zinc-100 px-2 py-0.5 rounded text-[10px] uppercase text-zinc-600">{proj.category}</span>
                      <span className="text-indigo-600">{proj.upvotes.length} Stud Upvotes</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 col-span-full">
                  <p className="text-zinc-400 text-xs">No projects found matching "{searchTerm}"</p>
                </div>
              )
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
