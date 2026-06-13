/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Student' | 'Student Entrepreneurs' | 'Student Organizations' | 'Campus Creators' | 'Student Leaders';

export interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string; // 'Tech' | 'Business' | 'Design' | 'Creative' | 'Research'
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  stage: 'Idea' | 'MVP' | 'Launched';
  upvotes: string[]; // Student IDs who upvoted
  links?: SocialLinks;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  coverImage?: string;
  role: UserRole;
  faculty: string;
  department: string;
  level: string; // '100L' | '200L' | '300L' | '400L' | '500L' | '600L' | 'Postgrad'
  bio: string;
  interests: string[];
  skills: string[];
  projectsCount: number;
  socials: SocialLinks;
  verified?: boolean;
  savedPostIds?: string[]; // Added: curating saved library bookmarks
  points?: number; // Gamification points
  badges?: string[]; // Earned badges
  matricNo?: string; // Matriculation number
  verificationStatus?: 'unverified' | 'pending' | 'verified';
  orgRegCode?: string; // Registration number / CAC Student Affairs ID
  orgPatron?: string; // Faculty advisor / Patron Name
  orgDocType?: string; // Type of uploaded document
  orgDocBase64?: string; // Image/spec of uploaded document
  orgDescription?: string; // Brief description or aims for verification review
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // List of Student IDs
}

export interface Poll {
  question: string;
  options: PollOption[];
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  authorTag?: string; // e.g., "President", "Developer"
  content: string;
  image?: string;
  images?: string[]; // Multiple image support: array of base64 or urls
  category: 'Discussions' | 'Experiences' | 'Questions' | 'Announcements' | 'Opinions';
  poll?: Poll;
  likes: string[]; // Student IDs
  comments: Comment[];
  isPinned?: boolean;
  createdAt: string;
  reactions?: { [emoji: string]: string[] }; // emoji character -> array of studentProfile IDs
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
  parentId?: string; // Parent comment ID for nested replies
  likes?: string[]; // Array of student IDs who liked this comment
}

export interface Community {
  id: string;
  name: string;
  description: string;
  category: string; // 'Academic' | 'Professional' | 'Hobby' | 'Social'
  banner: string;
  logo: string;
  membersCount: number;
  members: string[]; // User IDs who joined
  rules?: string[];
  creatorId?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Internship' | 'Scholarship' | 'Competition' | 'Startup Role' | 'Volunteer';
  description: string;
  requirements: string[];
  deadline: string;
  postedBy: string; // User ID
  postedByName: string;
  applications: string[]; // User IDs who applied
  link?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  date: string;
  time: string;
  venue: string;
  category: string; // 'Academic' | 'Social' | 'Tech' | 'Gathering' | 'Religious'
  banner: string;
  rsvps: string[]; // User IDs attending
  capacity?: number;
  createdAt: string;
}

export interface AppState {
  profiles: StudentProfile[];
  posts: Post[];
  communities: Community[];
  opportunities: Opportunity[];
  events: Event[];
  projects: Project[];
  currentUser: StudentProfile;
  offlineMode: boolean;
  offlineQueue: any[]; // Operations waiting to sync
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  createdAt: string;
  reactions?: { [emoji: string]: string[] }; // emoji character -> array of pupil studentProfile IDs
}

export interface Chat {
  id: string;
  name?: string; // Group chat name, undefined for 1-to-1 DMs
  isGroup: boolean;
  memberIds: string[]; // List of StudentProfile.id
  avatar?: string; // Group chat image/avatar, or undefined for custom 1-on-1 calculations
  createdAt: string;
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'post_interaction' | 'event_rsvp' | 'mentorship_request' | 'announcement' | 'direct_message' | 'post_comment' | 'community_post' | 'upcoming_event' | 'opportunity_match';
  title: string;
  message: string;
  senderName: string;
  senderAvatar: string;
  targetId?: string;
  read: boolean;
  createdAt: string;
}

