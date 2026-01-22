import React, { useState, useEffect } from 'react';
import { Shield, Search, User, Calendar, FileText, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { auditLogService } from '../../services/auditLog.service';
import type { AuditLogDTO } from '../../types/auditLog.types';

const AuditLogList: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 20;
  const organizationId = 1; // TODO: Get from auth context

  useEffect(() => {
    fetchLogs();
  }, [currentPage, searchKeyword]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await auditLogService.searchAuditLogs(
        organizationId,
        searchKeyword || undefined,
        currentPage,
        pageSize
      );
      setLogs(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create')) return 'bg-green-50 text-green-700 border-green-200';
    if (actionLower.includes('update') || actionLower.includes('edit')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (actionLower.includes('delete')) return 'bg-red-50 text-red-700 border-red-200';
    if (actionLower.includes('login') || actionLower.includes('logout')) return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(0); // Reset to first page on search
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <Shield size={22} /> Audit Logs
            </h1>
            <div className="flex items-center gap-3">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by action, entity, or user..."
                  value={searchKeyword}
                  onChange={e => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto px-6 py-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-900">{logs.length}</span> of{' '}
              <span className="font-semibold text-slate-900">{totalElements}</span> audit logs
            </div>
            <div className="text-sm text-slate-600">
              Page <span className="font-semibold text-slate-900">{currentPage + 1}</span> of{' '}
              <span className="font-semibold text-slate-900">{totalPages || 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-6 pb-6">
        {loading ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <Loader2 className="mx-auto animate-spin text-red-900" size={32} />
            <p className="text-slate-600 mt-3">Loading audit logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <Shield size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-semibold text-slate-700 mb-1">No audit logs found</h3>
            <p className="text-slate-500 text-sm">
              {searchKeyword ? 'Try adjusting your search' : 'No activity has been logged yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Entity
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Entity ID
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Metadata
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Calendar size={14} className="text-slate-400" />
                          {formatDate(log.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center text-white font-semibold text-xs">
                            <User size={14} />
                          </div>
                          <span className="text-sm font-medium text-slate-900">
                            User #{log.userId}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getActionColor(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <FileText size={14} className="text-slate-400" />
                          {log.entityName}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                          #{log.entityId}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {log.metadata ? (
                          <div className="text-xs text-slate-600 max-w-xs truncate" title={log.metadata}>
                            {log.metadata}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between bg-white rounded-lg border border-slate-200 px-4 py-3">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (currentPage < 3) {
                      pageNum = i;
                    } else if (currentPage > totalPages - 3) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-md text-sm font-medium ${
                          currentPage === pageNum
                            ? 'bg-red-900 text-white'
                            : 'border border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuditLogList;
