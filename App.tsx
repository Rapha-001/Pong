/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentProfile, Post, Community, Opportunity, Event, Project, AppNotification, Message, Chat } from './types';
import {
  MOCK_PROFILES,
  MOCK_POSTS,
  MOCK_COMMUNITIES,
  MOCK_OPPORTUNITIES,
  MOCK_EVENTS,
  MOCK_PROJECTS
} from './mockData';

// Subcomponents
import OfflineIndicator from './components/OfflineIndicator';
import IdentitySection from './components/IdentitySection';
import FeedSection from './components/FeedSection';
import CommunitiesSection from './components/CommunitiesSection';
import DiscoverySection from './components/DiscoverySection';
import OpportunitiesSection from './components/OpportunitiesSection';
import EventsSection from './components/EventsSection';
import ProjectsSection from './components/ProjectsSection';
import CreatePostSection from './components/CreatePostSection';
import ProfileViewModal from './components/ProfileViewModal';
import GamificationHub from './components/GamificationHub';
import MessagesSection from './components/MessagesSection';
import { NotificationsSection } from './components/NotificationsSection';
import SettingsSection from './components/SettingsSection';

// Constant pre-seeded conversations to make the experience feel immediate and highly functional
const DEFAULT_CHATS: Chat[] = [
  {
    id: 'chat_seed_1',
    isGroup: false,
    memberIds: ['student_raphael', 'student_chidi'],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    lastMessage: "I'll upload the delivery requirements slide today.",
    lastMessageAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'chat_seed_2',
    isGroup: false,
    memberIds: ['student_raphael', 'student_emem'],
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    lastMessage: "Let's align on UI theme rules.",
    lastMessageAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: 'chat_seed_3',
    name: "CSC 411 - Group Work 🤖",
    isGroup: true,
    memberIds: ['student_raphael', 'student_emem', 'student_bassey'],
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=256',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    lastMessage: "Shall we meet tomorrow at the main campus lab?",
    lastMessageAt: new Date(Date.now() - 0.5 * 3600000).toISOString()
  }
];

const DEFAULT_MESSAGES: Message[] = [
  // Chat 1 messages: Raphael & Chidi
  {
    id: 'msg_seed_1_1',
    chatId: 'chat_seed_1',
    senderId: 'student_chidi',
    senderName: 'Chidi Nwachukwu',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    content: "Hey Raphael! We need to map out transport routes for the Tusk Laundry campus expansion. Could you help review the Figma draft?",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'msg_seed_1_2',
    chatId: 'chat_seed_1',
    senderId: 'student_raphael',
    senderName: 'Raphael Akpabio',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    content: "Sure Chidi! I can review it tonight. Are we focusing on Town Campus or permanent site routes?",
    createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString()
  },
  {
    id: 'msg_seed_1_3',
    chatId: 'chat_seed_1',
    senderId: 'student_chidi',
    senderName: 'Chidi Nwachukwu',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    content: "Both, but let's start with Town Campus. I'll upload the delivery requirements slide today.",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },

  // Chat 2 messages: Raphael & Emem
  {
    id: 'msg_seed_2_1',
    chatId: 'chat_seed_2',
    senderId: 'student_emem',
    senderName: 'Emem Obong',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    content: "Hey team Lead! Did you examine our forum post for the upcoming NACOS Hackathon?",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'msg_seed_2_2',
    chatId: 'chat_seed_2',
    senderId: 'student_raphael',
    senderName: 'Raphael Akpabio',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    content: "Yes, looks solid Emem! Let's align on UI theme rules.",
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },

  // Chat 3 messages: CSC Group
  {
    id: 'msg_seed_3_1',
    chatId: 'chat_seed_3',
    senderId: 'student_bassey',
    senderName: 'Bassey Edet',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    content: "Hey study group, we should get started on the machine learning project specifications.",
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString()
  },
  {
    id: 'msg_seed_3_2',
    chatId: 'chat_seed_3',
    senderId: 'student_emem',
    senderName: 'Emem Obong',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    content: "Agreed Bassey. Do you have a preference for the algorithm structure?",
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: 'msg_seed_3_3',
    chatId: 'chat_seed_3',
    senderId: 'student_raphael',
    senderName: 'Raphael Akpabio',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    content: "Shall we meet tomorrow at the main campus lab?",
    createdAt: new Date(Date.now() - 3600000 * 0.5).toISOString()
  }
];

// Lucide Icons
import {
  Sparkles,
  Wifi,
  WifiOff,
  User,
  MessageSquare,
  Users,
  Compass,
  Briefcase,
  Calendar,
  Rocket,
  PlusCircle,
  Plus,
  TrendingUp,
  Download,
  CheckCircle,
  AlertTriangle,
  Menu,
  X,
  Sun,
  Moon,
  Trophy,
  Bell,
  BellRing,
  Handshake,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// In-memory fallback map for environments with blocked/disabled localStorage
const memoryStorage = new Map<string, string>();

// IndexedDB Storage Engine for large attachments (like videos/images) that exceed 5MB localStorage quotas
const DB_NAME = 'uniuyo_offline_db';
const STORE_NAME = 'keyval_store';

const getIDBConnection = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const idbStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const db = await getIDBConnection();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.warn('idbStorage.getItem failed:', e);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      const db = await getIDBConnection();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.put(value, key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.warn('idbStorage.setItem failed:', e);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      const db = await getIDBConnection();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.warn('idbStorage.removeItem failed:', e);
    }
  }
};

// Global safe storage interface wrapper to prevent Uncaught SecurityError in restricted secure iframes
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage !== null) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn(`Access to localStorage is denied/blocked for getItem(${key}):`, e);
    }
    return memoryStorage.get(key) || null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage !== null) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn(`Access to localStorage is denied/blocked for setItem(${key}):`, e);
    }
    memoryStorage.set(key, value);
    // Asynchronously update IndexedDB backend to support massive payloads (videos, documents)
    idbStorage.setItem(key, value);
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage !== null) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`Access to localStorage is denied/blocked for removeItem(${key}):`, e);
    }
    memoryStorage.delete(key);
    idbStorage.removeItem(key);
  }
};

// Global helper to safely parse JSON from localStorage with fallback
const getCachedOrFallback = <T,>(key: string, fallback: T): T => {
  try {
    const val = safeLocalStorage.getItem(key);
    if (!val || val === 'undefined' || val === 'null') {
      return fallback;
    }
    return JSON.parse(val);
  } catch (e) {
    console.warn(`Local storage parse failed for key: ${key}, resetting to default data`, e);
    try {
      safeLocalStorage.removeItem(key);
    } catch (_) {}
    return fallback;
  }
};

export default function App() {
  // Global States backed by LocalStorage for durable caching
  const [profiles, setProfiles] = useState<StudentProfile[]>(() => {
    const cached = getCachedOrFallback('uniuyo_profiles', MOCK_PROFILES);
    const arr = Array.isArray(cached) ? cached : MOCK_PROFILES;
    return arr.map(c => {
      if (!c) return MOCK_PROFILES[0];
      const fallback = MOCK_PROFILES.find(p => p && p.id === c.id) || MOCK_PROFILES[0];
      return { ...fallback, ...c };
    });
  });
  const [posts, setPosts] = useState<Post[]>(() => {
    const cached = getCachedOrFallback('uniuyo_posts', MOCK_POSTS);
    return Array.isArray(cached) ? cached : MOCK_POSTS;
  });
  const [communities, setCommunities] = useState<Community[]>(() => {
    const cached = getCachedOrFallback('uniuyo_communities', MOCK_COMMUNITIES);
    return Array.isArray(cached) ? cached : MOCK_COMMUNITIES;
  });
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const cached = getCachedOrFallback('uniuyo_opportunities', MOCK_OPPORTUNITIES);
    return Array.isArray(cached) ? cached : MOCK_OPPORTUNITIES;
  });
  const [events, setEvents] = useState<Event[]>(() => {
    const cached = getCachedOrFallback('uniuyo_events', MOCK_EVENTS);
    return Array.isArray(cached) ? cached : MOCK_EVENTS;
  });
  const [projects, setProjects] = useState<Project[]>(() => {
    const cached = getCachedOrFallback('uniuyo_projects', MOCK_PROJECTS);
    return Array.isArray(cached) ? cached : MOCK_PROJECTS;
  });
  const [currentUser, setCurrentUser] = useState<StudentProfile>(() => {
    const cached = getCachedOrFallback('uniuyo_active_user', MOCK_PROFILES[0]);
    const safeCached = cached && typeof cached === 'object' ? cached : MOCK_PROFILES[0];
    const fallback = MOCK_PROFILES.find(p => p && p.id === safeCached.id) || MOCK_PROFILES[0];
    return { ...fallback, ...safeCached };
  });

  // Real-time Notification system interactive state backed by local storage
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const activeUserId = currentUser?.id || 'student_raphael';
    const defaultNotifs: AppNotification[] = [
      {
        id: 'notif_1',
        userId: activeUserId,
        type: 'post_interaction',
        title: 'New Interaction on Post',
        message: 'Emem Obong liked your announcement post about NACOS Hackathon 2026.',
        senderName: 'Emem Obong',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
        targetId: 'post_1',
        read: false,
        createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString() // 1.5 hours ago
      },
      {
        id: 'notif_2',
        userId: activeUserId,
        type: 'mentorship_request',
        title: 'Mentorship Request Received',
        message: 'Bassey Edet requests academic mentoring on "UX/UI layout aesthetics in high-fidelity prototypes".',
        senderName: 'Bassey Edet',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
        targetId: 'student_bassey',
        read: false,
        createdAt: new Date(Date.now() - 3600000 * 3.5).toISOString() // 3.5 hours ago
      },
      {
        id: 'notif_3',
        userId: activeUserId,
        type: 'event_rsvp',
        title: 'New Event RSVP Recieved',
        message: 'Chidi Nwachukwu RSVP\'d to your Moot Court representation rehearsal.',
        senderName: 'Chidi Nwachukwu',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
        targetId: 'event_1',
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString() // 12 hours ago
      }
    ];
    const cached = getCachedOrFallback('uniuyo_notifications', defaultNotifs);
    return Array.isArray(cached) ? cached.filter(Boolean) : defaultNotifs;
  });

  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState<boolean>(false);

  // Direct peer messages and study group conversations states
  const [chats, setChats] = useState<Chat[]>(() => {
    const cached = getCachedOrFallback('uniuyo_chats', DEFAULT_CHATS);
    return Array.isArray(cached) ? cached : DEFAULT_CHATS;
  });
  const [messages, setMessages] = useState<Message[]>(() => {
    const cached = getCachedOrFallback('uniuyo_messages', DEFAULT_MESSAGES);
    return Array.isArray(cached) ? cached : DEFAULT_MESSAGES;
  });

  // Profile view modal state
  const [viewingProfile, setViewingProfile] = useState<StudentProfile | null>(null);

  // Post target comments state requested from notification interaction
  const [targetPostIdForComments, setTargetPostIdForComments] = useState<string | null>(null);

  // Connectivity simulators
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<any[]>(() => getCachedOrFallback('uniuyo_offline_queue', []));

  // Navigation tab coordinates
  const [activeTab, setActiveTab ] = useState<'Feed' | 'Identity' | 'Forums' | 'Discovery' | 'Jobs' | 'Events' | 'Projects' | 'CreatePost' | 'Gamification' | 'Messages' | 'Notifications' | 'Settings'>('Feed');
  const [showMobileSidenav, setShowMobileSidenav] = useState<boolean>(false);

  // Layout display mode (Default is 'fullscreen' - fluid layout view as requested)
  const [displayMode, setDisplayMode] = useState<'standard' | 'fullscreen'>(() => {
    try {
      const saved = safeLocalStorage.getItem('uniuyo_settings_display_mode');
      return (saved as 'standard' | 'fullscreen') || 'fullscreen';
    } catch {
      return 'fullscreen';
    }
  });

  // Modern Theme Contextual State Controls
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (safeLocalStorage.getItem('uniuyo_theme') as 'light' | 'dark') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark', 'bg-zinc-950');
      body.classList.remove('bg-zinc-100', 'bg-white');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark', 'bg-zinc-950');
      body.classList.add('bg-zinc-100');
    }
  }, [theme]);

  // Load initial caching states from IndexedDB asynchronously on startup
  useEffect(() => {
    const loadFromIDB = async () => {
      try {
        const cachedPosts = await idbStorage.getItem('uniuyo_posts');
        if (cachedPosts) {
          const parsed = JSON.parse(cachedPosts);
          if (Array.isArray(parsed) && parsed.length > 0) setPosts(parsed);
        }

        const cachedProfiles = await idbStorage.getItem('uniuyo_profiles');
        if (cachedProfiles) {
          const parsed = JSON.parse(cachedProfiles);
          if (Array.isArray(parsed) && parsed.length > 0) setProfiles(parsed);
        }

        const cachedCommunities = await idbStorage.getItem('uniuyo_communities');
        if (cachedCommunities) {
          const parsed = JSON.parse(cachedCommunities);
          if (Array.isArray(parsed) && parsed.length > 0) setCommunities(parsed);
        }

        const cachedOpportunities = await idbStorage.getItem('uniuyo_opportunities');
        if (cachedOpportunities) {
          const parsed = JSON.parse(cachedOpportunities);
          if (Array.isArray(parsed) && parsed.length > 0) setOpportunities(parsed);
        }

        const cachedEvents = await idbStorage.getItem('uniuyo_events');
        if (cachedEvents) {
          const parsed = JSON.parse(cachedEvents);
          if (Array.isArray(parsed) && parsed.length > 0) setEvents(parsed);
        }

        const cachedProjects = await idbStorage.getItem('uniuyo_projects');
        if (cachedProjects) {
          const parsed = JSON.parse(cachedProjects);
          if (Array.isArray(parsed) && parsed.length > 0) setProjects(parsed);
        }

        const cachedNotifications = await idbStorage.getItem('uniuyo_notifications');
        if (cachedNotifications) {
          const parsed = JSON.parse(cachedNotifications);
          if (Array.isArray(parsed) && parsed.length > 0) setNotifications(parsed);
        }

        const cachedUser = await idbStorage.getItem('uniuyo_active_user');
        if (cachedUser) {
          const parsed = JSON.parse(cachedUser);
          if (parsed && parsed.id) setCurrentUser(parsed);
        }

        const cachedChats = await idbStorage.getItem('uniuyo_chats');
        if (cachedChats) {
          const parsed = JSON.parse(cachedChats);
          if (Array.isArray(parsed) && parsed.length > 0) setChats(parsed);
        }

        const cachedMessages = await idbStorage.getItem('uniuyo_messages');
        if (cachedMessages) {
          const parsed = JSON.parse(cachedMessages);
          if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
        }

        const cachedQueue = await idbStorage.getItem('uniuyo_offline_queue');
        if (cachedQueue) {
          const parsed = JSON.parse(cachedQueue);
          if (Array.isArray(parsed) && parsed.length > 0) setOfflineQueue(parsed);
        }
      } catch (err) {
        console.warn('Error reloading records from IndexedDB backdrop:', err);
      }
    };
    loadFromIDB();
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    safeLocalStorage.setItem('uniuyo_theme', nextTheme);
    showToast(`Switched to ${nextTheme === 'light' ? 'Light Day' : 'Midnight Dark'} visual layout!`, 'success');
  };

  // Custom visual toast alerts
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'warn' } | null>(null);

  // App Installation Promotion state
  const [showInstallerModal, setShowInstallerModal] = useState<boolean>(false);

  // Save updates to localStorage on change
  useEffect(() => {
    // Keep initial items synced in local storage
    if (!safeLocalStorage.getItem('uniuyo_profiles')) safeLocalStorage.setItem('uniuyo_profiles', JSON.stringify(profiles));
    if (!safeLocalStorage.getItem('uniuyo_posts')) safeLocalStorage.setItem('uniuyo_posts', JSON.stringify(posts));
    if (!safeLocalStorage.getItem('uniuyo_communities')) safeLocalStorage.setItem('uniuyo_communities', JSON.stringify(communities));
    if (!safeLocalStorage.getItem('uniuyo_opportunities')) safeLocalStorage.setItem('uniuyo_opportunities', JSON.stringify(opportunities));
    if (!safeLocalStorage.getItem('uniuyo_events')) safeLocalStorage.setItem('uniuyo_events', JSON.stringify(events));
    if (!safeLocalStorage.getItem('uniuyo_projects')) safeLocalStorage.setItem('uniuyo_projects', JSON.stringify(projects));
    if (!safeLocalStorage.getItem('uniuyo_notifications')) safeLocalStorage.setItem('uniuyo_notifications', JSON.stringify(notifications));
    if (!safeLocalStorage.getItem('uniuyo_active_user')) safeLocalStorage.setItem('uniuyo_active_user', JSON.stringify(currentUser));
    if (!safeLocalStorage.getItem('uniuyo_chats')) safeLocalStorage.setItem('uniuyo_chats', JSON.stringify(chats));
    if (!safeLocalStorage.getItem('uniuyo_messages')) safeLocalStorage.setItem('uniuyo_messages', JSON.stringify(messages));
  }, []);

  // Save updates to localStorage on change
  const saveChats = (newChats: Chat[]) => {
    setChats(newChats);
    safeLocalStorage.setItem('uniuyo_chats', JSON.stringify(newChats));
  };

  const saveMessages = (newMsgs: Message[]) => {
    setMessages(newMsgs);
    safeLocalStorage.setItem('uniuyo_messages', JSON.stringify(newMsgs));
  };

  const handleAddChat = (c: Chat) => {
    saveChats([c, ...chats]);
  };

  const handleAddMessage = (m: Message) => {
    saveMessages([...messages, m]);
    const updatedChats = chats.map(chat => chat.id === m.chatId ? {
      ...chat,
      lastMessage: m.content,
      lastMessageAt: m.createdAt
    } : chat);
    saveChats(updatedChats);
  };

  const handleToggleMessageReaction = (messageId: string, emoji: string) => {
    const updated = messages.map(m => {
      if (m.id !== messageId) return m;

      const currentReactions = m.reactions || {};
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

      return {
        ...m,
        reactions: nextReactions
      };
    });

    saveMessages(updated);

    // Prompt intelligent real notification to sender
    const targetMsg = messages.find(m => m.id === messageId);
    if (targetMsg && targetMsg.senderId !== currentUser.id) {
      handleAddNotification({
        userId: targetMsg.senderId,
        type: 'post_interaction',
        title: 'New Message Reaction! ❤️',
        message: `${currentUser.name} reacted with ${emoji} directly to your message: "${targetMsg.content.substring(0, 30)}${targetMsg.content.length > 30 ? '...' : ''}"`,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        targetId: targetMsg.chatId
      });
    }
  };

  // Save updates to localStorage on change
  const saveProfiles = (newProfiles: StudentProfile[]) => {
    setProfiles(newProfiles);
    safeLocalStorage.setItem('uniuyo_profiles', JSON.stringify(newProfiles));
  };

  const savePosts = (newPosts: Post[]) => {
    setPosts(newPosts);
    safeLocalStorage.setItem('uniuyo_posts', JSON.stringify(newPosts));
  };

  const saveCommunities = (newComms: Community[]) => {
    setCommunities(newComms);
    safeLocalStorage.setItem('uniuyo_communities', JSON.stringify(newComms));
  };

  const saveOpportunities = (newOpps: Opportunity[]) => {
    setOpportunities(newOpps);
    safeLocalStorage.setItem('uniuyo_opportunities', JSON.stringify(newOpps));
  };

  const saveEvents = (newEvents: Event[]) => {
    setEvents(newEvents);
    safeLocalStorage.setItem('uniuyo_events', JSON.stringify(newEvents));
  };

  const saveProjects = (newProjs: Project[]) => {
    setProjects(newProjs);
    safeLocalStorage.setItem('uniuyo_projects', JSON.stringify(newProjs));
  };

  const saveNotifications = (newNotifs: AppNotification[]) => {
    setNotifications(newNotifs);
    safeLocalStorage.setItem('uniuyo_notifications', JSON.stringify(newNotifs));
  };

  const handleAddNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    saveNotifications([newNotif, ...notifications]);
    showToast(`🛎️ ${notif.title}: ${notif.message}`, 'success');
  };

  const handleNotificationClick = (notif: AppNotification) => {
    // 1. Mark notification as read
    const updated = notifications.map(n => n.id === notif.id ? { ...n, read: true } : n);
    saveNotifications(updated);

    // 2. Redirect/Execute action based on type and targetId
    if (notif.type === 'post_interaction' || notif.type === 'post_comment') {
      setActiveTab('Feed');
      if (notif.targetId) {
        setTargetPostIdForComments(notif.targetId);
      }
    } else if (notif.type === 'event_rsvp' || notif.type === 'upcoming_event') {
      setActiveTab('Events');
    } else if (notif.type === 'mentorship_request') {
      const matched = profiles.find(p => p.id === notif.targetId || p.name === notif.senderName);
      if (matched) {
        setViewingProfile(matched);
      }
    } else if (notif.type === 'direct_message') {
      setActiveTab('Messages');
    } else if (notif.type === 'community_post') {
      setActiveTab('Forums');
    } else if (notif.type === 'opportunity_match') {
      setActiveTab('Jobs');
    } else {
      // Default fallback
      setActiveTab('Feed');
    }
    
    showToast(`Navigated to active notification update! 🚀`, 'success');
  };


  const saveActiveUser = (user: StudentProfile) => {
    setCurrentUser(user);
    safeLocalStorage.setItem('uniuyo_active_user', JSON.stringify(user));
    
    // Also sync updates inside profiles directory array
    const updatedProfiles = profiles.map(p => p.id === user.id ? user : p);
    saveProfiles(updatedProfiles);
  };

  const handleViewProfileByUserId = (userId: string) => {
    const matchedProfile = profiles.find(p => p.id === userId);
    if (matchedProfile) {
      setViewingProfile(matchedProfile);
    } else {
      // Find matching user from post if possible or use fallback
      let matchedName = "UniUyo Scholar";
      let matchedAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256";
      let matchedRole: any = "Student";

      // Try finding the author in posts
      const foundPost = posts.find(p => p.authorId === userId);
      if (foundPost) {
        matchedName = foundPost.authorName;
        matchedAvatar = foundPost.authorAvatar;
        matchedRole = foundPost.authorRole;
      }

      const fallback: StudentProfile = {
        id: userId,
        name: matchedName,
        email: `${userId.replace('student_', '')}@uniuyo.edu.ng`,
        avatar: matchedAvatar,
        role: matchedRole,
        faculty: 'Science',
        department: 'Computer Science',
        level: '300L',
        bio: 'Enthusiastic University of Uyo scholar participating in peer connections and campus projects.',
        interests: ['Social Connections', 'Academic Discussions', 'Creative Design'],
        skills: ['Team Player'],
        projectsCount: 0,
        socials: {}
      };
      setViewingProfile(fallback);
    }
  };

  const saveQueue = (queue: any[]) => {
    setOfflineQueue(queue);
    safeLocalStorage.setItem('uniuyo_offline_queue', JSON.stringify(queue));
  };

  // Toast orchestrator
  const showToast = (msg: string, type: 'success' | 'warn') => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync Offline Queue Actions
  const syncQueue = () => {
    if (offlineQueue.length === 0) return;
    
    // Distribute offline compiled requests back to respective caches
    let tempPosts = [...posts];
    let tempOpps = [...opportunities];
    let tempEvents = [...events];
    let tempProjs = [...projects];

    offlineQueue.forEach((oper) => {
      if (oper.type === 'NEW_POST') {
        tempPosts = [oper.data, ...tempPosts];
      } else if (oper.type === 'NEW_OPP') {
        tempOpps = [oper.data, ...tempOpps];
      } else if (oper.type === 'NEW_EVENT') {
        tempEvents = [oper.data, ...tempEvents];
      } else if (oper.type === 'NEW_PROJECT') {
        tempProjs = [oper.data, ...tempProjs];
      }
    });

    savePosts(tempPosts);
    saveOpportunities(tempOpps);
    saveEvents(tempEvents);
    saveProjects(tempProjs);
    saveQueue([]);

    showToast(`Successfully synchronized ${offlineQueue.length} offline operations to cloud networks!`, 'success');
  };

  // State mutation wrappers respecting offline-queue
  const handleAddPost = (p: Post) => {
    if (offlineMode) {
      saveQueue([...offlineQueue, { type: 'NEW_POST', data: p }]);
    } else {
      savePosts([p, ...posts]);
    }

    // Direct community post notifier:
    // When a post is created, broadcast a notification to all members of communities the user belongs to
    const userJoinedCommunities = communities.filter(c => c.members.includes(currentUser.id));
    userJoinedCommunities.forEach(comm => {
      comm.members.forEach(memberId => {
        if (memberId !== currentUser.id) {
          handleAddNotification({
            userId: memberId,
            type: 'community_post',
            title: `New Post in ${comm.name} 👥`,
            message: `${currentUser.name} shared a thought: "${p.content.substring(0, 45)}${p.content.length > 45 ? '...' : ''}"`,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            targetId: p.id
          });
        }
      });
    });

    // Award contribution points
    if (currentUser) {
      const currentPoints = currentUser.points || 0;
      const currentBadges = currentUser.badges || [];
      const hasBadge = currentBadges.includes("Forum Contributor");
      const nextBadges = hasBadge ? currentBadges : [...currentBadges, "Forum Contributor"];
      
      saveActiveUser({
        ...currentUser,
        points: currentPoints + 15,
        badges: nextBadges
      });
      showToast("Awarded +15 Points for contribution! Badge unlocked: Forum Contributor 📝", "success");
    }
  };

  const handleUpdatePost = (p: Post) => {
    const updated = posts.map(item => item.id === p.id ? p : item);
    savePosts(updated);
  };

  const handleDeletePost = (postId: string) => {
    const remaining = posts.filter(item => item.id !== postId);
    savePosts(remaining);
  };

  const handleUpdateCommunity = (c: Community) => {
    const originalCommunity = communities.find(item => item.id === c.id);
    const updated = communities.map(item => item.id === c.id ? c : item);
    saveCommunities(updated);

    if (originalCommunity && currentUser) {
      const originalIsMember = originalCommunity.members.includes(currentUser.id);
      const nowIsMember = c.members.includes(currentUser.id);

      if (!originalIsMember && nowIsMember) {
        const currentPoints = currentUser.points || 0;
        const currentBadges = currentUser.badges || [];
        const hasBadge = currentBadges.includes("Community Pioneer");
        const nextBadges = hasBadge ? currentBadges : [...currentBadges, "Community Pioneer"];

        saveActiveUser({
          ...currentUser,
          points: currentPoints + 10,
          badges: nextBadges
        });
        showToast("Awarded +10 Points for joining a fellowship! Badge unlocked: Community Pioneer 🤝", "success");
      } else if (originalIsMember && !nowIsMember) {
        const currentPoints = currentUser.points || 0;
        saveActiveUser({
          ...currentUser,
          points: Math.max(0, currentPoints - 10)
        });
      }
    }
  };

  const handleCreateCommunity = (c: Community) => {
    saveCommunities([...communities, c]);
    
    if (currentUser) {
      const currentPoints = currentUser.points || 0;
      const currentBadges = currentUser.badges || [];
      const hasBadge = currentBadges.includes("Forum Founder");
      const nextBadges = hasBadge ? currentBadges : [...currentBadges, "Forum Founder"];
      
      saveActiveUser({
        ...currentUser,
        points: currentPoints + 25,
        badges: nextBadges
      });
      showToast("Awarded +25 Points for starting a forum! Badge unlocked: Forum Founder 🏆", "success");
    }
  };

  const handleAddOpportunity = (o: Opportunity) => {
    if (offlineMode) {
      saveQueue([...offlineQueue, { type: 'NEW_OPP', data: o }]);
    } else {
      saveOpportunities([o, ...opportunities]);
    }

    // Opportunity matching scanner: Checks against all StudentProfiles (including mock profiles)
    profiles.forEach(prof => {
      // Find if any student interest shares a keyword with title, description, requirements or types
      const matchedInterest = prof.interests.find(interest =>
        o.title.toLowerCase().includes(interest.toLowerCase()) ||
        o.description.toLowerCase().includes(interest.toLowerCase()) ||
        o.type.toLowerCase().includes(interest.toLowerCase()) ||
        (o.requirements && o.requirements.some(req => req.toLowerCase().includes(interest.toLowerCase())))
      );

      if (matchedInterest) {
        handleAddNotification({
          userId: prof.id,
          type: 'opportunity_match',
          title: 'Matching Opportunity Open! 💼',
          message: `A new ${o.type} matches your interest in "${matchedInterest}": check out "${o.title}" with ${o.company}!`,
          senderName: o.company,
          senderAvatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=256',
          targetId: o.id
        });
      }
    });
  };

  const handleUpdateOpportunity = (o: Opportunity) => {
    const updated = opportunities.map(item => item.id === o.id ? o : item);
    saveOpportunities(updated);
  };

  const handleAddEvent = (evt: Event) => {
    if (offlineMode) {
      saveQueue([...offlineQueue, { type: 'NEW_EVENT', data: evt }]);
    } else {
      saveEvents([evt, ...events]);
    }
  };

  const handleUpdateEvent = (evt: Event) => {
    const originalEvent = events.find(item => item.id === evt.id);
    const updated = events.map(item => item.id === evt.id ? evt : item);
    saveEvents(updated);

    if (originalEvent && currentUser) {
      const originalAttending = originalEvent.rsvps.includes(currentUser.id);
      const nowAttending = evt.rsvps.includes(currentUser.id);
      
      if (!originalAttending && nowAttending) {
        const currentPoints = currentUser.points || 0;
        const currentBadges = currentUser.badges || [];
        const hasBadge = currentBadges.includes("Event Goer");
        const nextBadges = hasBadge ? currentBadges : [...currentBadges, "Event Goer"];
        
        saveActiveUser({
          ...currentUser,
          points: currentPoints + 10,
          badges: nextBadges
        });
        showToast("Awarded +10 Points for RSVPing to campus events! Badge unlocked: Event Goer 🎟️", "success");
        // Trigger real-time notifications on local state
        handleAddNotification({
          userId: currentUser.id,
          type: 'event_rsvp',
          title: 'Event Ticket Secured',
          message: `You successfully booked a registration seat at "${evt.title}". Event badge unlocked!`,
          senderName: 'UniUyo Events Board',
          senderAvatar: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=256',
          targetId: evt.id
        });
      } else if (originalAttending && !nowAttending) {
        const currentPoints = currentUser.points || 0;
        saveActiveUser({
          ...currentUser,
          points: Math.max(0, currentPoints - 10)
        });
      }
    }
  };

  const handleAddProject = (proj: Project) => {
    if (offlineMode) {
      saveQueue([...offlineQueue, { type: 'NEW_PROJECT', data: proj }]);
    } else {
      saveProjects([proj, ...projects]);
    }

    if (currentUser) {
      const currentPoints = currentUser.points || 0;
      const currentBadges = currentUser.badges || [];
      const hasBadge = currentBadges.includes("MVP Founder");
      const nextBadges = hasBadge ? currentBadges : [...currentBadges, "MVP Founder"];
      
      saveActiveUser({
        ...currentUser,
        projectsCount: currentUser.projectsCount + 1,
        points: currentPoints + 25,
        badges: nextBadges
      });
      showToast("Awarded +25 Points for starting a project MVP! Badge unlocked: MVP Founder 🚀", "success");
    }
  };

  const handleUpdateProject = (proj: Project) => {
    const updated = projects.map(item => item.id === proj.id ? proj : item);
    saveProjects(updated);
  };

  const handleDeleteCommunity = (commId: string) => {
    const remaining = communities.filter(item => item.id !== commId);
    saveCommunities(remaining);
    showToast("Community forum deleted successfully.", "success");
  };

  const handleDeleteOpportunity = (oppId: string) => {
    const remaining = opportunities.filter(item => item.id !== oppId);
    saveOpportunities(remaining);
    showToast("Opportunity listing deleted successfully.", "success");
  };

  const handleDeleteEvent = (eventId: string) => {
    const remaining = events.filter(item => item.id !== eventId);
    saveEvents(remaining);
    showToast("Campus event listing deleted.", "success");
  };

  const handleDeleteProject = (projId: string) => {
    const remaining = projects.filter(item => item.id !== projId);
    saveProjects(remaining);
    showToast("Project portfolio deleted successfully.", "success");
  };

  // Switch impersonated active student profile
  const handleSwitchUser = (userId: string) => {
    const target = profiles.find(p => p.id === userId);
    if (target) {
      setCurrentUser(target);
      safeLocalStorage.setItem('uniuyo_active_user', JSON.stringify(target));
      showToast(`Logged in successfully as: ${target.name}`, 'success');
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-zinc-500">Initializing UniUyo Connect local cache...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-zinc-950 text-zinc-100' : 'bg-zinc-100 text-zinc-800'} flex flex-col font-sans antialiased transition-colors duration-200`} id="uniuyo-connect-root">
      
      {/* PWA offline connectivity system */}
      <OfflineIndicator
        offlineMode={offlineMode}
        setOfflineMode={(off) => {
          setOfflineMode(off);
          if (!off) {
            // Suggest syncing
            showToast(offlineQueue.length > 0 ? "You're online! Click 'Sync Cache' to save offline posts." : "Connected to UniUyo Cloud networks.", "success");
          } else {
            showToast("Connectivity loss simulated. System working on offline LocalStorage.", "warn");
          }
        }}
        queueCount={offlineQueue.length}
        syncQueue={syncQueue}
      />

      {/* Main sticky top header navigation */}
      <header className="sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm" id="main-application-header font-sans">
        <div className={`${displayMode === 'fullscreen' ? 'max-w-none px-6' : 'max-w-7xl mx-auto px-4'} h-16 transition-all duration-300 flex items-center justify-between`}>
          
          {/* Logo Brand coordinates */}
          <div className="flex items-center gap-3 select-none">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md cursor-pointer">
              U
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-indigo-600 flex items-center gap-1">
                <span>UniUyo <span className="text-emerald-500">Connect</span></span>
                <span className="bg-emerald-50 text-emerald-700 text-[9px] uppercase font-bold py-0.5 px-1.5 rounded-full border border-emerald-100 hidden sm:inline-block">
                  Live Index
                </span>
              </h1>
              <span className="text-[10px] text-zinc-500 block -mt-0.5 font-mono">Student Identity Portal</span>
            </div>
          </div>

          {/* Desktop tabs selectors (Main Options Only) */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold leading-normal text-indigo-600">
            <button
              onClick={() => setActiveTab('Feed')}
              className={`px-3.5 py-2 rounded-lg cursor-pointer transition ${activeTab === 'Feed' ? 'bg-indigo-50 text-indigo-600 font-extrabold' : 'text-zinc-550 hover:bg-zinc-50 hover:text-zinc-900'}`}
            >
              Feed Stream
            </button>
            <button
              onClick={() => setActiveTab('Identity')}
              className={`px-3.5 py-2 rounded-lg cursor-pointer transition ${activeTab === 'Identity' ? 'bg-indigo-50 text-indigo-600 font-extrabold' : 'text-zinc-550 hover:bg-zinc-50 hover:text-zinc-900'}`}
            >
              My Identity (L1)
            </button>
            <button
              onClick={() => setActiveTab('Forums')}
              className={`px-3.5 py-2 rounded-lg cursor-pointer transition ${activeTab === 'Forums' ? 'bg-indigo-50 text-indigo-600 font-extrabold' : 'text-zinc-550 hover:bg-zinc-50 hover:text-zinc-900'}`}
            >
              Forums (L3)
            </button>
            <button
              onClick={() => setActiveTab('Projects')}
              className={`px-3.5 py-2 rounded-lg cursor-pointer transition ${activeTab === 'Projects' ? 'bg-indigo-50 text-indigo-600 font-extrabold' : 'text-zinc-550 hover:bg-zinc-50 hover:text-zinc-900'}`}
            >
              Projects (L7)
            </button>
            <button
              onClick={() => setActiveTab('Gamification')}
              className={`px-3.5 py-2 rounded-lg cursor-pointer transition flex items-center gap-1 bg-amber-500/10 text-amber-700 font-black animate-none ${activeTab === 'Gamification' ? 'bg-amber-500 text-white font-extrabold border-amber-500' : 'hover:bg-amber-50'}`}
            >
              <Trophy className="w-3.5 h-3.5 shrink-0" />
              <span>Campus Arena (Beta)</span>
            </button>
          </nav>

          {/* Active Profile capsule widget */}
          <div className="flex items-center gap-3">
            {/* Real-time Notification Bell Widget with badge count (Removed as requested, moved to Side Nav) */}
            <div className="hidden" id="bell-notification-container">
              <button
                onClick={() => {}}
                className="hidden"
              >
              </button>

              {/* Notification dropdown portal */}
              <AnimatePresence>
                {false && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotificationsDropdown(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="fixed sm:absolute top-16 sm:top-14 sm:right-4 left-4 right-4 sm:left-auto sm:w-[380px] max-w-lg sm:max-w-none mx-auto max-h-[75vh] sm:max-h-[520px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 text-left font-sans flex flex-col overflow-hidden"
                    >
                      {/* Dropdown Header */}
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-205 dark:border-zinc-800/80 flex items-center justify-between shrink-0">
                        <div>
                          <h4 className="text-xs font-black uppercase text-zinc-900 dark:text-zinc-100 tracking-wider flex items-center gap-1.5 font-mono">
                            <Bell className="w-4 h-4 text-indigo-600" />
                            <span>Campus Notifications</span>
                          </h4>
                          <span className="text-[10px] text-zinc-400 font-medium block mt-0.5">
                            {notifications.filter(n => !n.read).length} unread interactions
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setShowNotificationsDropdown(false)}
                            className="text-[9px] font-bold text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-250 hover:bg-zinc-150 dark:hover:bg-zinc-800 p-1.5 rounded-lg transition cursor-pointer flex items-center gap-0.5 shrink-0 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                            title="Dismiss dropdown"
                          >
                            <X className="w-3.5 h-3.5 text-zinc-400" />
                            <span className="sm:hidden font-sans uppercase text-zinc-500 text-[8.5px] font-black">Exit</span>
                          </button>
                          {notifications.length > 0 && (
                            <>
                              <button
                                onClick={() => {
                                  const updated = notifications.map(n => ({ ...n, read: true }));
                                  saveNotifications(updated);
                                  showToast("All notifications marked as read! 📚", "success");
                                }}
                                className="text-[9px] font-bold text-indigo-600 hover:text-indigo-850 bg-indigo-50/50 dark:bg-indigo-950/30 px-2 py-0.5 rounded transition cursor-pointer"
                                title="Mark all"
                              >
                                Mark Read
                              </button>
                              <button
                                onClick={() => {
                                  saveNotifications([]);
                                  showToast("Notification log cleared completely.", "warn");
                                }}
                                className="text-[9px] font-bold text-red-500 hover:text-red-700 bg-red-50/50 px-2 py-0.5 rounded transition cursor-pointer"
                                title="Clear all"
                              >
                                Clear
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Dropdown list */}
                      <div className="overflow-y-auto flex-1 max-h-[220px] sm:max-h-[280px] py-1">
                        {notifications.length === 0 ? (
                          <div className="text-center py-12 px-4 space-y-2">
                            <Bell className="w-8 h-8 text-zinc-300 mx-auto stroke-1" />
                            <p className="text-xs font-bold text-zinc-500">No Notifications Yet</p>
                            <p className="text-[10px] text-zinc-400 max-w-[200px] mx-auto leading-relaxed">
                              Simulate requests below or wait for other students to like/comment on your content stream!
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {notifications.map((notif) => (
                              <div
                                key={notif.id}
                                className={`p-3.5 transition-all flex gap-3 relative group ${
                                  notif.read ? 'bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-805/40' : 'bg-indigo-50/20 hover:bg-indigo-50/30 dark:bg-indigo-950/15 dark:hover:bg-indigo-950/20 border-l-2 border-indigo-500'
                                }`}
                              >
                                <img
                                  src={notif.senderAvatar}
                                  alt={notif.senderName}
                                  className="w-10 h-10 rounded-xl object-cover border border-zinc-200 shrink-0 cursor-pointer"
                                  onClick={() => {
                                    const matched = MOCK_PROFILES.find(p => p.name === notif.senderName);
                                    if (matched) {
                                      setViewingProfile(matched);
                                    } else {
                                      showToast(`Could not find profile metadata for ${notif.senderName}`, "warn");
                                    }
                                    setShowNotificationsDropdown(false);
                                  }}
                                  referrerPolicy="no-referrer"
                                />
                                
                                <div className="flex-1 min-w-0 pr-4 text-left">
                                  <div className="flex items-center gap-1.5 pb-0.5">
                                    <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                                      notif.type === 'post_interaction' 
                                        ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400' 
                                        : notif.type === 'event_rsvp'
                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                                        : notif.type === 'mentorship_request'
                                        ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                                        : 'bg-zinc-100 text-zinc-650'
                                    }`}>
                                      {notif.type.replace('_', ' ')}
                                    </span>
                                    <span className="text-[8px] text-zinc-400 font-mono">
                                      {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                  </div>

                                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">
                                    {notif.title}
                                  </p>
                                  
                                  <p className="text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed font-sans -mt-0.5">
                                    {notif.message}
                                  </p>

                                  {/* Mentorship request specific buttons */}
                                  {notif.type === 'mentorship_request' && !notif.message.includes('Accepted') && !notif.message.includes('Declined') && (
                                    <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                                      <button
                                        onClick={() => {
                                          const updated = notifications.map(n => n.id === notif.id ? {
                                            ...n,
                                            read: true,
                                            message: `Accepted request with ${n.senderName}. +15 points awarded! ✅`
                                          } : n);
                                          saveNotifications(updated);
                                          
                                          // Add points
                                          saveActiveUser({
                                            ...currentUser,
                                            points: (currentUser.points || 0) + 15
                                          });
                                          showToast(`Accepted mentoring with ${notif.senderName}! +15 pts added. 🤝`, 'success');
                                        }}
                                        className="text-[9.5px] font-black bg-indigo-600 hover:bg-indigo-750 text-white px-2.5 py-1 rounded-lg transition cursor-pointer shadow-xs border border-indigo-600"
                                      >
                                        Accept Request
                                      </button>
                                      <button
                                        onClick={() => {
                                          const updated = notifications.map(n => n.id === notif.id ? {
                                            ...n,
                                            read: true,
                                            message: `Declined mentorship connection with ${n.senderName}. ❌`
                                          } : n);
                                          saveNotifications(updated);
                                          showToast("Mentorship request declined.", "warn");
                                        }}
                                        className="text-[9.5px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-300 px-2.5 py-1 rounded-lg hover:bg-zinc-200 transition cursor-pointer"
                                      >
                                        Decline
                                      </button>
                                    </div>
                                  )}

                                  {/* Navigation links if any */}
                                  {notif.type === 'post_interaction' && (
                                    <button
                                      onClick={() => {
                                        setActiveTab('Feed');
                                        setShowNotificationsDropdown(false);
                                      }}
                                      className="text-[9.5px] text-indigo-650 hover:underline block font-bold font-mono mt-1"
                                    >
                                      🚀 View Active Post Discussion →
                                    </button>
                                  )}
                                  
                                  {notif.type === 'event_rsvp' && (
                                    <button
                                      onClick={() => {
                                        setActiveTab('Events');
                                        setShowNotificationsDropdown(false);
                                      }}
                                      className="text-[9.5px] text-indigo-650 hover:underline block font-bold font-mono mt-1"
                                    >
                                      🎟️ Go to Events Calendar →
                                    </button>
                                  )}
                                </div>

                                {/* Delete single notification */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const updated = notifications.filter(n => n.id !== notif.id);
                                    saveNotifications(updated);
                                  }}
                                  className="absolute right-2 top-2 p-1 rounded-md text-zinc-300 hover:text-zinc-600 group-hover:opacity-100 opacity-0 transition cursor-pointer"
                                  title="Delete check"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Simulator block at footer of notification list for outstanding user convenience */}
                      <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950/80 border-t border-zinc-150 dark:border-zinc-800 space-y-2 shrink-0">
                        <span className="text-[10px] font-extrabold uppercase text-indigo-750 dark:text-indigo-400 tracking-wider block font-mono">
                          ⚡ REAL-TIME ALERT SIMULATION BASE
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          <button
                            onClick={() => {
                              handleAddNotification({
                                userId: currentUser.id,
                                type: 'post_interaction',
                                title: 'New Interaction on Post',
                                message: 'Chidi Nwachukwu commented: "Count me in for this research presentation, amazing work!"',
                                senderName: 'Chidi Nwachukwu',
                                senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
                                targetId: 'post_1'
                              });
                            }}
                            className="bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-750 p-2 rounded text-left transition font-medium cursor-pointer shadow-3xs text-zinc-700 dark:text-zinc-300 font-mono"
                          >
                            💬 Comment Mock
                          </button>
                          
                          <button
                            onClick={() => {
                              handleAddNotification({
                                userId: currentUser.id,
                                type: 'post_interaction',
                                title: 'New Like Interaction',
                                message: 'Bassey Edet liked your showcase project and voted in your peer poll.',
                                senderName: 'Bassey Edet',
                                senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
                                targetId: 'post_1'
                              });
                            }}
                            className="bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-750 p-2 rounded text-left transition font-medium cursor-pointer shadow-3xs text-zinc-700 dark:text-zinc-300 font-mono"
                          >
                            ❤️ Post Like Mock
                          </button>

                          <button
                            onClick={() => {
                              handleAddNotification({
                                userId: currentUser.id,
                                type: 'event_rsvp',
                                title: 'Event RSVP Received',
                                message: 'Law Rep Emem Obong RSVP\'d to your Upcoming Science Symposium grounds.',
                                senderName: 'Emem Obong',
                                senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
                                targetId: 'event_1'
                              });
                            }}
                            className="bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-750 p-2 rounded text-left transition font-medium cursor-pointer shadow-3xs text-zinc-700 dark:text-zinc-300 font-mono"
                          >
                            🎟️ Event RSVP Mock
                          </button>

                          <button
                            onClick={() => {
                              handleAddNotification({
                                userId: currentUser.id,
                                type: 'mentorship_request',
                                title: 'Mentorship Request Received',
                                message: 'Chidi Nwachukwu requested mentorship on: "Logistics, gig-economy scaling, & venture pitches".',
                                senderName: 'Chidi Nwachukwu',
                                senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
                                targetId: 'student_chidi'
                              });
                            }}
                            className="bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-750 p-2 rounded text-left transition font-medium cursor-pointer shadow-3xs text-zinc-700 dark:text-zinc-300 font-mono"
                          >
                            🤝 Mentor Req Mock
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle option */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition cursor-pointer flex items-center justify-center border border-zinc-200 dark:border-zinc-700"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowInstallerModal(true)}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
              title="Install progressive web app"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="text-[10px] sm:text-xs font-bold font-mono uppercase tracking-wide hidden sm:inline">PWA Installer</span>
            </button>

            <button
              onClick={() => setActiveTab('Identity')}
              className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 p-1.5 pr-3 rounded-xl transition cursor-pointer select-none text-left"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border border-zinc-100 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="hidden sm:block">
                <span className="text-xs font-bold leading-none block truncate max-w-[100px]">{currentUser.name}</span>
                <span className="text-[9px] text-zinc-400 block font-bold uppercase">{currentUser.role.split(' ')[0]}</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Responsive Workspace Grid with Desktop Sidenav */}
      <div className={`flex-1 w-full ${displayMode === 'fullscreen' ? 'max-w-none px-6' : 'max-w-7xl mx-auto'} transition-all duration-300 flex items-stretch`}>
        
        {/* Persistent Sidenav for Large Viewports containing EVERYTHING */}
        <aside className="hidden lg:flex w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-5 flex-col gap-1.5 shrink-0 select-none">
          <div className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-3 mb-2 font-mono">My Hub</div>
          
          <button
            onClick={() => setActiveTab('Feed')}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${
              activeTab === 'Feed' 
                ? 'bg-indigo-50 text-indigo-600 font-extrabold shadow-sm border border-indigo-100/50' 
                : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950'
            }`}
          >
            <MessageSquare className="w-4.5 h-4.5 shrink-0" />
            <span>Home Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('Messages')}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer relative ${
              activeTab === 'Messages' 
                ? 'bg-indigo-50 text-indigo-600 font-extrabold shadow-sm border border-indigo-100/50' 
                : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950'
            }`}
          >
            <MessageSquare className="w-4.5 h-4.5 shrink-0 text-indigo-600" />
            <span className="flex-1">Direct Messages</span>
            <span className="bg-teal-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">LIVE</span>
          </button>

          <button
            onClick={() => setActiveTab('CreatePost')}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${
              activeTab === 'CreatePost' 
                ? 'bg-indigo-50 text-indigo-600 font-extrabold shadow-sm border border-indigo-100/50' 
                : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950'
            }`}
          >
            <PlusCircle className="w-4.5 h-4.5 shrink-0 text-indigo-600" />
            <span className="flex-1">Create Post (Dedicated)</span>
            <span className="bg-amber-100 text-amber-800 text-[8px] font-black uppercase px-1.5 py-0.5 rounded">NEW</span>
          </button>

          <button
            onClick={() => setActiveTab('Identity')}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${
              activeTab === 'Identity' 
                ? 'bg-indigo-50 text-indigo-600 font-extrabold shadow-sm border border-indigo-100/50' 
                : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950'
            }`}
          >
            <User className="w-4.5 h-4.5 shrink-0" />
            <span>My Identity</span>
          </button>

          <button
            onClick={() => setActiveTab('Forums')}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${
              activeTab === 'Forums' 
                ? 'bg-indigo-50 text-indigo-600 font-extrabold shadow-sm border border-indigo-100/50' 
                : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950'
            }`}
          >
            <Users className="w-4.5 h-4.5 shrink-0" />
            <span>Campus Forums</span>
          </button>

          <button
            onClick={() => setActiveTab('Projects')}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${
              activeTab === 'Projects' 
                ? 'bg-indigo-50 text-indigo-600 font-extrabold shadow-sm border border-indigo-100/50' 
                : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950'
            }`}
          >
            <Rocket className="w-4.5 h-4.5 shrink-0" />
            <span>MVPs &amp; Projects</span>
          </button>

          <button
            onClick={() => setActiveTab('Gamification')}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${
              activeTab === 'Gamification' 
                ? 'bg-[#F2F0FF] text-[#4F46E5] font-extrabold shadow-sm border border-indigo-100/50' 
                : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950'
            }`}
          >
            <Trophy className="w-4.5 h-4.5 shrink-0 text-amber-500" />
            <span className="flex-1">Campus Arena &amp; Wars</span>
            <span className="bg-amber-100 text-amber-800 text-[8px] font-black uppercase px-1.5 py-0.5 rounded">NEW</span>
          </button>

          <button
            onClick={() => setActiveTab('Notifications')}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer relative ${
              activeTab === 'Notifications' 
                ? 'bg-indigo-50 text-indigo-600 font-extrabold shadow-sm border border-indigo-100/50' 
                : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950'
            }`}
          >
            {notifications.some(n => !n.read) ? (
              <BellRing className="w-4.5 h-4.5 shrink-0 text-indigo-600 animate-bounce" />
            ) : (
              <Bell className="w-4.5 h-4.5 shrink-0 text-zinc-650" />
            )}
            <span className="flex-1">Notifications</span>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="bg-red-500 text-white font-extrabold text-[9px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>

          <div className="h-px bg-zinc-200/80 my-3" />
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-3 mb-2 font-mono">Discovery Core</div>

          <button
            onClick={() => setActiveTab('Discovery')}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${
              activeTab === 'Discovery' 
                ? 'bg-indigo-50 text-indigo-600 font-extrabold shadow-sm border border-indigo-100/50' 
                : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950'
            }`}
          >
            <Compass className="w-4.5 h-4.5 shrink-0" />
            <span>Directory Search</span>
          </button>

          <button
            onClick={() => setActiveTab('Jobs')}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${
              activeTab === 'Jobs' 
                ? 'bg-indigo-50 text-indigo-600 font-extrabold shadow-sm border border-indigo-100/50' 
                : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950'
            }`}
          >
            <Briefcase className="w-4.5 h-4.5 shrink-0" />
            <span>Opportunities</span>
          </button>

          <button
            onClick={() => setActiveTab('Events')}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${
              activeTab === 'Events' 
                ? 'bg-indigo-50 text-indigo-600 font-extrabold shadow-sm border border-indigo-100/50' 
                : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950'
            }`}
          >
            <Calendar className="w-4.5 h-4.5 shrink-0" />
            <span>Campus Events</span>
          </button>

          <button
            onClick={() => setActiveTab('Settings')}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${
              activeTab === 'Settings' 
                ? 'bg-indigo-50 text-indigo-600 font-extrabold shadow-sm border border-indigo-100/50' 
                : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950'
            }`}
          >
            <Sliders className="w-4.5 h-4.5 shrink-0" />
            <span>App Settings</span>
          </button>

          {/* Sidenav Custom Bento Tracker Card (Vibrant Theme Guidelines) */}
          <div className="mt-auto p-4 bg-gradient-to-br from-indigo-650 to-indigo-800 rounded-2xl text-white shadow-md relative overflow-hidden">
            <div className="absolute right-[-10px] bottom-[-10px] w-14 h-14 bg-white/5 rounded-full blur-xl" />
            <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-200 block mb-1">Live Identity Core</span>
            <p className="text-xs font-extrabold truncate">{currentUser.name}</p>
            <div className="mt-2.5 bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg--accent bg-[#FF8C00] h-full rounded-full transition-all duration-300" 
                style={{ width: `${currentUser.completionRate || 75}%` }}
              />
            </div>
            <p className="text-[10px] mt-1.5 opacity-85 shrink-0">L1 Identity Portal • Active</p>
          </div>
        </aside>

        {/* Content Viewport Frame */}
        <main className="flex-1 w-full px-0 sm:px-4 py-6 pb-24 lg:pb-12 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'Feed' && (
                <FeedSection
                  currentUser={currentUser}
                  posts={posts}
                  profiles={profiles}
                  onAddPost={handleAddPost}
                  onUpdatePost={handleUpdatePost}
                  onDeletePost={handleDeletePost}
                  onUpdateCurrentUser={saveActiveUser}
                  onNavigateToComposer={() => setActiveTab('CreatePost')}
                  onViewProfile={handleViewProfileByUserId}
                  offlineMode={offlineMode}
                  onShowToast={showToast}
                  theme={theme}
                  onAddNotification={handleAddNotification}
                  initialActiveCommentPostId={targetPostIdForComments}
                  onClearInitialActiveCommentPostId={() => setTargetPostIdForComments(null)}
                />
              )}

              {activeTab === 'CreatePost' && (
                <CreatePostSection
                  currentUser={currentUser}
                  onAddPost={handleAddPost}
                  onShowToast={showToast}
                  setActiveTab={setActiveTab}
                  theme={theme}
                />
              )}

              {activeTab === 'Identity' && (
                <IdentitySection
                  currentUser={currentUser}
                  profiles={profiles}
                  onUpdateCurrentUser={saveActiveUser}
                  onSwitchUser={handleSwitchUser}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'Forums' && (
                <CommunitiesSection
                  currentUser={currentUser}
                  communities={communities}
                  posts={posts}
                  onUpdateCommunity={handleUpdateCommunity}
                  onUpdatePost={handleUpdatePost}
                  onViewProfile={handleViewProfileByUserId}
                  onShowToast={showToast}
                  onCreateCommunity={handleCreateCommunity}
                  onDeleteCommunity={handleDeleteCommunity}
                />
              )}

              {activeTab === 'Discovery' && (
                <DiscoverySection
                  currentUser={currentUser}
                  profiles={profiles}
                  communities={communities}
                  opportunities={opportunities}
                  events={events}
                  projects={projects}
                  onViewProfile={handleViewProfileByUserId}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'Jobs' && (
                <OpportunitiesSection
                  currentUser={currentUser}
                  opportunities={opportunities}
                  onAddOpportunity={handleAddOpportunity}
                  onUpdateOpportunity={handleUpdateOpportunity}
                  offlineMode={offlineMode}
                  onShowToast={showToast}
                  onDeleteOpportunity={handleDeleteOpportunity}
                />
              )}

              {activeTab === 'Events' && (
                <EventsSection
                  currentUser={currentUser}
                  events={events}
                  onAddEvent={handleAddEvent}
                  onUpdateEvent={handleUpdateEvent}
                  offlineMode={offlineMode}
                  onShowToast={showToast}
                  onDeleteEvent={handleDeleteEvent}
                  onAddNotification={handleAddNotification}
                />
              )}

              {activeTab === 'Projects' && (
                <ProjectsSection
                  currentUser={currentUser}
                  projects={projects}
                  onAddProject={handleAddProject}
                  onUpdateProject={handleUpdateProject}
                  offlineMode={offlineMode}
                  onShowToast={showToast}
                  onDeleteProject={handleDeleteProject}
                />
              )}

              {activeTab === 'Gamification' && (
                <GamificationHub
                  currentUser={currentUser}
                  onUpdateCurrentUser={saveActiveUser}
                  onShowToast={showToast}
                  theme={theme}
                />
              )}

              {activeTab === 'Messages' && (
                <MessagesSection
                  currentUser={currentUser}
                  profiles={profiles}
                  chats={chats}
                  messages={messages}
                  onAddChat={handleAddChat}
                  onAddMessage={handleAddMessage}
                  onToggleReaction={handleToggleMessageReaction}
                  onAddNotification={handleAddNotification}
                  onShowToast={showToast}
                  theme={theme}
                  onSwitchUser={(userId) => {
                    const foundProf = profiles.find(p => p.id === userId);
                    if (foundProf) {
                      saveActiveUser(foundProf);
                      showToast(`Simulating network viewpoint as: ${foundProf.name}`, 'success');
                    }
                  }}
                />
              )}

              {activeTab === 'Notifications' && (
                <NotificationsSection
                  currentUser={currentUser}
                  notifications={notifications}
                  profiles={profiles}
                  onSetViewingProfile={setViewingProfile}
                  onSaveNotifications={saveNotifications}
                  onAddNotification={handleAddNotification}
                  onShowToast={showToast}
                  saveActiveUser={saveActiveUser}
                  onNotificationClick={handleNotificationClick}
                />
              )}

              {activeTab === 'Settings' && (
                <SettingsSection
                  currentUser={currentUser}
                  theme={theme}
                  toggleTheme={toggleTheme}
                  onShowToast={showToast}
                  offlineQueueCount={offlineQueue.length}
                  onSyncOfflineQueue={syncQueue}
                  displayMode={displayMode}
                  onChangeDisplayMode={setDisplayMode}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Sticky Bottom Tab Bar (Strictly Mobile viewports <= lg to reinforce Native PWA feeling) - Main Options only */}
      <footer className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-zinc-200 py-2.5 px-3 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('Feed')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition ${activeTab === 'Feed' ? 'text-indigo-600 scale-105 font-extrabold' : 'text-zinc-400'}`}
        >
          <MessageSquare className="w-5 h-5 shrink-0" />
          <span className="text-[10px]">Feed</span>
        </button>

        <button
          onClick={() => setActiveTab('Forums')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition ${activeTab === 'Forums' ? 'text-indigo-600 scale-105 font-extrabold' : 'text-zinc-400'}`}
        >
          <Users className="w-5 h-5 shrink-0" />
          <span className="text-[10px]">Forums</span>
        </button>

        {/* Center Post action button */}
        <button
          onClick={() => setActiveTab('CreatePost')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition ${
            activeTab === 'CreatePost' ? 'text-indigo-600 scale-105 font-extrabold' : 'text-zinc-400 hover:text-indigo-600'
          }`}
        >
          <div className="w-10 h-10 -mt-5 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-indigo-700 transition transform hover:scale-105 active:scale-95">
            <Plus className="w-5.5 h-5.5 stroke-[3]" />
          </div>
          <span className="text-[10px]">Post</span>
        </button>

        <button
          onClick={() => setActiveTab('Projects')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition ${activeTab === 'Projects' ? 'text-indigo-600 scale-105 font-extrabold' : 'text-zinc-400'}`}
        >
          <Rocket className="w-5 h-5 shrink-0" />
          <span className="text-[10px]">MVPs</span>
        </button>

        <button
          onClick={() => setShowMobileSidenav(true)}
          className="flex flex-col items-center gap-1 cursor-pointer transition text-zinc-400 hover:text-indigo-600 relative"
        >
          <div className="relative">
            <Menu className="w-5 h-5 shrink-0" />
            {notifications.some(n => !n.read) && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white animate-pulse" />
            )}
          </div>
          <span className="text-[10px]">More</span>
        </button>
      </footer>

      {/* Slider Sidenav for Mobile Viewports (Everything else) */}
      <AnimatePresence>
        {showMobileSidenav && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileSidenav(false)}
            className="fixed inset-0 z-50 bg-zinc-950/65 lg:hidden flex justify-end"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-72 bg-white h-full shadow-2xl p-5 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm">
                      U
                    </div>
                    <span className="font-extrabold text-indigo-700 text-sm">UniUyo Connect</span>
                  </div>
                  <button 
                    onClick={() => setShowMobileSidenav(false)}
                    className="p-1.5 px-3 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-xs font-bold transition text-zinc-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2.5 font-mono">My Workspace</div>
                  
                  <button
                    onClick={() => { setActiveTab('Feed'); setShowMobileSidenav(false); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${activeTab === 'Feed' ? 'bg-indigo-50 text-indigo-600' : 'text-zinc-650 hover:bg-zinc-50'}`}
                  >
                    <MessageSquare className="w-4.5 h-4.5 text-indigo-600" />
                    <span>Home Feed Stream</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('Messages'); setShowMobileSidenav(false); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${activeTab === 'Messages' ? 'bg-indigo-50 text-indigo-600' : 'text-zinc-650 hover:bg-zinc-50'}`}
                  >
                    <MessageSquare className="w-4.5 h-4.5 text-indigo-600" />
                    <span className="flex-1">Direct Messages</span>
                    <span className="bg-teal-500 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full">LIVE</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('Identity'); setShowMobileSidenav(false); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${activeTab === 'Identity' ? 'bg-indigo-50 text-indigo-600' : 'text-zinc-650 hover:bg-zinc-50'}`}
                  >
                    <User className="w-4.5 h-4.5 text-indigo-600" />
                    <span>My Student Identity</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('Forums'); setShowMobileSidenav(false); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${activeTab === 'Forums' ? 'bg-indigo-50 text-indigo-600' : 'text-zinc-650 hover:bg-zinc-50'}`}
                  >
                    <Users className="w-4.5 h-4.5 text-indigo-600" />
                    <span>Campus Forums</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('Projects'); setShowMobileSidenav(false); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${activeTab === 'Projects' ? 'bg-indigo-50 text-indigo-600' : 'text-zinc-650 hover:bg-zinc-50'}`}
                  >
                    <Rocket className="w-4.5 h-4.5 text-indigo-600" />
                    <span>MVPs &amp; Project Hub</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('Gamification'); setShowMobileSidenav(false); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${activeTab === 'Gamification' ? 'bg-[#F2F0FF] text-[#4F46E5] font-extrabold' : 'text-zinc-650 hover:bg-zinc-50'}`}
                  >
                    <Trophy className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                    <span className="flex-1">Campus Arena &amp; Wars</span>
                    <span className="bg-amber-100 text-amber-800 text-[8px] font-black uppercase px-1.5 py-0.5 rounded">NEW</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('Notifications'); setShowMobileSidenav(false); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer relative ${activeTab === 'Notifications' ? 'bg-indigo-50 text-indigo-600' : 'text-zinc-650 hover:bg-zinc-50'}`}
                  >
                    <Bell className="w-4.5 h-4.5 text-indigo-600" />
                    <span className="flex-1">Notifications</span>
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="bg-red-500 text-white font-extrabold text-[9px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>

                  <div className="h-px bg-zinc-200/80 my-3" />
                  <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2.5 font-mono">Discovery Core</div>

                  <button
                    onClick={() => { setActiveTab('Discovery'); setShowMobileSidenav(false); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${activeTab === 'Discovery' ? 'bg-indigo-50 text-indigo-600' : 'text-zinc-650 hover:bg-zinc-50'}`}
                  >
                    <Compass className="w-4.5 h-4.5 text-indigo-600" />
                    <span>Campus Directory</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('Jobs'); setShowMobileSidenav(false); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${activeTab === 'Jobs' ? 'bg-indigo-50 text-indigo-600' : 'text-zinc-650 hover:bg-zinc-50'}`}
                  >
                    <Briefcase className="w-4.5 h-4.5 text-indigo-600" />
                    <span>Open Opportunities</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('Events'); setShowMobileSidenav(false); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${activeTab === 'Events' ? 'bg-indigo-50 text-indigo-600' : 'text-zinc-650 hover:bg-zinc-50'}`}
                  >
                    <Calendar className="w-4.5 h-4.5 text-indigo-600" />
                    <span>Events Calendar</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('Settings'); setShowMobileSidenav(false); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${activeTab === 'Settings' ? 'bg-indigo-50 text-indigo-600' : 'text-zinc-650 hover:bg-zinc-50'}`}
                  >
                    <Sliders className="w-4.5 h-4.5 text-indigo-600" />
                    <span>App Settings</span>
                  </button>
                </div>
              </div>

              {/* Bento Card in Mobile Drawer */}
              <div className="p-4 bg-gradient-to-br from-indigo-650 to-indigo-800 rounded-2xl text-white shadow-md">
                <span className="text-[9px] block mb-1 uppercase tracking-widest font-extrabold text-emerald-200">Identity Core</span>
                <p className="text-xs font-bold truncate">{currentUser.name}</p>
                <div className="mt-2.5 bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#FF8C00] w-3/4 h-full rounded-full"></div>
                </div>
                <p className="text-[10px] mt-1 text-white/80 font-medium">Verified student session</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating alert notification toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 lg:bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-50 max-w-sm"
          >
            <div className={`p-4 rounded-xl border shadow-lg flex items-start gap-3 ${
              toast.type === 'warn'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-zinc-900 border-zinc-800 text-white'
            }`}>
              {toast.type === 'warn' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-xs font-bold font-sans">UniUyo Network System Notice</p>
                <p className="text-xs mt-0.5 leading-normal opacity-90">{toast.msg}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Standard PWA Mobile/Desktop Step-by-Step Installer Modal Dialog */}
      <AnimatePresence>
        {showInstallerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/60 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xl max-w-md w-full p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-105 pb-3">
                <span className="font-extrabold text-sm text-zinc-900 uppercase tracking-widest flex items-center gap-1.5 pb-0.5">
                  <Download className="w-4 h-4 text-indigo-600" />
                  <span>PWA Installation steps</span>
                </span>
                <button
                  onClick={() => setShowInstallerModal(false)}
                  className="text-zinc-400 hover:text-zinc-800 text-sm font-bold p-1 rounded-full hover:bg-zinc-50"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5 mb-2">
                <p className="text-xs text-zinc-600 leading-relaxed">
                  UniUyo Connect conforms fully to progressive web application guidelines, letting you run it natively outside the web browser.
                </p>

                <div className="space-y-2.5">
                  <div className="p-3 bg-zinc-50 border border-zinc-150 rounded-xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block mb-0.5">For Android (Chrome / Brave)</span>
                    <ol className="list-decimal pl-4.5 text-[11px] text-zinc-600 space-y-1 font-medium">
                      <li>Tap the three vertical dots in chrome top right menu.</li>
                      <li>Click <strong className="text-zinc-800">"Install app"</strong> or "Add to Home screen".</li>
                      <li>Launch UniUyo directly from your launcher drawer.</li>
                    </ol>
                  </div>

                  <div className="p-3 bg-zinc-50 border border-zinc-150 rounded-xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block mb-0.5">For iOS (Safari)</span>
                    <ol className="list-decimal pl-4.5 text-[11px] text-zinc-600 space-y-1 font-medium">
                      <li>Tap the rectangular <strong className="text-zinc-800">Share</strong> icon at the bottom of safari.</li>
                      <li>Scroll down the options list and find <strong className="text-zinc-800">"Add to Home Screen"</strong>.</li>
                      <li>Confirm. The icon appears instantly next to normal apps.</li>
                    </ol>
                  </div>

                  <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-[11px] text-indigo-950 font-medium leading-relaxed">
                    🌟 <strong>Offline support:</strong> Any posts, comments, RSVPs or resumes triggered offline are saved locally inside durable sandboxes and synced automatically.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowInstallerModal(false)}
                className="w-full bg-zinc-900 border border-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
              >
                Close Installer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Profile View Modal Overlay */}
      <AnimatePresence>
        {viewingProfile && (
          <ProfileViewModal
            profile={viewingProfile}
            onClose={() => setViewingProfile(null)}
            onShowToast={showToast}
            currentUser={currentUser!}
            theme={theme}
            onAddNotification={handleAddNotification}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

