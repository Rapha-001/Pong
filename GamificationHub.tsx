import React, { useState, useEffect } from 'react';
import { StudentProfile } from '../types';
import { 
  Trophy, 
  HelpCircle, 
  CheckCircle, 
  X, 
  RefreshCw, 
  Search, 
  Award, 
  Zap, 
  Vote, 
  Eye, 
  Clock, 
  MessageSquare, 
  ChevronRight, 
  ChevronLeft,
  TrendingUp, 
  Send, 
  Share2, 
  Coins, 
  Users,
  AlertCircle,
  Volume2,
  BookOpen,
  MapPin,
  Sparkles,
  ClipboardList,
  Gamepad2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GamificationHubProps {
  currentUser: StudentProfile;
  onUpdateCurrentUser: (updatedUser: StudentProfile) => void;
  onShowToast: (msg: string, type?: 'info' | 'warn' | 'success') => void;
  theme?: string;
}

// ----------------------------------------------------------------------
// DEFINITION MODELS & CONFIGURATION TABLES
// ----------------------------------------------------------------------

interface FacultyScore {
  name: string;
  emoji: string;
  color: string;
  knowledgePoints: number;
  activityPoints: number;
  contentPoints: number;
  challengePoints: number;
  popularityPoints: number;
  totalPoints: number;
}

const INITIAL_FACULTIES: FacultyScore[] = [
  { name: "Engineering & Technology", emoji: "⚙️", color: "from-blue-600 to-indigo-650", knowledgePoints: 2450, activityPoints: 3100, contentPoints: 1800, challengePoints: 2950, popularityPoints: 2100, totalPoints: 12400 },
  { name: "Basic Medical Sciences", emoji: "🩺", color: "from-teal-600 to-emerald-600", knowledgePoints: 2100, activityPoints: 2200, contentPoints: 2100, challengePoints: 2400, popularityPoints: 2800, totalPoints: 11600 },
  { name: "Science", emoji: "🔬", color: "from-purple-600 to-pink-600", knowledgePoints: 2800, activityPoints: 2000, contentPoints: 1900, challengePoints: 2500, popularityPoints: 2000, totalPoints: 11200 },
  { name: "Social Sciences", emoji: "📊", color: "from-amber-500 to-orange-600", knowledgePoints: 1900, activityPoints: 2500, contentPoints: 2300, challengePoints: 1800, popularityPoints: 1900, totalPoints: 10400 },
  { name: "Law", emoji: "⚖️", color: "from-red-650 to-rose-800", knowledgePoints: 2305, activityPoints: 1600, contentPoints: 2200, challengePoints: 1500, popularityPoints: 2100, totalPoints: 9705 },
  { name: "Business Administration", emoji: "💼", color: "from-blue-500 to-cyan-500", knowledgePoints: 1500, activityPoints: 2800, contentPoints: 1700, challengePoints: 1900, popularityPoints: 1700, totalPoints: 9600 },
  { name: "Arts", emoji: "🎭", color: "from-indigo-500 to-purple-500", knowledgePoints: 1800, activityPoints: 1700, contentPoints: 2000, challengePoints: 1600, popularityPoints: 2200, totalPoints: 9300 },
  { name: "Agriculture", emoji: "🌾", color: "from-green-600 to-lime-600", knowledgePoints: 1600, activityPoints: 1900, contentPoints: 1400, challengePoints: 2100, popularityPoints: 1500, totalPoints: 8500 }
];

interface TriviaQuestion {
  id: string;
  category: 'heritage' | 'landmarks' | 'culture';
  question: string;
  options: string[];
  correctIdx: number;
  points: number;
  didYouKnow: string; // Forensic / Educational background note
}

const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  // Heritage & Lore
  {
    id: "t1",
    category: "heritage",
    question: "The University of Uyo was originally established in 1983 as what tertiary institution?",
    options: [
      "University of Cross River State (UNICROSS)",
      "Calabar State College of Technology",
      "Akwa Ibom State University of Science",
      "National Institute of Southern Nigeria"
    ],
    correctIdx: 0,
    points: 20,
    didYouKnow: "UniUyo was founded initially as the University of Cross River State (UNICROSS) by the military command of CRS in 1983, before being upgraded and renamed as a Federal university in October 1991."
  },
  {
    id: "t2",
    category: "heritage",
    question: "What are the official corporate academic colors representing UniUyo's dignity?",
    options: [
      "Blue and Gold",
      "Green and Gold",
      "Silver and Crimson",
      "Purple and White"
    ],
    correctIdx: 1,
    points: 15,
    didYouKnow: "Green represents Akwa Ibom's agricultural wealth and lush vegetation, while Gold signifies our rich educational treasures, academic excellence, and resilience."
  },
  {
    id: "t5",
    category: "heritage",
    question: "Who is the legendary mascot of Uyo, representing academic resilience?",
    options: [
      "The Falcon of Nwaniba",
      "The Uyo Lion",
      "The Golden Eagle",
      "The Forest Leopard"
    ],
    correctIdx: 1,
    points: 15,
    didYouKnow: "The Lion of UniUyo stands at main roundabouts as a direct symbol of fearless academic pursuits and raw intellectual strength."
  },

  // Landmarks & Spaces
  {
    id: "t3",
    category: "landmarks",
    question: "Which major road is the legendary UniUyo Town Campus situated on?",
    options: [
      "Nwaniba Road Corridor",
      "Ikpa Road Junction",
      "Abak Highway Area",
      "Oron Road District"
    ],
    correctIdx: 1,
    points: 15,
    didYouKnow: "The Town Campus is situated along busy Ikpa Road. It holds historical buildings, the historic Senate chambers, and older departments of Arts and Social Sciences."
  },
  {
    id: "t4",
    category: "landmarks",
    question: "What is the popular student acronym used for the Main Campus transit shuttles?",
    options: [
      "Keke Connect",
      "UniUyo Gallop",
      "Town-To-Permanent (T2P) Metro",
      "Uyo Campus Rider"
    ],
    correctIdx: 2,
    points: 20,
    didYouKnow: "T2P stands for 'Town to Permanent Site', denoting the critical transit network utilized by thousands who study between campuses daily."
  },
  {
    id: "l1",
    category: "landmarks",
    question: "Where is the legendary 'Blue Room' briefing center situated inside Town Campus?",
    options: [
      "The Main Library complex",
      "Vice Chancellor's Administrative Compound",
      "Faculty of Science Annex Block",
      "ETF Lecture Auditorium"
    ],
    correctIdx: 1,
    points: 20,
    didYouKnow: "The Blue Room is the primary high-profile executive briefing room found directly inside the historic Vice Chancellor's administrative estate."
  },

  // Uyo Campus Culture
  {
    id: "c1",
    category: "culture",
    question: "What does the common UniUyo student parlance 'Kopo' refer to?",
    options: [
      "A quick financial donation or borrowing",
      "The final year clearance ritual",
      "Buying low-cost roadside snack mix",
      "Staying up all night to study at the annex"
    ],
    correctIdx: 0,
    points: 15,
    didYouKnow: "'Kopo' refers to the student culture of combining resources or borrowing tiny coins to make ends meet before allowance day."
  },
  {
    id: "c2",
    category: "culture",
    question: "Which of these is historically dubbed 'The First Bank Lecture Theater'?",
    options: [
      "The multi-level lecture hall at Main Campus",
      "The engineering workshop theater",
      "The medical campus auditorium",
      "The arts campus drama center"
    ],
    correctIdx: 0,
    points: 15,
    didYouKnow: "The First Bank Lecture Theater has served generations of students as a primary examination and major symposium arena on Main Campus."
  }
];

interface OptionVote {
  id: string;
  text: string;
  percentage: number;
  votes: number;
}

interface ThisOrThatItem {
  id: string;
  category: 'social' | 'academic' | 'lifestyle';
  question: string;
  optionA: OptionVote;
  optionB: OptionVote;
  isUserSubmitted?: boolean;
}

const INITIAL_THIS_OR_THAT: ThisOrThatItem[] = [
  {
    id: "tot1",
    category: "lifestyle",
    question: "Which of these represents the quintessential student accommodation experience in Uyo?",
    optionA: { id: "a", text: "Hostel Life (Town Campus / Permanent Site)", percentage: 58, votes: 342 },
    optionB: { id: "b", text: "Off-Campus Living (Ikpa / Nwaniba road apartments)", percentage: 42, votes: 247 }
  },
  {
    id: "tot2",
    category: "academic",
    question: "What is your preferred battleground for grading?",
    optionA: { id: "a", text: "Continuous Assessment & Practical Assignments", percentage: 71, votes: 495 },
    optionB: { id: "b", text: "Three-Hour Main Exams hall showdown", percentage: 29, votes: 205 }
  },
  {
    id: "tot3",
    category: "social",
    question: "When is your absolute peak time to absorb intense academic lectures?",
    optionA: { id: "a", text: "Morning Lectures (8:00 AM - 11:00 AM)", percentage: 34, votes: 254 },
    optionB: { id: "b", text: "Afternoon Classes (2:00 PM - 5:00 PM)", percentage: 66, votes: 498 }
  },
  {
    id: "tot4",
    category: "lifestyle",
    question: "Which campus environment speaks directly to your student soul?",
    optionA: { id: "a", text: "Town Campus (Traditional, centrally located, historic trees)", percentage: 54, votes: 311 },
    optionB: { id: "b", text: "Main Campus / Permanent Site (Nwaniba - modern, massive, serene)", percentage: 46, votes: 265 }
  },
  {
    id: "tot5",
    category: "lifestyle",
    question: "What is the ultimate campus transportation convenience?",
    optionA: { id: "a", text: "The classic UniUyo Campus Bus transit system", percentage: 62, votes: 390 },
    optionB: { id: "b", text: "The nimble and direct Keke Napep (Tricycle)", percentage: 38, votes: 239 }
  }
];

interface DiskReward {
  id: number;
  text: string;
  color: string;
  rewardType: 'points' | 'badge' | 'multiplier' | 'nothing';
  value: number;
  odds: string;
}

const SPIN_REWARDS: DiskReward[] = [
  { id: 0, text: "+10 Coins", color: "#4F46E5", rewardType: 'points', value: 10, odds: "40%" },
  { id: 1, text: "Double Multiplier (1h)", color: "#10B981", rewardType: 'multiplier', value: 2, odds: "15%" },
  { id: 2, text: "+50 Credits", color: "#F59E0B", rewardType: 'points', value: 50, odds: "10%" },
  { id: 3, text: "Fresh Luck tomorrow", color: "#EF4444", rewardType: 'nothing', value: 0, odds: "15%" },
  { id: 4, text: "+100 Elite XP", color: "#8B5CF6", rewardType: 'points', value: 100, odds: "5%" },
  { id: 5, text: "Fortune's Jewel Badge", color: "#EC4899", rewardType: 'badge', value: 1, odds: "5%" },
  { id: 6, text: "+20 Coins", color: "#22C55E", rewardType: 'points', value: 20, odds: "5%" },
  { id: 7, text: "+80 Gold XP", color: "#EAB308", rewardType: 'points', value: 80, odds: "5%" }
];

interface CaseFile {
  id: string;
  title: string;
  status: 'active' | 'solved' | 'locked';
  difficulty: 'Beginner' | 'Intermediate' | 'Hard';
  reward: string;
  synopsis: string;
  correctCulprit: string;
  costToUnlock?: number;
}

const MYSTERY_CASES: CaseFile[] = [
  {
    id: "case1",
    title: "The Mystery of the Missing Senate Mace",
    status: 'active',
    difficulty: "Intermediate",
    reward: "+150 Points & Chief Detective Badge",
    synopsis: "Yesterday during a high-stakes Senate intermission, the iconic Golden Mace disappeared from the VC administrative podium. Synthetic grease, size 42 shoe footprints, and green apple residue are the only leads left behind.",
    correctCulprit: "registrar staff"
  },
  {
    id: "case2",
    title: "The Haunted Chemistry Exam Leak",
    status: 'solved',
    difficulty: "Beginner",
    reward: "+75 Points",
    synopsis: "An advance copy of CHM 101 examinations was printed privately at midnight. It turned out to be a test page left in the tray by an over-enthusiastic trainee lab attendant who got credentials mixed up. Archival log closed.",
    correctCulprit: "lab trainee"
  },
  {
    id: "case3",
    title: "The Nwaniba Server Blackout Intrigue",
    status: 'locked',
    difficulty: "Hard",
    reward: "+300 Points & Cyber Shield Emblem",
    synopsis: "The main portal router went down during post-graduate course registration. Was it a mechanical surge, or a tactical bypass to alter the portal ledger database? Unlock to investigate forensic data logs.",
    correctCulprit: "portal engineer",
    costToUnlock: 50
  }
];

interface DetectiveClue {
  id: string;
  caseId: string;
  name: string;
  shortDesc: string;
  forensics: string;
  witnessTranscript: string;
  isCoreEvidence: boolean;
  unlockedByDefault: boolean;
}

const DETECTIVE_CLUES: DetectiveClue[] = [
  {
    id: "clue1",
    caseId: "case1",
    name: "The Smudged Engineering Lanyard",
    shortDesc: "A torn lanyard fragment covered in high-vis blue fibers.",
    forensics: "Surgical examination under UV light isolates high-density synthetic machinery grease. This compound is only distributed within the main Mechanical workshop in Engineering and the Senate elevator shaft pulleys.",
    witnessTranscript: "Caretaker Okon noted: 'I saw someone walking near the elevator shaft around 11:30 AM wearing standard lab attire, but they slipped through the service stairwell quickly.'",
    isCoreEvidence: true,
    unlockedByDefault: true
  },
  {
    id: "clue2",
    caseId: "case1",
    name: "The Kiosk Kopo Apple Receipt",
    shortDesc: "A supermarket receipt listing three organic green apples.",
    forensics: "The receipt represents low-residue organic fiber purchased from a Town Campus kiosk at 11:45 AM. Fingerprint ink indicates index ridges matching the Administrative Staff database.",
    witnessTranscript: "Vendor Mama Chisom: 'Yes, a clean-shaven fellow from the Registrar's clerical branch bought three apples. He had a size 42 boot on and spoke with extreme haste.'",
    isCoreEvidence: true,
    unlockedByDefault: true
  },
  {
    id: "clue3",
    caseId: "case1",
    name: "Red Mud Tracks back the Ravine",
    shortDesc: "Wet size 42 footprints leading down administrative stairwells.",
    forensics: "The soil consists of dense laterite clay found only behind the Main Administration Block ravine. Footprint spacing reveals a noticeable right-leg limp, matching orthopedic reports of administrative staff with mechanical backgrounds.",
    witnessTranscript: "Security Guard Effiong: 'I noticed a gentleman walking with a limp through the restricted admin ravine paths carrying an elongated canvas tube at noon. He claimed it was geological survey gear.'",
    isCoreEvidence: true,
    unlockedByDefault: false
  }
];

interface DetectiveTheory {
  id: string;
  detectiveName: string;
  detectiveAvatar: string;
  detectiveFaculty: string;
  content: string;
  upvotes: number;
  upvotedBy: string[];
  createdAt: string;
}

const INITIAL_THEORIES: DetectiveTheory[] = [
  {
    id: "dt1",
    detectiveName: "Chidi Obinna",
    detectiveAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
    detectiveFaculty: "Engineering-Tech",
    content: "The synthetic grease smudges match the exact viscosity of pulley service oils. The culprit used the Elevator Shaft maintenance corridor to bypass the main security gates. This isolates our search to staffers with mechanical keys!",
    upvotes: 24,
    upvotedBy: [],
    createdAt: "3 hrs ago"
  },
  {
    id: "dt2",
    detectiveName: "Emem Edet",
    detectiveAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    detectiveFaculty: "Medical Science",
    content: "Why green apples? It's highly rich in citric acid. Excellent for preserving shiny metal surfaces or removing grease quickly from hands. Someone needed a quick cleanse while escaping through the admin ravine corridor!",
    upvotes: 19,
    upvotedBy: [],
    createdAt: "5 hrs ago"
  }
];

// In-memory fallback map for environments with blocked/disabled localStorage
const memoryStorage = new Map<string, string>();

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
        return;
      }
    } catch (e) {
      console.warn(`Access to localStorage is denied/blocked for setItem(${key}):`, e);
    }
    memoryStorage.set(key, value);
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage !== null) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch (e) {
      console.warn(`Access to localStorage is denied/blocked for removeItem(${key}):`, e);
    }
    memoryStorage.delete(key);
  }
};

// Override the global localStorage reference for all logic in this file smoothly
const localStorage = safeLocalStorage;

// Helper to synthesize kinetic audio ticks for daily spin
const playTickSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(850, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Fail silently under iframe rules or blocked user interactions
  }
};

export default function GamificationHub({ 
  currentUser, 
  onUpdateCurrentUser, 
  onShowToast, 
  theme = 'light' 
}: GamificationHubProps) {
  const [activeSegment, setActiveSegment] = useState<'wars' | 'trivia' | 'tot' | 'spin' | 'detective' | 'arcade'>('wars');
  const isDark = theme === 'dark';

  // Local helper to parse JSON from localStorage with default value
  function getCachedOrFallback<T>(key: string, fallback: T): T {
    try {
      const val = localStorage.getItem(key);
      if (!val) return fallback;
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }

  // ----------------------------------------------------------------------
  // CO-RETAIN STATES
  // ----------------------------------------------------------------------
  const [faculties, setFaculties] = useState<FacultyScore[]>(() => {
    return getCachedOrFallback('uniuyo_faculties_scores', INITIAL_FACULTIES);
  });
  const [lastRalliedTime, setLastRalliedTime] = useState<string | null>(() => {
    return localStorage.getItem('uniuyo_last_rally_time');
  });

  // Knowledge / Trivia States
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>(() => {
    return getCachedOrFallback('uniuyo_trivia_selected_answers', {});
  });
  const [triviaFinished, setTriviaFinished] = useState<Record<string, boolean>>(() => {
    return getCachedOrFallback('uniuyo_trivia_finished', {});
  });
  const [triviaCategory, setTriviaCategory] = useState<'heritage' | 'landmarks' | 'culture'>('heritage');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [triviaStreak, setTriviaStreak] = useState<number>(() => {
    return getCachedOrFallback('uniuyo_trivia_streak', 1);
  });
  
  // Fact Overlay Modal for 'Did You Know?'
  const [activeFactNote, setActiveFactNote] = useState<string | null>(null);

  // This or That (Dilemmas) States
  const [thisOrThatList, setThisOrThatList] = useState<ThisOrThatItem[]>(() => {
    return getCachedOrFallback('uniuyo_tot_questions_v2', INITIAL_THIS_OR_THAT);
  });
  const [votedTotIds, setVotedTotIds] = useState<Record<string, 'optionA' | 'optionB'>>(() => {
    return getCachedOrFallback('uniuyo_voted_tot_ids', {});
  });
  const [totIndex, setTotIndex] = useState<number>(0);

  // Custom This or That Forms
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [customOptA, setCustomOptA] = useState<string>('');
  const [customOptB, setCustomOptB] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<'academic' | 'social' | 'lifestyle'>('lifestyle');
  const [showCustomTotForm, setShowCustomTotForm] = useState<boolean>(false);

  // Local comments talk stream per dilemma
  const [dilemmaComments, setDilemmaComments] = useState<Record<string, Array<{user: string; role: string; text: string; side: 'A' | 'B'}>>>(() => {
    const fallback: Record<string, any[]> = {
      tot1: [
        { user: "Praise Joseph", role: "Student Leaders", text: "Off-campus gives freedom! No hostel warden locking gates by 10 PM.", side: 'B' },
        { user: "Iniobong Willie", role: "Student", text: "But you pay three times the price in transport and utility bills! True campus life is in the hostels.", side: 'A' }
      ]
    };
    return getCachedOrFallback('uniuyo_tot_comments', fallback);
  });
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [commentSideChoice, setCommentSideChoice] = useState<'A' | 'B'>('A');

  // Daily Spin States
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(() => {
    return getCachedOrFallback('uniuyo_spin_streak', 4);
  });
  const [lastSpinTime, setLastSpinTime] = useState<string | null>(() => {
    return localStorage.getItem('uniuyo_last_spin_time');
  });
  const [wonPrizeText, setWonPrizeText] = useState<string | null>(null);
  const [isDoublePointsActive, setIsDoublePointsActive] = useState<boolean>(false);

  // Detective States
  const [activeCaseId, setActiveCaseId] = useState<string>('case1');
  const [mysteryCaseSolved, setMysteryCaseSolved] = useState<boolean>(() => {
    return getCachedOrFallback('uniuyo_case_solved_v2', false);
  });
  const [unlockedClueIds, setUnlockedClueIds] = useState<string[]>(() => {
    return getCachedOrFallback('uniuyo_unlocked_clue_ids', ['clue1', 'clue2']);
  });
  const [detectiveTheories, setDetectiveTheories] = useState<DetectiveTheory[]>(() => {
    return getCachedOrFallback('uniuyo_detective_theories_v2', INITIAL_THEORIES);
  });
  const [newTheoryInput, setNewTheoryInput] = useState<string>('');
  const [accusedSuspect, setAccusedSuspect] = useState<string>('');
  
  // Interactive Forensic Magnifier State
  const [magnifiedClue, setMagnifiedClue] = useState<DetectiveClue | null>(null);

  // Virtual Live Battle Log events ticker
  const [battlefeedLogs, setBattlefeedLogs] = useState<string[]>([
    "Kunle Animashaun (Engineering) spun the Daily Fortune Wheel and won +50 Credits!",
    "Aniekan Archibong (Science) resolved Course Heritage Trivia correctly (+20 PTS)",
    "Glory Udoh (Basic Medical Sciences) added the 'Oron road vs Ikpa transit' dilemma!",
    "Favour Moses (Law) solved 'Cabinet Mace Case #024' successfully! (+150 PTS)",
    "Idara Bassey (Business Admin) activated 2X hourly Battle booster rally!"
  ]);

  useEffect(() => {
    // Scroll logs automatically of battlefield contributions
    const interval = setInterval(() => {
      const depts = ["Engineering & Technology", "Basic Medical Sciences", "Law", "Science", "Business Administration"];
      const names = ["Ubong", "Etido", "Grace", "Uwem", "Ekemini", "Arit", "Victor", "Nisidiet"];
      const events = [
        "contributed 100 points via Hourly Booster Rally!",
        "unlocked forensic Clue #3 under Detective Board.",
        "answered a Landmarks Trivia correctly (+15 PTS)",
        "voted on Campus Transportation Dilemmas (+10 PTS)",
        "published a custom This-or-That dilemma successfully!"
      ];
      const randomDept = depts[Math.floor(Math.random() * depts.length)];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      
      const logLine = `${randomName} (${randomDept}) ${randomEvent}`;
      setBattlefeedLogs(prev => [logLine, ...prev.slice(0, 7)]);
    }, 12000);

    return () => clearInterval(interval);
  }, []);


  // ----------------------------------------------------------------------
  // POINT DISPATCH SERVICE ENGINE
  // ----------------------------------------------------------------------
  const contributeFacultyPoints = (points: number, battlefield: keyof FacultyScore) => {
    const finalPoints = isDoublePointsActive ? points * 2 : points;
    const userFaculty = currentUser.faculty || "Science";
    
    setFaculties(prev => {
      const updated = prev.map(f => {
        const matches = f.name.toLowerCase().includes(userFaculty.toLowerCase()) || 
                        userFaculty.toLowerCase().includes(f.name.toLowerCase());
        if (matches) {
          return {
            ...f,
            [battlefield]: (f[battlefield] as number) + finalPoints,
            totalPoints: f.totalPoints + finalPoints
          };
        }
        return f;
      });
      localStorage.setItem('uniuyo_faculties_scores', JSON.stringify(updated));
      return updated;
    });
  };

  const addPlayerPoints = (pts: number) => {
    const finalPts = isDoublePointsActive ? pts * 2 : pts;
    const nextPoints = (currentUser.points || 0) + finalPts;
    
    const updatedUser = {
      ...currentUser,
      points: nextPoints
    };
    onUpdateCurrentUser(updatedUser);
  };

  const addPlayerBadge = (badgeName: string) => {
    if (currentUser.badges?.includes(badgeName)) return;
    const nextBadges = [...(currentUser.badges || []), badgeName];
    const updatedUser = {
      ...currentUser,
      badges: nextBadges
    };
    onUpdateCurrentUser(updatedUser);
  };

  // ----------------------------------------------------------------------
  // COMPONENT ACTION HANDLERS
  // ----------------------------------------------------------------------

  // Houry Booster Rally
  const handleRallyFaculty = () => {
    const now = new Date();
    if (lastRalliedTime) {
      const lastRally = new Date(lastRalliedTime);
      const diffMs = now.getTime() - lastRally.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      if (diffHours < 1) {
        const remainingMinutes = Math.ceil(60 - (diffMs / (1000 * 60)));
        onShowToast(`Booster power is recharging. Feel free to rally in ${remainingMinutes} mins!`, 'warn');
        return;
      }
    }

    addPlayerPoints(25);
    contributeFacultyPoints(100, 'popularityPoints');
    localStorage.setItem('uniuyo_last_rally_time', now.toISOString());
    setLastRalliedTime(now.toISOString());
    onShowToast(`Rallied successfully! +25 PTS given. +100 Popularity added to your Faculty!`, 'success');
  };

  // Answer Campus Trivia MCQ
  const handleTriviaAnswer = (question: TriviaQuestion, optionIdx: number) => {
    if (triviaFinished[question.id]) return;

    setSelectedAnswers(prev => {
      const next = { ...prev, [question.id]: optionIdx };
      localStorage.setItem('uniuyo_trivia_selected_answers', JSON.stringify(next));
      return next;
    });

    setTriviaFinished(prev => {
      const next = { ...prev, [question.id]: true };
      localStorage.setItem('uniuyo_trivia_finished', JSON.stringify(next));
      return next;
    });

    const isCorrect = optionIdx === question.correctIdx;
    
    if (isCorrect) {
      addPlayerPoints(question.points);
      contributeFacultyPoints(question.points, 'knowledgePoints');
      onShowToast(`Correct theory! +${question.points} PTS credited to Department vault.`, "success");
      
      // Auto trigger Fact Modal to explain background properly
      setActiveFactNote(question.didYouKnow);
    } else {
      onShowToast("Incorrect theory deduction. The details are explained below!", "warn");
      // Still show Fact card to educate students properly
      setActiveFactNote(question.didYouKnow);
    }
  };

  const resetTrivia = () => {
    // Clear all answered questions inside selected category
    const questionsToClear = TRIVIA_QUESTIONS.filter(q => q.category === triviaCategory);
    
    setSelectedAnswers(prev => {
      const next = { ...prev };
      questionsToClear.forEach(q => delete next[q.id]);
      localStorage.setItem('uniuyo_trivia_selected_answers', JSON.stringify(next));
      return next;
    });

    setTriviaFinished(prev => {
      const next = { ...prev };
      questionsToClear.forEach(q => delete next[q.id]);
      localStorage.setItem('uniuyo_trivia_finished', JSON.stringify(next));
      return next;
    });

    setActiveQuestionIndex(0);
    onShowToast(`Reset completed! Challenge the '${triviaCategory}' division again.`, "info");
  };

  // Submit Dilemma Choice
  const handleTotVote = (totId: string, choice: 'optionA' | 'optionB') => {
    if (votedTotIds[totId]) return;

    setVotedTotIds(prev => {
      const next = { ...prev, [totId]: choice };
      localStorage.setItem('uniuyo_voted_tot_ids', JSON.stringify(next));
      return next;
    });

    setThisOrThatList(prev => {
      const next = prev.map(item => {
        if (item.id === totId) {
          const voteA = choice === 'optionA' ? item.optionA.votes + 1 : item.optionA.votes;
          const voteB = choice === 'optionB' ? item.optionB.votes + 1 : item.optionB.votes;
          const total = voteA + voteB;
          return {
            ...item,
            optionA: {
              ...item.optionA,
              votes: voteA,
              percentage: Math.round((voteA / total) * 100)
            },
            optionB: {
              ...item.optionB,
              votes: voteB,
              percentage: Math.round((voteB / total) * 100)
            }
          };
        }
        return item;
      });
      localStorage.setItem('uniuyo_tot_questions_v2', JSON.stringify(next));
      return next;
    });

    addPlayerPoints(10);
    contributeFacultyPoints(15, 'activityPoints');
    onShowToast("Verdict lodged! Feedback updated dynamically (+10 PTS).", "success");
  };

  // Custom Dilemmas Form Submission
  const handleCustomTotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || !customOptA.trim() || !customOptB.trim()) {
      onShowToast("Please populate all text fields completely.", "warn");
      return;
    }

    const newDilemma: ThisOrThatItem = {
      id: "tot_custom_" + Date.now(),
      category: customCategory,
      question: customQuestion.trim(),
      optionA: { id: "a", text: customOptA.trim(), percentage: 50, votes: 1 },
      optionB: { id: "b", text: customOptB.trim(), percentage: 50, votes: 1 },
      isUserSubmitted: true
    };

    const updated = [newDilemma, ...thisOrThatList];
    setThisOrThatList(updated);
    localStorage.setItem('uniuyo_tot_questions_v2', JSON.stringify(updated));
    
    // Clear forms
    setCustomQuestion('');
    setCustomOptA('');
    setCustomOptB('');
    setShowCustomTotForm(false);
    setTotIndex(0); // View their newly added card first!
    
    addPlayerPoints(25);
    contributeFacultyPoints(30, 'activityPoints');
    onShowToast("Interactive Dilemma launched on student feeds! +25 PTS.", "success");
  };

  // Add Comment on Dilemma Debate board
  const handleAddDebateComment = (e: React.FormEvent, itemId: string) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      user: currentUser.name,
      role: currentUser.role,
      text: newCommentText.trim(),
      side: commentSideChoice
    };

    const updatedComments = {
      ...dilemmaComments,
      [itemId]: [newComment, ...(dilemmaComments[itemId] || [])]
    };

    setDilemmaComments(updatedComments);
    localStorage.setItem('uniuyo_tot_comments', JSON.stringify(updatedComments));
    setNewCommentText('');
    addPlayerPoints(5);
    onShowToast("Argument filed onto the live debate log! (+5 PTS)", "success");
  };

  // Mechanical Dial Fortune Spin Spinner
  const handleFortuneSpin = () => {
    if (isSpinning) return;

    const now = new Date();
    if (lastSpinTime) {
      const lastSpin = new Date(lastSpinTime);
      const diffMs = now.getTime() - lastSpin.getTime();
      const diffHrs = diffMs / (1000 * 60 * 60);
      if (diffHrs < 24) {
        const remainingHrs = Math.floor(24 - diffHrs);
        const remainingMin = Math.ceil(60 - ((diffMs % 3600000) / 60000) % 60);
        onShowToast(`The wheel is cooling down! Spin again in ${remainingHrs}h ${remainingMin}m.`, 'warn');
        return;
      }
    }

    setIsSpinning(true);
    setWonPrizeText(null);

    // Pick a random reward index
    const randomIndex = Math.floor(Math.random() * SPIN_REWARDS.length);
    const segmentDegree = 360 / SPIN_REWARDS.length;
    // Calculate precise target rotation with kinetic 10-cycle revolutions (3600deg) 
    const finalDegree = 3600 + (360 - (randomIndex * segmentDegree)) - (segmentDegree / 2);
    setWheelRotation(finalDegree);

    // Dynamic mechanical tick audio play simulation
    let delay = 60;
    for (let i = 0; i < 28; i++) {
      setTimeout(() => {
        playTickSound();
      }, delay);
      delay += 55 + i * 11; // exponential deceleration slowdown
    }

    // Capture claim timeout
    setTimeout(() => {
      setIsSpinning(false);
      const reward = SPIN_REWARDS[randomIndex];
      
      if (reward.rewardType === 'points') {
        addPlayerPoints(reward.value);
        contributeFacultyPoints(reward.value, 'activityPoints');
      } else if (reward.rewardType === 'badge') {
        addPlayerBadge("Fortune's Favourite");
      } else if (reward.rewardType === 'multiplier') {
        setIsDoublePointsActive(true);
        onShowToast("Double Multiplier Active! Earn double values on ALL portal mini-games for 1 hour!", "success");
      }

      setWonPrizeText(`Claimed: ${reward.text}`);
      setLastSpinTime(now.toISOString());
      localStorage.setItem('uniuyo_last_spin_time', now.toISOString());
      
      const nextStreak = streakDays + 1 > 7 ? 1 : streakDays + 1;
      setStreakDays(nextStreak);
      localStorage.setItem('uniuyo_spin_streak', JSON.stringify(nextStreak));

      onShowToast(`Fortune logged: ${reward.text}! Progress tracked.`, "success");
    }, 3500);
  };

  // Investigative Clue Intel Purchase
  const unlockClueIntel = (clue: DetectiveClue) => {
    if (unlockedClueIds.includes(clue.id)) return;
    
    const cost = 30;
    const currentPoints = currentUser.points || 0;
    if (currentPoints < cost) {
      onShowToast("Insufficient player credits. Resolve daily quizzes to earn tokens first!", "warn");
      return;
    }

    // Deduct points and store status
    addPlayerPoints(-cost);
    const updated = [...unlockedClueIds, clue.id];
    setUnlockedClueIds(updated);
    localStorage.setItem('uniuyo_unlocked_clue_ids', JSON.stringify(updated));
    onShowToast(`Intel decoded! ${clue.name} unlocked. (-30 PTS)`, "success");
    setMagnifiedClue(clue); // immediately inspect
  };

  // Deduct Theory submission
  const handleTheorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTheoryInput.trim()) return;

    const userDept = currentUser.faculty || "Sciences";
    const newTheoryObj: DetectiveTheory = {
      id: "theory_" + Date.now(),
      detectiveName: currentUser.name,
      detectiveAvatar: currentUser.avatar,
      detectiveFaculty: userDept,
      content: newTheoryInput.trim(),
      upvotes: 0,
      upvotedBy: [],
      createdAt: "Just now"
    };

    const updated = [newTheoryObj, ...detectiveTheories];
    setDetectiveTheories(updated);
    localStorage.setItem('uniuyo_detective_theories_v2', JSON.stringify(updated));
    setNewTheoryInput('');

    addPlayerPoints(20);
    contributeFacultyPoints(30, 'contentPoints');
    onShowToast("Theory logged on investigation board! +20 PTS.", "success");
  };

  // Upvote other student theories
  const handleUpvoteTheory = (id: string) => {
    const updated = detectiveTheories.map(item => {
      if (item.id === id) {
        const hasVoted = item.upvotedBy.includes(currentUser.id);
        const upvoted = hasVoted 
          ? item.upvotedBy.filter(uId => uId !== currentUser.id)
          : [...item.upvotedBy, currentUser.id];
        return {
          ...item,
          upvotes: hasVoted ? item.upvotes - 1 : item.upvotes + 1,
          upvotedBy: upvoted
        };
      }
      return item;
    });

    setDetectiveTheories(updated);
    localStorage.setItem('uniuyo_detective_theories_v2', JSON.stringify(updated));
    onShowToast("Deduction upvoted!", "info");
  };

  // Accuse Case Verdict Solve Submission
  const handleAccuseSolveVerdict = (culprit: string) => {
    if (!culprit) return;
    const currentCase = MYSTERY_CASES.find(c => c.id === activeCaseId);
    if (!currentCase) return;

    if (culprit.toLowerCase() === currentCase.correctCulprit.toLowerCase()) {
      setMysteryCaseSolved(true);
      localStorage.setItem('uniuyo_case_solved_v2', 'true');
      addPlayerPoints(150);
      addPlayerBadge("Chief Detective 🕵️");
      contributeFacultyPoints(250, 'challengePoints');
      onShowToast("OUTSTANDING DEDUCTION! Case File Solved. +150 Points and Chief Detective badge issued!", "success");
    } else {
      onShowToast("Verdicts mismatch guards clues details. Recheck witnesses or purchase Clue #3 footprints!", "warn");
    }
  };

  // ----------------------------------------------------------------------
  // DUAL CATEGORY VARIABLES
  // ----------------------------------------------------------------------
  const categoryQuestions = TRIVIA_QUESTIONS.filter(q => q.category === triviaCategory);
  const activeQuestion = categoryQuestions[activeQuestionIndex] || categoryQuestions[0];
  const userSelectedAnswer = selectedAnswers[activeQuestion?.id];
  const answeredThisQuestion = triviaFinished[activeQuestion?.id];

  // SVG dynamic data calculations for Battlegrounds bar charts
  const maxFacultyPoints = Math.max(...faculties.map(f => f.totalPoints), 1);

  return (
    <div className={`space-y-6 ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`} id="uniuyo-gamification-hub-core">
      
      {/* VIBRANT SEASON STAGE BANNER */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-zinc-900 via-indigo-950 to-indigo-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute right-0 top-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 text-left z-10 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-amber-950 animate-pulse" />
              <span>UniUyo Arena (Defined Season 2)</span>
            </span>
            {isDoublePointsActive && (
              <span className="bg-emerald-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full animate-bounce">
                🔥 2X Points Active
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-400 shrink-0" />
            <span>Campus Arena &amp; Wars Portal</span>
          </h2>
          <p className="text-zinc-300 text-xs sm:text-sm max-w-xl leading-normal font-semibold">
            The games are officially defined and optimized! Test your Uyo knowledge, claim daily wheel fortunes, debate dilemmas, and decode mystery forensic cases. Every action powers your department battle rankings.
          </p>
        </div>

        {/* ACTIVE BALANCE CONTAINER */}
        <div className="flex gap-4 bg-white/5 border border-white/10 p-3.5 rounded-2xl shrink-0 z-10 font-mono">
          <div className="text-center px-2">
            <span className="text-[10px] text-zinc-400 uppercase block font-bold">Student Vault</span>
            <span className="text-lg font-black text-amber-400 flex items-center justify-center gap-1 mt-0.5">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{currentUser.points || 0}</span>
            </span>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center px-2">
            <span className="text-[10px] text-zinc-400 uppercase block font-bold">Rally Streaks</span>
            <span className="text-lg font-black text-emerald-400 block mt-0.5">🔥 {streakDays} Days</span>
          </div>
        </div>
      </div>

      {/* HORIZONTAL SEGMENT NAV BAR */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-xl no-scrollbar">
        {[
          { key: 'wars', label: 'Faculty Wars', icon: Trophy, badge: 'Ranks' },
          { key: 'trivia', label: 'Campus Trivia', icon: HelpCircle, badge: 'New Facts' },
          { key: 'tot', label: 'This or That', icon: Vote, badge: 'Debate' },
          { key: 'spin', label: 'Daily Spin', icon: RefreshCw, badge: 'Rewards' },
          { key: 'detective', label: 'Campus Detective', icon: Search, badge: 'Mystery File' },
          { key: 'arcade', label: 'Campus Arcade', icon: Gamepad2, badge: 'Play & Win' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSegment === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSegment(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-indigo-650 text-white shadow-md'
                  : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800 hover:text-zinc-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
              <span className={`text-[8px] px-1 py-0.2 rounded font-black upper ${isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700 dark:bg-zinc-800'}`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* RENDER ACTIVE CONSOLE FRAME */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSegment}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.12 }}
          className="space-y-6"
        >
          
          {/* ================================================================== */}
          {/* 1. FACULTY WARS CO-INTERFACE PANEL                                 */}
          {/* ================================================================== */}
          {activeSegment === 'wars' && (
            <div className="space-y-6" id="faculty-wars-console-defined">
              {/* Rally Faculty callout */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 dark:bg-zinc-900/40 dark:border-zinc-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full flex items-center justify-center text-lg shadow-sm shrink-0 font-bold">
                    ⚡
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-400 tracking-wider">Faculty War Hourly Booster</h4>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-450 leading-relaxed font-semibold">
                      Your chosen department needs popularity! Rally once every hour to deposit ranking boosts and claim 25 individual coins.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRallyFaculty}
                  className="bg-emerald-500 hover:bg-emerald-650 active:scale-95 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Boost '{currentUser.faculty || "Science"}'</span>
                </button>
              </div>

              {/* DEFINED INTERACTIVE SVG PERFORMANCE CHART */}
              <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow text-left space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-150 dark:border-zinc-800 pb-2.5">
                  <div>
                    <span className="text-[9px] uppercase font-mono font-black text-indigo-600">DEPARTMENT COMPARISON</span>
                    <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-100 mt-0.5">Faculty Standing Graph</h3>
                  </div>
                  <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950 text-[#4F46E5] font-black px-2 py-0.5 rounded uppercase font-mono">
                    Real-time SVG Ticker
                  </span>
                </div>

                {/* SVG Graph Drawing */}
                <div className="space-y-4 font-mono select-none">
                  {[...faculties].sort((a,b) => b.totalPoints - a.totalPoints).map((fac, idx) => {
                    const progressPercent = Math.max(5, (fac.totalPoints / maxFacultyPoints) * 100);
                    const isUserDept = currentUser.faculty?.toLowerCase().includes(fac.name.split(' ')[0].toLowerCase());
                    
                    return (
                      <div key={fac.name} className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="flex items-center gap-1.5 truncate">
                            <span className="text-zinc-400 font-bold">#{idx + 1}</span>
                            <span>{fac.emoji}</span>
                            <span className={isUserDept ? "text-indigo-650 dark:text-indigo-400 font-extrabold" : "text-zinc-700 dark:text-zinc-300"}>
                              {fac.name} {isUserDept && "(My Faculty)"}
                            </span>
                          </span>
                          <span className="text-zinc-900 dark:text-zinc-200 font-mono font-black">
                            {fac.totalPoints.toLocaleString()} PTS
                          </span>
                        </div>
                        
                        {/* Custom Animated Bar Track */}
                        <div className="w-full h-3.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden relative">
                          <motion.div 
                            className={`h-full rounded-full bg-gradient-to-r ${fac.color} relative`}
                            initial={{ width: "0%" }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          >
                            <span className="absolute right-2 top-0 text-[8px] font-black text-white uppercase tracking-widest font-mono align-baseline leading-normal">
                              {Math.round(progressPercent)}%
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TWO COLUMN LEADERBOARD AND REAL-TIME RANGES */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                
                {/* 5 BATTLEFIELDS INDEX INDEXED */}
                <div className="lg:col-span-2 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden shadow text-left">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700">
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">The Five Battlefields</h4>
                    <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Understand how every platform action converts into dynamic department points.</p>
                  </div>

                  <div className="divide-y divide-zinc-200 dark:divide-zinc-800 font-sans text-xs">
                    
                    <div className="p-4 flex items-start gap-3">
                      <span className="text-xl shrink-0 mt-0.5">📚</span>
                      <div>
                        <span className="font-bold text-zinc-900 dark:text-indigo-400 block pb-0.5">1. Knowledge War (Trivia Mastery)</span>
                        <p className="text-[11px] text-zinc-500 leading-normal font-semibold">
                          Acquired by completing Campus Trivia cards correctly. Contributes <strong className="text-indigo-600">+15 to +20 points</strong> each. The prevailing king department is <strong className="text-zinc-800 font-black">Science 🔬</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 flex items-start gap-3">
                      <span className="text-xl shrink-0 mt-0.5">⚡</span>
                      <div>
                        <span className="font-bold text-zinc-900 dark:text-teal-400 block pb-0.5">2. Popularity War (Student Rallies)</span>
                        <p className="text-[11px] text-zinc-500 leading-normal font-semibold">
                          Earned via hourly faculty booster button taps. Adds <strong className="text-teal-600">+100 popularity</strong> points to the department chart. Current leader: <strong className="text-zinc-800 font-black">Social Sciences 📊</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 flex items-start gap-3">
                      <span className="text-xl shrink-0 mt-0.5">🕸️</span>
                      <div>
                        <span className="font-bold text-zinc-900 dark:text-purple-400 block pb-0.5">3. Activity War (Login Spins)</span>
                        <p className="text-[11px] text-zinc-500 leading-normal font-semibold">
                          Fuelled by persistent daily fortune wheel actions. Yields <strong className="text-purple-600">+10 to +100</strong> points per wheel claimed. Key leader: <strong className="text-zinc-800 font-black">Basic Medical Sciences 🩺</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 flex items-start gap-3">
                      <span className="text-xl shrink-0 mt-0.5">✍️</span>
                      <div>
                        <span className="font-bold text-zinc-900 dark:text-amber-400 block pb-0.5">4. Content War (Interactions &amp; Debates)</span>
                        <p className="text-[11px] text-zinc-500 leading-normal font-semibold">
                          Fueled by launching custom This-or-That dilemma parameters or submitting verdict arguments. Yields <strong className="text-amber-600">+30 Action marks</strong>. Currently led by <strong className="text-zinc-800 font-black">Law ⚖️</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 flex items-start gap-3">
                      <span className="text-xl shrink-0 mt-0.5">🕵️</span>
                      <div>
                        <span className="font-bold text-zinc-900 dark:text-rose-400 block pb-0.5">5. Challenge War (Detective Investigations)</span>
                        <p className="text-[11px] text-zinc-500 leading-normal font-semibold">
                          Claimed by resolving mystery suspect case files. Resolving file #024 delivers a colossal <strong className="text-rose-600">+250 points</strong> to department coffers. Reigning lead: <strong className="text-zinc-800 font-black">Engineering ⚙️</strong>.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* LIVE CONTRIBUTION DRUM ACTIVITY */}
                <div className="space-y-4 text-left">
                  <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow space-y-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] uppercase font-black tracking-wider text-zinc-500 font-mono">Live Contribution Drum</span>
                    </div>
                    <div className="space-y-2 max-h-[290px] overflow-y-auto no-scrollbar font-mono text-[10px] leading-relaxed">
                      {battlefeedLogs.map((log, idx) => (
                        <div key={idx} className="p-2 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-150 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-400">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* END OF TERM CUP CARD */}
                  <div className="p-4 rounded-2xl bg-gradient-to-b from-indigo-50 to-indigo-100/40 border border-indigo-100 dark:from-zinc-900 dark:border-zinc-800 space-y-3">
                    <span className="text-[9px] uppercase font-mono font-black text-indigo-700 tracking-wider block">SEASON 2 FINALS CUP</span>
                    <h5 className="text-xs font-bold leading-snug">The Faculty Achievement Cup</h5>
                    <p className="text-[11px] text-zinc-500 font-medium">
                      At midnight on semester exams week, the department holding first position in overall score permanently mints the Gold Academic Trophy. All registered members receive the 'Championship Scholar' avatar ring plus 500 cataloged points!
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================================================================== */}
          {/* 2. CAMPUS TRIVIA CONSOLE (ROUND MECHANISM)                          */}
          {/* ================================================================== */}
          {activeSegment === 'trivia' && (
            <div className="space-y-6 text-left" id="campus-trivia-defined">
              
              {/* CATEGORY SELECTOR CHIPS */}
              <div className="flex gap-2.5 border-b border-zinc-200 dark:border-zinc-800 pb-3">
                {[
                  { key: 'heritage', label: 'Heritage & History', icon: BookOpen },
                  { key: 'landmarks', label: 'Landmarks & Spaces', icon: MapPin },
                  { key: 'culture', label: 'Uyo Campus Culture', icon: Sparkles }
                ].map((cat) => {
                  const CatIcon = cat.icon;
                  const isActive = triviaCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => {
                        setTriviaCategory(cat.key as any);
                        setActiveQuestionIndex(0);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-650 hover:bg-zinc-250 dark:hover:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      <CatIcon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* ACTIVE CONSOLE CARD */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* TRIVIA INTERACTION FRAME */}
                <div className="lg:col-span-2 p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow space-y-5">
                  <div className="flex justify-between items-center border-b border-zinc-150 dark:border-zinc-800 pb-3">
                    <div>
                      <span className="text-[9px] font-mono font-black text-indigo-650 uppercase">
                        CATEGORY: {triviaCategory.toUpperCase()} QUIZ
                      </span>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5">
                        Question {activeQuestionIndex + 1} of {categoryQuestions.length}
                      </h4>
                    </div>
                    <button 
                      onClick={resetTrivia}
                      className="text-[10px] font-extrabold text-zinc-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Clear Category Play</span>
                    </button>
                  </div>

                  {/* ACTIVE QUESTION PANEL */}
                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-55 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-150 dark:border-zinc-800">
                      <span className="text-[9px] font-mono font-black text-zinc-400 block uppercase">Deduction Objective</span>
                      <p className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-150 mt-1 leading-relaxed">
                        {activeQuestion.question}
                      </p>
                    </div>

                    {/* Options Stack */}
                    <div className="grid grid-cols-1 gap-2.5">
                      {activeQuestion.options.map((option, optIdx) => {
                        const isSelected = userSelectedAnswer === optIdx;
                        const isCorrect = activeQuestion.correctIdx === optIdx;
                        
                        let optionStyle = "bg-zinc-50 hover:bg-zinc-100 border-zinc-250 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700";
                        if (answeredThisQuestion) {
                          if (isCorrect) {
                            optionStyle = "bg-emerald-500 border-emerald-500 text-white font-black";
                          } else if (isSelected) {
                            optionStyle = "bg-red-500 border-red-500 text-white font-black animate-none";
                          } else {
                            optionStyle = "bg-zinc-50 opacity-55 border-zinc-200 text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800";
                          }
                        }

                        return (
                          <button
                            key={option}
                            disabled={answeredThisQuestion}
                            onClick={() => handleTriviaAnswer(activeQuestion, optIdx)}
                            className={`w-full p-4 rounded-xl text-left text-xs font-bold border transition ${optionStyle} ${!answeredThisQuestion ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed'}`}
                          >
                            <span className="font-mono text-zinc-400 mr-2 uppercase">[{String.fromCharCode(65 + optIdx)}]</span>
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* CAROUSEL FLOW CONTROLS */}
                  <div className="flex items-center justify-between border-t border-zinc-150 dark:border-zinc-800 pt-3">
                    <button
                      disabled={activeQuestionIndex === 0}
                      onClick={() => setActiveQuestionIndex(p => p - 1)}
                      className={`p-2 border border-zinc-205 dark:border-zinc-700 rounded-lg text-xs font-bold flex items-center gap-1 ${
                        activeQuestionIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    
                    <span className="text-[11px] text-zinc-450 italic font-medium">
                      Earnings multiplier active: x1
                    </span>

                    <button
                      disabled={activeQuestionIndex === categoryQuestions.length - 1}
                      onClick={() => setActiveQuestionIndex(p => p + 1)}
                      className={`p-2 border border-zinc-205 dark:border-zinc-700 rounded-lg text-xs font-bold flex items-center gap-1 ${
                        activeQuestionIndex === categoryQuestions.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer'
                      }`}
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* RIGHT: KNOWLEDGE TRUTH BOX / DID YOU KNOW? */}
                <div className="space-y-4">
                  <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow space-y-3">
                    <span className="text-[9px] uppercase font-mono font-black text-indigo-600 tracking-wider">
                      LOREMASTER FORENSIC BOARD
                    </span>
                    <h4 className="text-xs font-bold leading-snug">Did You Know? (Historical Fact)</h4>
                    {activeFactNote ? (
                      <p className="text-[11px] text-zinc-500 leading-relaxed font-semibold bg-indigo-50/40 dark:bg-zinc-800/40 p-3 rounded-lg border border-indigo-100/50 dark:border-zinc-805">
                        {activeFactNote}
                      </p>
                    ) : (
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-dashed border-zinc-200 text-center text-zinc-400">
                        <span className="text-2xl block mb-1">📖</span>
                        <p className="text-[11px] font-semibold">Answer any question in the category dashboard to unlock its historical, educational academic note!</p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100/40 border border-amber-100 dark:from-zinc-900 dark:border-zinc-800 space-y-2">
                    <h5 className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-400 font-mono flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Loremaster Milestones</span>
                    </h5>
                    <p className="text-[11px] text-zinc-650 dark:text-zinc-400 leading-normal font-semibold">
                      Answering all 8 campus division catalog questions correctly unlocks the prestigious <strong className="text-amber-800 dark:text-amber-400">"Uyo Loremasters Badge"</strong> medal directly on your profile capsule.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================================================================== */}
          {/* 3. THIS OR THAT DILEMMAS & COMMENTARY DEBATES                      */}
          {/* ================================================================== */}
          {activeSegment === 'tot' && (
            <div className="max-w-4xl mx-auto space-y-6 text-left" id="this-or-that-defined">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* MAIN DILEMMA DISPLAY */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-md space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-805 pb-2.5">
                      <div>
                        <span className="text-[9px] uppercase font-mono font-black text-emerald-600 block">CAMPUS Dilemma CARD</span>
                        <h3 className="text-xs font-bold text-zinc-850 mt-0.5 dark:text-white">
                          Card {totIndex + 1} of {thisOrThatList.length}
                        </h3>
                      </div>
                      
                      <button
                        onClick={() => setShowCustomTotForm(p => !p)}
                        className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <span>{showCustomTotForm ? "✖ Close Creator" : "✍ Submit My Dilemma"}</span>
                      </button>
                    </div>

                    {/* CREATION FORM OVERLAY */}
                    {showCustomTotForm ? (
                      <form onSubmit={handleCustomTotSubmit} className="p-4 bg-zinc-55 bg-zinc-50 dark:bg-zinc-800 rounded-xl space-y-3.5 border border-zinc-200 dark:border-zinc-700">
                        <span className="text-[10px] font-black uppercase text-indigo-650 block">Dilemma Creator Box</span>
                        
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-zinc-400 block uppercase">Question Parameter</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Which route has the ultimate beautiful student scenery?"
                            value={customQuestion}
                            onChange={e => setCustomQuestion(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-700 px-3 py-2 rounded-lg text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-zinc-400 block uppercase">Option A description</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Walking Ikpa corridor"
                              value={customOptA}
                              onChange={e => setCustomOptA(e.target.value)}
                              className="w-full bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-700 px-3 py-2 rounded-lg text-xs"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-zinc-400 block uppercase">Option B description</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Riding Permanent site shuttles"
                              value={customOptB}
                              onChange={e => setCustomOptB(e.target.value)}
                              className="w-full bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-700 px-3 py-2 rounded-lg text-xs"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <div className="flex gap-2 items-center text-xs">
                            <span className="text-zinc-450 text-[10px] font-bold uppercase">Category:</span>
                            <select
                              value={customCategory}
                              onChange={e => setCustomCategory(e.target.value as any)}
                              className="bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-700 px-2.5 py-1 rounded text-xs"
                            >
                              <option value="lifestyle">Lifestyle</option>
                              <option value="academic">Academic</option>
                              <option value="social">Social</option>
                            </select>
                          </div>

                          <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Publish to Feed (+25 PTS)</span>
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="py-2">
                          <p className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-150 max-w-xl leading-normal">
                            {thisOrThatList[totIndex].question}
                          </p>
                        </div>

                        {/* Interactive Voting Options */}
                        <div className="grid grid-cols-1 gap-3.5">
                          {/* Option A */}
                          {(() => {
                            const item = thisOrThatList[totIndex];
                            const voted = votedTotIds[item.id];
                            const alreadyVoted = !!voted;
                            const isChosen = voted === 'optionA';

                            return (
                              <div className="relative">
                                <button
                                  disabled={alreadyVoted}
                                  onClick={() => handleTotVote(item.id, 'optionA')}
                                  className={`w-full p-4 rounded-xl text-left font-bold text-xs relative overflow-hidden transition-all flex justify-between items-center ${
                                    alreadyVoted
                                      ? isChosen
                                        ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-950 dark:bg-zinc-800 dark:text-indigo-400'
                                        : 'bg-zinc-50 border border-zinc-200 opacity-60 dark:bg-zinc-800/40 text-zinc-405'
                                      : 'bg-zinc-50 border border-zinc-250 dark:bg-zinc-800 hover:bg-indigo-50/50 dark:hover:bg-zinc-750 hover:border-indigo-500 text-zinc-800 dark:text-zinc-200 cursor-pointer'
                                  }`}
                                >
                                  {alreadyVoted && (
                                    <div 
                                      className="absolute left-0 top-0 bottom-0 bg-indigo-500/10 dark:bg-indigo-400/15 transition-all duration-500 pointer-events-none"
                                      style={{ width: `${item.optionA.percentage}%` }}
                                    />
                                  )}
                                  <span className="z-10 truncate">{item.optionA.text}</span>
                                  {alreadyVoted && (
                                    <span className="z-10 font-mono text-zinc-900 dark:text-zinc-100 font-black">
                                      {item.optionA.percentage}% ({item.optionA.votes} votes)
                                    </span>
                                  )}
                                </button>
                              </div>
                            );
                          })()}

                          {/* Option B */}
                          {(() => {
                            const item = thisOrThatList[totIndex];
                            const voted = votedTotIds[item.id];
                            const alreadyVoted = !!voted;
                            const isChosen = voted === 'optionB';

                            return (
                              <div className="relative">
                                <button
                                  disabled={alreadyVoted}
                                  onClick={() => handleTotVote(item.id, 'optionB')}
                                  className={`w-full p-4 rounded-xl text-left font-bold text-xs relative overflow-hidden transition-all flex justify-between items-center ${
                                    alreadyVoted
                                      ? isChosen
                                        ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 dark:bg-zinc-800 dark:text-emerald-400'
                                        : 'bg-zinc-50 border border-zinc-200 opacity-60 dark:bg-zinc-850/40 text-zinc-405'
                                      : 'bg-zinc-50 border border-zinc-250 dark:bg-zinc-800 hover:bg-emerald-50/50 dark:hover:bg-zinc-750 hover:border-emerald-500 text-zinc-800 dark:text-zinc-200 cursor-pointer'
                                  }`}
                                >
                                  {alreadyVoted && (
                                    <div 
                                      className="absolute left-0 top-0 bottom-0 bg-emerald-500/10 dark:bg-emerald-400/15 transition-all duration-500 pointer-events-none"
                                      style={{ width: `${item.optionB.percentage}%` }}
                                    />
                                  )}
                                  <span className="z-10 truncate">{item.optionB.text}</span>
                                  {alreadyVoted && (
                                    <span className="z-10 font-mono text-zinc-900 dark:text-zinc-100 font-black">
                                      {item.optionB.percentage}% ({item.optionB.votes} votes)
                                    </span>
                                  )}
                                </button>
                              </div>
                            );
                          })()}

                        </div>
                      </div>
                    )}

                    {/* INDEX BAR PAGINATORS */}
                    <div className="flex items-center justify-between border-t border-zinc-150 dark:border-zinc-800 pt-3">
                      <button
                        onClick={() => setTotIndex(prev => (prev > 0 ? prev - 1 : thisOrThatList.length - 1))}
                        className="p-2 border border-zinc-205 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-bold font-mono text-zinc-650 cursor-pointer"
                      >
                        Previous
                      </button>
                      <span className="text-[11px] text-zinc-450 italic font-semibold">Earn +10 PTS per dilemma resolved!</span>
                      <button
                        onClick={() => setTotIndex(prev => (prev < thisOrThatList.length - 1 ? prev + 1 : 0))}
                        className="p-2 border border-zinc-205 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-bold font-mono text-zinc-650 cursor-pointer"
                      >
                        Next Card
                      </button>
                    </div>
                  </div>
                </div>

                {/* DEBATE Backlog Comments Column */}
                <div className="space-y-4">
                  <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow space-y-3">
                    <div className="flex justify-between items-center border-b border-zinc-150 dark:border-zinc-800 pb-2">
                      <span className="text-[9px] uppercase font-mono font-black text-[#4F46E5]">Debate Commentary</span>
                      <span className="text-[9px] uppercase font-bold text-zinc-400">Verdicts live</span>
                    </div>

                    <div className="space-y-2.5 max-h-[190px] overflow-y-auto no-scrollbar">
                      {(dilemmaComments[thisOrThatList[totIndex].id] || []).length > 0 ? (
                        (dilemmaComments[thisOrThatList[totIndex].id] || []).map((comm, idx) => (
                          <div key={idx} className="p-2.5 bg-zinc-55 bg-zinc-50 dark:bg-zinc-800 rounded-xl space-y-1 text-xs">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span className="text-zinc-800 dark:text-zinc-200">{comm.user} ({comm.role})</span>
                              <span className={comm.side === 'A' ? 'text-indigo-650 font-black' : 'text-emerald-700 font-black'}>
                                voted {comm.side === 'A' ? 'A' : 'B'}
                              </span>
                            </div>
                            <p className="text-zinc-505 leading-normal dark:text-zinc-400 text-[11px] font-semibold">
                              {comm.text}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-zinc-400 font-semibold text-[11px] placeholder-box">
                          No commentary comments posted yet! Write yours to kick off the debate.
                        </div>
                      )}
                    </div>

                    {/* Submit commenting */}
                    <form onSubmit={(e) => handleAddDebateComment(e, thisOrThatList[totIndex].id)} className="pt-2 border-t border-zinc-150 dark:border-zinc-800 space-y-2">
                      <textarea
                        required
                        placeholder="State your side logic..."
                        value={newCommentText}
                        onChange={e => setNewCommentText(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-850 border border-zinc-350 dark:border-zinc-700 px-2.5 py-1.5 rounded-lg text-xs"
                        rows={2}
                      />
                      
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setCommentSideChoice('A')}
                            className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                              commentSideChoice === 'A' ? 'bg-indigo-650 text-white' : 'bg-zinc-100 text-zinc-500'
                            }`}
                          >
                            Choice A
                          </button>
                          <button
                            type="button"
                            onClick={() => setCommentSideChoice('B')}
                            className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                              commentSideChoice === 'B' ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-500'
                            }`}
                          >
                            Choice B
                          </button>
                        </div>

                        <button type="submit" className="bg-zinc-900 dark:bg-zinc-700 hover:bg-zinc-800 text-white font-extrabold text-[9px] px-3 py-1.5 rounded-lg flex items-center gap-1">
                          <Send className="w-2.5 h-2.5" />
                          <span>Publish (+5)</span>
                        </button>
                      </div>
                    </form>

                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================================================================== */}
          {/* 4. DAILY SPIN fortune panel (Web Audio tick support)              */}
          {/* ================================================================== */}
          {activeSegment === 'spin' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left items-center justify-center max-w-4xl mx-auto" id="daily-spin-defined">
              
              {/* Graphic Wheel control panel */}
              <div className="flex flex-col items-center justify-center space-y-5">
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 select-none">
                  
                  {/* Outer glowing border ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-500 blur-md opacity-40 animate-pulse pointer-events-none" />
                  
                  {/* Spinning wheel graphics */}
                  <motion.div
                    className="w-full h-full rounded-full border-4 border-indigo-600 shadow-2xl relative overflow-hidden"
                    animate={{ rotate: wheelRotation }}
                    transition={isSpinning ? { duration: 3.5, ease: "easeOut" } : { duration: 0 }}
                    style={{ transformOrigin: 'center' }}
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {SPIN_REWARDS.map((rew, idx) => {
                        const angle = 360 / SPIN_REWARDS.length;
                        const startAngle = idx * angle;
                        const radians = ((startAngle - 90) * Math.PI) / 180;
                        const endAngle = (idx + 1) * angle;
                        const radiansEnd = ((endAngle - 90) * Math.PI) / 180;
                        
                        const x1 = 50 + 50 * Math.cos(radians);
                        const y1 = 50 + 50 * Math.sin(radians);
                        const x2 = 50 + 50 * Math.cos(radiansEnd);
                        const y2 = 50 + 50 * Math.sin(radiansEnd);
                        
                        // Text transformation coordinates
                        const textAngle = startAngle + angle / 2;
                        const textRad = ((textAngle - 90) * Math.PI) / 180;
                        const tx = 50 + 32 * Math.cos(textRad);
                        const ty = 50 + 32 * Math.sin(textRad);
                        
                        return (
                          <g key={rew.id}>
                            <path
                              d={`M50,50 L${x1},${y1} A50,50 0 0,1 ${x2},${y2} Z`}
                              fill={rew.color}
                              className="stroke-[0.4] stroke-white/20"
                            />
                            <text
                              x={tx}
                              y={ty}
                              transform={`rotate(${textAngle}, ${tx}, ${ty})`}
                              fill="white"
                              fontSize="3.1"
                              fontWeight="black"
                              textAnchor="middle"
                            >
                              {rew.text.split(' ')[0]} {rew.text.split(' ')[1] || ""}
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    {/* Wheel pointer center logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white border-4 border-indigo-600 shadow-lg flex items-center justify-center font-black text-indigo-750 font-mono text-[10px] z-10">
                        SPIN
                      </div>
                    </div>
                  </motion.div>

                  {/* Top Arrow Pointer Accent */}
                  <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[18px] border-t-indigo-600 z-25 pointer-events-none drop-shadow" />
                </div>

                <div className="space-y-1.5 text-center">
                  <button
                    disabled={isSpinning}
                    onClick={handleFortuneSpin}
                    className={`px-8 py-3.5 rounded-xl font-black text-xs tracking-wider uppercase border shadow ${
                      isSpinning
                        ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed border-zinc-200'
                        : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 cursor-pointer hover:scale-105 active:scale-95 transition'
                    }`}
                  >
                    {isSpinning ? "Fortune Dial Spinning..." : "Claim Daily Fortune Spin!"}
                  </button>
                  <span className="text-[10px] text-zinc-400 block font-semibold">Ticking noise synthesizes hourly kinetic torque.</span>
                </div>
              </div>

              {/* Progress Log panel and reward odds table */}
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow text-left space-y-3.5">
                  <div className="border-b border-zinc-150 dark:border-zinc-800 pb-2 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] uppercase font-mono font-black text-amber-500">7-DAY LOYALTY CALENDAR</span>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Fortune Spin Streak</h4>
                    </div>
                    <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2.5 py-0.5 rounded-full font-sans">Streak Day {streakDays}</span>
                  </div>

                  <p className="text-zinc-505 dark:text-zinc-400 text-xs leading-relaxed font-semibold">
                    Activate the dial once every 24 hours to keep the loyalty engine spinning. Reaching Day 7 rewards a direct gold multiplier buffer injection!
                  </p>

                  {wonPrizeText && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center gap-2.5"
                    >
                      <span className="text-xl">🎉</span>
                      <div>
                        <span className="text-[9px] font-black uppercase block font-mono">Vault Addition Successful</span>
                        <p className="text-xs font-extrabold text-zinc-850 dark:text-zinc-200">{wonPrizeText}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Day tracker icons */}
                  <div className="grid grid-cols-7 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                      const isCompleted = num <= streakDays;
                      const isNext = num === streakDays + 1;
                      
                      return (
                        <div key={num} className="text-center font-mono">
                          <div className={`h-8 rounded-lg flex items-center justify-center text-xs font-bold border transition ${
                            isCompleted 
                              ? 'bg-amber-500 border-amber-500 text-white shadow-xs' 
                              : isNext 
                              ? 'bg-white border-dashed border-amber-500 text-amber-550 animate-pulse' 
                              : 'bg-zinc-50 border-zinc-200 text-zinc-350 dark:bg-zinc-800 dark:border-zinc-800'
                          }`}>
                            {isCompleted ? "✔" : num}
                          </div>
                          <span className="text-[8px] text-zinc-400 block mt-1 font-bold">Day {num}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Odds transparency table */}
                <div className="p-4 border border-zinc-200 dark:border-zinc-805 bg-white dark:bg-zinc-900 rounded-2xl text-[11px] space-y-2">
                  <h5 className="font-bold text-zinc-800 dark:text-zinc-200 uppercase text-[10px] tracking-wider font-mono">Fortune Reward Matrix (Odds)</h5>
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 max-w-sm text-zinc-500 font-semibold font-mono text-[10px]">
                    <div className="flex justify-between border-b pb-1"><span>🎯 +10 Coins</span> <span className="text-zinc-900 dark:text-zinc-350 font-bold">40% Odds</span></div>
                    <div className="flex justify-between border-b pb-1"><span>🔥 Double Multiplier</span> <span className="text-zinc-900 dark:text-zinc-350 font-bold">15% Odds</span></div>
                    <div className="flex justify-between border-b pb-1"><span>💎 +100 Elite XP</span> <span className="text-zinc-900 dark:text-zinc-350 font-bold">5% Odds</span></div>
                    <div className="flex justify-between border-b pb-1"><span>💖 Rare Badge medal</span> <span className="text-zinc-900 dark:text-zinc-350 font-bold">5% Odds</span></div>
                    <div className="flex justify-between border-b pb-1"><span>❌ try again tomorrow</span> <span className="text-zinc-400">15% Odds</span></div>
                    <div className="flex justify-between border-b pb-1"><span>🌟 +50 Credits</span> <span className="text-zinc-900 dark:text-zinc-350 font-bold">10% Odds</span></div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================================================================== */}
          {/* 5. CAMPUS DETECTIVE CASE BOARD (FORENSIC DETECTOR MECHANISMS)      */}
          {/* ================================================================== */}
          {activeSegment === 'detective' && (
            <div className="space-y-6 text-left" id="campus-detective-defined">
              
              {/* CASES ROW SELECTOR */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MYSTERY_CASES.map((mysteryCase) => {
                  const isCurActive = mysteryCase.id === activeCaseId;
                  const isLocked = mysteryCase.status === 'locked';
                  const isSolved = mysteryCase.status === 'solved' || (mysteryCase.id === 'case1' && mysteryCaseSolved);
                  
                  return (
                    <div
                      key={mysteryCase.id}
                      onClick={() => !isLocked && setActiveCaseId(mysteryCase.id)}
                      className={`p-4 rounded-xl border transition relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                        isCurActive
                          ? 'border-indigo-600 bg-indigo-50/20 dark:bg-zinc-900 dark:border-indigo-500 shadow-sm'
                          : isLocked
                          ? 'border-zinc-200 bg-zinc-50 opacity-40 dark:bg-zinc-900 dark:border-zinc-800 cursor-not-allowed'
                          : 'border-zinc-200 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] font-mono font-black uppercase">
                          <span className={isSolved ? 'text-emerald-600' : 'text-amber-600'}>
                            {isSolved ? "✔ CASE CLOSED" : "🔍 UNRESOLVED FILE"}
                          </span>
                          <span className="text-zinc-400">{mysteryCase.difficulty} Level</span>
                        </div>
                        <h4 className="text-xs font-bold truncate text-zinc-900 dark:text-zinc-150">
                          {mysteryCase.title}
                        </h4>
                        <p className="text-[10px] text-zinc-500 font-semibold line-clamp-2 leading-relaxed">
                          {mysteryCase.synopsis}
                        </p>
                      </div>

                      <div className="flex justify-between items-center text-[9px] font-mono font-black border-t pt-2 mt-3 text-zinc-405">
                        <span>Bounty: {mysteryCase.reward.split(' ')[0]} {mysteryCase.reward.split(' ')[1] || ""}</span>
                        {isLocked && (
                          <span className="text-indigo-600">Locked (Reach lvl 5)</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* INTEGRATED BOARD FOR ACTIVE CASE */}
              {activeCaseId === 'case1' && (
                <div className="space-y-6">
                  
                  {/* CASE SYNOPSIS HERO */}
                  <div className="p-5 bg-gradient-to-r from-zinc-900 to-indigo-950 border border-zinc-800 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="space-y-2 flex-1 text-left z-10">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-amber-400 text-zinc-950 text-[9px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full">
                          CASEFILE #024 ACTIVE
                        </span>
                        <span className="text-zinc-450 font-mono text-[10px]">Location: Townsend building pod</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black font-sans text-amber-500">The Mystery of the Missing Senate Mace</h3>
                      <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl font-semibold">
                        The University VC has commissioned our Student Forensic task force! A heavy lanyard fragment, high-vis greases, apple cores and sizing footprint steps are verified. Study the clue files, query witnesses, build theories, and choose the correct option from the lineup below!
                      </p>
                    </div>

                    <div className="bg-zinc-850 p-4 border border-zinc-700 rounded-xl text-center space-y-1 font-mono shrink-0">
                      <span className="text-[9px] text-zinc-400 block uppercase font-bold">Solve Jackpot</span>
                      <span className="text-xs font-bold text-amber-450 block">+150 Coins &amp; Badge</span>
                    </div>
                  </div>

                  {/* ACTIVE SOLVED STATUS OVERLAY */}
                  {mysteryCaseSolved ? (
                    <motion.div 
                      initial={{ scale: 0.98, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-6 bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-zinc-850 dark:border-emerald-800 dark:text-emerald-400 rounded-2xl text-center shadow-lg space-y-2"
                    >
                      <span className="text-3xl block">🏆</span>
                      <h4 className="text-base font-black uppercase tracking-wider text-emerald-850 dark:text-emerald-300">Case Solved By Student Investigations!</h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-350 max-w-xl mx-auto font-semibold">
                        CONGRATULATIONS OFFICER! The mechanical grease-smudged lanyard indeed traced directly back to an administrative assistant working within the Registrar Staff. Your points and Chief Detective title badges have been successfully synchronized. Check back on next season for more case logs.
                      </p>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* FORENSICS INTEL BOARD */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-md space-y-4">
                          <span className="text-[9px] uppercase font-mono font-black text-indigo-750 block">FORENSIC SCIENCE INVESTBOARD</span>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {DETECTIVE_CLUES.map((clue, idx) => {
                              const isUnlocked = unlockedClueIds.includes(clue.id);
                              
                              return (
                                <div
                                  key={clue.id}
                                  onClick={() => isUnlocked && setMagnifiedClue(clue)}
                                  className={`p-3.5 rounded-xl border transition text-left flex flex-col justify-between ${
                                    isUnlocked
                                      ? magnifiedClue?.id === clue.id
                                        ? 'border-indigo-600 bg-indigo-50/10 dark:border-indigo-500'
                                        : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700 cursor-pointer'
                                      : 'border-dashed border-zinc-250 bg-zinc-50/40 opacity-70 cursor-not-allowed'
                                  }`}
                                >
                                  <div className="space-y-1">
                                    <span className="text-[8px] font-mono font-black text-zinc-400 block">CLUE CARD 0{idx + 1}</span>
                                    <h5 className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">{clue.name}</h5>
                                    <p className="text-[10px] text-zinc-550 dark:text-zinc-450 line-clamp-2 leading-relaxed">
                                      {isUnlocked ? clue.shortDesc : "Evidence lock - Requires decryption clearance."}
                                    </p>
                                  </div>

                                  <div className="pt-3 border-t mt-3 flex justify-between items-center">
                                    {isUnlocked ? (
                                      <span className="text-[9px] text-indigo-650 font-black flex items-center gap-0.5 whitespace-nowrap">
                                        <Search className="w-2.5 h-2.5" /> Inspect Clue File
                                      </span>
                                    ) : (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          unlockClueIntel(clue);
                                        }}
                                        className="bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-[9px] px-2.5 py-1 rounded cursor-pointer whitespace-nowrap"
                                      >
                                        Unlock (30 Pts)
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* DYNAMIC FORENSIC CLUE SPECIFICATION PANEL */}
                          {magnifiedClue ? (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 bg-zinc-55 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-750 text-xs space-y-3 relative"
                            >
                              <button 
                                onClick={() => setMagnifiedClue(null)}
                                className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-800 cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-mono font-black text-indigo-600 uppercase block">ACTIVE SPECS INSPECTION</span>
                                <h5 className="font-bold text-zinc-900 dark:text-white text-xs">{magnifiedClue.name}</h5>
                              </div>

                              <div className="space-y-2 leading-relaxed">
                                <div className="space-y-0.5">
                                  <span className="text-[8px] font-mono font-black text-amber-600 uppercase block">1. Lab Chemical Forensics Report</span>
                                  <p className="text-[11px] text-zinc-505 dark:text-zinc-400 font-semibold">{magnifiedClue.forensics}</p>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-[8px] font-mono font-black text-emerald-600 uppercase block">2. Security Witness Interview transcripts</span>
                                  <p className="text-[11px] text-zinc-505 dark:text-zinc-400 font-semibold italic">"{magnifiedClue.witnessTranscript}"</p>
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-dashed border-zinc-200 text-center text-zinc-405 text-xs font-semibold placeholder-box">
                              Select any unlocked clue file card above to load chemical laboratory reports and witness transcripts!
                            </div>
                          )}
                        </div>

                        {/* ACCUSATION CARD LINEUP FORM */}
                        <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow space-y-3.5">
                          <span className="text-[9px] uppercase font-mono font-black text-[#4F46E5] block">THE VERDICT STATEMENT PODIUM</span>
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-white leading-snug">Choose primary culprit from forensic lineup:</h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {[
                              { key: "engineering president", name: "The Faculty of Engineering Student President", label: "Wore pristine boots, lanyard missing track traces", role: "Alibi: Class exam coordinator check." },
                              { key: "science lecturer", name: "The Science Department Chemistry Laboratory Attendant", label: "Known to consume apples, size 45 shoes orthopedic", role: "Alibi: Present in Science block Annex B." },
                              { key: "registrar staff", name: "The Vice Registrar Assistant with mechanical experience", label: "Wore size 42 boots, walks with a visible right-leg limp", role: "Alibi: Claimed he was on geological admin ravine walk." },
                              { key: "kiosk owner", name: "The Town Campus kiosk vendor and fruit merchant", label: "Disburses Kopo receipt books, right-leg clean joints", role: "Alibi: Selling sugas at Town Campus intermission." }
                            ].map((suspect) => (
                              <div 
                                key={suspect.key}
                                onClick={() => setAccusedSuspect(suspect.key)}
                                className={`p-3 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${
                                  accusedSuspect === suspect.key
                                    ? 'border-indigo-650 bg-indigo-50/15 dark:border-indigo-500'
                                    : 'border-zinc-200 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100'
                                }`}
                              >
                                <div className="space-y-1">
                                  <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 block leading-tight">{suspect.name}</span>
                                  <span className="text-[10px] text-zinc-500 block font-medium">{suspect.label}</span>
                                </div>
                                <span className="text-[8px] font-mono text-zinc-400 block mt-2.5 uppercase font-bold">{suspect.role}</span>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => handleAccuseSolveVerdict(accusedSuspect)}
                            disabled={!accusedSuspect}
                            className={`w-full py-3.5 rounded-xl text-xs font-black text-white tracking-widest uppercase transition ${
                              accusedSuspect
                                ? 'bg-indigo-650 hover:bg-indigo-750 cursor-pointer'
                                : 'bg-zinc-200 text-zinc-405 cursor-not-allowed'
                            }`}
                          >
                            Publish Formal Detective Accusation Case File Verdict
                          </button>
                        </div>
                      </div>

                      {/* THEORY CRAFTING CHOP */}
                      <div className="space-y-4">
                        <div className="p-4 border border-zinc-200 dark:border-zinc-805 bg-white dark:bg-zinc-900 rounded-2xl shadow space-y-4">
                          <span className="text-[9px] uppercase font-mono font-black text-indigo-600 block">THEORY-CRAFT CHOP STREAM</span>
                          
                          <div className="space-y-3 max-h-[350px] overflow-y-auto no-scrollbar pr-1">
                            {detectiveTheories.map((theory) => {
                              const alreadyVoted = theory.upvotedBy.includes(currentUser.id);
                              
                              return (
                                <div key={theory.id} className="p-3 bg-zinc-55 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2 text-xs">
                                  <div className="flex items-center gap-2">
                                    <img 
                                      src={theory.detectiveAvatar} 
                                      alt={theory.detectiveName} 
                                      className="w-7 h-7 rounded-md object-cover"
                                    />
                                    <div className="min-w-0">
                                      <span className="font-bold text-zinc-900 dark:text-zinc-200 block truncate">{theory.detectiveName}</span>
                                      <span className="text-[8px] font-mono text-zinc-400 block truncate">{theory.detectiveFaculty}</span>
                                    </div>
                                  </div>
                                  <p className="text-[10px] text-zinc-505 dark:text-zinc-400 leading-normal font-semibold">
                                    {theory.content}
                                  </p>

                                  <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400 font-bold border-t pt-1.5 mt-2">
                                    <span>{theory.createdAt}</span>
                                    <button
                                      onClick={() => handleUpvoteTheory(theory.id)}
                                      className={`flex items-center gap-0.5 cursor-pointer hover:text-indigo-650 transition ${alreadyVoted ? 'text-indigo-650 font-black' : ''}`}
                                    >
                                      <span>👍 {theory.upvotes} Votes</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Submit theory formulating form */}
                          <form onSubmit={handleTheorySubmit} className="pt-2 border-t border-zinc-150 dark:border-zinc-800 space-y-2">
                            <textarea
                              required
                              placeholder="Formulate your investigative thesis..."
                              value={newTheoryInput}
                              onChange={e => setNewTheoryInput(e.target.value)}
                              className="w-full bg-white dark:bg-zinc-850 border border-zinc-350 dark:border-zinc-700 p-2.5 rounded-lg text-xs"
                              rows={2.5}
                            />
                            
                            <button
                              type="submit"
                              className="w-full bg-zinc-950 hover:bg-zinc-850 text-white font-extrabold text-[9px] py-2 rounded-lg cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              <span>Publish Theory Contribution (+20 PTS)</span>
                            </button>
                          </form>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* Archetypal Completed Mystery file representation */}
              {activeCaseId === 'case2' && (
                <div className="p-6 border border-zinc-250 bg-white dark:bg-zinc-900 rounded-2xl text-center space-y-4 shadow max-w-2xl mx-auto">
                  <span className="text-4xl block font-bold text-center">📂</span>
                  <h4 className="text-sm font-black uppercase text-indigo-705 dark:text-indigo-400 tracking-wider">ARCHIVAL LOG: CHM 101 midnight Exam papers leak</h4>
                  <p className="text-zinc-505 leading-relaxed text-xs max-w-lg mx-auto font-semibold">
                    The exam leak mystery was cracked on Season 1 of the portal. The forensic task force established that a trainee lab chemist accidentally submitted test printers without credentials clearance, triggering the server alarm logs.
                  </p>
                  <div className="bg-emerald-500/10 p-2.5 rounded-xl inline-block">
                    <span className="text-[10px] font-mono text-emerald-805 dark:text-emerald-400 font-extrabold flex items-center gap-1 justify-center">
                      ✔ CULPRIT SECURED: Trainee Lab Attendant
                    </span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ================================================================== */}
          {/* 6. CAMPUS ARCADE GAME MODES                                       */}
          {/* ================================================================== */}
          {activeSegment === 'arcade' && (
            <div className="space-y-6 text-left" id="campus-arcade-console">
              <CampusArcadeDashboard 
                currentUser={currentUser}
                onAddPoints={addPlayerPoints}
                onShowToast={onShowToast}
                theme={theme}
              />
            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
}

// ----------------------------------------------------------------------
// 🎮 CAMPUS ARCADE SYSTEM SUB-COMPONENTS
// ----------------------------------------------------------------------

interface CampusArcadeDashboardProps {
  currentUser: StudentProfile;
  onAddPoints: (pts: number) => void;
  onShowToast: (msg: string, type?: 'info' | 'warn' | 'success') => void;
  theme: string;
}

function CampusArcadeDashboard({ currentUser, onAddPoints, onShowToast, theme }: CampusArcadeDashboardProps) {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    {
      id: 'wordle',
      title: 'UniWordle',
      desc: 'Guess 5-letter slang and official campus keywords before attempts expire!',
      reward: '+20 PTS',
      emoji: '⌨️',
      color: 'from-amber-500/10 to-amber-500/5 hover:border-amber-500/30'
    },
    {
      id: 'game2048',
      title: 'Uyo Connect 2048',
      desc: 'Slide the tiles and connect campus achievements all the way to Vice Chancellor!',
      reward: '+30 PTS',
      emoji: '🧩',
      color: 'from-indigo-500/10 to-indigo-500/5 hover:border-indigo-500/30'
    },
    {
      id: 'memory',
      title: 'Memory Match',
      desc: 'Test your brain and match the icons of different academic faculties.',
      reward: '+15 PTS',
      emoji: '🧠',
      color: 'from-emerald-500/10 to-emerald-500/5 hover:border-emerald-500/30'
    },
    {
      id: 'tictactoe',
      title: 'Tic-Tac-Toe Duel',
      desc: 'Challenge the strict Computer Professor Bot or play local pass-and-play.',
      reward: '+10 PTS',
      emoji: '❌',
      color: 'from-rose-500/10 to-rose-500/5 hover:border-rose-500/30'
    }
  ];

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!selectedGame ? (
          <motion.div
            key="dashboard-menu"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            {/* Header Callout badge */}
            <div className="p-6 bg-indigo-600/5 dark:bg-zinc-900/40 border border-indigo-500/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 flex-1">
                <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest">
                  🕹️ ARCADE CABIN
                </span>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">UniUyo Student Arcade Club</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                  Take a break from the Faculty Wars and continuous assessments! Play these quick single-player and dual games, master campus slangs, climb the VC leaderboard, and earn bonus coins directly added to your player profiles.
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-indigo-600 text-white p-3.5 rounded-xl shadow shrink-0">
                <Gamepad2 className="w-5 h-5" />
                <span className="text-[11px] font-black uppercase tracking-wider">Play To Earn XP</span>
              </div>
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game.id)}
                  className={`p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 bg-gradient-to-br ${game.color} text-left flex gap-4 transition shadow-sm hover:shadow active:scale-[0.99] cursor-pointer group`}
                >
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-3xl shrink-0 shadow-inner group-hover:scale-105 transition">
                    {game.emoji}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-105 tracking-wide">{game.title}</h4>
                      <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/10">
                        {game.reward}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-450 leading-relaxed font-semibold">
                      {game.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="active-cabin-game"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-850">
              <button
                onClick={() => setSelectedGame(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-205 dark:border-zinc-800 text-zinc-650 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 rounded-lg text-xs font-black uppercase transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Exit Arcade</span>
              </button>
              <div className="text-right">
                <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400 dark:text-zinc-500 block">Playing:</span>
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                  {games.find(g => g.id === selectedGame)?.title}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-md">
              {selectedGame === 'wordle' && (
                <UniWordleGame onAddPoints={onAddPoints} onShowToast={onShowToast} />
              )}
              {selectedGame === 'game2048' && (
                <Uyo2048Game onAddPoints={onAddPoints} onShowToast={onShowToast} />
              )}
              {selectedGame === 'memory' && (
                <MemoryMatchGame onAddPoints={onAddPoints} onShowToast={onShowToast} />
              )}
              {selectedGame === 'tictactoe' && (
                <TicTacToeGame onAddPoints={onAddPoints} onShowToast={onShowToast} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================================
// ⌨️ GAME 1: UNIWORDLE
// =========================================================================

interface WordleWord {
  word: string;
  clue: string;
}

const WORDLE_POOL: WordleWord[] = [
  { word: "NWANI", clue: "Refers to Nwaniba Road corridor where the massive permanent site Main Campus sits." },
  { word: "CLASS", clue: "Where lectures are delivered, or where early birds book seats with their notes." },
  { word: "ADMIN", clue: "The central administration blocks where critical student clearances are processed." },
  { word: "EXAMS", clue: "The intense physical continuous audit under strict external invigilator eyes." },
  { word: "KEKES", clue: "Nicknamed yellow tricycles that serve as the chief connecting transit off-campus." },
  { word: "DEANS", clue: "The executive leaders overseeing different student and academic department clusters." },
  { word: "BOARD", clue: "The legendary notice board where score updates, lecture schedules, and news are pinned." },
  { word: "MARKS", clue: "Continuous assessment and examination scores that build up player grade indexes." },
  { word: "TOWNY", clue: "The historical Town Campus layout on busy Ikpa Road with decades of engineering heritage." },
  { word: "STUDY", clue: "Late night reviews under administrative hallway corridor lights during peak exams." },
  { word: "BOOKS", clue: "Academic and research materials housed across the three storeys of the main library." },
  { word: "TOKEN", clue: "A virtual security digit utilized on the school network portal to pull result lists." },
  { word: "SHUTT", clue: "Short slang for UniUyo shuttle transit buses that haul students between campuses." }
];

function UniWordleGame({ onAddPoints, onShowToast }: { onAddPoints: (pts: number) => void; onShowToast: (msg: string, type?: 'info' | 'warn' | 'success') => void }) {
  const [wordleObj, setWordleObj] = useState<WordleWord>(WORDLE_POOL[0]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [pointsClaimed, setPointsClaimed] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const randomIndex = Math.floor(Math.random() * WORDLE_POOL.length);
    setWordleObj(WORDLE_POOL[randomIndex]);
    setGuesses([]);
    setCurrentGuess('');
    setStatus('playing');
    setPointsClaimed(false);
  };

  const currentCount = guesses.length;

  const handleKeyPress = (char: string) => {
    if (status !== 'playing') return;

    if (char === 'ENTER') {
      if (currentGuess.length < 5) {
        onShowToast("Guess must contain exactly 5 letters!", "warn");
        return;
      }
      const newGuesses = [...guesses, currentGuess.toUpperCase()];
      setGuesses(newGuesses);
      setCurrentGuess('');

      if (currentGuess.toUpperCase() === wordleObj.word) {
        setStatus('won');
        if (!pointsClaimed) {
          onAddPoints(20);
          setPointsClaimed(true);
          onShowToast("Winner! Match found +20 Points added!", "success");
        }
      } else if (newGuesses.length >= 6) {
        setStatus('lost');
      }
    } else if (char === 'BACK') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else {
      if (currentGuess.length < 5) {
        setCurrentGuess(prev => (prev + char).toUpperCase());
      }
    }
  };

  const getLetterStyle = (char: string, index: number, isConfirmed: boolean) => {
    if (!isConfirmed) {
      return "bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 scale-100";
    }

    const upperChar = char.toUpperCase();
    if (wordleObj.word[index] === upperChar) {
      return "bg-emerald-555 border-emerald-555 text-white bg-emerald-600 border-emerald-600";
    } else if (wordleObj.word.includes(upperChar)) {
      return "bg-amber-500 border-amber-500 text-white";
    } else {
      return "bg-zinc-400 dark:bg-zinc-750 border-zinc-400 dark:border-zinc-750 text-white";
    }
  };

  const rowTemplate = Array(6).fill(null);

  return (
    <div className="space-y-6 text-center max-w-sm mx-auto">
      <div className="space-y-1.5">
        <h4 className="text-base font-black tracking-tight text-zinc-900 dark:text-white">⌨️ UniWordle Dictionary</h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
          Find the 5-letter campus keyword. <strong>Clue:</strong> &ldquo;{wordleObj.clue}&rdquo;
        </p>
      </div>

      {/* Grid Canvas */}
      <div className="grid grid-rows-6 gap-2 max-w-[210px] mx-auto select-none">
        {rowTemplate.map((_, rowIndex) => {
          const isGuessed = rowIndex < guesses.length;
          const rowWord = isGuessed ? guesses[rowIndex] : (rowIndex === guesses.length ? currentGuess : '');
          
          return (
            <div key={rowIndex} className="grid grid-cols-5 gap-1.5">
              {Array(5).fill(null).map((_, colIndex) => {
                const char = rowWord[colIndex] || '';
                return (
                  <div
                    key={colIndex}
                    className={`w-9 h-9 border flex items-center justify-center text-sm font-extrabold rounded-lg transition duration-200 uppercase ${getLetterStyle(char, colIndex, isGuessed)}`}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Outcome Banner */}
      {status !== 'playing' && (
        <div className="p-4 rounded-xl space-y-2 border bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
          {status === 'won' ? (
            <div className="space-y-1 text-emerald-650 dark:text-emerald-400">
              <span className="text-2xl block">🎉</span>
              <p className="text-xs font-black uppercase">Outstanding! Correct Wordle solved!</p>
              <p className="text-[11px] text-zinc-550 leading-relaxed font-semibold">The target word was <strong className="font-bold underline uppercase">{wordleObj.word}</strong>. Clue matches correctly!</p>
            </div>
          ) : (
            <div className="space-y-1 text-red-600">
              <span className="text-2xl block">🔋</span>
              <p className="text-xs font-black uppercase">Attempts Expired</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                You didn't get it this time. The word was <strong className="font-extrabold underline uppercase">{wordleObj.word}</strong>.
              </p>
            </div>
          )}
          <button
            onClick={resetGame}
            className="mt-2 text-xs py-1.5 px-4 bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold uppercase rounded-lg shadow cursor-pointer transition active:scale-95"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Virtual Keyboard */}
      <div className="space-y-1 p-2 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-850">
        {[
          ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
          ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
          ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"]
        ].map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-1.5">
            {row.map((char) => {
              const isAction = char === 'ENTER' || char === 'BACK';
              return (
                <button
                  key={char}
                  onClick={() => handleKeyPress(char)}
                  className={`h-8 hover:scale-105 active:scale-95 transition text-[10px] font-black uppercase rounded text-center cursor-pointer ${
                    isAction 
                      ? 'px-2.5 bg-zinc-300 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-400' 
                      : 'w-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-80D text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {char}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================
// 🧩 GAME 2: UYO CONNECT 2048
// =========================================================================

function Uyo2048Game({ onAddPoints, onShowToast }: { onAddPoints: (pts: number) => void; onShowToast: (msg: string, type?: 'info' | 'warn' | 'success') => void }) {
  const [board, setBoard] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [pointsClaimed, setPointsClaimed] = useState<boolean>(false);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    let emptyBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    emptyBoard = spawnRandomTile(spawnRandomTile(emptyBoard));
    setBoard(emptyBoard);
    setScore(0);
    setGameOver(false);
    setPointsClaimed(false);
  };

  const spawnRandomTile = (grid: number[][]): number[][] => {
    const copy = grid.map(r => r.slice());
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (copy[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }
    if (emptyCells.length > 0) {
      const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      copy[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
    return copy;
  };

  const compressRow = (row: number[]): { compressed: number[]; scoreGained: number } => {
    let nonZeros = row.filter(val => val !== 0);
    let scoreGained = 0;
    const merged: number[] = [];
    let i = 0;
    while (i < nonZeros.length) {
      if (i < nonZeros.length - 1 && nonZeros[i] === nonZeros[i + 1]) {
        const double = nonZeros[i] * 2;
        merged.push(double);
        scoreGained += double;
        i += 2;
      } else {
        merged.push(nonZeros[i]);
        i += 1;
      }
    }
    while (merged.length < 4) {
      merged.push(0);
    }
    return { compressed: merged, scoreGained };
  };

  const checkGameOver = (grid: number[][]): boolean => {
    // any empty tiles?
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] === 0) return false;
      }
    }
    // any mergeable adjacent tiles?
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = grid[r][c];
        if (r < 3 && grid[r + 1][c] === val) return false;
        if (c < 3 && grid[r][c + 1] === val) return false;
      }
    }
    return true;
  };

  const move = (direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN') => {
    if (gameOver) return;
    let gridCopy = board.map(r => r.slice());
    let scoreGained = 0;
    let changed = false;

    if (direction === 'LEFT') {
      for (let r = 0; r < 4; r++) {
        const oldRow = gridCopy[r];
        const { compressed, scoreGained: increment } = compressRow(oldRow);
        gridCopy[r] = compressed;
        scoreGained += increment;
        if (JSON.stringify(oldRow) !== JSON.stringify(compressed)) {
          changed = true;
        }
      }
    } else if (direction === 'RIGHT') {
      for (let r = 0; r < 4; r++) {
        const oldRow = gridCopy[r];
        const reversed = oldRow.slice().reverse();
        const { compressed, scoreGained: increment } = compressRow(reversed);
        const output = compressed.reverse();
        gridCopy[r] = output;
        scoreGained += increment;
        if (JSON.stringify(oldRow) !== JSON.stringify(output)) {
          changed = true;
        }
      }
    } else if (direction === 'UP') {
      for (let c = 0; c < 4; c++) {
        const col = [gridCopy[0][c], gridCopy[1][c], gridCopy[2][c], gridCopy[3][c]];
        const { compressed, scoreGained: increment } = compressRow(col);
        scoreGained += increment;
        for (let r = 0; r < 4; r++) {
          if (gridCopy[r][c] !== compressed[r]) {
            changed = true;
          }
          gridCopy[r][c] = compressed[r];
        }
      }
    } else if (direction === 'DOWN') {
      for (let c = 0; c < 4; c++) {
        const col = [gridCopy[0][c], gridCopy[1][c], gridCopy[2][c], gridCopy[3][c]];
        const reversed = col.slice().reverse();
        const { compressed, scoreGained: increment } = compressRow(reversed);
        const output = compressed.reverse();
        scoreGained += increment;
        for (let r = 0; r < 4; r++) {
          if (gridCopy[r][c] !== output[r]) {
            changed = true;
          }
          gridCopy[r][c] = output[r];
        }
      }
    }

    if (changed) {
      gridCopy = spawnRandomTile(gridCopy);
      setBoard(gridCopy);
      setScore(prev => prev + scoreGained);

      // Check if VC tile (2048) was made
      let maxVal = 0;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (gridCopy[r][c] > maxVal) maxVal = gridCopy[r][c];
        }
      }

      if (maxVal >= 2048 && !pointsClaimed) {
        onAddPoints(30);
        setPointsClaimed(true);
        onShowToast("🏆 Legendary! Reached Vice Chancellor Level! Earned +30 points!", "success");
      }

      if (checkGameOver(gridCopy)) {
        setGameOver(true);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === 'ArrowUp') { move('UP'); e.preventDefault(); }
      else if (e.key === 'ArrowDown') { move('DOWN'); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { move('LEFT'); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { move('RIGHT'); e.preventDefault(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, gameOver]);

  const tileMappings: Record<number, { title: string; style: string }> = {
    2: { title: "100L Freshman", style: "bg-zinc-100 text-zinc-900 border-zinc-250 font-bold" },
    4: { title: "200L Sophomore", style: "bg-slate-200 text-slate-900 border-slate-305 font-bold" },
    8: { title: "300L Junior", style: "bg-amber-100 text-amber-900 border-amber-300 font-bold" },
    16: { title: "400L Senior", style: "bg-orange-100 text-orange-950 border-orange-300 font-bold" },
    32: { title: "Graduate B.Sc", style: "bg-emerald-100 text-emerald-950 border-emerald-300 font-black" },
    64: { title: "M.Sc Postgrad", style: "bg-teal-100 text-teal-950 border-teal-300 font-black" },
    128: { title: "Ph.D. Scholar", style: "bg-cyan-100 text-cyan-950 border-cyan-300 font-black" },
    256: { title: "Asst. Lecturer", style: "bg-indigo-100 text-indigo-950 border-indigo-300 font-black" },
    512: { title: "Aso. Professor", style: "bg-purple-100 text-purple-950 border-purple-300 font-black" },
    1024: { title: "Faculty Dean", style: "bg-yellow-200/90 text-zinc-950 border-amber-500 font-black text-amber-800" },
    2048: { title: "Vice Chancellor 👑", style: "bg-gradient-to-tr from-amber-500 to-indigo-600 text-white border-yellow-400 font-black shadow-lg" }
  };

  const getTileStyles = (val: number) => {
    if (val === 0) return "bg-zinc-50 dark:bg-zinc-950 border-zinc-150 dark:border-zinc-800/80";
    return tileMappings[val]?.style || "bg-indigo-600 text-white font-bold";
  };

  const getMaxTitle = (): string => {
    let max = 0;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] > max) max = board[r][c];
      }
    }
    return tileMappings[max]?.title || "Aspirant";
  };

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-850">
        <div className="text-left">
          <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest block">Highest Rank:</span>
          <span className="text-sm font-black text-indigo-700 dark:text-indigo-400">{score > 0 ? getMaxTitle() : "Empty Board"}</span>
        </div>
        <div className="text-right p-1.5 px-3 bg-zinc-900 text-white rounded-lg select-none">
          <span className="text-[9px] uppercase tracking-wider block font-bold leading-none text-zinc-400">Score</span>
          <span className="text-sm font-black font-mono leading-none">{score}</span>
        </div>
      </div>

      <div className="p-3 bg-zinc-100 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-2xl">
        <div className="grid grid-cols-4 gap-2 aspect-square">
          {board.map((row, rIdx) => 
            row.map((val, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`border rounded-xl flex flex-col items-center justify-center p-1 transition-all duration-150 select-none ${getTileStyles(val)}`}
              >
                {val > 0 && (
                  <div className="text-center">
                    <span className="font-mono text-xs font-black block leading-none">{val}</span>
                    <span className="text-[7px] text-zinc-500 dark:text-zinc-400 block tracking-tight leading-tighter font-extrabold max-w-[55px] truncate mt-0.5">
                      {tileMappings[val]?.title.split(" ")[0]}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Swipe Overlay buttons for absolute comfort inside Sandbox */}
      <div className="space-y-2">
        <span className="block text-[10px] uppercase font-black text-zinc-400 text-center tracking-wider">Touch / Arrow controls</span>
        
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => move('UP')}
            className="w-12 h-10 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm font-bold flex items-center justify-center rounded-lg shadow-xs cursor-pointer active:scale-95 transition"
            title="Slide Up"
          >
            ▲
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => move('LEFT')}
              className="w-12 h-10 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm font-bold flex items-center justify-center rounded-lg shadow-xs cursor-pointer active:scale-95 transition"
              title="Slide Left"
            >
              ◀
            </button>
            <button
              onClick={() => move('DOWN')}
              className="w-12 h-10 bg-white hover:bg-zinc-50 border border-zinc-205 text-zinc-700 text-sm font-bold flex items-center justify-center rounded-lg shadow-xs cursor-pointer active:scale-95 transition"
              title="Slide Down"
            >
              ▼
            </button>
            <button
              onClick={() => move('RIGHT')}
              className="w-12 h-10 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm font-bold flex items-center justify-center rounded-lg shadow-xs cursor-pointer active:scale-95 transition"
              title="Slide Right"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      {gameOver && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-2.5">
          <span className="text-xl block">🔒</span>
          <p className="text-xs font-black text-rose-800 uppercase leading-none">Ranks Locked (Game over)</p>
          <p className="text-[10px] text-zinc-500 leading-normal font-semibold">Your finalized score is {score}. You reached the tier of {getMaxTitle()}!</p>
          <button
            onClick={initGame}
            className="text-xs py-1.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold uppercase rounded-lg shadow cursor-pointer transition active:scale-95 inline-block"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 🧠 GAME 3: MEMORY MATCH
// =========================================================================

interface MemoryCard {
  id: number;
  emoji: string;
  matched: boolean;
  flipped: boolean;
  label: string;
}

const MEMORY_ITEMS = [
  { emoji: "💻", label: "Science/CS Lab" },
  { emoji: "📚", label: "Uyo Library" },
  { emoji: "🍎", label: "Campus Kiosks" },
  { emoji: "🚌", label: "Shuttle Transit" },
  { emoji: "🔬", label: "Biology Physics" },
  { emoji: "🏛️", label: "Senate House" },
  { emoji: "⚖️", label: "Law Faculty" },
  { emoji: "⚽", label: "Main Arena Stadium" }
];

function MemoryMatchGame({ onAddPoints, onShowToast }: { onAddPoints: (pts: number) => void; onShowToast: (msg: string, type?: 'info' | 'warn' | 'success') => void }) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [pointsClaimed, setPointsClaimed] = useState(false);

  useEffect(() => {
    initDeck();
  }, []);

  const initDeck = () => {
    const doubleDeck = [...MEMORY_ITEMS, ...MEMORY_ITEMS].map((item, index) => ({
      id: index,
      emoji: item.emoji,
      matched: false,
      flipped: false,
      label: item.label
    }));
    
    // Shuffle deck
    for (let i = doubleDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [doubleDeck[i], doubleDeck[j]] = [doubleDeck[j], doubleDeck[i]];
    }

    setCards(doubleDeck);
    setSelectedIndices([]);
    setMoves(0);
    setGameCompleted(false);
    setPointsClaimed(false);
  };

  const handleCardClick = (idx: number) => {
    if (gameCompleted) return;
    if (cards[idx].matched || cards[idx].flipped) return;
    if (selectedIndices.length >= 2) return;

    const nextCards = cards.map((c, i) => i === idx ? { ...c, flipped: true } : c);
    setCards(nextCards);

    const nextSelected = [...selectedIndices, idx];
    setSelectedIndices(nextSelected);

    if (nextSelected.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIdx, secondIdx] = nextSelected;
      
      if (cards[firstIdx].emoji === cards[secondIdx].emoji) {
        // Matched!
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => {
            if (i === firstIdx || i === secondIdx) {
              return { ...c, matched: true, flipped: true };
            }
            return c;
          }));
          setSelectedIndices([]);
          
          // is all matched?
          const isAllChecked = nextCards.every((c, i) => {
            if (i === firstIdx || i === secondIdx) return true;
            return c.matched;
          });
          if (isAllChecked) {
            setGameCompleted(true);
            if (!pointsClaimed) {
              onAddPoints(15);
              setPointsClaimed(true);
              onShowToast("Brain Booster match won! Claimed +15 Points!", "success");
            }
          }
        }, 300);
      } else {
        // No match, turn back
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => {
            if (i === firstIdx || i === secondIdx) {
              return { ...c, flipped: false };
            }
            return c;
          }));
          setSelectedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-850">
        <div className="text-left">
          <span className="text-[10px] text-zinc-400 uppercase font-black block">Goal:</span>
          <span className="text-xs text-indigo-750 dark:text-indigo-400 font-extrabold leading-none">Find matching Faculty pairs</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-zinc-400 uppercase font-bold block">Moves Made:</span>
          <span className="text-xs font-black font-semibold">{moves}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5 p-3 bg-zinc-100 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-2xl select-none">
        {cards.map((card, idx) => {
          const isFlippedOrMatched = card.flipped || card.matched;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`aspect-square rounded-xl border transition-all duration-300 transform active:scale-95 flex items-center justify-center text-2xl shadow-sm cursor-pointer ${
                isFlippedOrMatched 
                  ? 'bg-white dark:bg-zinc-900 border-indigo-400 rotate-y-180 scale-100 text-zinc-900' 
                  : 'bg-gradient-to-tr from-indigo-500 to-indigo-600 border-indigo-600 rotate-0 text-white hover:opacity-90'
              }`}
              title={isFlippedOrMatched ? card.label : "Tap to flip"}
            >
              {isFlippedOrMatched ? (
                <span>{card.emoji}</span>
              ) : (
                <span className="text-[11px] font-black uppercase text-indigo-100 select-none leading-none tracking-tight">UYO</span>
              )}
            </button>
          );
        })}
      </div>

      {gameCompleted && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
          <span className="text-xl block">🎓</span>
          <p className="text-xs font-black text-emerald-800 uppercase leading-none">Memory Match Victory!</p>
          <p className="text-[10px] text-zinc-500 leading-normal font-semibold">Matched all 8 academic study departments in {moves} moves!</p>
          <button
            onClick={initDeck}
            className="text-xs py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold soccer-banner uppercase rounded-lg shadow cursor-pointer transition active:scale-95"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// ❌ GAME 4: TIC-TAC-TOE Duel
// =========================================================================

function TicTacToeGame({ onAddPoints, onShowToast }: { onAddPoints: (pts: number) => void; onShowToast: (msg: string, type?: 'info' | 'warn' | 'success') => void }) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // Player student is O (Students), but let's make O play first
  const [vsBot, setVsBot] = useState(true);
  const [status, setStatus] = useState<'playing' | 'O_wins' | 'X_wins' | 'draw'>('playing');
  const [pointsClaimed, setPointsClaimed] = useState(false);

  // Re-evalulate game status
  const checkWinner = (grid: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
        return grid[a];
      }
    }
    if (grid.every(cell => cell !== null)) return 'draw';
    return null;
  };

  const handleCellClick = (idx: number) => {
    if (board[idx] || status !== 'playing') return;

    const nextBoard = [...board];
    const currentPlayer = isXNext ? 'O' : 'X'; // O represents student, X is lecturer
    nextBoard[idx] = currentPlayer;
    setBoard(nextBoard);

    const winner = checkWinner(nextBoard);
    if (winner) {
      if (winner === 'O') {
        setStatus('O_wins');
        if (vsBot && !pointsClaimed) {
          onAddPoints(10);
          setPointsClaimed(true);
          onShowToast("Student O won the match! Granted +10 PTS!", "success");
        }
      } else if (winner === 'X') {
        setStatus('X_wins');
      } else {
        setStatus('draw');
      }
    } else {
      setIsXNext(!isXNext);
    }
  };

  // Bot computer move
  useEffect(() => {
    if (!vsBot || isXNext || status !== 'playing') return;

    const timer = setTimeout(() => {
      // 1. Can bot (X) win right now?
      const winMove = findWinningMove('X', board);
      if (winMove !== -1) {
        makeBotMove(winMove);
        return;
      }

      // 2. Can player (O) win right now? Block them!
      const blockMove = findWinningMove('O', board);
      if (blockMove !== -1) {
        makeBotMove(blockMove);
        return;
      }

      // 3. Take center if available
      if (board[4] === null) {
        makeBotMove(4);
        return;
      }

      // 4. Random empty cells
      const emptyIndices: number[] = [];
      board.forEach((val, i) => { if (val === null) emptyIndices.push(i); });
      if (emptyIndices.length > 0) {
        const randomCell = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        makeBotMove(randomCell);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [board, isXNext, vsBot, status]);

  const findWinningMove = (player: 'X' | 'O', grid: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (const [a, b, c] of lines) {
      if (grid[a] === player && grid[b] === player && grid[c] === null) return c;
      if (grid[a] === player && grid[c] === player && grid[b] === null) return b;
      if (grid[b] === player && grid[c] === player && grid[a] === null) return a;
    }
    return -1;
  };

  const makeBotMove = (cellIdx: number) => {
    const nextBoard = [...board];
    nextBoard[cellIdx] = 'X';
    setBoard(nextBoard);

    const winner = checkWinner(nextBoard);
    if (winner) {
      if (winner === 'X') {
        setStatus('X_wins');
      } else if (winner === 'O') {
        setStatus('O_wins');
      } else {
        setStatus('draw');
      }
    } else {
      setIsXNext(true); // back to player (O)
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true); // O always ready to start
    setStatus('playing');
    setPointsClaimed(false);
  };

  return (
    <div className="space-y-4 max-w-sm mx-auto text-center font-sans">
      <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950 p-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-850">
        <label className="flex items-center gap-2 font-bold cursor-pointer text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={vsBot}
            onChange={(e) => {
              setVsBot(e.target.checked);
              resetGame();
            }}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <span>VS Professor Bot (Win awards PTS)</span>
        </label>
        <span className="text-[10px] text-zinc-400 font-extrabold uppercase bg-zinc-200 dark:bg-zinc-800 p-1 px-2.5 rounded-md">
          {vsBot ? "Single Player" : "2-Player Local"}
        </span>
      </div>

      {/* Grid */}
      <div className="p-3 bg-zinc-100 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-2xl">
        <div className="grid grid-cols-3 gap-2.5 aspect-square max-w-[240px] mx-auto">
          {board.map((cell, idx) => (
            <button
              key={idx}
              onClick={() => handleCellClick(idx)}
              className={`aspect-square rounded-xl border font-black text-3xl flex items-center justify-center transition shadow-sm active:scale-95 cursor-pointer ${
                cell === 'O' 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20' 
                  : cell === 'X' 
                  ? 'bg-rose-50 text-rose-700 border-rose-250 dark:bg-rose-950/20' 
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50'
              }`}
            >
              {cell === 'O' ? (
                <span className="animate-fade-in">O</span>
              ) : cell === 'X' ? (
                <span className="animate-fade-in">X</span>
              ) : (
                ""
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs font-black uppercase text-zinc-650 tracking-wider">
        {status === 'playing' ? (
          <p>
            Current Turn: <span className={isXNext ? "text-indigo-650" : "text-rose-650"}>{isXNext ? "Student (O)" : "Professor (X)"}</span>
          </p>
        ) : (
          <div className="p-3 border rounded-xl bg-zinc-50 dark:bg-zinc-955 border-zinc-200 dark:border-zinc-850 space-y-1.5">
            {status === 'O_wins' && (
              <span className="text-emerald-600 block">🏆 Victory! Student (O) beat the Lecturer!</span>
            )}
            {status === 'X_wins' && (
              <span className="text-rose-600 block">🔋 Exam Failed! Professor (X) secured the matches.</span>
            )}
            {status === 'draw' && (
              <span className="text-zinc-500 block">🤝 Draw Match! Try a different strategy.</span>
            )}
            <button
              onClick={resetGame}
              className="mt-1 text-xs py-1 px-3.5 bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold uppercase rounded-lg shadow cursor-pointer transition"
            >
              Restart game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
