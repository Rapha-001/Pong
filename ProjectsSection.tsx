/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, StudentProfile } from '../types';
import { Rocket, Sparkles, Plus, ArrowLeft, Heart, Github, Globe, Star, FileCode, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectsSectionProps {
  currentUser: StudentProfile;
  projects: Project[];
  onAddProject: (proj: Project) => void;
  onUpdateProject: (proj: Project) => void;
  offlineMode: boolean;
  onShowToast: (msg: string, type: 'success' | 'warn') => void;
  onDeleteProject?: (projectId: string) => void;
}

export default function ProjectsSection({
  currentUser,
  projects,
  onAddProject,
  onUpdateProject,
  offlineMode,
  onShowToast,
  onDeleteProject,
}: ProjectsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>('All');
  
  // Show creation overlay
  const [showCreator, setShowCreator] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Tech');
  const [stage, setStage] = useState<'Idea' | 'MVP' | 'Launched'>('Idea');
  const [websiteLink, setWebsiteLink] = useState('');
  const [githubLink, setGithubLink] = useState('');

  const categories = ['All', 'Tech', 'Business', 'Design', 'Creative', 'Research'];

  const handleUpvote = (proj: Project) => {
    const isUpvoted = proj.upvotes.includes(currentUser.id);
    let updatedUpvotes: string[];

    if (isUpvoted) {
      updatedUpvotes = proj.upvotes.filter(id => id !== currentUser.id);
      onShowToast(`Upvote retrieved for ${proj.title}.`, 'success');
    } else {
      updatedUpvotes = [...proj.upvotes, currentUser.id];
      onShowToast(`You upvoted ${proj.title}! Premium product credit added.`, 'success');
    }

    onUpdateProject({
      ...proj,
      upvotes: updatedUpvotes
    });
  };

  const handlePublishProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) {
      onShowToast('Please fill in Title and descriptions!', 'warn');
      return;
    }

    const newProj: Project = {
      id: `proj_${Date.now()}`,
      title: title.trim(),
      description: desc.trim(),
      category,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorAvatar: currentUser.avatar,
      stage,
      upvotes: [currentUser.id], // Auto upvote on create
      links: {
        website: websiteLink.trim() ? websiteLink.trim() : undefined,
        github: githubLink.trim() ? githubLink.trim() : undefined
      },
      createdAt: new Date().toISOString()
    };

    onAddProject(newProj);

    // Reset fields
    setTitle('');
    setDesc('');
    setWebsiteLink('');
    setGithubLink('');
    setShowCreator(false);
    onShowToast(offlineMode ? 'Project queued to local cache!' : 'Campus product catalog updated!', 'success');
  };

  const filteredProjects = projects.filter(p => {
    if (activeTab === 'All') return true;
    return p.category === activeTab;
  });

  return (
    <div className="space-y-6" id="projects-section-workspace">
      <AnimatePresence mode="wait">
        {!showCreator ? (
          // MAIN SHOWCASE CARDS STREAM
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header section layout */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-none sm:rounded-xl border-y sm:border border-x-0 border-zinc-200">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-950 tracking-tight">University Builders &amp; Creators Registry</h3>
                <p className="text-zinc-500 text-xs">Examine research proposals, mobile startup apps, designs, and business models engineered on campus.</p>
              </div>

              <button
                onClick={() => setShowCreator(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Showcase Project</span>
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
                  {c === 'All' ? '🚀 All Portfolios' : `${c} Works`}
                </button>
              ))}
            </div>

            {/* Grid display layouts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((p) => {
                const isUpvoted = p.upvotes.includes(currentUser.id);
                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-none sm:rounded-2xl border-y sm:border border-x-0 border-zinc-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between h-full space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="bg-zinc-150 border border-zinc-200 text-zinc-600 font-extrabold px-2.5 py-0.5 rounded text-[10px] uppercase font-mono">
                          {p.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                            p.stage === 'Launched'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : p.stage === 'MVP'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-150'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {p.stage}
                          </span>

                          {p.creatorId === currentUser.id && onDeleteProject && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete your project "${p.title}"?`)) {
                                  onDeleteProject(p.id);
                                }
                              }}
                              className="p-1 px-1.5 bg-zinc-50 border border-zinc-250 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-zinc-400 font-bold transition flex items-center shrink-0 cursor-pointer rounded"
                              title="Delete Portfolio Project"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-zinc-950 text-base tracking-tight">{p.title}</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-semibold mt-1">
                          <span>By {p.creatorName}</span>
                        </div>
                      </div>

                      <p className="text-zinc-650 text-xs leading-relaxed line-clamp-3">
                        {p.description}
                      </p>

                      {/* Display links if any */}
                      {(p.links?.github || p.links?.website) && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {p.links.github && (
                            <a
                              href={p.links.github}
                              target="_blank"
                              rel="noreferrer"
                              className="text-zinc-500 hover:text-zinc-900 transition flex items-center gap-1 text-[10px] font-bold border border-zinc-200 p-1 px-2 rounded-lg bg-zinc-50 font-mono"
                            >
                              <Github className="w-3.5 h-3.5" />
                              <span>Repository</span>
                            </a>
                          )}
                          {p.links.website && (
                            <a
                              href={p.links.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 text-[10px] font-semibold border border-indigo-100 p-1 px-2 rounded-lg bg-indigo-50/50"
                            >
                              <Globe className="w-3.5 h-3.5" />
                              <span>Live Site</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer Upvoting Mechanism */}
                    <div className="flex items-center justify-between border-t border-zinc-100 pt-3.5 mt-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={p.creatorAvatar}
                          alt={p.creatorName}
                          className="w-5 h-5 rounded-md object-cover border border-zinc-100"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[10px] text-zinc-500 font-medium">Classwork</span>
                      </div>

                      <button
                        onClick={() => handleUpvote(p)}
                        className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer select-none ${
                          isUpvoted
                            ? 'bg-emerald-50 border-emerald-250 text-emerald-700 font-extrabold'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        <Rocket className={`w-3.5 h-3.5 ${isUpvoted ? 'text-emerald-600 fill-emerald-100' : 'text-zinc-400'}`} />
                        <span>Upvote • {p.upvotes.length}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          // CREATOR REGISTRY SUBMISSION FORM
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
              <h3 className="font-extrabold text-base text-zinc-950 tracking-tight flex items-center gap-2 ml-2">
                <Rocket className="w-4 h-4 text-indigo-600" />
                <span>Broadcasting Student Portfolios</span>
              </h3>
            </div>

            <form onSubmit={handlePublishProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">Project Name*</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:outline-none"
                    placeholder="e.g., Tusk Laundry Dispatcher App"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">Category Type</label>
                  <select
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Tech">Tech / Digital App</option>
                    <option value="Business">Business Venture / Startup</option>
                    <option value="Design">UI/UX Design / Figma</option>
                    <option value="Creative">Creative Writing / Media</option>
                    <option value="Research">Academic Research / Thesis</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">Development Phase</label>
                  <div className="flex gap-2 bg-zinc-50 border border-zinc-200 p-1.5 rounded-lg text-xs">
                    {(['Idea', 'MVP', 'Launched'] as const).map(pStage => (
                      <button
                        key={pStage}
                        type="button"
                        onClick={() => setStage(pStage)}
                        className={`flex-1 py-1 text-center font-bold rounded cursor-pointer transition ${
                          stage === pStage
                            ? 'bg-zinc-900 text-white shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-800'
                        }`}
                      >
                        {pStage}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">Live Site Link</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:outline-none"
                    placeholder="https://tusk-delivery.com"
                    value={websiteLink}
                    onChange={(e) => setWebsiteLink(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">GitHub Repo Link</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:outline-none"
                    placeholder="https://github.com/..."
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-1">Project detailed description</label>
                <textarea
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs focus:outline-none"
                  placeholder="Introduce the academic problem statement or digital MVP features. Explain what stack you used, who you collaborated with, and list links for reviewing designs..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreator(false)}
                  className="px-4 py-2 border border-zinc-300 hover:bg-zinc-100 rounded-xl font-bold text-xs cursor-pointer text-zinc-700"
                >
                  Cancel Publication
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-sm"
                >
                  Publish Portfolio
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
