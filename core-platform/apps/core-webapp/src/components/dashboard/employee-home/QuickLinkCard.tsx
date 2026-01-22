import { type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickLinkCardProps {
    id: string;
    label: string;
    icon: LucideIcon;
    href: string;
    badge?: number;
    color?: 'blue' | 'purple' | 'green' | 'orange' | 'indigo' | 'red' | 'teal';
}

const QuickLinkCard = ({ label, icon: Icon, href, badge, color = 'blue' }: QuickLinkCardProps) => {
    const navigate = useNavigate();

    // Color mapping for different link types
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-300',
        purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100 hover:border-purple-300',
        green: 'bg-green-50 text-green-600 hover:bg-green-100 hover:border-green-300',
        orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100 hover:border-orange-300',
        indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300',
        red: 'bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300',
        teal: 'bg-teal-50 text-teal-600 hover:bg-teal-100 hover:border-teal-300',
    };

    const badgeColorClasses = {
        blue: 'bg-blue-600',
        purple: 'bg-purple-600',
        green: 'bg-green-600',
        orange: 'bg-orange-600',
        indigo: 'bg-indigo-600',
        red: 'bg-red-600',
        teal: 'bg-teal-600',
    };

    const handleClick = () => {
        navigate(href);
    };

    return (
        <button
            onClick={handleClick}
            className={`
                relative bg-white border border-steel-200 rounded-lg p-2
                hover:shadow-sm hover:border-burgundy-300
                transition-all duration-200
                cursor-pointer group
                focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-1
            `}
        >
            {/* Badge for notifications */}
            {badge !== undefined && badge > 0 && (
                <span
                    className={`
                        absolute -top-1 -right-1
                        ${badgeColorClasses[color]}
                        text-white text-[10px] font-bold
                        rounded-full w-4 h-4
                        flex items-center justify-center
                        shadow-sm
                    `}
                >
                    {badge > 9 ? '9+' : badge}
                </span>
            )}

            <div className="flex flex-col items-center text-center">
                {/* Icon container with color coding */}
                <div
                    className={`
                        w-8 h-8 rounded-lg
                        flex items-center justify-center
                        mb-1.5
                        transition-colors duration-200
                        ${colorClasses[color]}
                    `}
                >
                    <Icon size={16} className="transition-transform duration-200 group-hover:scale-110" />
                </div>

                {/* Label */}
                <p className="text-[11px] font-medium text-steel-900 group-hover:text-burgundy-700 transition-colors leading-tight">
                    {label}
                </p>
            </div>
        </button>
    );
};

export default QuickLinkCard;
