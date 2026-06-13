/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { StudentProfile, Chat, Message, AppNotification } from '../types';
import { 
  Send, 
  MessageSquare, 
  Plus, 
  Users, 
  User, 
  Search, 
  ArrowLeft, 
  Clock, 
  Sparkles, 
  UserSquare2, 
  Check, 
  CheckCheck, 
  Info, 
  Trash2, 
  Filter, 
  FileText, 
  UserCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MessagesSectionProps {
  currentUser: StudentProfile;
  profiles: StudentProfile[];
  chats: Chat[];
  messages: Message[];
  onAddMessage: (msg: Message) => void;
  onAddChat: (chat: Chat) => void;
  onToggleReaction?: (msgId: string, emoji: string) => void;
  onSwitchUser?: (userId: string) => void;
  onShowToast: (msg: string, type: 'success' | 'warn') => void;
  onAddNotification: (notif: {
    userId: string;
    type: 'post_interaction' | 'event_rsvp' | 'mentorship_request' | 'announcement' | 'direct_message' | 'post_comment' | 'community_post' | 'upcoming_event' | 'opportunity_match';
    title: string;
    message: string;
    senderName: string;
    senderAvatar: string;
    targetId?: string;
  }) => void;
  theme?: 'light' | 'dark';
}

export default function MessagesSection({
  currentUser,
  profiles = [],
  chats = [],
  messages = [],
  onAddMessage,
  onAddChat,
  onToggleReaction,
  onSwitchUser,
  onShowToast,
  onAddNotification,
  theme = 'light'
}: MessagesSectionProps) {
  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    return chats.length > 0 ? chats[0].id : null;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [chatTypeFilter, setChatTypeFilter] = useState<'all' | 'private' | 'group'>('all');
  
  // New conversation dialog modal
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [newChatType, setNewChatType] = useState<'private' | 'group'>('private');
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>([]);
  const [creatorSearchQuery, setCreatorSearchQuery] = useState('');

  // Main input state
  const [textInput, setTextInput] = useState('');
  
  // Emoji reaction temporary selector state
  const [activeEmojiPickerMsgId, setActiveEmojiPickerMsgId] = useState<string | null>(null);
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  // Autoscroll chat window
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChatId, messages]);

  const activeChat = chats.find(c => c.id === activeChatId) || (chats.length > 0 ? chats[0] : null);
  
  // Filter active chats by query and category
  const filteredChats = chats.filter(chat => {
    // Determine title of chat
    let chatName = '';
    if (chat.isGroup) {
      chatName = chat.name || 'Student Study Group';
    } else {
      const otherId = chat.memberIds.find(id => id !== currentUser.id) || '';
      const otherProfile = profiles.find(p => p.id === otherId);
      chatName = otherProfile ? otherProfile.name : 'UniUyo Student';
    }

    const matchesSearch = chatName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (chatTypeFilter === 'private') {
      return matchesSearch && !chat.isGroup;
    }
    if (chatTypeFilter === 'group') {
      return matchesSearch && chat.isGroup;
    }
    return matchesSearch;
  });

  // Fetch active chat messages in order
  const activeChatMessages = messages.filter(m => m.chatId === activeChat?.id);

  // Quick prompt suggestions
  const presetSuggestions = [
    "Let's meet at the Computer Science Lab! 💻",
    "Are you participating in the UniUyo Tech Hackathon? 🚀",
    "Let's form a study group for the exams this weekend! 📝",
    "Let's coordinate our project pitch deck. 📊",
    "Can you share the lecture slides? 🙏"
  ];

  // Send message trigger
  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || !activeChat) return;

    const nextMsg: Message = {
      id: `msg_${Date.now()}`,
      chatId: activeChat.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: textToSend.trim(),
      createdAt: new Date().toISOString()
    };

    onAddMessage(nextMsg);
    setTextInput('');

    // Trigger notification for all other participants in the room
    const otherMemberIds = activeChat.memberIds.filter(id => id !== currentUser.id);
    
    otherMemberIds.forEach(targetId => {
      const desc = activeChat.isGroup 
        ? `"${activeChat.name}": ${currentUser.name} sent: "${textToSend.substring(0, 30)}${textToSend.length > 30 ? '...' : ''}"`
        : `New direct message from ${currentUser.name}: "${textToSend.substring(0, 35)}${textToSend.length > 35 ? '...' : ''}"`;
        
      onAddNotification({
        userId: targetId,
        type: 'direct_message',
        title: activeChat.isGroup ? `New message in ${activeChat.name}` : `New message from ${currentUser.name}`,
        message: desc,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        targetId: activeChat.id
      });
    });

    onShowToast(`Message sent successfully! 💬`, 'success');
  };

  // Switch between other members of this chat room to test multi-user chat response
  const handleSwitchSimulatorUser = (targetId: string) => {
    if (onSwitchUser) {
      onSwitchUser(targetId);
      onShowToast(`Impersonating ${profiles.find(p => p.id === targetId)?.name || 'Student'} to send response.`, 'success');
    }
  };

  // Launch chat creator execution
  const handleCreateConversation = () => {
    if (newChatType === 'private') {
      if (selectedRecipientIds.length !== 1) {
        onShowToast("Please choose 1 classmate to message.", "warn");
        return;
      }
      
      const recipientId = selectedRecipientIds[0];
      
      // Check if chat already exists
      const existing = chats.find(c => !c.isGroup && c.memberIds.includes(currentUser.id) && c.memberIds.includes(recipientId));
      if (existing) {
        setActiveChatId(existing.id);
        setShowCreatorModal(false);
        onShowToast("Resumed existing private message thread.", "success");
        return;
      }

      const freshChat: Chat = {
        id: `chat_${Date.now()}`,
        isGroup: false,
        memberIds: [currentUser.id, recipientId],
        createdAt: new Date().toISOString(),
        lastMessage: 'Conversation initialized.',
        lastMessageAt: new Date().toISOString()
      };

      onAddChat(freshChat);
      setActiveChatId(freshChat.id);
      setShowCreatorModal(false);
      setSelectedRecipientIds([]);
      onShowToast("Direct Chat Thread Launched!", "success");
    } else {
      // Group chat
      if (!newGroupName.trim()) {
        onShowToast("Please provide a name for your Study Group.", "warn");
        return;
      }
      if (selectedRecipientIds.length < 2) {
        onShowToast("A group chat must include at least 2 other classmates.", "warn");
        return;
      }

      const freshChat: Chat = {
        id: `chat_${Date.now()}`,
        name: newGroupName.trim(),
        isGroup: true,
        memberIds: [currentUser.id, ...selectedRecipientIds],
        avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=256',
        createdAt: new Date().toISOString(),
        lastMessage: 'Group Study Space established.',
        lastMessageAt: new Date().toISOString()
      };

      onAddChat(freshChat);
      setActiveChatId(freshChat.id);
      setShowCreatorModal(false);
      setNewGroupName('');
      setSelectedRecipientIds([]);
      onShowToast(`Created group study chat "${freshChat.name}"! 👥`, "success");
    }
  };

  const handleToggleRecipientSelection = (id: string) => {
    if (newChatType === 'private') {
      // Only 1 selection
      setSelectedRecipientIds([id]);
    } else {
      setSelectedRecipientIds(prev => 
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
    }
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px] rounded-2xl border ${
      isDark ? 'border-zinc-800 bg-zinc-900/60' : 'border-zinc-200 bg-white'
    } overflow-hidden`} id="p2p-direct-messaging-system">
      
      {/* Chats Column / Navigation Drawer (span 4/12) */}
      <div className={`lg:col-span-4 border-r flex flex-col h-[600px] ${
        activeChatId ? 'hidden lg:flex' : 'flex'
      } ${
        isDark ? 'border-zinc-800 bg-zinc-950/20' : 'border-zinc-200 bg-zinc-50/50'
      }`}>
        {/* Navigation Sidebar Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-black uppercase tracking-wider font-mono">My Conversations</h2>
            </div>
            
            <button
              onClick={() => {
                setNewChatType('private');
                setNewGroupName('');
                setSelectedRecipientIds([]);
                setShowCreatorModal(true);
              }}
              className="p-1 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-750 text-white font-black text-xs transition duration-150 cursor-pointer flex items-center gap-1 shadow-2xs"
              title="Spawn direct conversation or group"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create</span>
            </button>
          </div>

          {/* Search bar inputs */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search classmates or groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-1.5 rounded-xl text-xs font-medium border focus:ring-1 focus:ring-indigo-500 focus:outline-hidden ${
                isDark ? 'bg-zinc-900 border-zinc-850 text-white' : 'bg-white border-zinc-200 text-zinc-800'
              }`}
            />
          </div>

          {/* Filter badges */}
          <div className="flex items-center gap-1 bg-zinc-200/50 dark:bg-zinc-800/50 p-1 rounded-xl">
            <button
              onClick={() => setChatTypeFilter('all')}
              className={`flex-1 text-center py-1 rounded-lg text-[10px] uppercase font-black tracking-wide transition ${
                chatTypeFilter === 'all' 
                  ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-white shadow-xs' 
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setChatTypeFilter('private')}
              className={`flex-1 text-center py-1 rounded-lg text-[10px] uppercase font-black tracking-wide transition ${
                chatTypeFilter === 'private' 
                  ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-white shadow-xs' 
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              Direct
            </button>
            <button
              onClick={() => setChatTypeFilter('group')}
              className={`flex-1 text-center py-1 rounded-lg text-[10px] uppercase font-black tracking-wide transition ${
                chatTypeFilter === 'group' 
                  ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-white shadow-xs' 
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              Groups
            </button>
          </div>
        </div>

        {/* Chats scroll List */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
          {filteredChats.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2.5">
              <MessageSquare className="w-9 h-9 text-zinc-350 mx-auto stroke-1" />
              <p className="text-xs font-bold text-zinc-500">No Conversations Found</p>
              <p className="text-[10px] text-zinc-400 max-w-[180px] mx-auto leading-relaxed">
                Click "Create" to start a direct 1-to-1 chat or coordinate a group study chat!
              </p>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const isSelected = activeChat?.id === chat.id;
              
              // Resolve name, avatar, member details
              let chatTitle = '';
              let chatAvatar = '';
              let groupCountText = '';

              if (chat.isGroup) {
                chatTitle = chat.name || 'Student Study Group';
                chatAvatar = chat.avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=256';
                groupCountText = `${chat.memberIds.length} members`;
              } else {
                const otherId = chat.memberIds.find(id => id !== currentUser.id) || '';
                const otherProfile = profiles.find(p => p.id === otherId);
                chatTitle = otherProfile ? otherProfile.name : 'UniUyo Student';
                chatAvatar = otherProfile ? otherProfile.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256';
                groupCountText = otherProfile ? `${otherProfile.level} • ${otherProfile.department}` : 'Classmate';
              }

              // Get actual last message preview
              const chatMsgs = messages.filter(m => m.chatId === chat.id);
              const lastMsg = chatMsgs.length > 0 ? chatMsgs[chatMsgs.length - 1] : null;
              const lastText = lastMsg ? lastMsg.content : (chat.lastMessage || 'Space established...');
              const lastTime = lastMsg ? new Date(lastMsg.createdAt) : new Date(chat.lastMessageAt || chat.createdAt);

              return (
                <button
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`w-full p-3.5 transition text-left flex gap-3 focus:outline-hidden border-l-3 relative select-none cursor-pointer ${
                    isSelected 
                      ? 'bg-indigo-55/15 hover:bg-indigo-55/20 border-l-indigo-600 dark:bg-indigo-950/20' 
                      : 'border-l-transparent hover:bg-zinc-200/30 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={chatAvatar}
                      alt={chatTitle}
                      className="w-11 h-11 rounded-xl object-cover border border-zinc-205"
                      referrerPolicy="no-referrer"
                    />
                    {chat.isGroup ? (
                      <span className="absolute -bottom-1 -right-1 bg-indigo-500 text-white rounded-full p-0.5 border border-white flex items-center justify-center">
                        <Users className="w-2.5 h-2.5" />
                      </span>
                    ) : (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between pb-0.5">
                      <h4 className="text-xs font-extrabold truncate text-zinc-900 dark:text-zinc-100 pr-1 select-none">
                        {chatTitle}
                      </h4>
                      <span className="text-[9px] text-zinc-400 shrink-0 font-mono font-medium">
                        {lastTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-[10px] font-medium text-indigo-600/80 dark:text-indigo-400 block mb-0.5 font-sans">
                      {groupCountText}
                    </p>

                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate leading-relaxed">
                      {lastMsg && lastMsg.senderId === currentUser.id ? 'You: ' : ''}
                      {lastText}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Active Conversation Ledger View (span 8/12) */}
      <div className={`lg:col-span-8 flex flex-col h-[600px] relative ${
        !activeChatId ? 'hidden lg:flex' : 'flex'
      }`}>
        {activeChat ? (
          <>
            {/* Active Chat Header widget */}
            <div className={`p-4 border-b shrink-0 flex items-center justify-between gap-3 ${
              isDark ? 'bg-zinc-950/40 border-zinc-800' : 'bg-zinc-50/20 border-zinc-200'
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setActiveChatId(null)}
                  className="lg:hidden p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 transition cursor-pointer"
                  title="Back to conversations list"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={
                    activeChat.isGroup 
                      ? activeChat.avatar 
                      : (profiles.find(p => p.id === activeChat.memberIds.find(id => id !== currentUser.id))?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256')
                  }
                  alt={activeChat.isGroup ? activeChat.name : 'Convo Profile'}
                  className="w-10 h-10 rounded-xl object-cover shrink-0 border border-zinc-200"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h3 className="text-xs font-black uppercase text-zinc-900 dark:text-white truncate tracking-wider font-mono">
                    {activeChat.isGroup ? activeChat.name : (profiles.find(p => p.id === activeChat.memberIds.find(id => id !== currentUser.id))?.name || 'UniUyo Connect Scholar')}
                  </h3>
                  <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    <span>Active Member Lane • Study Room</span>
                  </p>
                </div>
              </div>

              {/* Impersonation Interactive Tool (Multi-User Simulation) */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-zinc-400 font-bold uppercase shrink-0 font-mono hidden sm:inline">Simulation Hub:</span>
                
                <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-850 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  {activeChat.memberIds.map(memId => {
                    const prof = profiles.find(p => p.id === memId);
                    if (!prof) return null;
                    const isActiveImpersonate = currentUser.id === memId;

                    return (
                      <button
                        key={memId}
                        onClick={() => handleSwitchSimulatorUser(memId)}
                        className={`w-7 h-7 rounded-lg overflow-hidden border transition relative shrink-0 ${
                          isActiveImpersonate 
                            ? 'border-indigo-500 ring-2 ring-indigo-500/30' 
                            : 'border-zinc-300 dark:border-zinc-700 opacity-60 hover:opacity-100'
                        }`}
                        title={`Act as ${prof.name}`}
                      >
                        <img src={prof.avatar} alt={prof.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        {isActiveImpersonate && (
                          <div className="absolute inset-0 bg-indigo-650/30 flex items-center justify-center">
                            <UserCheck className="w-3.5 h-3.5 text-white stroke-2 shadow-xs" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Impersonator Status Notification bar */}
            <div className="p-2.5 bg-indigo-500/10 dark:bg-indigo-950/20 px-4 flex items-center gap-2 text-[10px] text-indigo-750 dark:text-indigo-400 border-b border-indigo-100/30 select-none shrink-0 font-medium">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <span>
                Testing multi-user chats? Click a student avatar on the right to switch profiles! <strong>Replying as "{currentUser.name}"</strong>.
              </span>
            </div>

            {/* Messaging Stream ledger panel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-radial from-transparent to-zinc-50/50 dark:to-zinc-950/5">
              {activeChatMessages.length === 0 ? (
                <div className="text-center py-20 px-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                    <MessageSquare className="w-6 h-6 stroke-1" />
                  </div>
                  <p className="text-xs font-bold text-zinc-400">Establish Connection</p>
                  <p className="text-[10px] text-zinc-400 max-w-[245px] mx-auto leading-relaxed">
                    Say hello to initiate peer-to-peer discussion!
                  </p>
                </div>
              ) : (
                activeChatMessages.map((msg, idx) => {
                  const isSentByMe = msg.senderId === currentUser.id;
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-[85%] ${
                        isSentByMe ? 'ml-auto flex-row-reverse' : 'mr-auto'
                      }`}
                    >
                      {/* Message avatar */}
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-8 h-8 rounded-lg object-cover border border-zinc-200 shrink-0 self-end mb-1"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1">
                        {/* Display Name for group channels */}
                        {activeChat.isGroup && !isSentByMe && (
                          <span className="text-[9px] text-zinc-400 font-bold block mb-0.5 ml-1 font-mono">
                            {msg.senderName}
                          </span>
                        )}

                        {/* Bubble and reaction trigger */}
                        <div className={`relative flex items-center gap-1.5 group ${isSentByMe ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-xs transition-all ${
                            isSentByMe 
                              ? 'bg-indigo-600 text-white rounded-br-none' 
                              : 'bg-zinc-105 dark:bg-zinc-805 text-zinc-800 dark:text-zinc-150 rounded-bl-none border border-zinc-200 dark:border-zinc-700/60'
                          }`}>
                            {msg.content}
                          </div>

                          {/* Hover emoji reaction launcher button */}
                          <div className="relative shrink-0">
                            <button
                              type="button"
                              onClick={() => setActiveEmojiPickerMsgId(activeEmojiPickerMsgId === msg.id ? null : msg.id)}
                              className="opacity-40 lg:opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition cursor-pointer text-[13px] leading-none"
                              title="React with reaction"
                            >
                              😊
                            </button>

                            {/* Floating emoji selection picker tray */}
                            <AnimatePresence>
                              {activeEmojiPickerMsgId === msg.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.85, y: 5 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.85, y: 5 }}
                                  className={`absolute z-45 bottom-full mb-1 p-1 flex items-center gap-1.5 rounded-full shadow-lg border bg-white dark:bg-zinc-850 border-zinc-200 dark:border-zinc-750 ${
                                    isSentByMe ? 'right-0' : 'left-0'
                                  }`}
                                >
                                  {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(emoji => {
                                    const reactors = msg.reactions?.[emoji] || [];
                                    const hasReacted = reactors.includes(currentUser.id);
                                    return (
                                      <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => {
                                          if (onToggleReaction) {
                                            onToggleReaction(msg.id, emoji);
                                          }
                                          setActiveEmojiPickerMsgId(null);
                                        }}
                                        className={`w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 text-sm transition scale-100 hover:scale-120 cursor-pointer active:scale-95 ${
                                          hasReacted ? 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-250' : ''
                                        }`}
                                      >
                                        {emoji}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Active reactions pill list under bubble */}
                        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                          <div className={`flex flex-wrap gap-1 mt-1.5 ${isSentByMe ? 'justify-end' : ''}`}>
                            {Object.entries(msg.reactions).map(([emoji, userIds]) => {
                              if (userIds.length === 0) return null;
                              const hasReacted = userIds.includes(currentUser.id);

                              const reactorNames = userIds.map(id => {
                                if (id === currentUser.id) return 'You';
                                return profiles.find(p => p.id === id)?.name || 'Classmate';
                              }).join(', ');

                              return (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => {
                                    if (onToggleReaction) {
                                      onToggleReaction(msg.id, emoji);
                                    }
                                  }}
                                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] transition-all cursor-pointer select-none ${
                                    hasReacted
                                      ? 'bg-indigo-100/65 border-indigo-300 text-indigo-750 dark:bg-indigo-950/30 dark:border-indigo-800 dark:text-indigo-300'
                                      : 'bg-zinc-100/80 border-zinc-200 text-zinc-650 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 hover:bg-zinc-150'
                                  }`}
                                  title={`Reacted by: ${reactorNames}`}
                                >
                                  <span>{emoji}</span>
                                  <span className="font-extrabold text-[9px]">{userIds.length}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Metadata line */}
                        <div className={`flex items-center gap-1 text-[8.5px] text-zinc-400 mt-1 ${isSentByMe ? 'justify-end' : ''}`}>
                          <Clock className="w-2.5 h-2.5" />
                          <span className="font-mono">
                            {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          {isSentByMe && (
                            <span className="text-emerald-500 font-bold ml-0.5 flex items-center">
                              <CheckCheck className="w-3 h-3 text-indigo-500 shrink-0" />
                              <span className="text-[8px] uppercase tracking-wide font-black">Sent</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messageEndRef} />
            </div>

            {/* Text message creation tool input */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-90 w-full shrink-0">
              {/* Messages quick-typing emojis keyboard tray */}
              <div className="flex gap-1 overflow-x-auto no-scrollbar pb-3 mb-2 justify-center border-b border-zinc-150/60 dark:border-zinc-800/65">
                {['😊', '👍', '❤️', '🔥', '😂', '😮', '😢', '🙌', '🎉', '🚀', '💡', '🎓', '💯', '👏', '👀', '📌', '💻', '📚', '🏆', '🌟', '🍿', '⚡', '🙏'].map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setTextInput(prev => prev + emoji)}
                    className="text-sm p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer scale-100 active:scale-95"
                    title={`Click to type ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(textInput);
                }}
                className="flex gap-2.5"
              >
                <input
                  type="text"
                  placeholder={`Write your peer update as ${currentUser.name}...`}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 border ${
                    isDark 
                      ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500' 
                      : 'bg-zinc-100 border-zinc-200 text-zinc-800 placeholder-zinc-400'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!textInput.trim()}
                  className="p-3 bg-indigo-600 text-white rounded-xl transition duration-150 flex items-center justify-center cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-750"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shadow-xs border border-zinc-200 dark:border-zinc-700">
              <MessageSquare className="w-8 h-8 stroke-1" />
            </div>
            <div className="text-center space-y-1.5 max-w-sm">
              <h3 className="text-xs font-black uppercase text-zinc-900 dark:text-white tracking-wider font-mono">No Active Chats Selected</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Start a private peer discussion or format a Study Group by tapping the <strong>Create</strong> button!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New conversation creation Modal */}
      <AnimatePresence>
        {showCreatorModal && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreatorModal(false)}
              className="fixed inset-0 bg-transparent/45 backdrop-blur-xs"
            />

            {/* Dialog Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className={`w-full max-w-md p-6 rounded-2xl shadow-2xl relative z-10 border ${
                isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-xs font-black uppercase text-zinc-900 dark:text-white tracking-widest font-mono">
                    Compose Message Lane
                  </h3>
                </div>
                <button
                  onClick={() => setShowCreatorModal(false)}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Toggle Conversation framework (Direct vs study group) */}
              <div className="flex items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-850 rounded-xl mb-4 text-xs font-bold shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setNewChatType('private');
                    setSelectedRecipientIds([]);
                  }}
                  className={`flex-1 text-center py-2 rounded-lg transition ${
                    newChatType === 'private'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  Private Thread
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewChatType('group');
                    setSelectedRecipientIds([]);
                  }}
                  className={`flex-1 text-center py-2 rounded-lg transition ${
                    newChatType === 'group'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  Assemble Study Group
                </button>
              </div>

              {/* Group Name input */}
              {newChatType === 'group' && (
                <div className="mb-4">
                  <label className="text-[10px] font-black uppercase text-zinc-400 block mb-1.5 font-mono">
                    Group Chat Name:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CSC 421 study cohort 📚"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 border ${
                      isDark ? 'bg-zinc-855 border-zinc-750 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  />
                </div>
              )}

              {/* Selection filter */}
              <div className="mb-3">
                <label className="text-[10px] font-black uppercase text-zinc-400 block mb-1.5 font-mono">
                  {newChatType === 'private' ? 'Select 1 Classmate:' : 'Choose Group participants (at least 2):'}
                </label>

                {/* Search members inside modal */}
                <div className="relative mb-2 shrink-0">
                  <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Filter names/department..."
                    value={creatorSearchQuery}
                    onChange={(e) => setCreatorSearchQuery(e.target.value)}
                    className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-[11px] font-semibold border focus:outline-hidden focus:ring-1 focus:ring-indigo-500 ${
                      isDark ? 'bg-zinc-850 border-zinc-750 text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-900'
                    }`}
                  />
                </div>

                <div className="max-h-[180px] overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800 border rounded-xl dark:border-zinc-800">
                  {profiles
                    .filter(p => p.id !== currentUser.id)
                    .filter(p => !creatorSearchQuery.trim() || p.name.toLowerCase().includes(creatorSearchQuery.toLowerCase()) || p.department.toLowerCase().includes(creatorSearchQuery.toLowerCase()))
                    .map((prof) => {
                      const isSelected = selectedRecipientIds.includes(prof.id);
                      
                      return (
                        <button
                          key={prof.id}
                          type="button"
                          onClick={() => handleToggleRecipientSelection(prof.id)}
                          className={`w-full p-2 text-left flex items-center justify-between transition cursor-pointer ${
                            isSelected 
                              ? 'bg-indigo-50/20 dark:bg-indigo-950/20' 
                              : 'hover:bg-zinc-50 dark:hover:bg-zinc-805/40'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img src={prof.avatar} alt={prof.name} className="w-8 h-8 rounded-lg object-cover" />
                            <div className="min-w-0">
                              <span className="text-xs font-bold block text-zinc-900 dark:text-zinc-150 truncate">
                                {prof.name}
                              </span>
                              <span className="text-[9px] text-zinc-400 font-bold block truncate">
                                {prof.level} • {prof.department}
                              </span>
                            </div>
                          </div>

                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition shrink-0 ${
                            isSelected 
                              ? 'bg-indigo-600 border-indigo-600 text-white' 
                              : 'border-zinc-300 dark:border-zinc-700'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white stroke-[3.5px]" />}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Footer action buttons */}
              <div className="flex gap-2.5 mt-5">
                <button
                  type="button"
                  onClick={() => setShowCreatorModal(false)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 text-center ${
                    isDark ? 'border-zinc-750 text-zinc-300' : 'border-zinc-200 text-zinc-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateConversation}
                  disabled={selectedRecipientIds.length === 0}
                  className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-lg transition font-black text-xs cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Initialize Lane
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Custom Close icon since some configurations might require it
function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2005/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
