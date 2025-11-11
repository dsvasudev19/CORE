import {  Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface LeaveBalance {
    total: number;
    used: number;
    pending: number;
    available: number;
}

interface LeaveBalanceWidgetProps {
    balance: LeaveBalance;
    isLoading?: boolean;
}

const LeaveBalanceWidget = ({ balance, isLoading = false }: LeaveBalanceWidgetProps) => {
    const getBalanceStatus = () => {
        const percentage = (balance.available / balance.total) * 100;
        if (percentage > 50) {
            return { color: 'bg-green-500', textColor: 'text-green-600' };
        } else if (percentage > 25) {
            return { color: 'bg-yellow-500', textColor: 'text-yellow-600' };
        } else {
            return { color: 'bg-red-500', textColor: 'text-red-600' };
        }
    };

    const status = getBalanceStatus();
    const usedPercentage = (balance.used / balance.total) * 100;
    const pendingPercentage = (balance.pending / balance.total) * 100;
    const availablePercentage = (balance.available / balance.total) * 100;

    if (isLoading) {
        return (
            <div className="bg-white border border-steel-200 rounded-xl p-4">
                <div className="h-5 w-28 bg-steel-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                    <div className="h-2 bg-steel-200 rounded-full animate-pulse"></div>
                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-1">
                                <div className="h-3 w-16 bg-steel-200 rounded animate-pulse"></div>
                                <div className="h-6 w-12 bg-steel-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-steel-200 rounded-xl p-4">
            <h3 className="text-base font-semibold text-steel-900 mb-4">Leave Balance</h3>

            {/* Visual Progress Bar */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-steel-600">Days Available</span>
                    <span className={`text-sm font-semibold ${status.textColor}`}>
                        {balance.available} of {balance.total}
                    </span>
                </div>
                <div className="w-full h-2 bg-steel-100 rounded-full overflow-hidden">
                    <div className="h-full flex">
                        <div
                            className="bg-steel-400 h-full"
                            style={{ width: `${usedPercentage}%` }}
                            title={`Used: ${balance.used} days`}
                        ></div>
                        <div
                            className="bg-yellow-400 h-full"
                            style={{ width: `${pendingPercentage}%` }}
                            title={`Pending: ${balance.pending} days`}
                        ></div>
                        <div
                            className={`${status.color} h-full`}
                            style={{ width: `${availablePercentage}%` }}
                            title={`Available: ${balance.available} days`}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Balance Details */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-steel-50 rounded-lg p-2">
                    <p className="text-xs text-steel-600">Total</p>
                    <p className="text-lg font-semibold text-steel-900">{balance.total}</p>
                </div>
                <div className="bg-steel-50 rounded-lg p-2">
                    <p className="text-xs text-steel-600">Used</p>
                    <p className="text-lg font-semibold text-steel-900">{balance.used}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-2">
                    <p className="text-xs text-yellow-700">Pending</p>
                    <p className="text-lg font-semibold text-yellow-700">{balance.pending}</p>
                </div>
                <div className={`${status.color.replace('bg-', 'bg-').replace('-500', '-50')} rounded-lg p-2`}>
                    <p className={`text-xs ${status.textColor}`}>Available</p>
                    <p className={`text-lg font-semibold ${status.textColor}`}>{balance.available}</p>
                </div>
            </div>

            {/* Request Leave Button */}
            <Link
                to="/e/leave"
                className="flex items-center justify-center gap-2 w-full bg-burgundy-600 hover:bg-burgundy-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
                <Plus className="w-4 h-4" />
                Request Leave
            </Link>
        </div>
    );
};

export default LeaveBalanceWidget;
