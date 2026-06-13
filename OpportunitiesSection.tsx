/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Opportunity, StudentProfile } from '../types';
import { Briefcase, Landmark, Calendar, MapPin, Sparkles, Plus, Trash2, ArrowLeft, Send, CheckCircle2, FileText, SendHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OpportunitiesSectionProps {
  currentUser: StudentProfile;
  opportunities: Opportunity[];
  onAddOpportunity: (opp: Opportunity) => void;
  onUpdateOpportunity: (opp: Opportunity) => void;
  offlineMode: boolean;
  onShowToast: (msg: string, type: 'success' | 'warn') => void;
  onDeleteOpportunity?: (oppId: string) => void;
}

export default function OpportunitiesSection({
  currentUser,
  opportunities,
  onAddOpportunity,
  onUpdateOpportunity,
  offlineMode,
  onShowToast,
  onDeleteOpportunity,
}: OpportunitiesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  
  // Application Form Overlays
  const [applyOppId, setApplyOppId] = useState<string | null>(null);
  const [statement, setStatement] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');

  // Post Opportunity Creators
  const [showCreator, setShowCreator] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLoc, setNewLoc] = useState('');
  const [newType, setNewType] = useState<'Internship' | 'Scholarship' | 'Competition' | 'Startup Role' | 'Volunteer'>('Internship');
  const [newDesc, setNewDesc] = useState('');
  const [req1, setReq1] = useState('');
  const [req2, setReq2] = useState('');
  const [deadline, setDeadline] = useState('2026-07-20');

  const filters = ['All', 'Internship', 'Scholarship', 'Competition', 'Startup Role', 'Volunteer'];

  const filteredOpportunities = opportunities.filter((opp) => {
    if (activeFilter === 'All') return true;
    return opp.type === activeFilter;
  });

  const handleApply = (opp: Opportunity) => {
    // Check if already applied
    if (opp.applications.includes(currentUser.id)) {
      onShowToast("You have already applied for this campus role!", "warn");
      return;
    }
    setApplyOppId(opp.id);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statement.trim()) {
      onShowToast("Please tell us why you are interested in this position!", "warn");
      return;
    }

    const opportunity = opportunities.find(o => o.id === applyOppId);
    if (!opportunity) return;

    // Record application
    onUpdateOpportunity({
      ...opportunity,
      applications: [...opportunity.applications, currentUser.id]
    });

    setApplyOppId(null);
    setStatement('');
    setPortfolioLink('');
    onShowToast(`Portfolio successfully dispatched! Chidi or the host will reach out to: ${currentUser.email}`, 'success');
  };

  const handlePublishOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim() || !newDesc.trim()) {
      onShowToast('Please fill in Name, Company, and Role descriptions!', 'warn');
      return;
    }

    const r: string[] = [];
    if (req1.trim()) r.push(req1.trim());
    if (req2.trim()) r.push(req2.trim());
    if (r.length === 0) {
      r.push('Requires regular attendance at University of Uyo lectures.');
    }

    const newOpp: Opportunity = {
      id: `opp_${Date.now()}`,
      title: newTitle.trim(),
      company: newCompany.trim(),
      location: newLoc.trim() ? newLoc.trim() : 'UniUyo Town Campus',
      type: newType,
      description: newDesc.trim(),
      requirements: r,
      deadline,
      postedBy: currentUser.id,
      postedByName: currentUser.name,
      applications: [],
      createdAt: new Date().toISOString()
    };

    onAddOpportunity(newOpp);

    // Reset state
    setNewTitle('');
    setNewCompany('');
    setNewLoc('');
    setNewDesc('');
    setReq1('');
    setReq2('');
    setShowCreator(false);
    onShowToast(offlineMode ? 'Vacancy queued locally under PWA storage!' : 'Scholarship / Role board updated!', 'success');
  };

  const selectedOppForApplying = opportunities.find(o => o.id === applyOppId);

  return (
    <div className="space-y-6" id="opportunities-section-workspace">
      <AnimatePresence mode="wait">
        {!showCreator && !applyOppId ? (
          // MAIN LIST OF OPPORTUNITIES
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header controls layout */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-none sm:rounded-xl border-y sm:border border-x-0 border-zinc-200">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-950 tracking-tight">Student-Focused Opportunity Board</h3>
                <p className="text-zinc-500 text-xs">Internships, startup developer roles, volunteer opportunities, and active fellowships.</p>
              </div>

              <button
                onClick={() => setShowCreator(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish Vacancy</span>
              </button>
            </div>

            {/* Filter Tabs layout */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition border cursor-pointer shrink-0 ${
                    activeFilter === f
                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                  }`}
                >
                  {f === 'All' ? '💼 All Vacancies' : f}
                </button>
              ))}
            </div>

            {/* Grid display cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
              {filteredOpportunities.map((opp) => {
                const alreadyApplied = opp.applications.includes(currentUser.id);
                return (
                  <div
                    key={opp.id}
                    className="bg-white rounded-none sm:rounded-2xl border-y sm:border border-x-0 border-zinc-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Badge and title tag */}
                      <div className="flex items-center justify-between gap-1.5">
                        <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                          opp.type === 'Scholarship'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : opp.type === 'Internship'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : opp.type === 'Competition'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                        }`}>
                          {opp.type}
                        </span>
                        
                        <span className="text-[10px] text-zinc-400 font-bold">
                          Closing {new Date(opp.deadline).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-zinc-900 text-base tracking-tight">{opp.title}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold mt-1">
                          <Landmark className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{opp.company}</span>
                          <span>•</span>
                          <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{opp.location}</span>
                        </div>
                      </div>

                      <p className="text-zinc-600 text-xs leading-relaxed line-clamp-3">
                        {opp.description}
                      </p>

                      {/* Requirements bullets list */}
                      <div className="space-y-1.5 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                        <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-wider block">Candidate Specifications:</span>
                        <ul className="text-[10px] text-zinc-600 space-y-1 leading-normal list-disc pl-3 font-medium">
                          {opp.requirements.map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Footer Apply action */}
                    <div className="flex items-center justify-between gap-4 border-t border-zinc-100 pt-4 mt-2">
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                        <span>Posted by {opp.postedByName}</span>
                        {opp.postedBy === currentUser.id && onDeleteOpportunity && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete your opportunity post "${opp.title}"?`)) {
                                onDeleteOpportunity(opp.id);
                              }
                            }}
                            className="p-1 text-zinc-400 hover:text-red-650 hover:bg-red-50 rounded transition shrink-0 cursor-pointer"
                            title="Delete Opportunity Post"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleApply(opp)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          alreadyApplied
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                        }`}
                      >
                        {alreadyApplied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Applied</span>
                          </>
                        ) : (
                          <span>Submit Resume</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : showCreator ? (
          // POST CREATOR ENVELOPE
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
              <h3 className="font-extrabold text-base text-zinc-950 tracking-tight flex items-center gap-1.5 ml-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Broadcasting Student Vacancy</span>
              </h3>
            </div>

            <form onSubmit={handlePublishOpportunity} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">Opportunity Title*</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g., UI/UX Specialist Intern"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">Host Entity/Company*</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g., Tusk Logistics Hub"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">Vacancy Category</label>
                  <select
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs bg-white focus:outline-none"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                  >
                    <option value="Internship">Internship Role</option>
                    <option value="Scholarship">Scholarship Cover</option>
                    <option value="Competition">Hackathon/Competition</option>
                    <option value="Startup Role">Startup Employee</option>
                    <option value="Volunteer">Volunteer Club Post</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">Location Details</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:outline-none"
                    placeholder="e.g., Perm Site / Remote"
                    value={newLoc}
                    onChange={(e) => setNewLoc(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">Application Deadline</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:outline-none"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">Position / Program description</label>
                <textarea
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:outline-none"
                  placeholder="Summarize the core activities, stipend structures, or scholarship benefits..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">Key Requirement #1</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:outline-none"
                    placeholder="e.g., Must own a laptop or completed 300L CSI"
                    value={req1}
                    onChange={(e) => setReq1(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">Key Requirement #2</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:outline-none"
                    placeholder="e.g., Basic coding syntax in HTML/CSS"
                    value={req2}
                    onChange={(e) => setReq2(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreator(false)}
                  className="px-4 py-2 border border-zinc-300 text-zinc-700 hover:bg-zinc-100 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Cancel Listing
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-sm"
                >
                  Confirm Broadcast
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          // DIRECT APPLY FORUM MODE
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm max-w-lg mx-auto space-y-6"
          >
            {selectedOppForApplying && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                  <span className="font-bold text-sm text-zinc-950 block">Resume Dispatcher</span>
                  <button onClick={() => setApplyOppId(null)} className="text-zinc-400 hover:text-zinc-800 text-xs">×</button>
                </div>
                
                <div className="bg-indigo-50 p-3 rounded-lg text-xs border border-indigo-100 text-zinc-800">
                  <p className="font-bold text-indigo-950">Applying for: {selectedOppForApplying.title}</p>
                  <p className="text-[10px] text-zinc-500 font-medium">Provided by {selectedOppForApplying.company}</p>
                </div>

                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1">Classroom Credentials</label>
                    <input
                      type="text"
                      disabled
                      className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-xs bg-zinc-100 font-semibold"
                      value={`${currentUser.name} (${currentUser.level} - Dept. of ${currentUser.department})`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1">Email Coordinates</label>
                    <input
                      type="text"
                      disabled
                      className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-xs bg-zinc-100 text-zinc-500"
                      value={currentUser.email}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-650 uppercase tracking-wider mb-1">Self-introduction Pitch (Cover)*</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="e.g., Introduce yourself briefly. Why should they enlist you? List any comparable projects from your profile..."
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={statement}
                      onChange={(e) => setStatement(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-600 uppercase tracking-widest mb-1">Portfolio (Website Link)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:outline-none"
                      placeholder="Paste Figma Link, GitHub Repo or PDF drive url..."
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setApplyOppId(null)}
                      className="px-4 py-2 border border-zinc-300 text-zinc-700 hover:bg-zinc-100 rounded-lg text-xs cursor-pointer font-bold"
                    >
                      Hold Off
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                    >
                      <SendHorizontal className="w-3.5 h-3.5 shrink-0" />
                      <span>Dispatch Credentials</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
