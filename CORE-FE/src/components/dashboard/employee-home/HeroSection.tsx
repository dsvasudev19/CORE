import { Clock, CheckSquare, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
    employeeName: string;
    stats: {
        pendingTasks: number;
        hoursThisWeek: number;
        leaveBalance: number;
    };
}

const HeroSection = ({ employeeName, stats }: HeroSectionProps) => {
    const navigate = useNavigate();

    // Get current date and time
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Get time-based greeting
    const hour = now.getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) {
        greeting = 'Good afternoon';
    } else if (hour >= 17) {
        greeting = 'Good evening';
    }

    return (
        <section className="hero-section">
            <div className="bg-gradient-to-r from-burgundy-600 to-steel-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Personalized Greeting */}
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                            {greeting}, {employeeName}! 👋
                        </h1>
                        <p className="text-burgundy-100 mt-2 text-sm sm:text-base">
                            {dateString}
                        </p>
                    </div>

                    {/* Quick Stats Cards */}
                    <div className="flex gap-3 flex-wrap lg:flex-nowrap">
                        {/* Pending Tasks Stat */}
                        <button
                            onClick={() => navigate('/e/tasks')}
                            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex-1 min-w-[140px] hover:bg-white/20 transition-all duration-200 hover:scale-105 cursor-pointer group"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <CheckSquare size={18} className="text-burgundy-100 group-hover:text-white transition-colors" />
                                <p className="text-sm text-burgundy-100 group-hover:text-white transition-colors">
                                    Pending Tasks
                                </p>
                            </div>
                            <p className="text-2xl sm:text-3xl font-bold">{stats.pendingTasks}</p>
                        </button>

                        {/* Hours This Week Stat */}
                        <button
                            onClick={() => navigate('/e/timesheet')}
                            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex-1 min-w-[140px] hover:bg-white/20 transition-all duration-200 hover:scale-105 cursor-pointer group"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Clock size={18} className="text-burgundy-100 group-hover:text-white transition-colors" />
                                <p className="text-sm text-burgundy-100 group-hover:text-white transition-colors">
                                    Hours This Week
                                </p>
                            </div>
                            <p className="text-2xl sm:text-3xl font-bold">{stats.hoursThisWeek}</p>
                        </button>

                        {/* Leave Balance Stat */}
                        <button
                            onClick={() => navigate('/e/leave')}
                            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex-1 min-w-[140px] hover:bg-white/20 transition-all duration-200 hover:scale-105 cursor-pointer group"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar size={18} className="text-burgundy-100 group-hover:text-white transition-colors" />
                                <p className="text-sm text-burgundy-100 group-hover:text-white transition-colors">
                                    Leave Balance
                                </p>
                            </div>
                            <p className="text-2xl sm:text-3xl font-bold">{stats.leaveBalance}</p>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
