/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProfile, UserRole } from '../types';
import { UNIUYO_FACULTIES } from '../mockData';
import { 
  Edit2, ShieldCheck, Mail, MapPin, Award, ExternalLink, Link2, Key, Star, 
  Sparkles, Plus, Trash2, Check, RefreshCw, UploadCloud, FileText, CheckCircle2,
  ChevronRight, AlertTriangle, UserPlus, Users, HelpCircle, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IdentitySectionProps {
  currentUser: StudentProfile;
  profiles: StudentProfile[];
  onUpdateCurrentUser: (updatedUser: StudentProfile) => void;
  onSwitchUser: (userId: string) => void;
  onShowToast: (msg: string, type: 'success' | 'warn') => void;
  onUpdateProfiles?: (updatedProfiles: StudentProfile[]) => void;
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

export default function IdentitySection({
  currentUser,
  profiles,
  onUpdateCurrentUser,
  onSwitchUser,
  onShowToast,
  onUpdateProfiles,
  onAddNotification,
}: IdentitySectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'verification' | 'gamification'>('profile');

  // Biography Editing States
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(currentUser.name);
  const [editedBio, setEditedBio] = useState(currentUser.bio);
  const [editedFaculty, setEditedFaculty] = useState(currentUser.faculty);
  const [editedDepartment, setEditedDepartment] = useState(currentUser.department);
  const [editedLevel, setEditedLevel] = useState(currentUser.level);
  const [editedRole, setEditedRole] = useState(currentUser.role as UserRole);

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [skills, setSkills] = useState<string[]>(currentUser.skills);
  const [interests, setInterests] = useState<string[]>(currentUser.interests);

  const [twitter, setTwitter] = useState(currentUser.socials.twitter || '');
  const [github, setGithub] = useState(currentUser.socials.github || '');
  const [linkedin, setLinkedin] = useState(currentUser.socials.linkedin || '');

  // Verification Portal States
  const [matricInput, setMatricInput] = useState(currentUser.matricNo || '');
  const [schoolEmailInput, setSchoolEmailInput] = useState(currentUser.email || '');
  const [idCardFileBase64, setIdCardFileBase64] = useState<string | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<string>('idle'); // idle | loading | success
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [verifyStageName, setVerifyStageName] = useState('');

  // Org Verification Portal States
  const [orgRegCodeInput, setOrgRegCodeInput] = useState(currentUser.orgRegCode || '');
  const [orgPatronInput, setOrgPatronInput] = useState(currentUser.orgPatron || '');
  const [orgDocTypeInput, setOrgDocTypeInput] = useState(currentUser.orgDocType || 'Charter Recommendation Letter');
  const [orgDocBase64, setOrgDocBase64] = useState<string | null>(currentUser.orgDocBase64 || null);
  const [orgDescriptionInput, setOrgDescriptionInput] = useState(currentUser.orgDescription || '');
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Referral / Invite Friends States
  const [inviteFriendName, setInviteFriendName] = useState('');
  const [friendsInvited, setFriendsInvited] = useState<string[]>([]);

  // File Upload Handlers (Profile Photo and Cover banner upload)
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        onShowToast("Profile picture must be less than 15MB", "warn");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateCurrentUser({
            ...currentUser,
            avatar: reader.result
          });
          onShowToast("Profile picture successfully updated!", "success");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        onShowToast("Cover banner must be less than 15MB", "warn");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateCurrentUser({
            ...currentUser,
            coverImage: reader.result
          });
          onShowToast("Cover banner background updated!", "success");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        onShowToast("Student ID scan file must be less than 20MB", "warn");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setIdCardFileBase64(reader.result);
          onShowToast("ID Card graphic uploaded to browser memory frame!", "success");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOrgDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        onShowToast("Document scan file must be less than 20MB", "warn");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setOrgDocBase64(reader.result);
          onShowToast("Charter recommendation document loaded into browser memory!", "success");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Active faculty departments
  const currentFacultyData = UNIUYO_FACULTIES.find(f => f.name === editedFaculty);
  const availableDepartments = currentFacultyData ? currentFacultyData.departments : [];

  const handleFacultyChange = (facName: string) => {
    setEditedFaculty(facName);
    const firstDept = UNIUYO_FACULTIES.find(f => f.name === facName)?.departments[0] || '';
    setEditedDepartment(firstDept);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      const updatedInterests = [...interests, newInterest.trim()];
      setInterests(updatedInterests);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (intToRemove: string) => {
    setInterests(interests.filter(i => i !== intToRemove));
  };

  const handleSave = () => {
    if (!editedName.trim()) {
      onShowToast('Name is required', 'warn');
      return;
    }

    // Award profile completion points if not already awarded
    const hadBio = !!currentUser.bio;
    const hasNowBio = !!editedBio.trim();
    let pointsToAdd = 0;
    const currentBadges = currentUser.badges || [];
    let nextBadges = [...currentBadges];

    if (!hadBio && hasNowBio) {
      pointsToAdd = 30;
      if (!nextBadges.includes("Profile Completed")) {
        nextBadges.push("Profile Completed");
      }
    }

    const updatedProfile: StudentProfile = {
      ...currentUser,
      name: editedName,
      bio: editedBio,
      faculty: editedFaculty,
      department: editedDepartment,
      level: editedLevel,
      role: editedRole,
      skills,
      interests,
      points: (currentUser.points || 0) + pointsToAdd,
      badges: nextBadges,
      socials: {
        twitter: twitter ? twitter : undefined,
        github: github ? github : undefined,
        linkedin: linkedin ? linkedin : undefined,
      }
    };

    onUpdateCurrentUser(updatedProfile);
    setIsEditing(false);
    onShowToast('Profile identity successfully updated!', 'success');
    if (pointsToAdd > 0) {
      onShowToast(`Awarded +${pointsToAdd} Points for detailing profile biography!`, 'success');
    }
  };

  const startEdit = () => {
    setEditedName(currentUser.name);
    setEditedBio(currentUser.bio);
    setEditedFaculty(currentUser.faculty);
    setEditedDepartment(currentUser.department);
    setEditedLevel(currentUser.level);
    setEditedRole(currentUser.role);
    setSkills(currentUser.skills);
    setInterests(currentUser.interests);
    setTwitter(currentUser.socials.twitter || '');
    setGithub(currentUser.socials.github || '');
    setLinkedin(currentUser.socials.linkedin || '');
    setIsEditing(true);
  };

  // Verify Identity Process
  const handleVerifyIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matricInput.trim()) {
      onShowToast('Please provide your formal UniUyo Matriculation Number', 'warn');
      return;
    }
    if (!schoolEmailInput.trim() || !schoolEmailInput.endsWith('.edu.ng')) {
      onShowToast('Official school email must terminate in .edu.ng for student validations!', 'warn');
      return;
    }
    if (!idCardFileBase64) {
      onShowToast('Please upload a front image scan of your UniUyo student identity card!', 'warn');
      return;
    }

    // Begin Simulated multi-stage verification
    setVerifyStatus('loading');
    setVerifyProgress(5);
    setVerifyStageName('Initializing secure connection to UniUyo student registry...');

    const stages = [
      { prg: 22, name: 'Querying matric registry for database match on ' + matricInput + '...' },
      { prg: 48, name: 'Validating official domain MX logs and active status for ' + schoolEmailInput + '...' },
      { prg: 75, name: 'Scanning ID Card graphics and matching credentials with record photos...' },
      { prg: 92, name: 'Generating cryptographic signature and allocating verified credentials...' },
      { prg: 100, name: 'Identity approved! Injecting official status marks...' },
    ];

    let currentStageIndex = 0;
    const intervalRef = setInterval(() => {
      if (currentStageIndex < stages.length) {
        const stage = stages[currentStageIndex];
        setVerifyProgress(stage.prg);
        setVerifyStageName(stage.name);
        currentStageIndex++;
      } else {
        clearInterval(intervalRef);
        setVerifyStatus('success');
        
        // Update user status
        const currentPoints = currentUser.points || 0;
        const currentBadges = currentUser.badges || [];
        const nextBadges = currentBadges.includes("Verified Scholar") 
          ? currentBadges 
          : [...currentBadges, "Verified Scholar"];

        onUpdateCurrentUser({
          ...currentUser,
          verified: true,
          verificationStatus: 'verified',
          matricNo: matricInput.trim(),
          points: currentPoints + 100,
          badges: nextBadges
        });

        onShowToast("Student Verification Approved! Awarded +100 Points & Certified Badge", "success");
      }
    }, 1200);
  };

  const handleVerifyOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgRegCodeInput.trim()) {
      onShowToast('Please provide your official university organization registration code', 'warn');
      return;
    }
    if (!orgPatronInput.trim()) {
      onShowToast('Please provide your Staff Patron or Faculty Advisor full name', 'warn');
      return;
    }
    if (!orgDocBase64) {
      onShowToast('Please upload a scan of your recommendation letter or constitution draft!', 'warn');
      return;
    }

    setVerifyStatus('loading');
    setVerifyProgress(5);
    setVerifyStageName('Initializing secure connection to Student Affairs registry...');

    const stages = [
      { prg: 25, name: 'Registering application records for ' + currentUser.name + '...' },
      { prg: 50, name: 'Validating registration code matches with Student Affairs database logs...' },
      { prg: 75, name: 'Extracting and verifying staff metadata for Patron: ' + orgPatronInput + '...' },
      { prg: 90, name: 'Scanning and hashing uploaded document: ' + orgDocTypeInput + '...' },
      { prg: 100, name: 'Queueing application for student governance review board!' }
    ];

    let currentStageIndex = 0;
    const intervalRef = setInterval(() => {
      if (currentStageIndex < stages.length) {
        const stage = stages[currentStageIndex];
        setVerifyProgress(stage.prg);
        setVerifyStageName(stage.name);
        currentStageIndex++;
      } else {
        clearInterval(intervalRef);
        setVerifyStatus('success_org');

        const updatedOrg: StudentProfile = {
          ...currentUser,
          verificationStatus: 'pending',
          verified: false,
          orgRegCode: orgRegCodeInput.trim(),
          orgPatron: orgPatronInput.trim(),
          orgDocType: orgDocTypeInput,
          orgDocBase64: orgDocBase64,
          orgDescription: orgDescriptionInput.trim()
        };

        onUpdateCurrentUser(updatedOrg);
        onShowToast("Charter application submitted! Awaiting administrator review.", "success");

        if (onAddNotification) {
          onAddNotification({
            userId: currentUser.id,
            type: 'announcement',
            title: 'Verification Queued 📋',
            message: `Your organization's charter review is currently pending administrator inspection.`,
            senderName: 'UniUyo Governance',
            senderAvatar: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=256'
          });
        }
      }
    }, 1200);
  };

  const handleAdminApprove = (profile: StudentProfile) => {
    const isOrg = profile.role === 'Student Organizations';
    const nextBadges = isOrg
      ? [...(profile.badges || []).filter(b => b !== 'Verified Org'), 'Verified Org', 'Approved Charter']
      : [...(profile.badges || []).filter(b => b !== 'Verified Scholar'), 'Verified Scholar'];

    const updatedProfile: StudentProfile = {
      ...profile,
      verified: true,
      verificationStatus: 'verified',
      points: (profile.points || 0) + (isOrg ? 120 : 100),
      badges: nextBadges
    };

    if (onUpdateProfiles) {
      const nextProfiles = profiles.map(p => p.id === profile.id ? updatedProfile : p);
      onUpdateProfiles(nextProfiles);
    }

    if (profile.id === currentUser.id) {
      onUpdateCurrentUser(updatedProfile);
    }

    onShowToast(`Approved verification for ${profile.name}!`, "success");

    if (onAddNotification) {
      onAddNotification({
        userId: profile.id,
        type: 'announcement',
        title: 'Verification Approved! 🎉',
        message: isOrg
          ? `Your student organization "${profile.name}" has been officially verified! The gold-green Verified Org badge is now active on your profile.`
          : `Your scholar identity has been officially verified! The Verified Scholar badge is now active on your profile.`,
        senderName: 'UniUyo Administrators',
        senderAvatar: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=256'
      });
    }
  };

  const handleAdminDecline = (profile: StudentProfile) => {
    const updatedProfile: StudentProfile = {
      ...profile,
      verified: false,
      verificationStatus: 'unverified'
    };

    if (onUpdateProfiles) {
      const nextProfiles = profiles.map(p => p.id === profile.id ? updatedProfile : p);
      onUpdateProfiles(nextProfiles);
    }

    if (profile.id === currentUser.id) {
      onUpdateCurrentUser(updatedProfile);
    }

    onShowToast(`Declined verification request for ${profile.name}`, "warn");

    if (onAddNotification) {
      onAddNotification({
        userId: profile.id,
        type: 'announcement',
        title: 'Verification Declined ⚠️',
        message: `Your verification request was reviewed but declined due to insufficient or unreadable documentation. Please re-submit within the portal.`,
        senderName: 'UniUyo Administrators',
        senderAvatar: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=256'
      });
    }
  };

  // Friends invitation loop simulation
  const handleInviteFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteFriendName.trim()) return;
    
    const email = inviteFriendName.trim().replace(/\s+/g, '').toLowerCase() + '@student.uniuyo.edu.ng';
    
    if (friendsInvited.includes(email)) {
      onShowToast("This student friend has already been sent an application link!", "warn");
      return;
    }

    setFriendsInvited([...friendsInvited, email]);
    
    // Credit referral points
    const currentPoints = currentUser.points || 0;
    const currentBadges = currentUser.badges || [];
    const hasBadge = currentBadges.includes("Referral Master");
    const nextBadges = hasBadge ? currentBadges : [...currentBadges, "Referral Master"];

    onUpdateCurrentUser({
      ...currentUser,
      points: currentPoints + 20,
      badges: nextBadges
    });

    onShowToast(`Invitation link dispatched to ${email}! Awarded +20 points.`, "success");
    setInviteFriendName('');
  };

  // Calculate ranks and sort profiles for real-time Dynamic Leaderboard
  // Merge the currently active student session details to reflect changes instantly!
  const liveLeaderboardList = profiles.map(p => {
    if (p.id === currentUser.id) {
      return currentUser;
    }
    return p;
  }).sort((a, b) => (b.points || 0) - (a.points || 0));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="identity-section-workspace">
      {/* Col 1 & 2: Main Identity Card Panel */}
      <div className="lg:col-span-2 space-y-6">
        {/* Profile Card Frame */}
        <div className="bg-white rounded-none sm:rounded-2xl border-y sm:border border-x-0 border-zinc-200 overflow-hidden shadow-sm">
          {/* Cover Image Wrapper */}
          <div className="h-44 w-full relative bg-zinc-800">
            {currentUser.coverImage ? (
              <img
                src={currentUser.coverImage}
                alt="Profile Cover"
                className="w-full h-full object-cover opacity-75"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            )}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <input
                type="file"
                id="banner-image-upload-input"
                accept="image/*"
                className="hidden"
                onChange={handleBannerUpload}
              />
              <label
                htmlFor="banner-image-upload-input"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900/80 hover:bg-zinc-950 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer select-none"
              >
                <span>Upload Banner</span>
              </label>

              {activeSubTab === 'profile' && (
                !isEditing ? (
                  <button
                    onClick={startEdit}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/90 backdrop-blur-sm hover:bg-white text-zinc-800 text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-zinc-650" />
                    <span>Customize Profile</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                )
              )}
            </div>
            
            {/* Role Header Badge */}
            <div className="absolute bottom-4 left-4">
              <span className="bg-zinc-900/80 backdrop-blur-sm text-zinc-100 text-xs px-3 py-1 pb-1.5 rounded-full font-bold uppercase tracking-wider">
                {currentUser.role}
              </span>
            </div>
          </div>

          {/* Avatar and basic Info Row */}
          <div className="px-6 relative pb-2">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-5 gap-4">
              <div className="relative group">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-white bg-zinc-100 shadow-md transform"
                  referrerPolicy="no-referrer"
                />
                <input
                  type="file"
                  id="avatar-image-upload-input"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <label
                  htmlFor="avatar-image-upload-input"
                  className="absolute bottom-1 right-1 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl shadow-md cursor-pointer transition flex items-center justify-center border border-white"
                  title="Upload profile picture"
                >
                  <Edit2 className="w-3 w-3" />
                </label>

                {currentUser.verified && (
                  <div className="absolute -bottom-1 -left-1 bg-white p-0.5 rounded-full shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-indigo-600 fill-indigo-100" />
                  </div>
                )}
              </div>
              
              <div className="flex gap-4">
                <div className="text-left sm:text-right">
                  <span className="text-xs text-zinc-500 block">Durable Auth ID</span>
                  <span className="font-mono text-zinc-800 text-xs font-semibold bg-zinc-100 px-2 py-0.5 rounded block truncate max-w-[150px]">
                    {currentUser.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-tabs segment switcher */}
            <div className="flex border-b border-zinc-200 mb-6 font-semibold text-xs text-zinc-500 overflow-x-auto no-scrollbar">
              <button
                onClick={() => { setActiveSubTab('profile'); setIsEditing(false); }}
                className={`py-3 px-4 border-b-2 transition-all shrink-0 ${
                  activeSubTab === 'profile'
                    ? 'border-indigo-600 text-indigo-650 font-extrabold text-[#4F46E5] border-[#4F46E5]'
                    : 'border-transparent hover:text-zinc-900 hover:border-zinc-300'
                }`}
              >
                Profile Biography
              </button>
              
              <button
                onClick={() => { setActiveSubTab('verification'); setIsEditing(false); }}
                className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                  activeSubTab === 'verification'
                    ? 'border-indigo-600 text-indigo-650 font-extrabold text-[#4F46E5] border-[#4F46E5]'
                    : 'border-transparent hover:text-zinc-900 hover:border-zinc-300'
                }`}
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${currentUser.verified ? (currentUser.role === 'Student Organizations' ? 'text-emerald-600' : 'text-indigo-650') : 'text-zinc-400'}`} />
                <span>{currentUser.role === 'Student Organizations' ? 'Organization Charter Portal' : 'Student Verification Portal'}</span>
                {currentUser.verified ? (
                  <span className="bg-emerald-100 text-emerald-805 text-[9px] px-1.5 py-0.5 rounded-full font-bold">VERIFIED</span>
                ) : currentUser.verificationStatus === 'pending' ? (
                  <span className="bg-amber-100 text-amber-805 text-[9px] px-1.5 py-0.5 rounded-full font-bold">PENDING</span>
                ) : (
                  <span className="bg-zinc-100 text-zinc-650 text-[9px] px-1.5 py-0.5 rounded-full font-bold">UNVERIFIED</span>
                )}
              </button>
              
              <button
                onClick={() => { setActiveSubTab('gamification'); setIsEditing(false); }}
                className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                  activeSubTab === 'gamification'
                    ? 'border-indigo-600 text-indigo-150 font-extrabold text-[#4F46E5] border-[#4F46E5]'
                    : 'border-transparent hover:text-zinc-900 hover:border-zinc-300'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Gamification &amp; Leaderboard</span>
                <span className="bg-amber-100 text-amber-850 text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  {currentUser.points || 0} PTS
                </span>
              </button>
            </div>
          </div>

          {/* ACTIVE GRAPHIC RENDER COMPONENT */}
          <div className="px-6 pb-6">
            <AnimatePresence mode="wait">
              {/* SUBTAB 1: Profile Biography */}
              {activeSubTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  key="bio-pane"
                  className="space-y-6"
                >
                  {!isEditing ? (
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">{currentUser.name}</h2>
                          {currentUser.verified && (
                            <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 h-5">
                              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 fill-indigo-100" /> Verified Scholar
                            </span>
                          )}
                        </div>
                        
                        {/* Department level labels */}
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-sm text-zinc-650 mt-1 pb-4 border-b border-zinc-100 font-medium">
                          <span className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-zinc-400 shrink-0" />
                            {currentUser.department} ({currentUser.level})
                          </span>
                          <span className="inline-block w-1.5 h-1.5 bg-zinc-300 rounded-full"></span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                            Faculty of {currentUser.faculty}
                          </span>
                          <span className="inline-block w-1.5 h-1.5 bg-zinc-300 rounded-full"></span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                            {currentUser.email}
                          </span>
                        </div>
                      </div>

                      {/* Bio text */}
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-widest flex items-center gap-1 font-mono">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Biography
                        </h4>
                        <p className="text-zinc-700 leading-relaxed text-sm whitespace-pre-line bg-zinc-50/50 p-4 rounded-xl border border-dashed border-zinc-200">
                          {currentUser.bio || 'Provide a biography about yourself. Tap "Customize Profile" above to fill this out and earn +30 Points!'}
                        </p>
                      </div>

                      {/* Social links */}
                      {(currentUser.socials.twitter || currentUser.socials.github || currentUser.socials.linkedin) && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-widest font-mono">Connect Links</h4>
                          <div className="flex flex-wrap gap-2.5">
                            {currentUser.socials.linkedin && (
                              <a
                                href={currentUser.socials.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100 rounded-xl text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition"
                              >
                                <Link2 className="w-3.5 h-3.5" />
                                <span>LinkedIn Profile</span>
                                <ExternalLink className="w-3 h-3 text-zinc-400" />
                              </a>
                            )}
                            {currentUser.socials.twitter && (
                              <a
                                href={currentUser.socials.twitter}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100 rounded-xl text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition"
                              >
                                <Link2 className="w-3.5 h-3.5 animate-pulse" />
                                <span>Twitter X</span>
                                <ExternalLink className="w-3 h-3 text-zinc-400" />
                              </a>
                            )}
                            {currentUser.socials.github && (
                              <a
                                href={currentUser.socials.github}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100 rounded-xl text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition"
                              >
                                <Link2 className="w-3.5 h-3.5" />
                                <span>GitHub Repo</span>
                                <ExternalLink className="w-3 h-3 text-zinc-400" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Grid for Skills and Interests */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-widest font-mono">Skills &amp; Specializations</h4>
                          {currentUser.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {currentUser.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="bg-indigo-50 text-indigo-700 font-semibold text-xs px-2.5 py-1 rounded-lg border border-indigo-100"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-zinc-400 text-xs italic">No skills listed yet.</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-widest font-mono font-bold">Interactions &amp; Interests</h4>
                          {currentUser.interests.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {currentUser.interests.map((interest) => (
                                <span
                                  key={interest}
                                  className="bg-zinc-100 text-zinc-700 font-medium text-xs px-2.5 py-1 rounded-lg border border-zinc-200"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-zinc-400 text-xs italic">No interests listed yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Editing Inputs fields
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1 font-mono">Display Name</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-505"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1 font-mono">Campus Role Type</label>
                          <select
                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={editedRole}
                            onChange={(e) => setEditedRole(e.target.value as UserRole)}
                          >
                            <option value="Student">Regular Student</option>
                            <option value="Student Entrepreneurs">Student Entrepreneur</option>
                            <option value="Student Organizations">Student Organization</option>
                            <option value="Campus Creators">Campus Creator</option>
                            <option value="Student Leaders">Student Leader (Rep)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1 font-mono">Faculty</label>
                          <select
                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-505"
                            value={editedFaculty}
                            onChange={(e) => handleFacultyChange(e.target.value)}
                          >
                            {UNIUYO_FACULTIES.map((fac) => (
                              <option key={fac.name} value={fac.name}>
                                {fac.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1 font-mono">Department</label>
                          <select
                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-505"
                            value={editedDepartment}
                            onChange={(e) => setEditedDepartment(e.target.value)}
                          >
                            {availableDepartments.map((dept) => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1 font-mono">Academic level</label>
                          <select
                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-505"
                            value={editedLevel}
                            onChange={(e) => setEditedLevel(e.target.value)}
                          >
                            <option value="100L">100L</option>
                            <option value="200L">200L</option>
                            <option value="300L">300L</option>
                            <option value="400L">400L</option>
                            <option value="500L">500L</option>
                            <option value="600L">600L</option>
                            <option value="Postgrad">Postgraduate</option>
                            <option value="Alumni">Alumni Member</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1 font-mono">Biography</label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-505"
                          placeholder="Tell other University of Uyo students about your research projects, laundry business, design works or general activities..."
                          value={editedBio}
                          onChange={(e) => setEditedBio(e.target.value)}
                        />
                      </div>

                      {/* Edit Skills and Interests */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border border-zinc-200 p-3 rounded-lg bg-zinc-50/50">
                          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1 font-mono">Manage Skills</label>
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              className="flex-1 px-2.5 py-1 border border-zinc-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-505 bg-white"
                              placeholder="e.g., Photography, React, Python"
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                            />
                            <button
                              type="button"
                              onClick={handleAddSkill}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1 rounded cursor-pointer"
                            >
                              Add
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                            {skills.map(s => (
                              <span key={s} className="bg-white px-2 py-0.5 rounded text-xs text-zinc-700 border border-zinc-200 flex items-center gap-1 font-medium">
                                {s}
                                <button type="button" onClick={() => handleRemoveSkill(s)} className="text-zinc-400 hover:text-red-500 font-bold shrink-0">×</button>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="border border-zinc-200 p-3 rounded-lg bg-zinc-50/50">
                          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1 font-mono">Manage Interests</label>
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              className="flex-1 px-2.5 py-1 border border-zinc-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-505 bg-white"
                              placeholder="e.g., Football, Law Tech, Fashion"
                              value={newInterest}
                              onChange={(e) => setNewInterest(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                            />
                            <button
                              type="button"
                              onClick={handleAddInterest}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1 rounded cursor-pointer"
                            >
                              Add
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                            {interests.map(i => (
                              <span key={i} className="bg-white px-2 py-0.5 rounded text-xs text-zinc-700 border border-zinc-200 flex items-center gap-1 font-medium">
                                {i}
                                <button type="button" onClick={() => handleRemoveInterest(i)} className="text-zinc-400 hover:text-red-500 font-bold shrink-0">×</button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 border border-zinc-200 rounded-lg space-y-2">
                        <span className="block text-xs font-bold text-zinc-700 uppercase tracking-wider font-mono">Social Channels Links</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            className="px-2.5 py-1.5 border border-zinc-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-505"
                            placeholder="Linkedin Link"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                          />
                          <input
                            type="text"
                            className="px-2.5 py-1.5 border border-zinc-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-505"
                            placeholder="Twitter X Link"
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                          />
                          <input
                            type="text"
                            className="px-2.5 py-1.5 border border-zinc-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-505"
                            placeholder="Github Link"
                            value={github}
                            onChange={(e) => setGithub(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-100 text-zinc-700 font-semibold text-xs cursor-pointer"
                        >
                          Cancel Customizing
                        </button>
                        <button
                          type="button"
                          onClick={handleSave}
                          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs cursor-pointer shadow-sm"
                        >
                          Publish Credentials
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
                  {/* SUBTAB 2: Student & Organization Verification Center */}
              {activeSubTab === 'verification' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  key="verify-pane"
                  className="space-y-6 text-left"
                >
                  {/* ADMIN MODE TOGGLE WIDGET */}
                  <div className="bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl">
                        <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-extrabold text-zinc-900 dark:text-zinc-100 text-sm">Administration Review Center</p>
                        <p className="text-zinc-500 text-xs mt-0.5">Admin credential simulator for organization charter approvals & identity reviews.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAdminMode(!isAdminMode);
                        setVerifyStatus('idle'); // reset student simulator if any
                      }}
                      className={`w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 border cursor-pointer ${
                        isAdminMode
                          ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
                          : 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:text-zinc-900 dark:border-white hover:opacity-90'
                      }`}
                    >
                      {isAdminMode ? 'Exit Admin View' : 'Enter Admin View'}
                    </button>
                  </div>

                  <div className="p-4 bg-indigo-50 text-indigo-950 rounded-xl border border-indigo-100 flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-[#4F46E5] text-xs uppercase tracking-wider font-mono font-sans">Certified Student Registry</h4>
                      <p className="text-zinc-650 text-xs mt-1 leading-relaxed">
                        To maintain standard safety and authentic networking, we encourage all active University of Uyo students to link their official matric records and student ID card image scans. Linking credentials awards **+100 merit points** instantly!
                      </p>
                    </div>
                  </div>

                  {currentUser.verified ? (
                    /* ACTIVE VERIFIED DISPLAY FOR STUDENTS / ORGANIZATIONS */
                    currentUser.role === 'Student Organizations' ? (
                      /* ORGANIZATION CHARTER VERIFIED BOARD */
                      <div className="bg-gradient-to-br from-emerald-500/5 to-indigo-500/5 rounded-2xl border-2 border-emerald-500 p-8 text-center relative overflow-hidden shadow-sm border-dashed">
                        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl animate-none" />
                        
                        <div className="max-w-md mx-auto space-y-4 relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-md">
                            <ShieldCheck className="w-10 h-10 fill-white/10" />
                          </div>
                          
                          <div>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black tracking-widest px-3.5 py-1 rounded-full uppercase font-mono">
                              OFFICIALLY CHARTERED CAMPUS ASSOCIATION
                            </span>
                            <h3 className="text-xl font-extrabold text-zinc-900 mt-2">Organization Charter Verified</h3>
                            <p className="text-zinc-500 text-xs mt-1 leading-relaxed font-sans">
                              Your student group has successfully achieved a certified charter portfolio with the University of Uyo.
                            </p>
                          </div>

                          <div className="border border-zinc-200 bg-white/80 rounded-xl p-4 text-xs font-semibold text-zinc-700 space-y-2 text-left shadow-2xs font-sans">
                            <div className="flex justify-between">
                              <span className="text-zinc-400 font-medium">Organization Name:</span>
                              <span className="font-extrabold text-zinc-950">{currentUser.name}</span>
                            </div>
                            <div className="flex justify-between font-sans">
                              <span className="text-zinc-400 font-medium">Official Registry Code:</span>
                              <span className="font-mono font-bold text-zinc-900">{currentUser.orgRegCode || 'REG/CS/NACOS/001'}</span>
                            </div>
                            <div className="flex justify-between font-sans">
                              <span className="text-zinc-400 font-medium">Faculty Patron:</span>
                              <span className="font-bold text-zinc-900">{currentUser.orgPatron || 'N/A Academic Advisor'}</span>
                            </div>
                            <div className="flex justify-between border-t border-zinc-100 pt-2 text-emerald-700 font-bold uppercase text-[10px]">
                              <span>Charter Authority Status:</span>
                              <span className="flex items-center gap-1 text-emerald-605 font-sans">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approved &amp; Synchronized
                              </span>
                            </div>
                          </div>

                          <p className="text-[10px] font-mono text-zinc-400">
                            UniUyo Governance Registry Authority Cryptographic ID: <span className="underline">{currentUser.id.slice(0, 10)}_charter_certified</span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* STUDENT VERIFIED DISPLAY */
                      <div className="bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-2xl border-2 border-dashed border-indigo-200 p-8 text-center relative overflow-hidden shadow-sm">
                        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl" />
                        
                        <div className="max-w-md mx-auto space-y-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-emerald-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-md">
                            <ShieldCheck className="w-10 h-10 fill-white/10" />
                          </div>
                          
                          <div>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest font-mono">
                              OFFICIALLY CERTIFIED STUDENT
                            </span>
                            <h3 className="text-xl font-extrabold text-zinc-900 mt-2">Enrollment Verified</h3>
                            <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                              Your identity is securely tied with the University of Uyo registrar record database.
                            </p>
                          </div>

                          <div className="border border-zinc-200 bg-white/80 rounded-xl p-4 text-xs font-medium text-zinc-700 space-y-2 text-left shadow-2xs">
                            <div className="flex justify-between">
                              <span className="text-zinc-400 font-medium">Student Name:</span>
                              <span className="font-extrabold text-zinc-955">{currentUser.name}</span>
                            </div>
                            <div className="flex justify-between font-mono">
                              <span className="text-zinc-400 font-sans font-medium">Formal Matric No:</span>
                              <span className="font-mono font-bold text-zinc-900">{currentUser.matricNo || '19/EG/CS/345'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400 font-medium">Academic Major:</span>
                              <span className="font-bold text-zinc-900">{currentUser.department} ({currentUser.level})</span>
                            </div>
                            <div className="flex justify-between border-t border-zinc-105 pt-2 text-emerald-700 font-bold uppercase text-[10px]">
                              <span>Registry Sync Status:</span>
                              <span className="flex items-center gap-1 font-extrabold text-emerald-600 font-sans">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
                              </span>
                            </div>
                          </div>

                          <p className="text-[10px] font-mono text-zinc-400 font-semibold text-center">
                            UniUyo Registry Authority Cryptographic ID: <span className="underline">{currentUser.id.slice(0, 10)}_certified</span>
                          </p>
                        </div>
                      </div>
                    )
                  ) : (
                    /* DELEGATED PENDING STATE OR MEMBER PROFILE ENROLLMENT forms */
                    currentUser.verificationStatus === 'pending' ? (
                      /* CONSOLE PENDING STATE SCREEN FOR SUBMITTED USERS */
                      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-5 text-center">
                        <div className="max-w-md mx-auto space-y-4">
                          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-100">
                            <Clock className="w-6 h-6 animate-pulse" />
                          </div>

                          <div>
                            <span className="bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase font-mono">
                              Awaiting Governance Review
                            </span>
                            <h3 className="text-base font-extrabold text-zinc-900 mt-2">Charter Application Pending</h3>
                            <p className="text-zinc-500 text-xs mt-1 leading-relaxed font-sans font-medium">
                              {currentUser.role === 'Student Organizations' 
                                ? "Your organization portfolio has been securely uploaded to the Student Affairs desk. An administrator will review your constitution details shortly."
                                : "Your individual student registration record is queued for ID match verification. Check back shortly."}
                            </p>
                          </div>

                          {/* RE-SUBMIT / RESET TRIGGER BUTTON */}
                          <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-4 text-xs select-none space-y-1.5 text-left font-sans">
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Registry Code:</span>
                              <b className="font-mono text-zinc-800">{currentUser.orgRegCode || currentUser.matricNo || 'N/A'}</b>
                            </div>
                            {currentUser.role === 'Student Organizations' && (
                              <div className="flex justify-between font-sans">
                                <span className="text-zinc-400 font-medium font-sans">Faculty Patron:</span>
                                <b className="text-zinc-805">{currentUser.orgPatron || 'N/A'}</b>
                              </div>
                            )}
                          </div>

                          <div className="pt-2 border-t border-zinc-100 flex justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateCurrentUser({
                                  ...currentUser,
                                  verificationStatus: 'unverified'
                                });
                                setVerifyStatus('idle');
                                onShowToast("Edit mode unlocked. You can adjust files and re-submit now.", "success");
                              }}
                              className="px-4 py-2 bg-zinc-100 font-bold hover:bg-zinc-200 text-zinc-700 text-xs rounded-xl cursor-pointer transition font-sans"
                            >
                              Edit &amp; Re-submit Documents
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsAdminMode(true);
                                onShowToast("Simulating administration board switch...", "success");
                              }}
                              className="px-4 py-2 bg-zinc-900 font-bold text-white text-xs rounded-xl cursor-pointer transition hover:opacity-90 font-mono"
                            >
                              🔧 Approve as Admin
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : currentUser.role === 'Student Organizations' ? (
                      /* ORGANIZATION REGISTRATION FORM */
                      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-2xs space-y-5 border-dashed">
                        <div className="border-b border-zinc-100 pb-3">
                          <h3 className="font-extrabold text-zinc-909 text-sm font-sans">Register Student Organization Charter</h3>
                          <p className="text-zinc-500 text-xs mt-0.5 font-sans justify-center">Please provide registered details and advisor endorsements to establish your verified presence.</p>
                        </div>

                        {verifyStatus === 'idle' && (
                          <form onSubmit={handleVerifyOrg} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1 font-mono">Organization Registration ID / Code</label>
                                <input
                                  type="text"
                                  required
                                  value={orgRegCodeInput}
                                  onChange={(e) => setOrgRegCodeInput(e.target.value)}
                                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500 font-mono focus:border-indigo-500 uppercase"
                                  placeholder="e.g., ORG/REG/CSC/105"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-zinc-705 uppercase tracking-wider mb-1 font-mono">Faculty Advisor / Staff Patron Name</label>
                                <input
                                  type="text"
                                  required
                                  value={orgPatronInput}
                                  onChange={(e) => setOrgPatronInput(e.target.value)}
                                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-505"
                                  placeholder="e.g., Prof. Aniefiok Edem"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                              <div>
                                <label className="block text-xs font-bold text-zinc-705 uppercase tracking-wider mb-1 font-mono animate-none">Document Verification Type</label>
                                <select
                                  value={orgDocTypeInput}
                                  onChange={(e) => setOrgDocTypeInput(e.target.value)}
                                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                  <option value="Charter Recommendation Letter">Charter Recommendation Letter from Faculty Dean</option>
                                  <option value="Association Constitution Draft">Association Constitution Draft (PDF/Docx Scan)</option>
                                  <option value="Student Affairs Approval Letter">Student Affairs Board Approval Certificate</option>
                                  <option value="CBT Authorized Registration">CBT Center Authorization Slip</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-zinc-705 uppercase tracking-wider mb-1 font-mono">Short Description / Core Aims</label>
                                <input
                                  type="text"
                                  value={orgDescriptionInput}
                                  onChange={(e) => setOrgDescriptionInput(e.target.value)}
                                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                                  placeholder="e.g., Fostering leadership, computer skill acquisition, and community coding."
                                />
                              </div>
                            </div>

                            {/* Charter Letter Upload */}
                            <div className="space-y-1.5 font-sans">
                              <label className="block text-xs font-bold text-zinc-750 uppercase tracking-wider font-mono">Upload Signed Charter Scan / Constitution Page 1</label>
                              <div className="relative border-2 border-dashed border-zinc-300 rounded-xl p-6 bg-zinc-50/50 hover:bg-zinc-50 transition duration-150 group text-center cursor-pointer">
                                <input
                                  type="file"
                                  id="verify-org-doc-input"
                                  accept="image/*"
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  onChange={handleOrgDocUpload}
                                />
                                {orgDocBase64 ? (
                                  <div className="space-y-3.5 flex flex-col items-center font-sans">
                                    <div className="h-28 w-44 rounded-lg bg-zinc-800 border-2 border-indigo-200 overflow-hidden relative shadow-sm flex items-center justify-center animate-none">
                                      <img
                                        src={orgDocBase64}
                                        alt="Charter letter upload preview"
                                        className="w-full h-full object-cover opacity-85 animate-none"
                                        referrerPolicy="no-referrer"
                                      />
                                      <b className="absolute bottom-1 right-1 bg-emerald-600 text-white font-mono text-[8px] font-extrabold px-1.5 rounded uppercase font-sans animate-none">
                                        UPLOADED
                                      </b>
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-emerald-700 font-sans animate-none">Constitution Scan indexed successfully!</p>
                                      <p className="text-[10px] text-zinc-400">Click or drag another image to replace files</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center gap-2 font-sans">
                                    <div className="w-10 h-10 bg-zinc-200 text-zinc-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition duration-150 animate-none">
                                      <UploadCloud className="w-5 h-5 text-indigo-500 animate-none" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold text-zinc-700">Drag &amp; drop signed endorsement letter, or <span className="text-indigo-600 underline font-sans">browse scan</span></p>
                                      <p className="text-[10px] text-zinc-400 mt-0.5 font-sans">Scanned document, PDF, JPG, PNG up to 20MB limit</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-zinc-100 flex justify-end font-semibold">
                              <button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer font-sans"
                              >
                                <ShieldCheck className="w-4 h-4 fill-white/10" />
                                <span>Submit Charter Application</span>
                              </button>
                            </div>
                          </form>
                        )}

                        {verifyStatus === 'loading' && (
                          /* PROGRESS LOADER FOR ORGS */
                          <div className="p-6 text-center space-y-5">
                            <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin mx-auto" />
                            <div className="space-y-2">
                              <h4 className="text-sm font-black text-zinc-900 font-sans">Uploading Organization Prospectus</h4>
                              <p className="text-zinc-500 text-xs font-mono max-w-sm mx-auto min-h-[30px] leading-relaxed">
                                {verifyStageName}
                              </p>
                            </div>
                            <div className="w-full max-w-sm bg-zinc-100 rounded-full h-2.5 mx-auto overflow-hidden animate-none">
                              <div 
                                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                                style={{ width: `${verifyProgress}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-650 font-mono uppercase bg-emerald-50 px-2.5 py-1 rounded">
                              Step {verifyProgress <= 25 ? '1/5' : verifyProgress <= 50 ? '2/5' : verifyProgress <= 75 ? '3/5' : verifyProgress <= 90 ? '4/5' : '5/5'}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* STUDENT VERIFICATION FORM */
                      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-2xs space-y-5">
                        <div className="border-b border-zinc-100 pb-3">
                          <h3 className="font-extrabold text-zinc-905 text-sm">Submit University Credentials</h3>
                          <p className="text-zinc-505 text-xs mt-0.5">Please provide realistic school details. Verification is processed instantly in our offline sandbox simulation.</p>
                        </div>

                      {verifyStatus === 'idle' && (
                        <form onSubmit={handleVerifyIdentity} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1 font-mono">Official UniUyo Matric No</label>
                              <input
                                type="text"
                                required
                                value={matricInput}
                                onChange={(e) => setMatricInput(e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500 font-mono focus:border-indigo-500 uppercase"
                                placeholder="e.g., 20/SC/CO/104"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1 font-mono">Student Email Address</label>
                              <input
                                type="email"
                                required
                                value={schoolEmailInput}
                                onChange={(e) => setSchoolEmailInput(e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                                placeholder="e.g., mail@student.uniuyo.edu.ng"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider font-mono">Upload Front ID Card Image Scan</label>
                            
                            {/* Drag and Drop area */}
                            <div className="relative border-2 border-dashed border-zinc-300 rounded-xl p-6 bg-zinc-50/50 hover:bg-zinc-50 transition duration-150 group text-center cursor-pointer">
                              <input
                                type="file"
                                id="verify-id-card-input"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleIdCardUpload}
                              />
                              
                              {idCardFileBase64 ? (
                                <div className="space-y-3.5 flex flex-col items-center">
                                  <div className="h-28 w-44 rounded-lg bg-zinc-800 border-2 border-indigo-200 overflow-hidden relative shadow-sm">
                                    <img
                                      src={idCardFileBase64}
                                      alt="Student ID card preview"
                                      className="w-full h-full object-cover opacity-85"
                                      referrerPolicy="no-referrer"
                                    />
                                    <span className="absolute bottom-1 right-1 bg-emerald-600 text-white font-mono text-[8px] font-bold px-1 rounded">
                                      READY
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-emerald-700">Scan mapped successfully!</p>
                                    <p className="text-[10px] text-zinc-400">Click or drag another image to replace files</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center gap-2">
                                  <div className="w-9 h-9 bg-zinc-200 text-zinc-650 rounded-xl flex items-center justify-center group-hover:scale-105 transition duration-150">
                                    <UploadCloud className="w-5 h-5 text-zinc-500" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-zinc-750">Drag &amp; drop student ID, or <span className="text-indigo-600 underline">browse scan</span></p>
                                    <p className="text-[10px] text-zinc-400 mt-0.5">PNG, JPG or scanned document up to 20MB</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-zinc-100 flex justify-end">
                            <button
                              type="submit"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <ShieldCheck className="w-4 h-4 fill-white/10" />
                              <span>Simulate Identity Verification</span>
                            </button>
                          </div>
                        </form>
                      )}

                      {verifyStatus === 'loading' && (
                        /* SEQUENTIAL PROGRESS BAR LOADER */
                        <div className="p-6 text-center space-y-5">
                          <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin mx-auto" />
                          
                          <div className="space-y-2">
                            <h4 className="text-sm font-bold text-zinc-900">Validating Student Record Credentials</h4>
                            <p className="text-zinc-500 text-xs font-mono max-w-md mx-auto min-h-[30px] leading-relaxed">
                              {verifyStageName}
                            </p>
                          </div>

                          <div className="w-full max-w-sm bg-zinc-100 rounded-full h-2.5 mx-auto overflow-hidden">
                            <div 
                              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                              style={{ width: `${verifyProgress}%` }}
                            />
                          </div>

                          <span className="text-[10px] font-bold text-indigo-600 font-mono uppercase bg-indigo-50 px-2.5 py-1 rounded">
                            Step {verifyProgress <= 25 ? '1/4' : verifyProgress <= 50 ? '2/4' : verifyProgress <= 80 ? '3/4' : '4/4'}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                )}
              </motion.div>
              )}

              {/* SUBTAB 3: Gamification and Leaderboards */}
              {activeSubTab === 'gamification' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  key="game-pane"
                  className="space-y-6 text-left"
                >
                  {/* METRICS LEVEL DRAWER */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Points counter */}
                    <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-4 rounded-xl border border-indigo-850 text-white flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-indigo-300 uppercase font-bold tracking-widest font-mono">My Account Scale</span>
                        <h3 className="text-3xl font-black mt-1 font-sans">{currentUser.points || 0} <span className="text-xs text-indigo-300 font-bold">PTS</span></h3>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-indigo-800/40 text-[10px] text-indigo-200">
                        Ranked Level: <span className="font-extrabold">Bronze scholar tier</span>
                      </div>
                    </div>

                    {/* Level gauge */}
                    <div className="bg-white p-4 rounded-xl border border-zinc-200 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest font-mono">XP Tier Expansion</span>
                        <div className="flex justify-between items-end">
                          <span className="text-sm font-bold text-zinc-800">LEVEL 2</span>
                          <span className="text-[10px] text-zinc-500 font-mono">{(currentUser.points || 0)} / 500 PTS</span>
                        </div>
                      </div>

                      <div className="mt-2.5">
                        <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-650 h-full rounded-full transition-all duration-300 bg-[#4F46E5]"
                            style={{ width: `${Math.min(100, ((currentUser.points || 0) / 500) * 100)}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-zinc-400 block mt-1.5 font-bold">Gain 500 PTS to extend to Level 3 Academic Rep</span>
                      </div>
                    </div>

                    {/* Badge total banner */}
                    <div className="bg-white p-4 rounded-xl border border-zinc-200 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest font-mono">Earned Badges Drawer</span>
                        <h3 className="text-2xl font-extrabold text-zinc-900 mt-1 flex items-center gap-1.5">
                          <span>{(currentUser.badges || []).length} Badges</span>
                        </h3>
                      </div>

                      <div className="flex -space-x-1.5 overflow-hidden mt-3 max-h-6">
                        {(currentUser.badges || []).map((badge, idx) => (
                          <div 
                            key={badge} 
                            style={{ zIndex: 10 - idx }}
                            className="w-6 h-6 rounded-full bg-indigo-100 border border-white text-[11px] flex items-center justify-center shadow-xs"
                            title={badge}
                          >
                            🌟
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE STUDENT BADGES SLIDER */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-widest font-mono">Badges Locker Room</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {(currentUser.badges || []).length > 0 ? (
                        (currentUser.badges || []).map((badge) => {
                          const badgeDescription: { [b: string]: string } = {
                            'Verified Scholar': 'Simulated profile registry and Matric identity validated',
                            'Forum Contributor': 'Published standard discussion topics in the home streams',
                            'MVP Founder': 'Registered a research or technology software MVP project',
                            'Community Pioneer': 'Joined a student-managed academic or professional community',
                            'Event Goer': 'Saved seats and RSVP’d to campus discussions and meetings',
                            'Referral Master': 'Linked student friends using email dispatchers',
                          };

                          return (
                            <div key={badge} className="bg-zinc-55 bg-zinc-50/70 hover:bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex gap-2.5 items-start transition">
                              <span className="text-base">🌟</span>
                              <div className="min-w-0">
                                <span className="text-xs font-bold font-sans text-zinc-900 block truncate leading-tight">{badge}</span>
                                <span className="text-[9px] text-zinc-500 leading-tight block mt-0.5">
                                  {badgeDescription[badge] || 'Granted for outstanding activity on UniUyo Connect'}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-full border border-dashed border-zinc-200 p-4 text-center rounded-xl text-zinc-400 text-xs italic">
                          No merit badges unlocked yet. Complete Quests below to win gold medals!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* REAL-TIME CAMPUS SCORES LEADERBOARD */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-zinc-805 uppercase tracking-widest font-mono flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-indigo-500" />
                        <span>University of Uyo Leaderboard Scoreboard</span>
                      </h4>
                      <span className="text-[10px] text-[#4F46E5] uppercase font-bold bg-indigo-50 px-2 rounded-full font-mono">
                        Active Campus Wide
                      </span>
                    </div>

                    <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-3xs">
                      {liveLeaderboardList.map((profile, index) => {
                        const isSelfObj = profile.id === currentUser.id;
                        const rankNum = index + 1;
                        return (
                          <div 
                            key={profile.id}
                            className={`flex items-center justify-between p-3.5 border-b last:border-b-0 transition-colors ${
                              isSelfObj ? 'bg-indigo-50/50 hover:bg-indigo-50 border-r-4 border-r-indigo-650' : 'hover:bg-zinc-50/40'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {/* Medal Display */}
                              <div className="w-6.5 text-center font-bold font-mono">
                                {rankNum === 1 ? (
                                  <span className="text-[#FFD700] text-base" title="Gold Academic Rank">🥇</span>
                                ) : rankNum === 2 ? (
                                  <span className="text-[#C0C0C0] text-base" title="Silver Academic Rank">🥈</span>
                                ) : rankNum === 3 ? (
                                  <span className="text-[#CD7F32] text-base" title="Bronze Academic Rank">🥉</span>
                                ) : (
                                  <span className="text-xs text-zinc-400">#{rankNum}</span>
                                )}
                              </div>

                              <img
                                src={profile.avatar}
                                alt={profile.name}
                                className="w-8.5 h-8.5 rounded-lg object-cover bg-zinc-100 shadow-3xs"
                                referrerPolicy="no-referrer"
                              />

                              <div className="min-w-0">
                                <span className={`text-xs font-bold truncate block ${isSelfObj ? 'text-indigo-950 font-black' : 'text-zinc-900'}`}>
                                  {profile.name} {isSelfObj && ' (You)'}
                                </span>
                                <span className="text-[9px] text-zinc-500 block truncate">
                                  {profile.role} • {profile.department}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <span className="text-xs font-black font-mono text-zinc-900 block">{(profile.points || 0)}</span>
                                <span className="text-[8px] text-zinc-400 font-bold block uppercase tracking-wide">Points</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* INTERACTIVE REFERRAL INVITATIONS QUEST */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="border border-zinc-200 bg-white rounded-xl p-4 shadow-3xs space-y-3.5">
                      <div className="border-b border-zinc-100 pb-2">
                        <span className="text-[9px] uppercase font-black text-amber-600 block tracking-wider font-mono">REFERRALS QUEST</span>
                        <h4 className="text-xs font-bold text-zinc-900 mt-0.5">Invite Student Friends for Points</h4>
                      </div>

                      <form onSubmit={handleInviteFriend} className="space-y-2.5">
                        <p className="text-zinc-500 text-[11px] leading-relaxed">
                          Invite classmate peers by entering their username tags or initials. Get **+20 points** instantly on submission.
                        </p>
                        
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={inviteFriendName}
                            onChange={(e) => setInviteFriendName(e.target.value)}
                            placeholder="e.g., Chinyere Obinna"
                            className="bg-white px-2.5 py-1.5 border border-zinc-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-550 flex-1"
                          />
                          <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-lg shrink-0 cursor-pointer"
                          >
                            Send Invite
                          </button>
                        </div>
                      </form>

                      {friendsInvited.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Dispatched Referrals:</span>
                          <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                            {friendsInvited.map(item => (
                              <span key={item} className="bg-zinc-100 border border-zinc-200 text-zinc-700 text-[9px] font-mono py-0.5 px-2.5 rounded-full">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SYSTEM QUESTS TO SCORE POINTS CHECKLIST */}
                    <div className="border border-zinc-200 bg-white rounded-xl p-4 shadow-3xs space-y-2">
                      <div className="border-b border-zinc-100 pb-2">
                        <span className="text-[9px] uppercase font-black text-indigo-600 block tracking-wider font-mono">MISSION LOGS</span>
                        <h4 className="text-xs font-bold text-zinc-900 mt-0.5">Active Campus Quests</h4>
                      </div>

                      <div className="space-y-2 text-xs font-medium">
                        <div className="flex items-center justify-between text-zinc-650 bg-zinc-50 p-1.5 rounded-lg">
                          <span className="flex items-center gap-1.5">
                            <span className="text-emerald-600">✔</span> Complete profile biography
                          </span>
                          <span className="font-mono text-[9px] font-bold text-zinc-500">+30 PTS</span>
                        </div>

                        <div className="flex items-center justify-between text-zinc-650 bg-zinc-50 p-1.5 rounded-lg">
                          <span className="flex items-center gap-1.5">
                            <span className={currentUser.verified ? "text-emerald-600" : "text-zinc-350"}>
                              {currentUser.verified ? "✔" : "○"}
                            </span> 
                            Student Registry validation
                          </span>
                          <span className="font-mono text-[9px] font-bold text-indigo-650">+100 PTS</span>
                        </div>

                        <div className="flex items-center justify-between text-zinc-650 bg-zinc-50 p-1.5 rounded-lg">
                          <span className="flex items-center gap-1.5">
                            <span>○</span> Publish a discussion thread
                          </span>
                          <span className="font-mono text-[9px] font-bold text-zinc-500">+15 PTS</span>
                        </div>

                        <div className="flex items-center justify-between text-zinc-650 bg-zinc-50 p-1.5 rounded-lg">
                          <span className="flex items-center gap-1.5">
                            <span>○</span> Join a fellowship/forum category
                          </span>
                          <span className="font-mono text-[9px] font-bold text-zinc-500">+10 PTS</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Col 3: Role Simulator & Student Directory */}
      <div className="space-y-6 text-left">
        {/* Role Simulator Selector */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-905 text-white rounded-2xl p-5 shadow-sm border border-indigo-805 bg-slate-900">
          <div className="flex items-center gap-2 mb-3">
            <Key className="w-5 h-5 text-indigo-400 shrink-0" />
            <h3 className="font-bold text-base tracking-tight">Identity Role Simulator</h3>
          </div>
          <p className="text-indigo-200 text-xs leading-relaxed mb-4">
            UniUyo Connect displays tailored elements depending on active roles (Student Leaders, Campus Media, Organization, etc.). Select a student profile below to instantly log in as that identity.
          </p>

          <div className="space-y-2.5" id="user-switching-list">
            {profiles.map((profile) => {
              const isActive = profile.id === currentUser.id;
              return (
                <button
                  key={profile.id}
                  onClick={() => onSwitchUser(profile.id)}
                  className={`w-full text-left p-2.5 rounded-xl border flex items-center gap-3 transition cursor-pointer ${
                    isActive
                      ? 'bg-white text-zinc-950 border-white shadow-md font-semibold font-bold'
                      : 'bg-indigo-950/40 text-indigo-100 border-indigo-800 hover:bg-indigo-950/90'
                  }`}
                >
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-9 h-9 rounded-xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs truncate block font-bold">
                      {profile.name} {isActive && ' (You)'}
                    </span>
                    <span className={`text-[10px] block ${isActive ? 'text-[#4F46E5]' : 'text-indigo-300'}`}>
                      {profile.role} • {profile.department}
                    </span>
                  </div>
                  {isActive && (
                    <div className="bg-indigo-650 text-white p-1 rounded-full bg-[#4F46E5]">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Key Campus statistics */}
        <div className="bg-white rounded-none sm:rounded-2xl border-y sm:border border-x-0 border-zinc-200 p-5 shadow-sm space-y-4">
          <h4 className="font-bold text-zinc-900 text-sm border-b border-zinc-100 pb-2">University Roster Status</h4>
          
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
              <span className="block text-2xl font-extrabold text-indigo-600">8,450+</span>
              <span className="block text-[10px] uppercase font-bold text-zinc-500">Active Students</span>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
              <span className="block text-2xl font-extrabold text-emerald-600">42+</span>
              <span className="block text-[10px] uppercase font-bold text-zinc-500">Organizations</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-1 text-xs">
            <div className="flex justify-between items-center text-zinc-650">
              <span>Primary Host Location</span>
              <span className="font-bold text-zinc-900 font-sans">Uyo, Akwa Ibom State</span>
            </div>
            <div className="flex justify-between items-center text-zinc-650">
              <span>Main Gate Hubs</span>
              <span className="font-bold text-zinc-900 font-sans">Town Campus / Perm Site</span>
            </div>
            <div className="flex justify-between items-center text-zinc-650">
              <span>Network Protocol</span>
              <b className="font-mono text-zinc-800 text-[11px] bg-zinc-100 px-1.5 py-0.5 rounded">PWA Offline Capable</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
