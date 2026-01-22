import {
    FolderOpen,
    FileText,
    Calendar,
    Award,
    BookOpen,
    Megaphone,
    DollarSign,
    BarChart,
} from 'lucide-react';
import QuickLinkCard from './QuickLinkCard';

interface QuickLink {
    id: string;
    label: string;
    icon: typeof FolderOpen;
    href: string;
    badge?: number;
    color: 'blue' | 'purple' | 'green' | 'orange' | 'indigo' | 'red' | 'teal';
}

interface QuickLinksGridProps {
    links?: QuickLink[];
}

const QuickLinksGrid = ({ links }: QuickLinksGridProps) => {
    // Default quick links configuration
    const defaultLinks: QuickLink[] = [
        {
            id: 'projects',
            label: 'My Projects',
            icon: FolderOpen,
            href: '/e/projects',
            color: 'blue',
        },
        {
            id: 'documents',
            label: 'Documents',
            icon: FileText,
            href: '/e/documents',
            color: 'purple',
        },
        {
            id: 'leave',
            label: 'Leave Requests',
            icon: Calendar,
            href: '/e/leave',
            badge: 2, // Example: 2 pending requests
            color: 'green',
        },
        {
            id: 'performance',
            label: 'Performance',
            icon: Award,
            href: '/e/performance',
            color: 'orange',
        },
        {
            id: 'training',
            label: 'Training',
            icon: BookOpen,
            href: '/e/training',
            badge: 3, // Example: 3 new courses
            color: 'indigo',
        },
        {
            id: 'announcements',
            label: 'Announcements',
            icon: Megaphone,
            href: '/e/announcements',
            badge: 5, // Example: 5 unread announcements
            color: 'red',
        },
        {
            id: 'payslip',
            label: 'Payslip',
            icon: DollarSign,
            href: '/e/payroll',
            color: 'green',
        },
        {
            id: 'reports',
            label: 'Reports',
            icon: BarChart,
            href: '/e/reports',
            color: 'teal',
        },
    ];

    const quickLinks = links || defaultLinks;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {quickLinks.map((link) => (
                <QuickLinkCard
                    key={link.id}
                    id={link.id}
                    label={link.label}
                    icon={link.icon}
                    href={link.href}
                    badge={link.badge}
                    color={link.color}
                />
            ))}
        </div>
    );
};

export default QuickLinksGrid;
