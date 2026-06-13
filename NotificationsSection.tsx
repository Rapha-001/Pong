import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  CheckCheck, 
  Clock, 
  MessageSquare, 
  Calendar, 
  User, 
  Rocket, 
  AlertTriangle,
  Trophy,
  Briefcase,
  Compass,
  ArrowRight
} from 'lucide-react';
import { AppNotification, StudentProfile } from '../types';

interface NotificationsSectionProps {
  currentUser: StudentProfile;
  notifications: AppNotification[];
  profiles: StudentProfile[];
  onSetViewingProfile: (profile: StudentProfile) => void;
  onSaveNotifications: (updated: AppNotification[]) => void;
  onAddNotification: (notifObj: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
  onShowToast: (msg: string, type: 'success' | 'warn') => void;
  saveActiveUser: (updatedUser: StudentProfile) => void;
  onNotificationClick: (notif: AppNotification) => void;
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  currentUser,
  notifications,
  profiles,
  onSetViewingProfile,
  onSaveNotifications,
  onAddNotification,
  onShowToast,
  saveActiveUser,
  onNotificationClick
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'post_interaction' | 'event_rsvp' | 'mentorship_request'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    onSaveNotifications(updated);
    onShowToast("All notifications marked as read! 📚", "success");
  };

  const handleClearAll = () => {
    onSaveNotifications([]);
    onShowToast("Notification log cleared completely.", "warn");
  };

  const handleToggleRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: !n.read } : n);
    onSaveNotifications(updated);
  };

  const handleDelete = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    onSaveNotifications(updated);
    onShowToast("Notification removed.", "success");
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter !== 'all') return n.type === filter;
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Tab Header Dashboard */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center text-indigo-600">
              <Bell className="w-6 h-6 shrink-0" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50">Campus Notification Center</h2>
              <p className="text-xs text-zinc-550 dark:text-zinc-400 font-medium">
                Manage your real-time academic peer updates and system alerts ({unreadCount} unread)
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {notifications.length > 0 && (
              <>
                <button
                  onClick={handleMarkAllRead}
                  className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 border border-indigo-105/50"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark All Read</span>
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 border border-red-100/50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-zinc-150 dark:border-zinc-800">
          {(['all', 'unread', 'post_interaction', 'event_rsvp', 'mentorship_request'] as const).map(f => {
            const count = f === 'all' 
              ? notifications.length 
              : f === 'unread' 
              ? unreadCount 
              : notifications.filter(n => n.type === f).length;

            const labels: Record<string, string> = {
              all: 'All Logs',
              unread: 'Unread Only',
              post_interaction: 'Likes & Comments',
              event_rsvp: 'RSVPs & Attendance',
              mentorship_request: 'Mentorship Updates'
            };

            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition select-none cursor-pointer flex items-center gap-1.5 ${
                  filter === f
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
                }`}
              >
                <span>{labels[f]}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-extrabold ${filter === f ? 'bg-indigo-650 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-650'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main notifications list (centered, full-width, no sidebar) */}
      <div className="max-w-4xl mx-auto space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl p-12 text-center space-y-3.5">
            <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-400">
              <Bell className="w-6 h-6 stroke-1" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-600 dark:text-zinc-400">No Notifications Found</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed mt-1">
                There are no updates matching '{filter}' filter right now.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-150 dark:divide-zinc-800">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onNotificationClick && onNotificationClick(notif)}
                className={`p-4 transition flex gap-3.5 relative group cursor-pointer ${
                  notif.read 
                    ? 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40' 
                    : 'bg-indigo-50/15 dark:bg-indigo-950/10 border-l-3 border-indigo-600 hover:bg-indigo-50/25 dark:hover:bg-indigo-950/20'
                }`}
              >
                <img
                  src={notif.senderAvatar}
                  alt={notif.senderName}
                  className="w-11 h-11 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 shrink-0 cursor-pointer hover:opacity-90 transition relative z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    const matched = profiles.find(p => p.name === notif.senderName);
                    if (matched) onSetViewingProfile(matched);
                  }}
                  referrerPolicy="no-referrer"
                />
                
                <div className="flex-1 min-w-0 pr-10 text-left">
                  <div className="flex items-center gap-2 pb-0.5">
                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      notif.type === 'post_interaction' 
                        ? 'bg-red-50 text-red-650 dark:bg-red-950/30 dark:text-red-405' 
                        : notif.type === 'event_rsvp'
                        ? 'bg-emerald-50 text-emerald-650 dark:bg-emerald-950/30 dark:text-emerald-405'
                        : notif.type === 'mentorship_request'
                        ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-405'
                        : 'bg-zinc-100 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}>
                      {notif.type.replace('_', ' ')}
                    </span>
                    <span className="text-[9px] text-zinc-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 mt-1">
                    {notif.title}
                  </h4>
                  
                  <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed font-sans mt-0.5 max-w-xl">
                    {notif.message}
                  </p>

                  {/* Mentorship request actions inline inside list */}
                  {notif.type === 'mentorship_request' && !notif.message.includes('Accepted') && !notif.message.includes('Declined') && (
                    <div className="flex gap-2 mt-2.5 relative z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = notifications.map(n => n.id === notif.id ? {
                            ...n,
                            read: true,
                            message: `Accepted request with ${n.senderName}! +15 points awarded! ✅`
                          } : n);
                          onSaveNotifications(updated);
                          
                          saveActiveUser({
                            ...currentUser,
                            points: (currentUser.points || 0) + 15
                          });
                          onShowToast(`Accepted mentoring with ${notif.senderName}! +15 pts added. 🤝`, 'success');
                        }}
                        className="text-[10px] uppercase tracking-wider font-extrabold bg-indigo-600 hover:bg-indigo-750 text-white px-3 py-1.5 rounded-lg transition cursor-pointer shadow-3xs"
                      >
                        Accept request
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = notifications.map(n => n.id === notif.id ? {
                            ...n,
                            read: true,
                            message: `Declined request with ${n.senderName}. ✕`
                          } : n);
                          onSaveNotifications(updated);
                          onShowToast(`Declined mentoring request.`, 'warn');
                        }}
                        className="text-[10px] uppercase tracking-wider font-extrabold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-350 px-3 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        Ignore
                      </button>
                    </div>
                  )}
                </div>

                {/* Individual actions hovering overlay */}
                <div className="absolute right-3.5 top-3.5 flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleRead(notif.id);
                    }}
                    className="p-1.5 bg-zinc-50 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-zinc-450 hover:text-indigo-650 rounded-lg transition border border-zinc-200 dark:border-zinc-700"
                    title={notif.read ? "Mark as unread" : "Mark as read"}
                  >
                    <Check className={`w-3.5 h-3.5 ${notif.read ? 'text-zinc-400' : 'text-indigo-600'}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notif.id);
                    }}
                    className="p-1.5 bg-zinc-50 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-455 hover:text-red-500 rounded-lg transition border border-zinc-200 dark:border-zinc-700"
                    title="Delete permanent record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
