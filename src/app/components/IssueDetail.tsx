import React, { useState } from 'react';
import {
    ArrowLeft,
    ChevronRight,
    ClipboardList,
    MessageSquare,
    Clock,
    User,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Send,
    MoreVertical,
    Paperclip,
    Smile,
    Search,
    CheckCircle,
    Loader2
} from 'lucide-react';
import { CustomSelect } from './common/CustomSelect';

interface Comment {
    id: string;
    author: {
        name: string;
        avatar?: string;
        role: string;
    };
    content: string;
    timestamp: string;
    attachments?: string[];
}

interface Issue {
    id: string;
    title: string;
    description: string;
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    priority: 'High' | 'Medium' | 'Low';
    category: string;
    reporter: {
        name: string;
        avatar?: string;
    };
    assignedTo?: {
        name: string;
        avatar?: string;
    };
    createdAt: string;
    updatedAt: string;
    relatedTest?: {
        id: string;
        name: string;
        section: string;
    };
}

interface IssueDetailProps {
    issueId: string;
    onBack: () => void;
    onUpdateStatus: (id: string, status: string) => void;
}

export const IssueDetail: React.FC<IssueDetailProps> = ({
    issueId,
    onBack,
    onUpdateStatus
}) => {
    const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'history'>('details');
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    // Mock data for the issue
    const issue: Issue = {
        id: issueId,
        title: 'Incorrect scoring for Academic Writing Task 1',
        description: 'The automated scoring system consistently gives higher marks (8.5+) for Task 1 submissions even when the word count is significantly below the minimum requirement or contains major grammatical errors. This needs urgent investigation as it affects the credibility of the platform.',
        status: 'In Progress',
        priority: 'High',
        category: 'System Logic',
        reporter: {
            name: 'Priya Sharma',
            avatar: 'https://i.pravatar.cc/150?u=priya'
        },
        assignedTo: {
            name: 'Raj Tech',
            avatar: 'https://i.pravatar.cc/150?u=raj'
        },
        createdAt: '2024-03-20T10:30:00Z',
        updatedAt: '2024-03-21T14:45:00Z',
        relatedTest: {
            id: 'T1024',
            name: 'IELTS Academic Writing Test 01',
            section: 'Writing'
        }
    };

    const [comments, setComments] = useState<Comment[]>([
        {
            id: 'c1',
            author: {
                name: 'Priya Sharma',
                role: 'Content Admin',
                avatar: 'https://i.pravatar.cc/150?u=priya'
            },
            content: 'I noticed this during a routine quality check. Several student submissions were flagged for high scores despite poor quality.',
            timestamp: '2024-03-20T11:00:00Z'
        },
        {
            id: 'c2',
            author: {
                name: 'Raj Tech',
                role: 'System Architect',
                avatar: 'https://i.pravatar.cc/150?u=raj'
            },
            content: 'I am checking the scoring algorithm logs. It seems the word count penalty is not being applied correctly in the latest update.',
            timestamp: '2024-03-21T09:30:00Z'
        }
    ]);

    const handlePostComment = () => {
        if (!newComment.trim()) return;

        setIsSubmittingComment(true);
        setTimeout(() => {
            const comment: Comment = {
                id: Date.now().toString(),
                author: {
                    name: 'Admin User',
                    role: 'Admin',
                    avatar: 'https://i.pravatar.cc/150?u=admin'
                },
                content: newComment,
                timestamp: new Date().toISOString()
            };
            setComments([...comments, comment]);
            setNewComment('');
            setIsSubmittingComment(false);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full bg-[#f8f9fc]">
            {/* Header */}
            <div className="px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center gap-4 mb-3">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>AI Test Reports</span>
                        <ChevronRight size={14} />
                        <span>Issues</span>
                        <ChevronRight size={14} />
                        <span className="text-[#253154] font-medium">{issueId}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-[#253154]">{issue.title}</h1>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${issue.priority === 'High' ? 'bg-red-100 text-red-600' :
                                issue.priority === 'Medium' ? 'bg-amber-100 text-amber-600' :
                                    'bg-blue-100 text-blue-600'
                            }`}>
                            {issue.priority} Priority
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CustomSelect
                            value={issue.status}
                            onChange={(status) => onUpdateStatus(issueId, status)}
                            options={[
                                { value: 'Open', label: 'Open' },
                                { value: 'In Progress', label: 'In Progress' },
                                { value: 'Resolved', label: 'Resolved' },
                                { value: 'Closed', label: 'Closed' }
                            ]}
                            className={`w-40 font-semibold ${issue.status === 'Resolved' ? 'text-green-600 bg-green-50' :
                                    issue.status === 'In Progress' ? 'text-blue-600 bg-blue-50' :
                                        'text-gray-600 bg-gray-50'
                                }`}
                        />
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                            <MoreVertical size={20} className="text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 border-r border-gray-200">
                    {/* Tabs */}
                    <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`pb-4 px-2 text-sm font-semibold transition-all relative ${activeTab === 'details' ? 'text-[#0e042f]' : 'text-gray-400'
                                }`}
                        >
                            Issue Details
                            {activeTab === 'details' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0e042f]" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('comments')}
                            className={`pb-4 px-2 text-sm font-semibold transition-all relative ${activeTab === 'comments' ? 'text-[#0e042f]' : 'text-gray-400'
                                }`}
                        >
                            Comments ({comments.length})
                            {activeTab === 'comments' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0e042f]" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`pb-4 px-2 text-sm font-semibold transition-all relative ${activeTab === 'history' ? 'text-[#0e042f]' : 'text-gray-400'
                                }`}
                        >
                            History
                            {activeTab === 'history' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0e042f]" />
                            )}
                        </button>
                    </div>

                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            {/* Description */}
                            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                                <h3 className="text-sm font-bold text-[#253154] mb-3 flex items-center gap-2">
                                    <ClipboardList size={18} className="text-[#0e042f]" />
                                    Description
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    {issue.description}
                                </p>
                            </div>

                            {/* Related Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                                    <h3 className="text-sm font-bold text-[#253154] mb-4">Related Test Material</h3>
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                                            {issue.relatedTest?.section.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-blue-900">{issue.relatedTest?.name}</p>
                                            <p className="text-xs text-blue-700">Section: {issue.relatedTest?.section}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                                    <h3 className="text-sm font-bold text-[#253154] mb-4">Audit Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500 flex items-center gap-2">
                                                <Calendar size={14} /> Created
                                            </span>
                                            <span className="text-xs font-medium text-[#253154]">{new Date(issue.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500 flex items-center gap-2">
                                                <Clock size={14} /> Last Updated
                                            </span>
                                            <span className="text-xs font-medium text-[#253154]">{new Date(issue.updatedAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Resolution Action */}
                            {issue.status === 'In Progress' && (
                                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 flex-shrink-0">
                                            <AlertCircle size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-amber-900">Recommended Action</h4>
                                            <p className="text-xs text-amber-800 mt-1 mb-4">
                                                Review the scoring algorithm for Writing Task 1 and ensure word count requirements are factored into the final score.
                                            </p>
                                            <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors">
                                                Mark as Resolved
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'comments' && (
                        <div className="space-y-6">
                            {/* Comment List */}
                            <div className="space-y-6">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-4">
                                        <img
                                            src={comment.author.avatar}
                                            alt={comment.author.name}
                                            className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 mt-1"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-bold text-[#253154]">{comment.author.name}</span>
                                                <span className="text-[10px] text-gray-500 py-0.5 px-2 bg-gray-100 rounded-full">{comment.author.role}</span>
                                                <span className="text-[10px] text-gray-400">• {new Date(comment.timestamp).toLocaleString()}</span>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                                <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <button className="text-[10px] font-bold text-gray-500 hover:text-[#0e042f]">Reply</button>
                                                <button className="text-[10px] font-bold text-gray-500 hover:text-[#0e042f]">Edit</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Comment Box */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mt-8">
                                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-[#253154]">Add Comment</h4>
                                    <div className="flex gap-2">
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"><Paperclip size={16} /></button>
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"><Smile size={16} /></button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Type your feedback or solution here..."
                                        className="w-full h-32 text-sm border-0 focus:ring-0 placeholder:text-gray-400 resize-none p-0"
                                    />
                                    <div className="flex items-center justify-end mt-4">
                                        <button
                                            onClick={handlePostComment}
                                            disabled={!newComment.trim() || isSubmittingComment}
                                            className="flex items-center gap-2 px-6 py-2 bg-[#0e042f] hover:bg-[#1a0c4a] disabled:bg-gray-300 text-white rounded-lg text-sm font-bold transition-all"
                                        >
                                            {isSubmittingComment ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" />
                                                    Posting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={16} />
                                                    Post Comment
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            {[
                                { type: 'status', from: 'Open', to: 'In Progress', user: 'Raj Tech', time: '2024-03-21T09:30:00Z' },
                                { type: 'assignment', from: 'Unassigned', to: 'Raj Tech', user: 'Admin User', time: '2024-03-21T09:25:00Z' },
                                { type: 'creation', user: 'Priya Sharma', time: '2024-03-20T10:30:00Z' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 relative">
                                    {idx !== 2 && <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-100" />}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${item.type === 'status' ? 'bg-blue-100 text-blue-600' :
                                            item.type === 'assignment' ? 'bg-purple-100 text-purple-600' :
                                                'bg-green-100 text-green-600'
                                        }`}>
                                        {item.type === 'status' ? <CheckCircle2 size={16} /> :
                                            item.type === 'assignment' ? <User size={16} /> :
                                                <CheckCircle size={16} />}
                                    </div>
                                    <div className="py-1">
                                        <p className="text-sm font-bold text-[#253154]">
                                            {item.type === 'status' ? `Status changed to ${item.to}` :
                                                item.type === 'assignment' ? `Assigned to ${item.to}` :
                                                    'Issue created'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            By <span className="font-semibold">{item.user}</span> • {new Date(item.time).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Sidebar - Assignment & Tags */}
                <div className="w-[300px] overflow-y-auto px-6 py-6 space-y-8 bg-white">
                    {/* People Section */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">People</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wide">Reporter</p>
                                <div className="flex items-center gap-2">
                                    <img src={issue.reporter.avatar} alt="" className="w-8 h-8 rounded-full bg-gray-100" />
                                    <span className="text-sm font-bold text-[#253154]">{issue.reporter.name}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wide">Assignee</p>
                                <div className="flex items-center gap-2">
                                    <img src={issue.assignedTo?.avatar} alt="" className="w-8 h-8 rounded-full bg-gray-100" />
                                    <span className="text-sm font-bold text-[#253154]">{issue.assignedTo?.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Details Section */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Properties</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wide">Category</p>
                                <p className="text-sm font-semibold text-[#253154]">{issue.category}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wide">Material Type</p>
                                <p className="text-sm font-semibold text-[#253154]">Question Bank & Scoring</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wide">Severity</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-sm font-semibold text-[#253154]">Critical</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Tags Section */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Scoring Logic', 'Bug', 'Writing', 'IELTS'].map(tag => (
                                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
