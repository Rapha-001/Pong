/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentProfile, Post, Community, Opportunity, Event, Project } from './types';

// Real faculties and departments in UniUyo to make the application feel authentic and engaging
export const UNIUYO_FACULTIES = [
  {
    name: 'Science',
    departments: ['Computer Science', 'Mathematics', 'Statistics', 'Microbiology', 'Biochemistry', 'Physics', 'Pure Chemistry']
  },
  {
    name: 'Engineering',
    departments: ['Computer Engineering', 'Electrical/Electronic Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Petroleum Engineering']
  },
  {
    name: 'Law',
    departments: ['Public Law', 'Private and Property Law', 'Commercial Law', 'International Law']
  },
  {
    name: 'Basic Clinical Sciences',
    departments: ['Medicine and Surgery', 'Human Anatomy', 'Human Physiology']
  },
  {
    name: 'Business Administration',
    departments: ['Accounting', 'Business Management', 'Banking and Finance', 'Marketing']
  },
  {
    name: 'Arts',
    departments: ['Communication Arts', 'English and Literary Studies', 'History and International Studies', 'Linguistics and Nigerian Languages', 'Philosophy']
  },
  {
    name: 'Social Sciences',
    departments: ['Economics', 'Political Science and Public Administration', 'Sociology and Anthropology', 'Psychology']
  },
  {
    name: 'Environmental Studies',
    departments: ['Architecture', 'Urban and Regional Planning', 'Estate Management', 'Building']
  }
];

export const MOCK_PROFILES: StudentProfile[] = [
  {
    id: 'student_raphael',
    name: 'Raphael Akpabio',
    email: 'raphaelakpabio85@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    role: 'Campus Creators',
    faculty: 'Science',
    department: 'Computer Science',
    level: '400L',
    bio: 'Product Designer and Backend Enthusiast. Building digital bridges for UniUyo students. Love hackathons, UI/UX, and cold brews. 🚀🚀',
    interests: ['UI/UX Design', 'Fullstack Development', 'Startup Scaling', 'Campus Tech'],
    skills: ['Figma', 'TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    projectsCount: 2,
    socials: {
      twitter: 'https://twitter.com',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    },
    verified: true,
    points: 245,
    badges: ['Verified Scholar', 'MVP Builder', 'Discussion Pioneer'],
    matricNo: '18/SC/CO/002',
    verificationStatus: 'verified'
  },
  {
    id: 'student_chidi',
    name: 'Chidi Nwachukwu',
    email: 'chidi.n@uniuyo.edu.ng',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=800',
    role: 'Student Entrepreneurs',
    faculty: 'Business Administration',
    department: 'Business Management',
    level: '300L',
    bio: 'Founder of Tusk Logistics. We handle campus laundry and delivery services. Always looking for developers to join the team! 📦🧺',
    interests: ['Venture Capital', 'Campus Commerce', 'Logistics', 'Public Speaking'],
    skills: ['Operations', 'Business Strategy', 'Pitching', 'Sales'],
    projectsCount: 1,
    socials: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      website: 'https://uniuyo.edu.ng'
    },
    verified: true,
    points: 150,
    badges: ['Verified Scholar', 'Startup Founder'],
    matricNo: '19/BA/BM/045',
    verificationStatus: 'verified'
  },
  {
    id: 'student_emem',
    name: 'Emem Obong',
    email: 'emem.obong@uniuyo.edu.ng',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    coverImage: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80&w=800',
    role: 'Student Leaders',
    faculty: 'Law',
    department: 'Public Law',
    level: '500L',
    bio: 'Faculty of Law Representative. Passionate about student governance, legal tech, and human rights advocacy. Reach out for consultations!',
    interests: ['Constitutional Law', 'Debating', 'Student Welfare', 'Policy Making'],
    skills: ['Legal Drafting', 'Advocacy', 'Mediation', 'Leadership'],
    projectsCount: 1,
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    verified: true,
    points: 215,
    badges: ['Verified Scholar', 'Student Leader', 'Oratory Master'],
    matricNo: '17/LW/PL/012',
    verificationStatus: 'verified'
  },
  {
    id: 'student_bassey',
    name: 'Bassey Edet',
    email: 'bassey.photo@uniuyo.edu.ng',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=800',
    role: 'Campus Creators',
    faculty: 'Arts',
    department: 'Communication Arts',
    level: '200L',
    bio: 'Photographer and visual artist. Capturing the colors, struggles, and premium vibes of Town Campus and Permanent Site. 📸✨',
    interests: ['Street Photography', 'Video Editing', 'Creative Directing', 'Music Journalism'],
    skills: ['Photoshop', 'Lightroom', 'Videography', 'Storytelling'],
    projectsCount: 3,
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://instagram.com'
    },
    verified: false,
    points: 65,
    badges: ['Visual Creator'],
    matricNo: '20/AR/CO/104',
    verificationStatus: 'pending'
  },
  {
    id: 'org_gdsc',
    name: 'GDSC UniUyo',
    email: 'gdsc.uniuyo@outlook.com',
    avatar: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=256',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    role: 'Student Organizations',
    faculty: 'Science',
    department: 'Computer Science',
    level: 'Student Council',
    bio: 'Google Developer Student Club, University of Uyo Chapter. Connecting students to resources, tutorials, and real-world tech stacks.',
    interests: ['Mobile Development', 'Machine Learning', 'Cloud Systems'],
    skills: ['Flutter', 'Google Cloud', 'Events Engineering'],
    projectsCount: 1,
    socials: {
      twitter: 'https://twitter.com',
      website: 'https://gdsc.community.dev'
    },
    verified: false,
    points: 120,
    badges: ['Tech Community'],
    matricNo: 'ORG/GDSC/2026/005',
    verificationStatus: 'pending',
    orgRegCode: 'REG/GDSC/UNIUYO/105',
    orgPatron: 'Dr. Joshua Ekong (Computer Science)',
    orgDocType: 'Charter Recognition Letter',
    orgDocBase64: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=300',
    orgDescription: 'GDSC UniUyo aims to bridge the gap between theory and practice for student developers, offering free Bootcamps on Google Cloud and Android.'
  },
  {
    id: 'org_nacos',
    name: 'NACOS UniUyo Chapter',
    email: 'nacos@uniuyo.edu.ng',
    avatar: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=256',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
    role: 'Student Organizations',
    faculty: 'Science',
    department: 'Computer Science',
    level: 'Student Council',
    bio: 'Official handle of the National Association of Computer Science Students, University of Uyo. Fostering tech innovation and collaboration.',
    interests: ['Tech Education', 'Hackathons', 'Student Support', 'Career Fairs'],
    skills: ['Event Planning', 'Community Building', 'Workshops', 'Mentorship'],
    projectsCount: 2,
    socials: {
      twitter: 'https://twitter.com',
      github: 'https://github.com',
      website: 'https://nacosuniuyo.org'
    },
    verified: true,
    points: 310,
    badges: ['Verified Org', 'Tech Hub', 'Community Host'],
    matricNo: 'ORG/CS/2026/001',
    verificationStatus: 'verified'
  }
];

export const MOCK_COMMUNITIES: Community[] = [
  {
    id: 'comm_science_tech',
    name: 'UniUyo Tech Alliance',
    description: 'The premier community for developers, designers, product managers, and tech enthusiasts at the University of Uyo. Sharing code, design challenges, and job search checklists.',
    category: 'Academic',
    banner: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800',
    logo: '💻',
    membersCount: 245,
    members: ['student_raphael', 'student_chidi', 'student_bassey'],
    rules: ['Be helpful and respect all skill levels.', 'No piracy or unauthorized assignment sharing.', 'Jobs shared must be campus-relatable or junior-friendly.']
  },
  {
    id: 'comm_law_society',
    name: 'The Lex Society',
    description: 'Gathering of legal minds. Discussions on campus court simulations, constitution drafting, current legislation analysis, and competitive debate sparring loops.',
    category: 'Academic',
    banner: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    logo: '⚖️',
    membersCount: 182,
    members: ['student_emem'],
    rules: ['Respect logical debate standards.', 'Ensure references to case laws are factually checked.', 'No hate speech or targeting representatives.']
  },
  {
    id: 'comm_hustle_hub',
    name: 'UniUyo Entrepreneurs Hub',
    description: 'Where business-oriented students, freelancers, shop-owners, and idea generators meet to collaborate, swap customer hacks, and promote student entrepreneurship.',
    category: 'Professional',
    banner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    logo: '🚀',
    membersCount: 310,
    members: ['student_chidi', 'student_raphael'],
    rules: ['Spamming business links is restricted to the weekly Pitch thread.', 'Constructive feedback on student projects is encouraged.', 'Collaboration first, competition second.']
  },
  {
    id: 'comm_creators_collective',
    name: 'Art & Framing Collective',
    description: 'Photographers, writers, digital painters, and musicians of UniUyo. Showcasing daily aesthetics, organizing photo walks on camp, and co-creating artwork.',
    category: 'Hobby',
    banner: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
    logo: '🎨',
    membersCount: 156,
    members: ['student_bassey', 'student_raphael'],
    rules: ['Always credit photographers and artists.', 'Keep visual and audio reviews constructive.', 'No copying or plagiarism.']
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'post_1',
    authorId: 'student_raphael',
    authorName: 'Raphael Akpabio',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    authorRole: 'Campus Creators',
    authorTag: 'Lead Designer',
    content: "Hey techies! Quick updates on the UniUyo Connect platform. I've designed the UI interfaces for mobile and web screens to support high-contrast responsive layouts. Do you prefer a dark-sided cosmic theme or a clean editorial off-white design? Drop your suggestions! 👇",
    category: 'Discussions',
    likes: ['student_chidi', 'student_bassey', 'student_emem'],
    comments: [
      {
        id: 'comment_seed_ralphy',
        postId: 'post_1',
        authorId: 'student_raphael',
        authorName: 'Raphael Akpabio',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        authorRole: 'Campus Creators',
        content: 'How does this hold up after 8 hours? I need something that survives my work shifts',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
        likes: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'u10', 'u11', 'u12', 'u13', 'u14', 'u15', 'u16', 'u17', 'u18']
      },
      {
        id: 'comment_seed_jess',
        postId: 'post_1',
        authorId: 'student_jessica',
        authorName: 'Jessica Thompson',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
        authorRole: 'Campus Creators',
        content: "Still going strong at hour 10! I set it with the translucent powder and didn't touch up once. Game changer for long days fr",
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
        parentId: 'comment_seed_ralphy',
        likes: []
      },
      {
        id: 'comment_seed_anna',
        postId: 'post_1',
        authorId: 'student_anna',
        authorName: 'Anna Johnson',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
        authorRole: 'Student Leaders',
        content: 'This is so seamless!',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
        likes: []
      }
    ],
    isPinned: true,
    createdAt: '2026-06-08T08:00:00Z'
  },
  {
    id: 'post_2',
    authorId: 'student_chidi',
    authorName: 'Chidi Nwachukwu',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    authorRole: 'Student Entrepreneurs',
    content: "We are launching Tusk Campus Laundry service next week! To celebrating, we're holding a launch poll: What is the most critical feature you look for in a campus delivery/errand business? Let's hear your thoughts, Uyo and Perm Site folks. Check the poll below!",
    category: 'Opinions',
    poll: {
      question: 'Most important factor for campus laundry & delivery:',
      options: [
        { id: 'opt_1', text: 'Speed (< 24 Hour Turnaround)', votes: ['student_raphael', 'student_bassey'] },
        { id: 'opt_2', text: 'Budget-Friendly Pricing', votes: ['student_emem'] },
        { id: 'opt_3', text: 'Careful & Reliable Handling', votes: ['student_chidi'] }
      ]
    },
    likes: ['student_raphael'],
    comments: [],
    createdAt: '2026-06-07T14:20:00Z'
  },
  {
    id: 'post_3',
    authorId: 'org_nacos',
    authorName: 'NACOS UniUyo Chapter',
    authorAvatar: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=256',
    authorRole: 'Student Organizations',
    authorTag: 'Executive Council',
    content: '🚨 ANNOUNCEMENT: The NACOS Hackathon 2026 is officially on! Teams of 3-5 students can now register to build software solutions addressing daily student challenges. Free internet access, certificates, and prizes for winning projects are available! Check out the details in the Events tab. 🚀',
    category: 'Announcements',
    likes: ['student_raphael', 'student_chidi', 'student_emem', 'student_bassey'],
    comments: [
      {
        id: 'comment_3_1',
        postId: 'post_3',
        authorId: 'student_emem',
        authorName: 'Emem Obong',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
        authorRole: 'Student Leaders',
        content: 'Fabulous opportunity! I hope non-technical students can join as legal and business advisors to form fully functional startup structures.',
        createdAt: '2026-06-07T18:00:00Z'
      }
    ],
    createdAt: '2026-06-07T11:00:00Z'
  },
  {
    id: 'post_4',
    authorId: 'student_bassey',
    authorName: 'Bassey Edet',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    authorRole: 'Campus Creators',
    content: "Captured this stunning golden sunset behind the Multi-purpose Hall at Perm Site today. Even with all the exams and stress, University of Uyo has some breathtaking visual frames. What do you think? 📷🌄",
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
    category: 'Experiences',
    likes: ['student_raphael', 'student_emem', 'student_chidi'],
    comments: [],
    createdAt: '2026-06-06T19:40:00Z'
  }
];

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp_1',
    title: 'Mobile Developer (Flutter/React Native) Intern',
    company: 'Tusk Logistics Nigeria',
    location: 'UniUyo Town Campus / Remote',
    type: 'Internship',
    description: 'Join the Tusk logistics startup founded on campus. Assisting in integrating delivery tracking, push alerts, and map routing. Full mentorship from senior programmers and small allowance included.',
    requirements: [
      'Basic understanding of JavaScript/TypeScript or Dart.',
      'Completed at least 200L as a Computer Science/Engineering student.',
      'Ready to commit 10 hours per week.'
    ],
    deadline: '2026-07-15',
    postedBy: 'student_chidi',
    postedByName: 'Chidi Nwachukwu',
    applications: ['student_raphael'],
    createdAt: '2026-06-08T09:00:00Z'
  },
  {
    id: 'opp_2',
    title: 'Uyo Tech Hub Academic Scholarship Program',
    company: 'Innovation Growth Foundation',
    location: 'UniUyo Science Park',
    type: 'Scholarship',
    description: 'Fully funded scholarship cover for the 2026 session, including mentorship and enrollment in intensive Fullstack Node/React bootcamps. Open to energetic low-income science students exhibiting brilliant results.',
    requirements: [
      'GPA of 3.8 and above on a 5.0 scale.',
      'Science, Math, or Engineering student.',
      'Write a 400-word essay explaining why technology interests you.'
    ],
    deadline: '2026-06-30',
    postedBy: 'org_nacos',
    postedByName: 'NACOS UniUyo Chapter',
    applications: [],
    createdAt: '2026-06-06T12:00:00Z'
  },
  {
    id: 'opp_3',
    title: 'Campus Ambassador Program - Creative Writer',
    company: 'Uyo Book & Literary Review',
    location: 'Town Campus Library',
    type: 'Volunteer',
    description: 'Represent and promote academic literature, organize panel circles, and write review articles for UniUyo literary magazine. Great resume booster for Arts / Comm Arts majors.',
    requirements: [
      'Passionate about blogging and reading books.',
      'Excellent command of English language.',
      'Submit 2 creative writing samples.'
    ],
    deadline: '2026-06-25',
    postedBy: 'student_bassey',
    postedByName: 'Bassey Edet',
    applications: [],
    createdAt: '2026-06-05T08:00:00Z'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'evt_1',
    title: 'NACOS Annual Campus Hackathon 2026',
    description: 'A 48-hour competitive sprint in the Computer Labs. Build solutions for student accommodation mapping, campus dispatching, and exam study calendars. Free lunch, energy drinks, and cash rewards for top 3 solutions!',
    hostId: 'org_nacos',
    hostName: 'NACOS UniUyo Chapter',
    hostAvatar: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=256',
    date: '2026-06-18',
    time: '09:00 AM',
    venue: 'New Computer Labs, Permanent Site',
    category: 'Tech',
    banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
    rsvps: ['student_raphael', 'student_chidi'],
    capacity: 100,
    createdAt: '2026-06-07T11:00:00Z'
  },
  {
    id: 'evt_2',
    title: 'Student Legal Clinic & Advisory Panel',
    description: 'Free advisory circle by final-year law students. Learn about legal drafting for student startups, intellectual property protection, and copyright issues for creative designers on campus.',
    hostId: 'student_emem',
    hostName: 'Emem Obong',
    hostAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    date: '2026-06-12',
    time: '02:00 PM',
    venue: 'Moot Court Block, Town Campus',
    category: 'Academic',
    banner: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&q=80&w=800',
    rsvps: ['student_emem', 'student_raphael', 'student_chidi'],
    capacity: 60,
    createdAt: '2026-06-06T15:00:00Z'
  },
  {
    id: 'evt_3',
    title: 'Street Photography Walk: Golden Hour Perm Site',
    description: 'Gathering of photographers, model volunteers, and content curators. We will walk from the main gate to the CBT center catching backlights, retro buildings, and student shadows.',
    hostId: 'student_bassey',
    hostName: 'Bassey Edet',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    date: '2026-06-15',
    time: '04:30 PM',
    venue: 'Main Gate Roundabout, Perm Site',
    category: 'Social',
    banner: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800',
    rsvps: ['student_bassey', 'student_raphael'],
    capacity: 25,
    createdAt: '2026-06-05T19:00:00Z'
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    title: 'UniUyo Connect Platform',
    description: 'The exact campus student identity dashboard and discovery feed enabling real-time RSVPs, opportunities, peer networking, and community forums across all faculties.',
    category: 'Tech',
    creatorId: 'student_raphael',
    creatorName: 'Raphael Akpabio',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    stage: 'MVP',
    upvotes: ['student_chidi', 'student_bassey', 'student_emem'],
    links: {
      github: 'https://github.com',
      website: 'https://uniuyo-connect.app'
    },
    createdAt: '2026-06-08T08:00:00Z'
  },
  {
    id: 'proj_2',
    title: 'Tusk Laundry & Errand Bot',
    description: 'A logistics software that automates requests for laundry collections and quick grocery deliveries across Uyo Town Campus hostels. Complete tracking, instant notices, and cashless checkout.',
    category: 'Business',
    creatorId: 'student_chidi',
    creatorName: 'Chidi Nwachukwu',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    stage: 'Launched',
    upvotes: ['student_raphael', 'student_bassey'],
    links: {
      twitter: 'https://twitter.com',
      website: 'https://tusk-delivery.com'
    },
    createdAt: '2026-06-04T12:00:00Z'
  },
  {
    id: 'proj_3',
    title: 'Town Campus Virtual Walkway',
    description: 'Beautiful spherical 360 photography series capturing historical buildings, departmental pathways, lecture halls, and hangout spaces to guide freshman orientations.',
    category: 'Creative',
    creatorId: 'student_bassey',
    creatorName: 'Bassey Edet',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    stage: 'Idea',
    upvotes: ['student_raphael'],
    links: {
      github: 'https://github.com'
    },
    createdAt: '2026-06-03T17:00:00Z'
  }
];
