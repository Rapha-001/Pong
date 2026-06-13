/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Post, StudentProfile, Poll, Comment } from '../types';
import { Heart, MessageSquare, Megaphone, HelpCircle, Share2, Pin, Calendar, Vote, Send, Sparkles, Image, CheckSquare, Trash2, Edit3, X, AlertTriangle, Bookmark, ShieldCheck, MoreVertical, Navigation, Compass, Award, Users, Target, Briefcase, ChevronLeft, ChevronRight, MapPin, RotateCw, Star, Info, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PostMediaGallery from './PostMediaGallery';

const autocompleteSuggestions = [
  { id: 'student_raphael', name: 'Raphael Akpabio', username: 'ralphy', role: 'Campus Creators', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256' },
  { id: 'student_jessica', name: 'Jessica Thompson', username: 'jess123', role: 'Campus Creators', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256' },
  { id: 'student_anna', name: 'Anna Johnson', username: 'annaj', role: 'Student Leaders', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256' },
  { id: 'student_ganna123', name: 'Ganna Kovalenko', username: 'ganna123', role: 'Campus Creators', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256' },
  { id: 'student_ganna_off', name: 'Ganna Official', username: 'gannaofficial', role: 'Campus Ambassador', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256' },
  { id: 'student_chidi', name: 'Chidi Nwachukwu', username: 'chidi123', role: 'Student Entrepreneurs', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256' },
  { id: 'student_emem', name: 'Emem Obong', username: 'emem_obong', role: 'Student Leaders', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256' },
  { id: 'student_bassey', name: 'Bassey Edet', username: 'bassey_e', role: 'Campus Creators', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256' },
];

const getProfileUsername = (authorId: string, authorName: string): string => {
  const matched = autocompleteSuggestions.find(s => s.id === authorId || s.name.toLowerCase() === authorName.toLowerCase());
  if (matched) return matched.username;
  return authorName.toLowerCase().replace(/\s+/g, '').slice(0, 12);
};

const formatCommentTime = (dateStr: string): string => {
  try {
    const past = new Date(dateStr).getTime();
    if (isNaN(past)) return "2 days ago";
    const now = Date.now();
    const diffMs = now - past;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    
    return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch (e) {
    return "2 days ago";
  }
};

interface FeedSectionProps {
  currentUser: StudentProfile;
  posts: Post[];
  profiles: StudentProfile[];
  onAddPost: (post: Post) => void;
  onUpdatePost: (post: Post) => void;
  onDeletePost?: (postId: string) => void;
  onUpdateCurrentUser?: (updatedUser: StudentProfile) => void;
  onNavigateToComposer?: () => void;
  onViewProfile?: (userId: string) => void;
  offlineMode: boolean;
  onShowToast: (msg: string, type: 'success' | 'warn') => void;
  theme?: 'light' | 'dark';
  onAddNotification?: (notif: {
    userId: string;
    type: 'post_interaction' | 'event_rsvp' | 'mentorship_request' | 'announcement' | 'direct_message' | 'post_comment' | 'community_post' | 'upcoming_event' | 'opportunity_match';
    title: string;
    message: string;
    senderName: string;
    senderAvatar: string;
    targetId?: string;
  }) => void;
  initialActiveCommentPostId?: string | null;
  onClearInitialActiveCommentPostId?: () => void;
}

export default function FeedSection({
  currentUser,
  posts,
  profiles = [],
  onAddPost,
  onUpdatePost,
  onDeletePost,
  onUpdateCurrentUser,
  onNavigateToComposer,
  onViewProfile,
  offlineMode,
  onShowToast,
  theme = 'light',
  onAddNotification,
  initialActiveCommentPostId,
  onClearInitialActiveCommentPostId,
}: FeedSectionProps) {
  // Feed Filters
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [activePostEmojiId, setActivePostEmojiId] = useState<string | null>(null);

  // Rotating selection of outstanding students
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  // Campus Near Me / Location Radar States
  const [locPermission, setLocPermission] = useState<'prompt' | 'granted' | 'denied' | 'loading'>('prompt');
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  const [simulatedHub, setSimulatedHub] = useState<'perm_site' | 'town_campus'>('perm_site');
  const [activeRadarTab, setActiveRadarTab] = useState<'radar' | 'list'>('radar');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>('cs_lab');

  // Spotlight Auto Rotation (8.5s loop)
  React.useEffect(() => {
    const timer = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % 4);
    }, 8500);
    return () => clearInterval(timer);
  }, []);

  // Monitor Geolocation permission state
  React.useEffect(() => {
    if (typeof window !== 'undefined' && navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName })
        .then((result) => {
          if (result.state === 'granted') {
            setLocPermission('granted');
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                setUserCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
              },
              (err) => {
                console.log('Error listing coords:', err);
              }
            );
          }
        })
        .catch(() => {});
    }
  }, []);

  const requestLocation = () => {
    setLocPermission('loading');
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      setLocPermission('denied');
      onShowToast('Geolocation API not supported.', 'warn');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLocPermission('granted');
        setLocError(null);
        onShowToast('Campus location pinpointed successfully!', 'success');
      },
      (err) => {
        setLocPermission('denied');
        setLocError(err.message || 'Location permission was denied.');
        onShowToast('GPS permission denied. Operating in Simulated Campus Mode.', 'warn');
      }
    );
  };

  // Rotating selection of outstanding students mock dataset
  const SPOTLIGHT_ITEMS = [
    {
      id: 'spot_1',
      type: '🔥 Successful Entrepreneur',
      award: 'Outstanding Venture Bio',
      name: 'Chidi Nwachukwu',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      bio: '300L Business Management student & Founder of Tusk Logistics campus delivery system. Employs 15+ student gig workers to handle campus laundry and express deliveries. Peer-nominated for high enterprise support! 📦🧺',
      targetId: 'student_chidi',
      activityLabel: 'Community Nomination Winner',
      nominationCount: 42,
    },
    {
      id: 'spot_2',
      type: '🏆 Outstanding Creator',
      award: 'MVP Tech Builder',
      name: 'Raphael Akpabio',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      bio: '400L Computer Science student. Product Designer and Lead Developer behind the UniUyo Connect platform. Passionate about offline syncing, high fidelity interfaces, and visual student discovery tools. 🚀⚙️',
      targetId: 'student_raphael',
      activityLabel: '98% Platform Activity Score',
      nominationCount: 56,
    },
    {
      id: 'spot_3',
      type: '🎨 Creative Pioneer',
      award: 'Campus Visualist Award',
      name: 'Bassey Edet',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
      bio: '200L Communication Arts. Captured historical buildings, lecture blocks, and campus sunsets in his Town Campus Spherical Photowalk project to aid freshmen orientations and local identity mapping. 📸🌄',
      targetId: 'student_bassey',
      activityLabel: 'Top Active Contributor',
      nominationCount: 29,
    },
    {
      id: 'spot_4',
      type: '🤝 Active Student Organization',
      award: 'Best Academic Association',
      name: 'NACOS UniUyo Chapter',
      avatar: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=256',
      bio: 'National Association of Computer Science Students. Providing 48-hour competitive software sprints, free web labs, legal advisory clinics, and cash rewards to drive peer excellence. 💻🏆',
      targetId: 'org_nacos',
      activityLabel: 'Hackathon Host 2026',
      nominationCount: 68,
    }
  ];

  const LANDMARKS = [
    { id: 'cs_lab', name: 'Computer Labs (Perm Site)', latitude: 5.0425, longitude: 7.9775, type: 'Tech', desc: 'Host to NACOS Hackathon 2026 & Tech Alliance' },
    { id: 'moot_court', name: 'Moot Court Block (Town Campus)', latitude: 5.0298, longitude: 7.9268, type: 'Academic', desc: 'Host to Student Legal Clinic & Lex Society' },
    { id: 'main_gate', name: 'Main Gate Roundabout (Perm Site)', latitude: 5.0415, longitude: 7.9780, type: 'Social', desc: 'Starting point for Street Photography Walk' },
    { id: 'tusk_hub', name: 'Tusk Logistics Hub (Town Campus Hostels)', latitude: 5.0305, longitude: 7.9255, type: 'Opportunity', desc: 'Tusk Logistics Errand Hub & Internship location' },
    { id: 'science_park', name: 'UniUyo Science Park', latitude: 5.0450, longitude: 7.9795, type: 'Scholarship', desc: 'Scholarship Program & Tech Hub Science grounds' },
    { id: 'town_library', name: 'Town Campus Library', latitude: 5.0310, longitude: 7.9280, type: 'Volunteer', desc: 'Campus Ambassador Writer & Art Collective' }
  ];

  const getHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
  };

  // Post Creator State
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Discussions' | 'Experiences' | 'Questions' | 'Announcements' | 'Opinions'>('Discussions');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  
  // Poll State creators
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOption1, setPollOption1] = useState('');
  const [pollOption2, setPollOption2] = useState('');
  const [pollOption3, setPollOption3] = useState('');

  // Comment state creators (by target Post ID)
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  // Editing state
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');

  // comment editing state variables
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState<string>('');

  // Deletion confirm state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Active comment post (for overlay/modal rendering)
  const [activeCommentPost, setActiveCommentPost] = useState<Post | null>(null);
  const [replyingToComment, setReplyingToComment] = useState<Comment | null>(null);
  const [mentionSearch, setMentionSearch] = useState<string | null>(null);

  // Synchronize opening a specific post's comment thread from parent notifications click redirect
  React.useEffect(() => {
    if (initialActiveCommentPostId) {
      const matched = posts.find(p => p.id === initialActiveCommentPostId);
      if (matched) {
        setActiveCommentPost(matched);
      }
      if (onClearInitialActiveCommentPostId) {
        onClearInitialActiveCommentPostId();
      }
    }
  }, [initialActiveCommentPostId, posts, onClearInitialActiveCommentPostId]);

  // Active three-dots dropdown options menu
  const [activeDropdownPostId, setActiveDropdownPostId] = useState<string | null>(null);

  const categories = ['All', 'Discussions', 'Experiences', 'Questions', 'Announcements', 'Opinions', 'Saved Library'];

  // Handle creating a post
  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !pollQuestion.trim()) {
      onShowToast('Please write some content or create a poll first!', 'warn');
      return;
    }

    let pollObj: Poll | undefined = undefined;
    if (showPollCreator && pollQuestion.trim()) {
      if (!pollOption1.trim() || !pollOption2.trim()) {
        onShowToast('Please fill in at least two poll options!', 'warn');
        return;
      }
      const options = [
        { id: `opt_${Date.now()}_1`, text: pollOption1.trim(), votes: [] },
        { id: `opt_${Date.now()}_2`, text: pollOption2.trim(), votes: [] }
      ];
      if (pollOption3.trim()) {
        options.push({ id: `opt_${Date.now()}_3`, text: pollOption3.trim(), votes: [] });
      }
      pollObj = {
        question: pollQuestion.trim(),
        options
      };
    }

    const newPost: Post = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      authorTag: currentUser.role === 'Student Organizations' ? 'Official Handle' : undefined,
      content: content.trim(),
      image: imageUrl.trim() ? imageUrl.trim() : undefined,
      category,
      poll: pollObj,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };

    onAddPost(newPost);
    
    // Reset state
    setContent('');
    setImageUrl('');
    setPollQuestion('');
    setPollOption1('');
    setPollOption2('');
    setPollOption3('');
    setShowImageInput(false);
    setShowPollCreator(false);
    onShowToast(
      offlineMode 
        ? 'Draft stored locally! Post queued for cloud synchronization.' 
        : 'Post published successfully on the feed!', 
      'success'
    );
  };

  // Like Toggle
  const handleLike = (post: Post) => {
    const likesArr = post.likes || [];
    const isLiked = likesArr.includes(currentUser.id);
    let updatedLikes: string[];
    
    if (isLiked) {
      updatedLikes = likesArr.filter(id => id !== currentUser.id);
    } else {
      updatedLikes = [...likesArr, currentUser.id];
      // Trigger notification feedback triggers
      if (onAddNotification && post.authorId !== currentUser.id) {
        onAddNotification({
          userId: currentUser.id,
          type: 'post_interaction',
          title: 'Interaction Logged',
          message: `You liked ${post.authorName}'s update. Notification dispatched.`,
          senderName: post.authorName,
          senderAvatar: post.authorAvatar,
          targetId: post.id
        });
      }
    }

    onUpdatePost({
      ...post,
      likes: updatedLikes
    });
  };

  const handleTogglePostReaction = (post: Post, emoji: string) => {
    const currentReactions = post.reactions || {};
    const reactors = currentReactions[emoji] || [];
    const hasReacted = reactors.includes(currentUser.id);

    const updatedReactors = hasReacted
      ? reactors.filter(id => id !== currentUser.id)
      : [...reactors, currentUser.id];

    const nextReactions = {
      ...currentReactions,
      [emoji]: updatedReactors
    };

    if (nextReactions[emoji].length === 0) {
      delete nextReactions[emoji];
    }

    onUpdatePost({
      ...post,
      reactions: nextReactions
    });

    if (!hasReacted && onAddNotification && post.authorId !== currentUser.id) {
      onAddNotification({
        userId: post.authorId,
        type: 'post_interaction',
        title: 'New Post Reaction! ⭐',
        message: `${currentUser.name} reacted with ${emoji} to your post: "${post.content.substring(0, 30)}${post.content.length > 30 ? '...' : ''}"`,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        targetId: post.id
      });
    }

    onShowToast(`Reaction ${emoji} updated!`, "success");
  };

  // Poll Vote Handler
  const handleVote = (post: Post, optionId: string) => {
    if (!post.poll) return;

    // Check if user already voted in this poll
    const hasVoted = post.poll.options.some(opt => opt.votes.includes(currentUser.id));
    if (hasVoted) {
      onShowToast("You have already voted in this campus poll!", "warn");
      return;
    }

    const updatedOptions = post.poll.options.map(opt => {
      if (opt.id === optionId) {
        return {
          ...opt,
          votes: [...opt.votes, currentUser.id]
        };
      }
      return opt;
    });

    onUpdatePost({
      ...post,
      poll: {
        ...post.poll,
        options: updatedOptions
      }
    });

    onShowToast("Vote recorded successfully!", "success");
  };

  // Submit Comment
  const handleAddComment = (postId: string) => {
    const comText = commentInputs[postId];
    if (!comText || !comText.trim()) return;

    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      postId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      content: comText.trim(),
      createdAt: new Date().toISOString(),
      parentId: replyingToComment ? replyingToComment.id : undefined,
      likes: []
    };

    onUpdatePost({
      ...targetPost,
      comments: [...targetPost.comments, newComment]
    });

    // Clear input
    setCommentInputs({
      ...commentInputs,
      [postId]: ''
    });

    setReplyingToComment(null);
    setMentionSearch(null);

    onShowToast("Comment recorded!", "success");

    if (onAddNotification) {
      // 1. Notify self that the comment went through
      onAddNotification({
        userId: currentUser.id,
        type: 'post_interaction',
        title: 'New Comment Broadcasted',
        message: `Your comment was successfully recorded on ${targetPost.authorName}'s stream.`,
        senderName: targetPost.authorName,
        senderAvatar: targetPost.authorAvatar,
        targetId: targetPost.id
      });

      // 2. Notify post owner of the incoming reply (if commenter is not the post author)
      if (targetPost.authorId !== currentUser.id) {
        onAddNotification({
          userId: targetPost.authorId,
          type: 'post_comment',
          title: 'New Reply to Your Post 💬',
          message: `${currentUser.name} commented: "${comText.trim().substring(0, 45)}${comText.trim().length > 45 ? '...' : ''}"`,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          targetId: targetPost.id
        });
      }

      // 3. Notify comment being replied to
      if (replyingToComment && replyingToComment.authorId !== currentUser.id) {
        onAddNotification({
          userId: replyingToComment.authorId,
          type: 'post_comment',
          title: 'Someone replied to your comment 💬',
          message: `${currentUser.name} replied to you: "${comText.trim().substring(0, 45)}${comText.trim().length > 45 ? '...' : ''}"`,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          targetId: targetPost.id
        });
      }
    }
  };

  const handleToggleCommentLike = (post: Post, commentId: string) => {
    const updatedComments = (post.comments || []).map(c => {
      if (c.id === commentId) {
        const currentLikes = c.likes || [];
        const hasLiked = currentLikes.includes(currentUser.id);
        const nextLikes = hasLiked
          ? currentLikes.filter(uid => uid !== currentUser.id)
          : [...currentLikes, currentUser.id];
        return { ...c, likes: nextLikes };
      }
      return c;
    });

    onUpdatePost({
      ...post,
      comments: updatedComments
    });
    onShowToast("Comment liked! ❤️", "success");
  };

  // Handle sharing a post
  const handleShare = (post: Post) => {
    try {
      const shareUrl = window.location.href;
      const shareText = `UniUyo Connect - Check out this update by ${post.authorName}: "${post.content.slice(0, 75)}${post.content.length > 75 ? '...' : ''}"\nJoin discussions at: ${shareUrl}`;
      if (navigator.share) {
        navigator.share({
          title: 'UniUyo Connect Feed',
          text: shareText,
          url: shareUrl
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(shareText);
        onShowToast("Link & post text copied to clipboard!", "success");
      }
    } catch (err) {
      onShowToast("Copied to clipboard!", "success");
    }
  };

  // Toggle saving posts to campus curation library
  const handleToggleBookmark = (postId: string) => {
    const savedIds = currentUser.savedPostIds ? [...currentUser.savedPostIds] : [];
    const index = savedIds.indexOf(postId);
    let updatedIds: string[];
    let msg: string;
    
    if (index >= 0) {
      updatedIds = savedIds.filter(id => id !== postId);
      msg = "Post removed from your saved library!";
    } else {
      updatedIds = [...savedIds, postId];
      msg = "Post stored to your saved library successfully!";
    }

    if (onUpdateCurrentUser) {
      onUpdateCurrentUser({
        ...currentUser,
        savedPostIds: updatedIds
      });
      onShowToast(msg, "success");
    } else {
      onShowToast("Identity sync is disabled.", "warn");
    }
  };

  // Comments/Replies editing & deletion managers
  const handleEditComment = (post: Post, commentId: string, newContent: string) => {
    if (!newContent.trim()) {
      onShowToast("Reply content cannot be empty!", "warn");
      return;
    }
    const updatedComments = post.comments.map(c => 
      c.id === commentId ? { ...c, content: newContent.trim() } : c
    );
    onUpdatePost({
      ...post,
      comments: updatedComments
    });
    setEditingCommentId(null);
    onShowToast("Reply edited!", "success");
  };

  const handleDeleteComment = (post: Post, commentId: string) => {
    const remainingComments = post.comments.filter(c => c.id !== commentId);
    onUpdatePost({
      ...post,
      comments: remainingComments
    });
    onShowToast("Reply removed!", "success");
  };

  // Filtered posts list
  const filteredPosts = posts.filter(post => {
    if (showSavedOnly) {
      const savedIds = currentUser.savedPostIds || [];
      if (!savedIds.includes(post.id)) return false;
    }
    
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const matchesContent = post.content.toLowerCase().includes(query);
    const matchesAuthor = post.authorName.toLowerCase().includes(query);
    const matchesCategory = post.category.toLowerCase().includes(query);
    const matchesTag = post.authorTag ? post.authorTag.toLowerCase().includes(query) : false;
    
    return matchesContent || matchesAuthor || matchesCategory || matchesTag;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="feed-section-workspace">
      {/* Feed Column (2 cols) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Search Bar & Bookmarks Toggle */}
        <div className="flex gap-2 items-center" id="feed-search-row">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search posts by content, hashtag, or author name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold pl-10 pr-4 py-3 rounded-2xl border border-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white shadow-xs placeholder-zinc-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-650 font-extrabold text-[10px]"
              >
                Clear
              </button>
            )}
          </div>
          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`px-3.5 py-3 rounded-2xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer shrink-0 ${
              showSavedOnly
                ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
            }`}
            title={showSavedOnly ? "Showing saved bookmarks only" : "Filter saved library items"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-white' : ''}`} />
            <span className="hidden sm:inline">Saved Library</span>
          </button>
        </div>

        {/* Posts Stream */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => {
                const totalPollVotes = post.poll
                  ? post.poll.options.reduce((sum, opt) => sum + opt.votes.length, 0)
                  : 0;
                const isLiked = (post.likes || []).includes(currentUser.id);
                const authorProfile = profiles.find(p => p.id === post.authorId);
                const isAuthorVerified = authorProfile ? authorProfile.verified : false;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    key={post.id}
                    className={`bg-white rounded-none sm:rounded-2xl border-x-0 sm:border p-5 shadow-sm transition space-y-4 ${
                      post.category === 'Announcements'
                        ? 'border-red-200 bg-red-50/5'
                        : post.category === 'Questions'
                        ? 'border-indigo-100'
                        : 'border-zinc-200'
                    }`}
                  >
                    {/* Delete Confirmation Banner */}
                    {deleteConfirmId === post.id && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-650 shrink-0" />
                          <span className="text-xs text-red-850 font-extrabold leading-tight">
                            Delete this campus thread forever? This is irreversible.
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (onDeletePost) {
                                onDeletePost(post.id);
                                onShowToast("Post removed from UniUyo feeds!", "success");
                              } else {
                                onShowToast("Post removed draft!", "success");
                              }
                              setDeleteConfirmId(null);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg cursor-pointer transition shadow-sm"
                          >
                            Yes, Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="bg-white border border-zinc-200 text-zinc-700 font-bold text-xs px-3.5 py-1.5 rounded-lg cursor-pointer transition hover:bg-zinc-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Post Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div 
                        onClick={() => onViewProfile && onViewProfile(post.authorId)}
                        className="flex gap-3 cursor-pointer group select-none"
                        title="Click to view student profile"
                      >
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="w-10 h-10 rounded-xl object-cover border border-zinc-100 group-hover:ring-2 group-hover:ring-indigo-500/40 transition-all duration-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-zinc-950 text-sm group-hover:text-indigo-600 transition-colors duration-200 flex items-center gap-1">
                              {post.authorName}
                              {isAuthorVerified && (
                                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 fill-indigo-150 shrink-0" title="Verified UniUyo Student" />
                              )}
                            </span>
                            {post.authorTag && (
                              <span className="bg-red-100 text-red-800 text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded font-extrabold">
                                {post.authorTag}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-500 group-hover:text-zinc-700 transition-colors block">
                            {post.authorRole} • {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {/* Header Categories indicator & Actions */}
                      <div className="flex items-center gap-2 relative">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border shrink-0 ${
                          post.category === 'Announcements'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : post.category === 'Questions'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-150'
                            : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                        }`}>
                          {post.category === 'Questions' ? '❓ Question' : post.category}
                        </span>

                        <div className="relative">
                          <button
                            onClick={() => setActiveDropdownPostId(activeDropdownPostId === post.id ? null : post.id)}
                            className="p-1 px-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition cursor-pointer flex items-center justify-center animate-none"
                            title="Post options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeDropdownPostId === post.id && (
                            <>
                              {/* Click-away backdrop */}
                              <div 
                                className="fixed inset-0 z-30"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdownPostId(null);
                                }}
                              />
                              
                              {/* Dropdown Menu Overlay */}
                              <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl border border-zinc-150 shadow-xl py-1.5 z-40 text-left">
                                {/* Save/Bookmark item */}
                                {(() => {
                                  const isBookmarked = currentUser.savedPostIds?.includes(post.id) || false;
                                  return (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleBookmark(post.id);
                                        setActiveDropdownPostId(null);
                                      }}
                                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                                        isBookmarked 
                                          ? 'text-amber-600 hover:bg-amber-50' 
                                          : 'text-zinc-700 hover:bg-zinc-50'
                                      }`}
                                    >
                                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 stroke-amber-600' : ''}`} />
                                      <span>{isBookmarked ? 'Remove from Saved' : 'Save to Library'}</span>
                                    </button>
                                  );
                                })()}

                                {/* Edit Post option (if current user is author) */}
                                {post.authorId === currentUser.id && (
                                  <>
                                    <div className="h-px bg-zinc-150 my-1" />
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingPostId(post.id);
                                        setEditingContent(post.content);
                                        setActiveDropdownPostId(null);
                                      }}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer transition-colors"
                                    >
                                      <Edit3 className="w-3.5 h-3.5 text-zinc-500" />
                                      <span>Edit Post</span>
                                    </button>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteConfirmId(post.id);
                                        setActiveDropdownPostId(null);
                                      }}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                      <span>Delete Post</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="space-y-3">
                      {editingPostId === post.id ? (
                        <div className="space-y-2 bg-indigo-50/20 p-3.5 rounded-xl border border-indigo-100/50">
                          <textarea
                            className="w-full text-xs text-zinc-900 bg-white border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-550 font-semibold resize-none"
                            rows={3}
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                          />
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => {
                                if (!editingContent.trim()) {
                                  onShowToast("Content cannot be empty!", "warn");
                                  return;
                                }
                                onUpdatePost({
                                  ...post,
                                  content: editingContent.trim()
                                });
                                setEditingPostId(null);
                                onShowToast("Post edited and updated!", "success");
                              }}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg cursor-pointer transition duration-75 shadow-sm"
                            >
                              Save Edits
                            </button>
                            <button
                              onClick={() => setEditingPostId(null)}
                              className="bg-white border border-zinc-200 text-zinc-700 text-xs font-bold px-3.5 py-1.5 rounded-lg cursor-pointer transition duration-75 hover:bg-zinc-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-zinc-800 leading-relaxed whitespace-pre-line">
                          {post.content}
                        </p>
                      )}

                      {/* Enhanced Post Media Gallery (Facebook / Threads style grid adaptivity with full-screen carousel) */}
                      {(post.image || (post.images && post.images.length > 0)) && (
                        <PostMediaGallery 
                          images={post.images && post.images.length > 0 ? post.images : (post.image ? [post.image] : [])} 
                          onShowToast={onShowToast}
                        />
                      )}

                      {/* Campus Poll Widget */}
                      {post.poll && (
                        <div className="bg-zinc-50/70 border border-zinc-200 rounded-xl p-4 space-y-3">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 uppercase tracking-widest">
                            <Vote className="w-3.5 h-3.5 text-indigo-600" />
                            <span>UniUyo Poll: {post.poll.question}</span>
                          </span>

                          <div className="space-y-2">
                            {post.poll.options.map((option) => {
                              const voteCount = option.votes.length;
                              const pct = totalPollVotes > 0 ? Math.round((voteCount / totalPollVotes) * 100) : 0;
                              const userVotedForThis = option.votes.includes(currentUser.id);
                              
                              return (
                                <button
                                  key={option.id}
                                  onClick={() => handleVote(post, option.id)}
                                  className="w-full relative py-2.5 px-3 block text-left rounded-lg text-xs font-semibold overflow-hidden border border-zinc-200 hover:border-zinc-300 transition shrink-0 bg-white cursor-pointer animate-fadeIn"
                                >
                                  {/* Percentage Fill Bar */}
                                  <div
                                    className="absolute left-0 top-0 bottom-0 bg-indigo-50 transition-all duration-500 animate-slideEast"
                                    style={{ width: `${pct}%` }}
                                  ></div>

                                  <div className="relative flex justify-between items-center">
                                    <span className="text-zinc-800 flex items-center gap-1.5">
                                      {userVotedForThis && <span className="text-indigo-600 font-bold">✓</span>}
                                      {option.text}
                                    </span>
                                    <span className="text-zinc-600 shrink-0 font-bold">
                                      {voteCount} vote{voteCount !== 1 ? 's' : ''} ({pct}%)
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          <div className="text-[10px] text-zinc-400 text-right">
                            Total: {totalPollVotes} participant{totalPollVotes !== 1 ? 's' : ''}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Likes & Comment count controls (Replies lead to modal view on-demand) */}
                    <div className="flex items-center flex-wrap gap-5 pt-3 border-t border-zinc-150 text-xs">
                      <button
                        onClick={() => handleLike(post)}
                        className={`flex items-center gap-1.5 font-bold transition cursor-pointer select-none ${
                          isLiked ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-800'
                        }`}
                      >
                        <motion.span
                          layout
                          whileTap={{ scale: 0.8 }}
                          animate={isLiked ? { scale: [1, 1.45, 0.85, 1.15, 1] } : { scale: 1 }}
                          transition={{ duration: 0.45, type: 'keyframes', ease: 'easeInOut' }}
                          className="flex items-center justify-center shrink-0"
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 stroke-red-500' : ''}`} />
                        </motion.span>
                        <span>{(post.likes || []).length} Like{(post.likes || []).length !== 1 ? 's' : ''}</span>
                      </button>

                      <button
                        onClick={() => setActiveCommentPost(post)}
                        className="flex items-center gap-1 text-indigo-650 hover:text-indigo-800 font-bold transition cursor-pointer select-none"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="underline decoration-indigo-200 decoration-dotted underline-offset-4">
                          {(post.comments || []).length} Reply{(post.comments || []).length !== 1 ? 'ies' : 'y'}
                        </span>
                      </button>

                      <button
                        onClick={() => handleShare(post)}
                        className="flex items-center gap-1 text-zinc-500 hover:text-indigo-600 font-bold transition cursor-pointer select-none ml-auto"
                        title="Share post"
                      >
                        <Share2 className="w-4 h-4 text-zinc-400" />
                        <span>Share</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="bg-zinc-50 text-center rounded-2xl py-12 px-6 border border-zinc-200">
                <HelpCircle className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <p className="text-zinc-700 text-sm font-bold">No discussions in this channel</p>
                <p className="text-zinc-400 text-xs mt-1">Be the very first student to launch a thread here!</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Replies Drawer Overlay Sheet (on-demand comments layout) */}
      <AnimatePresence>
        {activeCommentPost && (() => {
          const liveCommentPost = posts.find(p => p.id === activeCommentPost.id) || activeCommentPost;
          const commentsList = liveCommentPost.comments || [];
          const parentComments = commentsList.filter(c => !c.parentId);
          const getRepliesFor = (pId: string) => commentsList.filter(c => c.parentId === pId);

          const handleSelectMention = (suggestion: typeof autocompleteSuggestions[0]) => {
            const currentInp = commentInputs[liveCommentPost.id] || '';
            const lastAtIndex = currentInp.lastIndexOf('@');
            if (lastAtIndex !== -1) {
              const nextText = currentInp.substring(0, lastAtIndex) + `@${suggestion.username} `;
              setCommentInputs({
                ...commentInputs,
                [liveCommentPost.id]: nextText
              });
            } else {
              setCommentInputs({
                ...commentInputs,
                [liveCommentPost.id]: currentInp + `@${suggestion.username} `
              });
            }
            setMentionSearch(null);
          };

          const handleCommentTextChange = (text: string) => {
            setCommentInputs({
              ...commentInputs,
              [liveCommentPost.id]: text
            });

            const lastAtIndex = text.lastIndexOf('@');
            if (lastAtIndex !== -1 && lastAtIndex >= text.length - 15) {
              const typedWord = text.substring(lastAtIndex + 1);
              if (!typedWord.includes(' ')) {
                setMentionSearch(typedWord);
              } else {
                setMentionSearch(null);
              }
            } else {
              setMentionSearch(null);
            }
          };

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setActiveCommentPost(null);
                setReplyingToComment(null);
                setMentionSearch(null);
              }}
              className="fixed inset-0 z-50 bg-[#06070a]/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
            >
              <motion.div
                initial={{ y: "100%", opacity: 0.5 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0.5 }}
                transition={{ type: 'spring', bounce: 0.08, duration: 0.35 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full sm:max-w-xl bg-[#0f111a] border border-zinc-900 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[75vh] select-none text-white overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-zinc-900 flex items-center justify-between bg-[#131520] rounded-t-3xl sm:rounded-t-2xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-zinc-800 text-white flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white tracking-wide">
                        Comments ({commentsList.length})
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-0.5 font-medium truncate max-w-[210px] sm:max-w-[320px]">
                        Discussion by @{getProfileUsername(liveCommentPost.authorId, liveCommentPost.authorName)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveCommentPost(null);
                      setReplyingToComment(null);
                      setMentionSearch(null);
                    }}
                    className="py-1 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold rounded-lg transition text-center cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                {/* Parent OP Summary Stream */}
                <div className="px-5 py-3.5 bg-[#121422]/60 border-b border-zinc-900/60 flex gap-2.5 items-start">
                  <img
                    src={liveCommentPost.authorAvatar}
                    alt={liveCommentPost.authorName}
                    className="w-7 h-7 rounded-full object-cover shrink-0 border border-zinc-800"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider block">
                      CAMPUS DISCUSSION:
                    </span>
                    <p className="text-xs text-zinc-300 font-medium leading-normal mt-0.5 line-clamp-2">
                      "{liveCommentPost.content}"
                    </p>
                  </div>
                </div>

                {/* Comments List Area */}
                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 min-h-[220px] no-scrollbar bg-[#0f111a]">
                  {parentComments.length > 0 ? (
                    parentComments.map((comment) => {
                      const commentLikesCount = (comment.likes || []).length;
                      const commentHasLiked = (comment.likes || []).includes(currentUser.id);
                      const commentReplies = getRepliesFor(comment.id);

                      return (
                        <div key={comment.id} className="space-y-4">
                          {/* Parent Comment */}
                          <div className="flex gap-3 text-xs">
                            <img
                              src={comment.authorAvatar}
                              alt={comment.authorName}
                              className="w-9 h-9 rounded-full object-cover shrink-0 border border-zinc-800 cursor-pointer hover:ring-2 hover:ring-indigo-500/50 transition-all"
                              referrerPolicy="no-referrer"
                              onClick={() => {
                                setActiveCommentPost(null);
                                if (onViewProfile) onViewProfile(comment.authorId);
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span
                                  onClick={() => {
                                    setActiveCommentPost(null);
                                    if (onViewProfile) onViewProfile(comment.authorId);
                                  }}
                                  className="font-bold text-white hover:underline cursor-pointer"
                                >
                                  @{getProfileUsername(comment.authorId, comment.authorName)}
                                </span>
                                <span className="text-[11px] text-zinc-500 font-medium">
                                  {formatCommentTime(comment.createdAt)}
                                </span>
                              </div>

                              {editingCommentId === comment.id ? (
                                <div className="mt-2 space-y-1.5">
                                  <textarea
                                    className="w-full text-xs p-2 border border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-[#161824] text-white font-medium"
                                    rows={2}
                                    value={editingCommentContent}
                                    onChange={(e) => setEditingCommentContent(e.target.value)}
                                  />
                                  <div className="flex justify-end gap-1.5">
                                    <button
                                      onClick={() => handleEditComment(liveCommentPost, comment.id, editingCommentContent)}
                                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                                    >
                                      Save Reply
                                    </button>
                                    <button
                                      onClick={() => setEditingCommentId(null)}
                                      className="px-2.5 py-1 bg-[#1a1c2a] border border-zinc-800 text-zinc-300 rounded-lg text-[10px] font-bold cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-zinc-250 leading-relaxed mt-1 text-[13px] break-words">
                                    {comment.content}
                                  </p>

                                  {/* Action bar (Like / Reply / Edit) */}
                                  <div className="flex items-center gap-4 mt-2.5">
                                    <button
                                      onClick={() => handleToggleCommentLike(liveCommentPost, comment.id)}
                                      className={`flex items-center gap-1 hover:text-white transition text-[11px] font-extrabold cursor-pointer ${
                                        commentHasLiked ? 'text-pink-500 font-black' : 'text-zinc-500'
                                      }`}
                                    >
                                      <Heart className={`w-3.5 h-3.5 ${commentHasLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
                                      <span>{commentLikesCount || 'Like'}</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        setReplyingToComment(comment);
                                        const handleStr = `@${getProfileUsername(comment.authorId, comment.authorName)} `;
                                        const val = commentInputs[liveCommentPost.id] || '';
                                        if (!val.includes(handleStr)) {
                                          setCommentInputs({
                                            ...commentInputs,
                                            [liveCommentPost.id]: handleStr + val
                                          });
                                        }
                                      }}
                                      className="flex items-center gap-1 text-zinc-500 hover:text-white transition text-[11px] font-extrabold cursor-pointer"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                      <span>Reply</span>
                                    </button>

                                    {comment.authorId === currentUser.id && (
                                      <div className="flex gap-2.5 ml-auto">
                                        <button
                                          onClick={() => {
                                            setEditingCommentId(comment.id);
                                            setEditingCommentContent(comment.content);
                                          }}
                                          className="text-[10px] font-bold text-zinc-500 hover:text-indigo-400 cursor-pointer"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDeleteComment(liveCommentPost, comment.id)}
                                          className="text-[10px] font-bold text-zinc-500 hover:text-red-400 cursor-pointer"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Nested Child Replies */}
                          {commentReplies.length > 0 && (
                            <div className="pl-10 relative mt-2.5 space-y-4">
                              {/* Thread connector line */}
                              <div className="absolute left-[18px] top-0 bottom-4 w-0.5 bg-zinc-800" />

                              {commentReplies.map((reply) => {
                                const replyLikesCount = (reply.likes || []).length;
                                const replyHasLiked = (reply.likes || []).includes(currentUser.id);

                                return (
                                  <div key={reply.id} className="relative flex gap-3 text-xs pt-1.5">
                                    {/* Bend horizontal connector */}
                                    <div className="absolute -left-[22px] top-[22px] w-[20px] h-0.5 bg-zinc-800" />

                                    <img
                                      src={reply.authorAvatar}
                                      alt={reply.authorName}
                                      className="w-8 h-8 rounded-full object-cover shrink-0 border border-zinc-800 cursor-pointer hover:ring-2 hover:ring-indigo-500/50 transition-all"
                                      referrerPolicy="no-referrer"
                                      onClick={() => {
                                        setActiveCommentPost(null);
                                        if (onViewProfile) onViewProfile(reply.authorId);
                                      }}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span
                                          onClick={() => {
                                            setActiveCommentPost(null);
                                            if (onViewProfile) onViewProfile(reply.authorId);
                                          }}
                                          className="font-bold text-white hover:underline cursor-pointer"
                                        >
                                          @{getProfileUsername(reply.authorId, reply.authorName)}
                                        </span>
                                        <span className="text-[11px] text-zinc-500 font-medium">
                                          {formatCommentTime(reply.createdAt)}
                                        </span>
                                      </div>

                                      {editingCommentId === reply.id ? (
                                        <div className="mt-2 space-y-1.5">
                                          <textarea
                                            className="w-full text-xs p-2 border border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-[#161824] text-white font-medium"
                                            rows={2}
                                            value={editingCommentContent}
                                            onChange={(e) => setEditingCommentContent(e.target.value)}
                                          />
                                          <div className="flex justify-end gap-1.5">
                                            <button
                                              onClick={() => handleEditComment(liveCommentPost, reply.id, editingCommentContent)}
                                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                                            >
                                              Save Reply
                                            </button>
                                            <button
                                              onClick={() => setEditingCommentId(null)}
                                              className="px-2.5 py-1 bg-[#1a1c2a] border border-zinc-800 text-zinc-300 rounded-lg text-[10px] font-bold cursor-pointer"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          <p className="text-zinc-250 leading-relaxed mt-1 text-[13px] break-words">
                                            {reply.content}
                                          </p>

                                          {/* Action bar for Replies */}
                                          <div className="flex items-center gap-4 mt-2">
                                            <button
                                              onClick={() => handleToggleCommentLike(liveCommentPost, reply.id)}
                                              className={`flex items-center gap-1 hover:text-white transition text-[11px] font-extrabold cursor-pointer ${
                                                replyHasLiked ? 'text-pink-500 font-black' : 'text-zinc-500'
                                              }`}
                                            >
                                              <Heart className={`w-3.5 h-3.5 ${replyHasLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
                                              <span>{replyLikesCount || 'Like'}</span>
                                            </button>

                                            <button
                                              onClick={() => {
                                                setReplyingToComment(comment); // set reply target to high-level parent for clean 2-level structure
                                                const handleStr = `@${getProfileUsername(reply.authorId, reply.authorName)} `;
                                                const val = commentInputs[liveCommentPost.id] || '';
                                                if (!val.includes(handleStr)) {
                                                  setCommentInputs({
                                                    ...commentInputs,
                                                    [liveCommentPost.id]: handleStr + val
                                                  });
                                                }
                                              }}
                                              className="flex items-center gap-1 text-zinc-500 hover:text-white transition text-[11px] font-extrabold cursor-pointer"
                                            >
                                              <MessageSquare className="w-3.5 h-3.5" />
                                              <span>Reply</span>
                                            </button>

                                            {reply.authorId === currentUser.id && (
                                              <div className="flex gap-2.5 ml-auto">
                                                <button
                                                  onClick={() => {
                                                    setEditingCommentId(reply.id);
                                                    setEditingCommentContent(reply.content);
                                                  }}
                                                  className="text-[10px] font-bold text-zinc-500 hover:text-indigo-400 cursor-pointer"
                                                >
                                                  Edit
                                                </button>
                                                <button
                                                  onClick={() => handleDeleteComment(liveCommentPost, reply.id)}
                                                  className="text-[10px] font-bold text-zinc-500 hover:text-red-400 cursor-pointer"
                                                >
                                                  Delete
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-16 text-center text-zinc-500 flex flex-col items-center justify-center gap-3 h-full">
                      <div className="w-12 h-12 rounded-full bg-[#131520] flex items-center justify-center border border-zinc-850">
                        <MessageSquare className="w-6 h-6 text-zinc-600 stroke-1" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-300">No comments yet</p>
                        <p className="text-xs text-zinc-500 mt-1">Start typing below to post the very first feedback!</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Docked Comment input bar */}
                <div className="p-4 sm:p-5 border-t border-zinc-900 bg-[#131520] relative rounded-b-3xl sm:rounded-b-2xl">
                  
                  {/* Autocomplete suggestions popup overlay */}
                  {mentionSearch !== null && (() => {
                    const filteredSuggestions = autocompleteSuggestions.filter(s => 
                      s.username.toLowerCase().includes(mentionSearch.toLowerCase()) ||
                      s.name.toLowerCase().includes(mentionSearch.toLowerCase())
                    );
                    if (filteredSuggestions.length === 0) return null;
                    return (
                      <div className="absolute left-4 right-4 bottom-22 z-50 bg-[#131520] border border-zinc-800 rounded-2xl p-2.5 shadow-2xl max-h-48 overflow-y-auto no-scrollbar space-y-1">
                        <div className="px-2 py-1 text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest select-none">
                          Mention Classmate
                        </div>
                        {filteredSuggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            type="button"
                            onClick={() => handleSelectMention(suggestion)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs text-white hover:bg-[#1a1c29]/90 transition-all cursor-pointer"
                          >
                            <img
                              src={suggestion.avatar}
                              alt={suggestion.name}
                              className="w-7 h-7 rounded-full object-cover border border-zinc-800 shrink-0 select-none"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="font-bold text-zinc-100 italic block text-xs">@{suggestion.username}</span>
                              <span className="text-[10px] text-zinc-500 block -mt-0.5 truncate">{suggestion.name} • {suggestion.role}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    );
                  })()}

                  {/* Replying banner indicator */}
                  {replyingToComment && (
                    <div className="flex items-center justify-between pb-3.5 mb-2.5 border-b border-zinc-900 text-xs text-indigo-400 font-bold px-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        Replying to @{getProfileUsername(replyingToComment.authorId, replyingToComment.authorName)}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingToComment(null);
                          // Strip trailing mentions optionally
                        }}
                        className="text-zinc-500 hover:text-white transition cursor-pointer"
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  )}

                  {/* Input Tray Card */}
                  <div className="bg-[#1a1c29] border border-zinc-850 rounded-full px-4.5 py-2.5 flex items-center gap-3 shadow-inner">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover border border-zinc-800 shrink-0 select-none"
                      referrerPolicy="no-referrer"
                    />
                    <input
                      type="text"
                      placeholder="Type your reply to this campus thread..."
                      className="flex-1 text-xs md:text-sm text-white bg-transparent outline-none placeholder-zinc-500 font-medium py-1"
                      value={commentInputs[liveCommentPost.id] || ''}
                      onChange={(e) => handleCommentTextChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddComment(liveCommentPost.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleAddComment(liveCommentPost.id)}
                      className="text-blue-500 hover:text-blue-400 p-2 rounded-full hover:bg-zinc-800/30 transition shadow-sm cursor-pointer shrink-0"
                    >
                      <Send className="w-3.5 h-3.5 text-blue-500 fill-blue-500 shrink-0" />
                    </button>
                  </div>
                  
                  {/* Subtle Footer watermark text */}
                  <div className="flex items-center justify-between mt-3 px-1 text-[10px] text-zinc-500 font-medium">
                    <span>Verified campus stream</span>
                    <span>Press Enter to comment</span>
                  </div>

                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Campus Sidebar (1 col) */}
      <div className="space-y-6">
        {/* Student Spotlight rotating widget */}
        <div id="student-spotlight-card" className="bg-white rounded-none sm:rounded-2xl p-5 border-y sm:border border-x-0 sm:border-zinc-200 border-zinc-150 shadow-sm space-y-4 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 uppercase tracking-widest">
              <Award className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Student Spotlight</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSpotlightIndex((prev) => (prev - 1 + 4) % 4)}
                className="p-1 hover:bg-zinc-100 rounded text-zinc-500 hover:text-zinc-950 transition cursor-pointer"
                title="Previous Spotlight"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold text-zinc-400">
                {spotlightIndex + 1}/4
              </span>
              <button
                onClick={() => setSpotlightIndex((prev) => (prev + 1) % 4)}
                className="p-1 hover:bg-zinc-100 rounded text-zinc-500 hover:text-zinc-950 transition cursor-pointer"
                title="Next Spotlight"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Body */}
          {(() => {
            const currentSpot = SPOTLIGHT_ITEMS[spotlightIndex];
            return (
              <div className="space-y-3 animation-none">
                <div className="flex items-start gap-3">
                  <img
                    src={currentSpot.avatar}
                    alt={currentSpot.name}
                    className="w-11 h-11 rounded-xl object-cover shrink-0 border border-zinc-200 shadow-xs cursor-pointer hover:ring-2 hover:ring-indigo-500/30 transition-all animate-none"
                    onClick={() => onViewProfile && onViewProfile(currentSpot.targetId)}
                    title="Click to view student profile"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                        {currentSpot.type}
                      </span>
                    </div>
                    <h4
                      onClick={() => onViewProfile && onViewProfile(currentSpot.targetId)}
                      className="font-extrabold text-xs text-zinc-950 hover:text-indigo-650 transition cursor-pointer truncate mt-1"
                      title="Click to view student profile"
                    >
                      {currentSpot.name}
                    </h4>
                    <span className="text-[9px] text-zinc-400 font-mono block -mt-0.5">
                      {currentSpot.award}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 font-medium leading-relaxed bg-zinc-55/40 p-3 rounded-xl border border-zinc-150 italic">
                  "{currentSpot.bio}"
                </p>

                {/* Nomination info & platform score metrics */}
                <div className="bg-amber-50/30 border border-amber-100/50 p-2.5 rounded-xl flex items-center justify-between text-[10px] text-amber-800 font-medium select-none">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                    <span>{currentSpot.activityLabel}</span>
                  </div>
                  <span className="bg-amber-100/70 text-amber-900 font-bold px-1.5 py-0.5 rounded font-mono">
                    ✦ {currentSpot.nominationCount} Nominees
                  </span>
                </div>

                <button
                  onClick={() => onViewProfile && onViewProfile(currentSpot.targetId)}
                  className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-900 text-[10.5px] font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm border border-indigo-100/50"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Highlight & View Student Profile</span>
                </button>
              </div>
            );
          })()}
        </div>

        {/* Campus Near Me Local Radar & Location Feed */}
        <div id="campus-near-me-radar" className="bg-white rounded-none sm:rounded-2xl p-5 border-y sm:border border-x-0 sm:border-zinc-200 border-zinc-150 shadow-sm space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between pb-2 border-b border-zinc-100">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 uppercase tracking-widest">
                <Compass className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Campus Near Me</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium mt-0.5">Explore nearby events & communities</p>
            </div>

            <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
              <button
                onClick={() => setActiveRadarTab('radar')}
                className={`py-1 px-2.5 text-[9px] font-bold rounded-md transition cursor-pointer ${
                  activeRadarTab === 'radar'
                    ? 'bg-white shadow-xs text-indigo-700 font-black'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                🗺️ Radar
              </button>
              <button
                onClick={() => setActiveRadarTab('list')}
                className={`py-1 px-2.5 text-[9px] font-bold rounded-md transition cursor-pointer ${
                  activeRadarTab === 'list'
                    ? 'bg-white shadow-xs text-indigo-700 font-black'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                📋 List
              </button>
            </div>
          </div>

          {/* Location details card / Geolocation Status Trigger */}
          {locPermission === 'prompt' && (
            <div className="bg-indigo-50/20 p-4 rounded-xl border border-indigo-105 text-center space-y-3">
              <div className="relative w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
                <MapPin className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h5 className="text-xs font-extrabold text-zinc-900">Locate Nearest Student Hubs</h5>
                <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                  UniUyo Connect tracks your distance relative to campus computer labs, law clinics, photowalk clusters, and logistics offices to show upcoming events.
                </p>
              </div>
              <button
                onClick={requestLocation}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-wider py-2 rounded-lg transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Grant GPS Authorization</span>
              </button>
            </div>
          )}

          {locPermission === 'loading' && (
            <div className="text-center py-6 space-y-2">
              <RotateCw className="w-5 h-5 text-indigo-650 animate-spin mx-auto" />
              <p className="text-[10px] text-zinc-400 font-mono">Calibrating student coordinates...</p>
            </div>
          )}

          {/* Active Geolocation views */}
          {(locPermission === 'granted' || locPermission === 'denied') && (() => {
            const realUyoLat = 5.0415;
            const realUyoLng = 7.9780;
            
            let currentLat = realUyoLat;
            let currentLng = realUyoLng;
            let usingVirtualSimulator = true;
            
            if (locPermission === 'granted' && userCoords) {
              const physicalDist = getHaversineDistance(userCoords.latitude, userCoords.longitude, realUyoLat, realUyoLng);
              // If within 15km of Uyo, prioritize their real physical browser coords
              if (physicalDist < 15000) {
                currentLat = userCoords.latitude;
                currentLng = userCoords.longitude;
                usingVirtualSimulator = false;
              }
            }

            if (usingVirtualSimulator) {
              if (simulatedHub === 'perm_site') {
                currentLat = 5.0422;
                currentLng = 7.9772;
              } else {
                currentLat = 5.0295;
                currentLng = 7.9265;
              }
            }

            // Map distances to landmarks
            const processedPlaces = LANDMARKS.map((landmark) => {
              const distanceInMeters = getHaversineDistance(currentLat, currentLng, landmark.latitude, landmark.longitude);
              
              let activeEntityName = '';
              let activeEntityType: 'Event' | 'Community' | 'Opportunity' | 'Scholarship' = 'Event';
              let relativePriority: 'Soon' | 'High Demand' | 'Active' = 'Active';
              let badgeText = '';

              if (landmark.id === 'cs_lab') {
                activeEntityName = 'NACOS Campus Hackathon 2026';
                activeEntityType = 'Event';
                relativePriority = 'High Demand';
                badgeText = '🔥 High Demand • 100 Seats';
              } else if (landmark.id === 'moot_court') {
                activeEntityName = 'Student Legal Clinic Advisory';
                activeEntityType = 'Event';
                relativePriority = 'Soon';
                badgeText = '⏰ June 12 • Free Entry';
              } else if (landmark.id === 'main_gate') {
                activeEntityName = 'Golden Hour Photography Walk';
                activeEntityType = 'Event';
                relativePriority = 'Soon';
                badgeText = '📸 June 15 • 25 RSVPs';
              } else if (landmark.id === 'tusk_hub') {
                activeEntityName = 'Mobile Developer Internship (Tusk)';
                activeEntityType = 'Opportunity';
                relativePriority = 'High Demand';
                badgeText = '💼 Paid • Town Campus';
              } else if (landmark.id === 'science_park') {
                activeEntityName = 'Science Park Tech Scholarship';
                activeEntityType = 'Opportunity';
                relativePriority = 'High Demand';
                badgeText = '🎓 Full Scholarship Cover';
              } else if (landmark.id === 'town_library') {
                activeEntityName = 'Creative Writer Ambassador';
                activeEntityType = 'Opportunity';
                relativePriority = 'Active';
                badgeText = '✍️ Resume Booster';
              }

              return {
                ...landmark,
                distance: distanceInMeters,
                activeEntityName,
                activeEntityType,
                relativePriority,
                badgeText
              };
            }).sort((a, b) => {
              const aPriorityScore = a.relativePriority === 'Soon' ? 3 : a.relativePriority === 'High Demand' ? 2 : 1;
              const bPriorityScore = b.relativePriority === 'Soon' ? 3 : b.relativePriority === 'High Demand' ? 2 : 1;
              
              if (aPriorityScore !== bPriorityScore) {
                return bPriorityScore - aPriorityScore;
              }
              return a.distance - b.distance;
            });

            const activePlace = processedPlaces.find(p => p.id === selectedPlaceId) || processedPlaces[0];

            return (
              <div className="space-y-4">
                {usingVirtualSimulator && (
                  <div className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-[9px] text-zinc-600 leading-relaxed font-mono flex items-start gap-2 select-none justify-between shadow-2xs">
                    <div className="flex-1">
                      <p className="font-extrabold text-indigo-700">🌍 Off-Campus Walk Mode</p>
                      <p className="text-zinc-500 mt-0.5">Mocking your Uyo coordinates for simulation testing.</p>
                    </div>
                    <button
                      onClick={() => setSimulatedHub(simulatedHub === 'perm_site' ? 'town_campus' : 'perm_site')}
                      className="shrink-0 text-[8px] bg-indigo-50 border border-indigo-200 font-black px-1.5 py-0.5 rounded text-indigo-650 hover:bg-indigo-650 hover:text-white transition cursor-pointer"
                    >
                      🔁 Hub: {simulatedHub === 'perm_site' ? 'Perm Site' : 'Town'}
                    </button>
                  </div>
                )}

                {/* Geolocation Content Tab 1: Map Radar Sweeper */}
                {activeRadarTab === 'radar' ? (
                  <div className="space-y-3">
                    <div className="relative aspect-square w-full max-w-[190px] mx-auto bg-zinc-950 rounded-full border-2 border-zinc-800 shadow-inner overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.08)_0%,transparent_75%)] animate-pulse" />
                      <div className="absolute w-[35%] h-[35%] border border-zinc-900 border-dashed rounded-full" />
                      <div className="absolute w-[68%] h-[68%] border border-zinc-90 w-fit rounded-full border-zinc-900" />
                      <div className="absolute w-[95%] h-[95%] border border-zinc-900 rounded-full" />
                      
                      <span className="absolute top-1 text-[8px] font-mono font-bold text-zinc-700">N</span>
                      <span className="absolute bottom-1 text-[8px] font-mono font-bold text-zinc-700">S</span>
                      <span className="absolute left-1 text-[8px] font-mono font-bold text-zinc-700">W</span>
                      <span className="absolute right-1 text-[8px] font-mono font-bold text-zinc-700">E</span>

                      {/* Moving radar sweep */}
                      <div className="absolute inset-0 origin-center bg-linear-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/15 rounded-full pointer-events-none" style={{ animation: 'spin 5s linear infinite' }} />

                      {/* Center Point */}
                      <div className="absolute z-10 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white shadow-md animate-ping" />
                      <div className="absolute z-10 w-2 h-2 bg-indigo-600 rounded-full border border-white" />

                      {/* Points plotted */}
                      {processedPlaces.map((pl) => {
                        const latDelta = pl.latitude - currentLat;
                        const lngDelta = pl.longitude - currentLng;
                        
                        const x = Math.min(175, Math.max(15, 95 + lngDelta * 8200));
                        const y = Math.min(175, Math.max(15, 95 - latDelta * 8200));

                        const isHighlighted = pl.id === selectedPlaceId;

                        return (
                          <button
                            key={pl.id}
                            onClick={() => setSelectedPlaceId(pl.id)}
                            style={{ left: `${(x / 190) * 100}%`, top: `${(y / 190) * 100}%` }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer"
                          >
                            <div className={`w-3 h-3 rounded-full flex items-center justify-center transition-all ${
                              isHighlighted
                                ? 'bg-amber-500 border border-white ring-4 ring-amber-500/35 scale-125'
                                : pl.relativePriority === 'Soon'
                                ? 'bg-red-500 border border-white ring-2 ring-red-500/20 hover:scale-110'
                                : pl.relativePriority === 'High Demand'
                                ? 'bg-emerald-500 border border-white ring-2 ring-emerald-500/20 hover:scale-110'
                                : 'bg-zinc-500 border border-white ring-2 ring-zinc-500/20 hover:scale-110'
                            }`} />
                          </button>
                        );
                      })}
                    </div>

                    {/* place details reader */}
                    <div className="bg-zinc-950 text-white rounded-xl p-3.5 border border-zinc-800 space-y-2 font-mono">
                      <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-zinc-850">
                        <span className="text-[10px] font-bold uppercase text-amber-400">
                          🎯 GPS RADAR SPOT
                        </span>
                        <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-300 py-0.5 px-2 rounded font-extrabold select-none">
                          {activePlace.distance < 1000 ? `${activePlace.distance.toFixed(0)}m` : `${(activePlace.distance / 1000).toFixed(1)} km`} away
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-black text-white tracking-tight">{activePlace.name}</h4>
                        <p className="text-[9px] text-zinc-400 mt-0.5 leading-normal">{activePlace.desc}</p>
                      </div>

                      {activePlace.activeEntityName && (
                        <div className="bg-zinc-900 border border-zinc-850 p-2 rounded-lg space-y-1">
                          <span className="text-[8px] bg-indigo-900/50 text-indigo-300 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider block w-fit">
                            Tied {activePlace.activeEntityType}
                          </span>
                          <span className="text-[10px] text-white font-extrabold block tracking-tight leading-tight">
                            {activePlace.activeEntityName}
                          </span>
                          <span className="text-[9px] text-zinc-400 font-medium block">
                            {activePlace.badgeText}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Geolocation Content Tab 2: Geolocation Distance feed */
                  <div className="space-y-2 max-h-[290px] overflow-y-auto no-scrollbar">
                    {processedPlaces.map((place) => (
                      <div
                        key={place.id}
                        onClick={() => {
                          setSelectedPlaceId(place.id);
                          setActiveRadarTab('radar');
                        }}
                        className={`p-3 rounded-xl border transition-all text-left cursor-pointer flex justify-between gap-2.5 items-start ${
                          place.id === selectedPlaceId
                            ? 'bg-amber-50/10 border-amber-300 ring-1 ring-amber-500/20'
                            : place.relativePriority === 'Soon'
                            ? 'bg-red-50/10 border-red-100 hover:bg-neutral-50/50'
                            : place.relativePriority === 'High Demand'
                            ? 'bg-emerald-50/10 border-emerald-100 hover:bg-neutral-50/50'
                            : 'bg-zinc-50/50 border-zinc-150 hover:bg-zinc-50'
                        }`}
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className={`text-[8.5px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider ${
                              place.relativePriority === 'Soon'
                                ? 'bg-red-100 text-red-900'
                                : place.relativePriority === 'High Demand'
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-zinc-100 text-zinc-650'
                            }`}>
                              {place.relativePriority === 'Soon' ? '🔥 Happening Soon' : place.relativePriority === 'High Demand' ? '⚡ High demand' : '📍 Active Site'}
                            </span>
                          </div>
                          <h5 className="font-extrabold text-xs text-zinc-950 truncate leading-tight mt-1">
                            {place.name}
                          </h5>
                          <p className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">
                            {place.activeEntityName}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10.5px] font-mono font-black text-indigo-650 block">
                            {place.distance < 1000 ? `${place.distance.toFixed(0)}m` : `${(place.distance / 1000).toFixed(1)}km`}
                          </span>
                          <span className="text-[8px] text-zinc-400 font-mono block mt-0.5">distance</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Hot Topics list */}
        <div className="bg-white rounded-none sm:rounded-2xl p-5 border-y sm:border border-x-0 border-zinc-150 sm:border-zinc-200 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 uppercase tracking-widest pb-2 border-b border-zinc-100">
            <Megaphone className="w-4 h-4 text-orange-500 shrink-0" />
            <span>Campus Micro-Trends</span>
          </div>

          <div className="space-y-3 pt-1 text-xs text-zinc-600">
            <div className="hover:bg-zinc-50 p-1.5 rounded-lg transition">
              <span className="text-indigo-600 font-bold">#NACOS-Hackathon2026</span>
              <span className="block text-[10px] text-zinc-400">Computer Science is buzzing. Teams recruiting now.</span>
            </div>
            <div className="hover:bg-zinc-50 p-1.5 rounded-lg transition">
              <span className="text-indigo-600 font-bold">#TuskLogistics</span>
              <span className="block text-[10px] text-zinc-400">Student deliveries laundry starting Uyo Perm Site.</span>
            </div>
            <div className="hover:bg-zinc-50 p-1.5 rounded-lg transition">
              <span className="text-indigo-600 font-bold font-mono">#GoldenHourLaw</span>
              <span className="block text-[10px] text-zinc-400">Photos walks and Moot court advice circles.</span>
            </div>
            <div className="hover:bg-zinc-50 p-1.5 rounded-lg transition">
              <span className="text-indigo-600 font-bold">#ExamReadyUniuyo</span>
              <span className="block text-[10px] text-zinc-400 font-medium">Librarian confirms midnight hours extended.</span>
            </div>
          </div>
        </div>

        {/* PWA Badge installer card */}
        <div className="bg-zinc-50 rounded-none sm:rounded-2xl p-5 border-y sm:border border-x-0 border-zinc-150 sm:border-zinc-200 text-zinc-800 space-y-3">
          <span className="bg-zinc-250 text-zinc-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block">
            PWA Capabilities
          </span>
          <h4 className="font-extrabold text-sm tracking-tight text-zinc-900 uppercase font-mono text-xs">Install App</h4>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Get offline access, responsive push notifications, and a standalone app environment on campus.
          </p>

          <div className="space-y-1.5 text-[10px] text-zinc-500 bg-white p-2.5 rounded-xl border border-zinc-150 font-mono">
            <p><strong>iOS:</strong> Share → "Add to Home Screen"</p>
            <p><strong>Android:</strong> Click banner button "Install Applet"</p>
            <p><strong>Desktop:</strong> Check URL bar for icon symbol ⊕</p>
          </div>
        </div>
      </div>
    </div>
  );
}
