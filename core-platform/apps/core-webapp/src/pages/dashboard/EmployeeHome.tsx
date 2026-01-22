import { useState, useEffect } from 'react';
import HeroSection from '../../components/dashboard/employee-home/HeroSection';
import QuickLinksGrid from '../../components/dashboard/employee-home/QuickLinksGrid';
import NewsFeed from '../../components/dashboard/employee-home/NewsFeed';
import MyTasksWidget from '../../components/dashboard/employee-home/MyTasksWidget';
import UpcomingEventsWidget from '../../components/dashboard/employee-home/UpcomingEventsWidget';
import LeaveBalanceWidget from '../../components/dashboard/employee-home/LeaveBalanceWidget';
import type { FeedItemData } from '../../components/dashboard/employee-home/FeedItem';
import type { Task } from '../../components/dashboard/employee-home/MyTasksWidget';
import type { Event } from '../../components/dashboard/employee-home/UpcomingEventsWidget';
import type { LeaveBalance } from '../../components/dashboard/employee-home/LeaveBalanceWidget';
import { mockFeedData, mockFeedDataPage2 } from '../../data/mockFeedData';

const EmployeeHome = () => {
    // Mock employee data - will be replaced with real data later
    const employeeName = 'Sarah';
    const stats = {
        pendingTasks: 8,
        hoursThisWeek: 32.5,
        leaveBalance: 12,
    };

    // Feed state
    const [feedItems, setFeedItems] = useState<FeedItemData[]>([]);
    const [isLoadingFeed, setIsLoadingFeed] = useState(true);
    const [hasMoreFeed, setHasMoreFeed] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Mock tasks data
    const mockTasks: Task[] = [
        {
            id: '1',
            title: 'Complete Q4 Performance Review',
            dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
            priority: 'high',
            status: 'pending',
        },
        {
            id: '2',
            title: 'Submit Expense Report',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            priority: 'medium',
            status: 'pending',
        },
        {
            id: '3',
            title: 'Review Team Documentation',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            priority: 'low',
            status: 'pending',
        },
    ];

    // Mock events data
    const mockEvents: Event[] = [
        {
            id: '1',
            title: 'Team Standup Meeting',
            startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
            endTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000),
            type: 'meeting',
            location: 'Conference Room A',
        },
        {
            id: '2',
            title: 'Project Deadline: Frontend Redesign',
            startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
            endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            type: 'deadline',
        },
        {
            id: '3',
            title: 'Company All-Hands Meeting',
            startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
            endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
            type: 'event',
            location: 'Virtual - Zoom',
        },
    ];

    // Mock leave balance data
    const mockLeaveBalance: LeaveBalance = {
        total: 20,
        used: 8,
        pending: 2,
        available: 10,
    };

    // Simulate initial data fetch
    useEffect(() => {
        const loadInitialFeed = async () => {
            setIsLoadingFeed(true);
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 800));
            setFeedItems(mockFeedData);
            setIsLoadingFeed(false);
        };

        loadInitialFeed();
    }, []);

    // Handle load more
    const handleLoadMore = async () => {
        setIsLoadingFeed(true);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 600));

        if (currentPage === 1) {
            // Load page 2
            setFeedItems([...feedItems, ...mockFeedDataPage2]);
            setCurrentPage(2);
            setHasMoreFeed(false); // No more pages after this
        }

        setIsLoadingFeed(false);
    };

    return (
        <div className="space-y-4">
            {/* Hero Section */}
            <HeroSection employeeName={employeeName} stats={stats} />

            {/* Quick Links Section - Compact */}
            <section className="quick-links-section">
                <div className="bg-white border border-steel-200 rounded-xl p-4">
                    <h2 className="text-sm font-semibold text-steel-900 mb-3">Quick Access</h2>
                    <QuickLinksGrid />
                </div>
            </section>

            {/* Main Content Area - Feed and Widgets */}
            <section className="main-content-section">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* News Feed Column (Left - 2/3) */}
                    <div className="lg:col-span-2">
                        <NewsFeed
                            items={feedItems}
                            onLoadMore={handleLoadMore}
                            hasMore={hasMoreFeed}
                            isLoading={isLoadingFeed}
                        />
                    </div>

                    {/* Widgets Sidebar (Right - 1/3) */}
                    <div className="space-y-4">
                        {/* My Tasks Widget */}
                        <MyTasksWidget tasks={mockTasks} totalCount={8} isLoading={false} />

                        {/* Upcoming Events Widget */}
                        <UpcomingEventsWidget events={mockEvents} isLoading={false} />

                        {/* Leave Balance Widget */}
                        <LeaveBalanceWidget balance={mockLeaveBalance} isLoading={false} />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EmployeeHome;
