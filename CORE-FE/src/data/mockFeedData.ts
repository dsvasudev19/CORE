import { type FeedItemData } from "../components/dashboard/employee-home/FeedItem";

// Mock feed data for the news feed
export const mockFeedData: FeedItemData[] = [
  {
    id: "1",
    type: "announcement",
    title: "Q4 All-Hands Meeting - Join us this Friday",
    excerpt:
      "Join us for our quarterly all-hands meeting where we'll discuss company performance, upcoming initiatives, and celebrate team achievements.",
    author: "Sarah Johnson",
    authorAvatar: undefined,
    publishedDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    priority: "high",
    category: "Company Update",
    imageUrl: undefined,
    isPinned: true,
    reactions: {
      likes: 45,
      comments: 12,
    },
  },
  {
    id: "2",
    type: "news",
    title: "New Employee Benefits Program Launched",
    excerpt:
      "We're excited to announce our enhanced benefits program including expanded health coverage, wellness initiatives, and professional development opportunities.",
    author: "Michael Chen",
    authorAvatar: undefined,
    publishedDate: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    priority: "medium",
    category: "HR News",
    imageUrl: undefined,
    isPinned: false,
    reactions: {
      likes: 78,
      comments: 23,
    },
  },
  {
    id: "3",
    type: "article",
    title: "Best Practices for Remote Work Productivity",
    excerpt:
      "Learn effective strategies to maintain productivity while working remotely, including time management tips, communication best practices, and work-life balance techniques.",
    author: "Emily Rodriguez",
    authorAvatar: undefined,
    publishedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    priority: undefined,
    category: "Productivity",
    imageUrl: undefined,
    isPinned: false,
    reactions: {
      likes: 34,
      comments: 8,
    },
  },
  {
    id: "4",
    type: "announcement",
    title: "Office Renovation Schedule - Building A",
    excerpt:
      "Building A will undergo renovations starting next month. Please review the schedule and temporary workspace assignments.",
    author: "David Park",
    authorAvatar: undefined,
    publishedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    priority: "medium",
    category: "Facilities",
    imageUrl: undefined,
    isPinned: false,
    reactions: {
      likes: 12,
      comments: 5,
    },
  },
  {
    id: "5",
    type: "news",
    title: "Company Wins Industry Excellence Award",
    excerpt:
      "We're proud to announce that our team has been recognized with the Industry Excellence Award for innovation and customer satisfaction.",
    author: "Jennifer Lee",
    authorAvatar: undefined,
    publishedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    priority: undefined,
    category: "Achievement",
    imageUrl: undefined,
    isPinned: false,
    reactions: {
      likes: 156,
      comments: 42,
    },
  },
  {
    id: "6",
    type: "article",
    title: "Understanding Our New Performance Review Process",
    excerpt:
      "A comprehensive guide to our updated performance review system, including timelines, evaluation criteria, and how to prepare for your review.",
    author: "Robert Martinez",
    authorAvatar: undefined,
    publishedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    priority: undefined,
    category: "HR Policy",
    imageUrl: undefined,
    isPinned: false,
    reactions: {
      likes: 67,
      comments: 18,
    },
  },
  {
    id: "7",
    type: "announcement",
    title: "Holiday Schedule and Office Closure Dates",
    excerpt:
      "Please note the upcoming holiday schedule and office closure dates for the remainder of the year. Plan your time off accordingly.",
    author: "Amanda White",
    authorAvatar: undefined,
    publishedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    priority: "high",
    category: "Important",
    imageUrl: undefined,
    isPinned: true,
    reactions: {
      likes: 89,
      comments: 15,
    },
  },
  {
    id: "8",
    type: "news",
    title: "New Partnership Announcement with TechCorp",
    excerpt:
      "We're thrilled to announce our strategic partnership with TechCorp, which will bring exciting new opportunities for growth and innovation.",
    author: "James Wilson",
    authorAvatar: undefined,
    publishedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    priority: undefined,
    category: "Business",
    imageUrl: undefined,
    isPinned: false,
    reactions: {
      likes: 124,
      comments: 31,
    },
  },
  {
    id: "9",
    type: "article",
    title: "Cybersecurity Best Practices for Employees",
    excerpt:
      "Essential cybersecurity tips to protect company data and your personal information. Learn about password management, phishing awareness, and secure browsing.",
    author: "Lisa Anderson",
    authorAvatar: undefined,
    publishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    priority: undefined,
    category: "IT Security",
    imageUrl: undefined,
    isPinned: false,
    reactions: {
      likes: 43,
      comments: 9,
    },
  },
  {
    id: "10",
    type: "news",
    title: "Employee Spotlight: Meet Our Team Leaders",
    excerpt:
      "Get to know the amazing leaders who drive our success. This month we're featuring interviews with department heads and their vision for the future.",
    author: "Kevin Brown",
    authorAvatar: undefined,
    publishedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    priority: undefined,
    category: "Culture",
    imageUrl: undefined,
    isPinned: false,
    reactions: {
      likes: 92,
      comments: 27,
    },
  },
];

// Additional items for pagination (simulating more data)
export const mockFeedDataPage2: FeedItemData[] = [
  {
    id: "11",
    type: "article",
    title: "Time Management Techniques for Busy Professionals",
    excerpt:
      "Discover proven time management strategies that can help you prioritize tasks, reduce stress, and achieve better work-life balance.",
    author: "Patricia Davis",
    authorAvatar: undefined,
    publishedDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    priority: undefined,
    category: "Professional Development",
    imageUrl: undefined,
    isPinned: false,
    reactions: {
      likes: 56,
      comments: 14,
    },
  },
  {
    id: "12",
    type: "announcement",
    title: "Updated COVID-19 Safety Protocols",
    excerpt:
      "Please review our updated health and safety protocols to ensure a safe working environment for everyone.",
    author: "Dr. Susan Miller",
    authorAvatar: undefined,
    publishedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    priority: "medium",
    category: "Health & Safety",
    imageUrl: undefined,
    isPinned: false,
    reactions: {
      likes: 38,
      comments: 11,
    },
  },
  {
    id: "13",
    type: "news",
    title: "Q3 Financial Results Exceed Expectations",
    excerpt:
      "Our Q3 performance has exceeded projections, demonstrating strong growth across all business units. Thank you for your hard work!",
    author: "Thomas Garcia",
    authorAvatar: undefined,
    publishedDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    priority: undefined,
    category: "Financial",
    imageUrl: undefined,
    isPinned: false,
    reactions: {
      likes: 187,
      comments: 45,
    },
  },
  {
    id: "14",
    type: "article",
    title: "Effective Communication in Virtual Teams",
    excerpt:
      "Learn how to communicate effectively with remote team members, overcome common challenges, and build stronger virtual relationships.",
    author: "Rachel Thompson",
    authorAvatar: undefined,
    publishedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    priority: undefined,
    category: "Communication",
    imageUrl: undefined,
    isPinned: false,
    reactions: {
      likes: 71,
      comments: 19,
    },
  },
  {
    id: "15",
    type: "news",
    title: "New Office Space Opening in Downtown",
    excerpt:
      "We're expanding! Our new downtown office will open next quarter, offering modern facilities and convenient location for our growing team.",
    author: "Christopher Moore",
    authorAvatar: undefined,
    publishedDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
    priority: undefined,
    category: "Expansion",
    imageUrl: undefined,
    isPinned: false,
    reactions: {
      likes: 143,
      comments: 38,
    },
  },
];
