import { useState, useMemo } from 'react';
import { Plus, Search, ChevronDown, ChevronRight, X, GripVertical, Loader2, CheckCircle2 as CheckIcon, AlertCircle } from 'lucide-react';

const EpicManagement = () => {
  const [expandedSprints, setExpandedSprints] = useState<Record<string, boolean>>({ sprint1: true, sprint2: true });
  const [expandedEpics, setExpandedEpics] = useState<Record<string | number, boolean>>({ 1: true, 2: true, backlog: true, noepic: true });
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [draggedIssue, setDraggedIssue] = useState<any>(null);
  const [dragOverSprint, setDragOverSprint] = useState<string | null>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Form state for modal
  const [formData, setFormData] = useState({
    summary: '',
    type: 'Story',
    priority: 'Medium',
    storyPoints: 0,
    epicId: null as number | null,
    assignee: '',
    description: ''
  });

  // Show toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Sample data (unchanged)
  const sprints = [
    { id: 'sprint1', name: 'Sprint 23', status: 'active', startDate: '2025-11-10', endDate: '2025-11-24', goal: 'Complete user authentication and payment setup', issues: ['PROJ-101', 'PROJ-102', 'PROJ-104'] },
    { id: 'sprint2', name: 'Sprint 24', status: 'future', startDate: null, endDate: null, goal: '', issues: ['PROJ-105'] }
  ];

  const epics = [
    { id: 1, key: 'PROJ-1', name: 'User Authentication System', color: '#6554C0' },
    { id: 2, key: 'PROJ-2', name: 'Payment Integration', color: '#00875A' }
  ];

  type Issue = {
    id: number;
    key: string;
    type: string;
    summary: string;
    epicId: number | null;
    priority: string;
    assignee: string | null;
    storyPoints: number;
    status: string;
    sprintId: string | null;
  };

  const [issues, setIssues] = useState<Issue[]>([
    { id: 1, key: 'PROJ-101', type: 'Story', summary: 'Implement OAuth2 authentication flow', epicId: 1, priority: 'Highest', assignee: 'Sarah Chen', storyPoints: 8, status: 'In Progress', sprintId: 'sprint1' },
    { id: 2, key: 'PROJ-102', type: 'Story', summary: 'Design login and registration screens', epicId: 1, priority: 'High', assignee: 'Mike Johnson', storyPoints: 5, status: 'Done', sprintId: 'sprint1' },
    { id: 3, key: 'PROJ-103', type: 'Bug', summary: 'Login button not responsive on mobile', epicId: 1, priority: 'Highest', assignee: null, storyPoints: 3, status: 'To Do', sprintId: null },
    { id: 4, key: 'PROJ-104', type: 'Task', summary: 'Set up JWT token management', epicId: 1, priority: 'Medium', assignee: 'Sarah Chen', storyPoints: 3, status: 'In Progress', sprintId: 'sprint1' },
    { id: 5, key: 'PROJ-105', type: 'Story', summary: 'Integrate Stripe payment gateway', epicId: 2, priority: 'Highest', assignee: 'John Davis', storyPoints: 13, status: 'To Do', sprintId: 'sprint2' },
    { id: 6, key: 'PROJ-106', type: 'Story', summary: 'Add PayPal as payment option', epicId: 2, priority: 'High', assignee: null, storyPoints: 8, status: 'To Do', sprintId: null },
    { id: 7, key: 'PROJ-107', type: 'Story', summary: 'Create analytics dashboard layout', epicId: null, priority: 'Medium', assignee: 'Emily Rodriguez', storyPoints: 5, status: 'To Do', sprintId: null },
    { id: 8, key: 'PROJ-108', type: 'Story', summary: 'Implement data visualization charts', epicId: null, priority: 'High', assignee: 'Emily Rodriguez', storyPoints: 8, status: 'To Do', sprintId: null }
  ]);

  // Real-time search & filter
  const filteredIssues = useMemo(() => {
    return issues.filter(issue =>
    (issue.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.key.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [issues, searchQuery]);

  // Toggle selection
  const toggleIssueSelection = (key: string) => {
    setSelectedIssues(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  // Drag & drop
  const handleDragStart = (e: React.DragEvent, issue: any) => {
    setDraggedIssue(issue);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetSprintId: string | null) => {
    e.preventDefault();
    if (!draggedIssue) return;

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400)); // fake delay

    setIssues(prev => prev.map(iss => iss.id === draggedIssue.id ? { ...iss, sprintId: targetSprintId } : iss));
    showToast('Issue moved', 'success');
    setDraggedIssue(null);
    setDragOverSprint(null);
    setIsLoading(false);
  };

  // Create / Update issue
  const handleSaveIssue = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400));

    if (selectedIssue) {
      setIssues(prev => prev.map(iss => iss.id === selectedIssue.id ? { ...iss, ...formData, epicId: formData.epicId || null } : iss));
      showToast('Issue updated', 'success');
    } else {
      const newIssue = {
        id: issues.length + 100,
        key: `PROJ-${String(100 + issues.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 'To Do',
        sprintId: null
      };
      setIssues(prev => [...prev, newIssue]);
      showToast('Issue created', 'success');
    }

    setShowIssueModal(false);
    setSelectedIssue(null);
    setIsLoading(false);
  };

  // Open modal – populate form if editing
  const openIssueModal = (issue: any = null) => {
    setSelectedIssue(issue);
    if (issue) {
      setFormData({
        summary: issue.summary,
        type: issue.type,
        priority: issue.priority,
        storyPoints: issue.storyPoints || 0,
        epicId: issue.epicId,
        assignee: issue.assignee || '',
        description: ''
      });
    } else {
      setFormData({ summary: '', type: 'Story', priority: 'Medium', storyPoints: 0, epicId: null, assignee: '', description: '' });
    }
    setShowIssueModal(true);
  };

  // Simple icons
  const getIssueIcon = (type: string) => {
    const map: any = {
      Story: <rect width="16" height="16" rx="2" fill="#63BA3C" />,
      Bug: <circle cx="8" cy="8" r="7" fill="#E5493A" />,
      Task: <path d="M2 2 L14 2 L8 14 Z" fill="#4BADE8" />
    };
    return <svg width="16" height="16" viewBox="0 0 16 16">{map[type] || map.Task}</svg>;
  };

  const IssueRow = ({ issue }: { issue: any }) => {
    const isSelected = selectedIssues.includes(issue.key);
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, issue)}
        onClick={() => !selectedIssues.length && openIssueModal(issue)}
        className={`flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded cursor-move group transition-all ${isSelected ? 'bg-blue-50 ring-2 ring-blue-500' : ''}`}
      >
        <GripVertical size={16} className="text-gray-400 opacity-0 group-hover:opacity-100" />
        <input type="checkbox" checked={isSelected} onChange={() => toggleIssueSelection(issue.key)} onClick={e => e.stopPropagation()} className="rounded" />
        <div className="flex items-center gap-2 flex-1">
          {getIssueIcon(issue.type)}
          <span className="text-sm font-medium text-gray-600">{issue.key}</span>
          <span className="text-sm truncate">{issue.summary}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {issue.epicId && <div className="w-3 h-3 rounded" style={{ backgroundColor: epics.find(e => e.id === issue.epicId)?.color }} />}
          <span className="text-gray-500">{issue.priority[0]}</span>
          {issue.assignee && <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center">{issue.assignee.split(' ').map((n: string) => n[0]).join('')}</div>}
          {issue.storyPoints > 0 && <span className="font-medium">{issue.storyPoints}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-white flex items-center gap-2 shadow-lg ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}>
          {toast.type === 'success' ? <CheckIcon size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">Backlog</h1>
            <div className="flex items-center gap-3">
              {selectedIssues.length > 0 && (
                <div className="bg-blue-50 px-4 py-2 rounded-lg text-sm">
                  {selectedIssues.length} selected
                </div>
              )}
              <button className="px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"><Search size={16} /> Search</button>
              <button onClick={() => openIssueModal()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
                <Plus size={16} /> Create issue
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Sprints + Backlog rendering (same structure as before but simplified) */}
          {sprints.map(sprint => {
            const sprintIssues = filteredIssues.filter(i => i.sprintId === sprint.id);
            return (
              <div
                key={sprint.id}
                className={`border rounded-lg overflow-hidden transition-all ${dragOverSprint === sprint.id ? 'ring-4 ring-blue-400 bg-blue-50' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOverSprint(sprint.id); }}
                onDragLeave={() => setDragOverSprint(null)}
                onDrop={e => handleDrop(e, sprint.id)}
              >
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setExpandedSprints(p => ({ ...p, [sprint.id]: !p[sprint.id] }))}>
                      {expandedSprints[sprint.id] ? <ChevronDown /> : <ChevronRight />}
                    </button>
                    <div>
                      <h3 className="font-semibold">{sprint.name}</h3>
                      {sprint.goal && <p className="text-sm text-gray-600">{sprint.goal}</p>}
                    </div>
                  </div>
                </div>
                {expandedSprints[sprint.id] && (
                  <div className="p-4 bg-white space-y-1">
                    {sprintIssues.length === 0 ? <p className="text-center text-gray-500 py-8">Drop issues here</p> : sprintIssues.map(iss => <IssueRow key={iss.id} issue={iss} />)}
                  </div>
                )}
              </div>
            );
          })}

          {/* Backlog section */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOverSprint(null); }}
            onDrop={e => handleDrop(e, null)}
            className={`p-4 rounded-lg border-2 border-dashed ${dragOverSprint === null ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}`}
          >
            <h3 className="font-semibold mb-3">Backlog ({filteredIssues.filter(i => !i.sprintId).length})</h3>
            <div className="space-y-4">
              {epics.map(epic => {
                const epicIssues = filteredIssues.filter(i => i.epicId === epic.id && !i.sprintId);
                if (epicIssues.length === 0) return null;
                return (
                  <div key={epic.id}>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setExpandedEpics(p => ({ ...p, [epic.id]: !p[epic.id] }))}>
                        {expandedEpics[epic.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: epic.color }}></div>
                      <span className="font-medium">{epic.name}</span>
                    </div>
                    {expandedEpics[epic.id] && <div className="ml-8 space-y-1 mt-2">{epicIssues.map(iss => <IssueRow key={iss.id} issue={iss} />)}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowIssueModal(false)}>
          <div className="bg-white rounded-lg w-full max-w-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{selectedIssue ? 'Edit Issue' : 'Create Issue'}</h2>
              <button onClick={() => setShowIssueModal(false)}><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <input placeholder="Summary" value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                <option>Story</option><option>Task</option><option>Bug</option>
              </select>
              <div className="grid grid-cols-2 gap-4">
                <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className="px-3 py-2 border rounded-lg">
                  <option>Highest</option><option>High</option><option>Medium</option><option>Low</option><option>Lowest</option>
                </select>
                <input type="number" placeholder="Story points" value={formData.storyPoints || ''} onChange={e => setFormData({ ...formData, storyPoints: +e.target.value })} className="px-3 py-2 border rounded-lg" />
              </div>
              <select value={formData.epicId || ''} onChange={e => setFormData({ ...formData, epicId: e.target.value ? +e.target.value : null })} className="w-full px-3 py-2 border rounded-lg">
                <option value="">No epic</option>
                {epics.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <input placeholder="Assignee (optional)" value={formData.assignee} onChange={e => setFormData({ ...formData, assignee: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowIssueModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
                <button onClick={handleSaveIssue} disabled={isLoading || !formData.summary} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  {selectedIssue ? 'Save' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpicManagement;