import React, { useState } from 'react';
import {
    ArrowLeft,
    ChevronRight,
    BookOpen,
    Settings,
    Clock,
    User,
    AlertCircle,
    Save,
    Trash2,
    Plus,
    Edit2,
    Sparkles,
    ExternalLink,
    ChevronDown,
    Layout,
    FileText,
    Volume2,
    PenTool,
    Mic2,
    GraduationCap,
    Globe,
    Tag,
    Eye,
    MoreVertical,
    CheckCircle2,
    X,
    PlusCircle,
    HelpCircle,
    Search,
    CheckCircle,
    AlertTriangle
} from 'lucide-react';
import { GenerateContentDrawer } from './GenerateContentDrawer';

interface Question {
    id: string;
    type: string;
    questionText: string;
    options?: string[];
    correctAnswer: string;
    explanation?: string;
    points: number;
}

interface LibraryItem {
    id: string;
    title: string;
    type: 'Reading' | 'Listening' | 'Writing' | 'Speaking' | 'Mock Test';
    status: 'Published' | 'Draft' | 'Archived';
    exam: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    tags: string[];
    lastModified: string;
    author: string;
    content?: {
        passage?: string;
        transcript?: string;
        duration?: string;
        questions?: Question[];
        prompts?: any[];
    };
}

interface LibraryItemDetailProps {
    itemId: string;
    onBack: () => void;
    onSave: (item: any) => void;
}

export const LibraryItemDetail: React.FC<LibraryItemDetailProps> = ({
    itemId,
    onBack,
    onSave
}) => {
    const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'preview'>('content');
    const [isGenerateDrawerOpen, setIsGenerateDrawerOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Mock data for the library item
    const [item, setItem] = useState<LibraryItem>({
        id: itemId,
        title: 'Academic Reading - Climate Change & Global Warning',
        type: 'Reading',
        status: 'Draft',
        exam: 'IELTS Academic',
        difficulty: 'Intermediate',
        tags: ['Environment', 'Science', 'IELTS'],
        lastModified: '2024-03-22T09:00:00Z',
        author: 'Admin User',
        content: {
            passage: 'Climate change represents one of the most significant challenges facing humanity in the 21st century. The scientific consensus is clear: global temperatures are rising at an unprecedented rate, largely due to human activities such as fossil fuel combustion and deforestation...',
            questions: [
                {
                    id: 'q1',
                    type: 'MCQ',
                    questionText: 'What is the primary cause of rising global temperatures according to the passage?',
                    options: [
                        'Natural solar cycles',
                        'Human activities like fossil fuel use',
                        'Volcanic eruptions',
                        'Agricultural expansion'
                    ],
                    correctAnswer: 'Human activities like fossil fuel use',
                    explanation: 'The passage explicitly mentions fossil fuel combustion and deforestation as primary causes.',
                    points: 1
                }
            ]
        }
    });

    const handleApplyAIContent = (generated: any) => {
        // Merge AI content with existing item
        const updatedContent = {
            ...item.content,
            passage: generated.content.passage || generated.content.transcript || generated.content.prompt,
            questions: generated.content.questions || []
        };

        setItem({
            ...item,
            content: updatedContent,
            lastModified: new Date().toISOString()
        });
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            onSave(item);
            setIsSaving(false);
        }, 1500);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Reading': return <FileText size={18} />;
            case 'Listening': return <Volume2 size={18} />;
            case 'Writing': return <PenTool size={18} />;
            case 'Speaking': return <Mic2 size={18} />;
            case 'Mock Test': return <Layout size={18} />;
            default: return <BookOpen size={18} />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f8f9fc]">
            {/* Header */}
            <div className="px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="hover:text-[#0e042f] cursor-pointer">Question Library</span>
                        <ChevronRight size={14} />
                        <span className="text-[#253154] font-medium">{item.id}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.status === 'Published' ? 'bg-green-100 text-green-600' :
                                item.status === 'Draft' ? 'bg-amber-100 text-amber-600' :
                                    'bg-gray-100 text-gray-600'
                            }`}>
                            {getTypeIcon(item.type)}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-bold text-[#253154]">{item.title}</h1>
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${item.status === 'Published' ? 'bg-green-100 text-green-700' :
                                        item.status === 'Draft' ? 'bg-amber-100 text-amber-700' :
                                            'bg-gray-100 text-gray-700'
                                    }`}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock size={12} /> Last edited: {new Date(item.lastModified).toLocaleString()}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <User size={12} /> Author: {item.author}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsGenerateDrawerOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-sm font-bold transition-all shadow-md group"
                        >
                            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                            AI Generate
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2 bg-[#0e042f] hover:bg-[#1a0c4a] text-white rounded-lg text-sm font-bold transition-all shadow-md disabled:bg-gray-300"
                        >
                            {isSaving ? (
                                <>
                                    <Clock size={16} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Changes
                                </>
                            )}
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                            <MoreVertical size={20} className="text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto px-6 py-6 border-r border-gray-200">
                    {/* Tabs */}
                    <div className="flex items-center gap-8 border-b border-gray-200 mb-8 sticky top-0 bg-[#f8f9fc] z-10 pt-2">
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`pb-4 px-2 text-sm font-bold transition-all relative ${activeTab === 'content' ? 'text-[#0e042f]' : 'text-gray-400'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <FileText size={16} />
                                Test Content & Questions
                            </div>
                            {activeTab === 'content' && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0e042f] rounded-t-full" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`pb-4 px-2 text-sm font-bold transition-all relative ${activeTab === 'settings' ? 'text-[#0e042f]' : 'text-gray-400'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Settings size={16} />
                                Item Settings
                            </div>
                            {activeTab === 'settings' && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0e042f] rounded-t-full" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`pb-4 px-2 text-sm font-bold transition-all relative ${activeTab === 'preview' ? 'text-[#0e042f]' : 'text-gray-400'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Eye size={16} />
                                Student Preview
                            </div>
                            {activeTab === 'preview' && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0e042f] rounded-t-full" />
                            )}
                        </button>
                    </div>

                    {activeTab === 'content' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Passage Editor */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                            <BookOpen size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-[#253154]">Reading Passage</h3>
                                            <p className="text-xs text-gray-500">Edit the main text content for this reading test item.</p>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Edit2 size={14} />
                                        Format Text
                                    </button>
                                </div>
                                <textarea
                                    value={item.content?.passage}
                                    onChange={(e) => setItem({ ...item, content: { ...item.content, passage: e.target.value } })}
                                    className="w-full h-80 p-6 text-sm text-gray-700 leading-relaxed border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0e042f] focus:border-transparent outline-none transition-all placeholder:text-gray-300 bg-gray-50/50"
                                    placeholder="Paste your reading passage here..."
                                />
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex gap-4">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Word count: {item.content?.passage?.split(' ').length || 0}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Paragraphs: {item.content?.passage?.split('\n').length || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"><Search size={14} /></button>
                                        <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"><HelpCircle size={14} /></button>
                                    </div>
                                </div>
                            </div>

                            {/* Questions Section */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                            <HelpCircle size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-[#253154]">Questions ({item.content?.questions?.length || 0})</h3>
                                            <p className="text-xs text-gray-500">Configure questions and answer keys for this item.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-[#f8f9fc] hover:bg-gray-100 text-[#0e042f] border border-gray-200 rounded-lg text-xs font-bold transition-all">
                                            <Plus size={14} />
                                            Add Question
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-[#f8f9fc] hover:bg-gray-100 text-[#0e042f] border border-gray-200 rounded-lg text-xs font-bold transition-all">
                                            <CheckCircle2 size={14} />
                                            Bulk Edit
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {item.content?.questions?.map((q, idx) => (
                                        <div key={q.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group hover:border-purple-200 transition-all">
                                            <div className="p-5 border-b border-gray-50">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <span className="w-6 h-6 bg-[#0e042f] text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
                                                                {idx + 1}
                                                            </span>
                                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">
                                                                {q.type}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-gray-400">
                                                                {q.points} Points
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={q.questionText}
                                                            className="w-full text-sm font-bold text-[#253154] placeholder:text-gray-300 border-none p-0 focus:ring-0"
                                                            placeholder="Enter question text here..."
                                                        />
                                                    </div>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><Edit2 size={14} /></button>
                                                        <button className="p-2 hover:bg-red-50 rounded-lg text-red-400"><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-5 bg-gray-50/30">
                                                <div className="space-y-3">
                                                    {q.options?.map((option, oIdx) => (
                                                        <div key={oIdx} className="flex items-center gap-3">
                                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center text-[10px] font-bold ${option === q.correctAnswer ? 'bg-green-500 border-green-500 text-white shadow-sm' : 'border-gray-300 text-gray-400 bg-white'
                                                                }`}>
                                                                {String.fromCharCode(65 + oIdx)}
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={option}
                                                                className="flex-1 text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-purple-300 transition-colors"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-5 pt-5 border-t border-gray-200/50 flex items-start gap-3 bg-white/50 p-4 rounded-xl">
                                                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                                                        <CheckCircle size={16} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-1">Answer Explanation</p>
                                                        <textarea
                                                            value={q.explanation}
                                                            className="w-full text-xs text-gray-600 bg-transparent border-none p-0 focus:ring-0 resize-none h-12"
                                                            placeholder="Add explanation for this question..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button className="w-full py-6 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-[#0e042f] hover:bg-gray-50 transition-all group">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-[#0e042f] group-hover:text-white transition-all">
                                            <PlusCircle size={24} className="text-gray-400 group-hover:text-white" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-500 group-hover:text-[#0e042f]">Add New Question</span>
                                        <p className="text-xs text-gray-400">Multiple choice, Matching, Completion, and more</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl mx-auto">
                            {/* Basic Details */}
                            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                                <h3 className="text-base font-bold text-[#253154] mb-8 flex items-center gap-3">
                                    <Layout size={20} className="text-[#0e042f]" />
                                    Basic Configuration
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Item Title</label>
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) => setItem({ ...item, title: e.target.value })}
                                            className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0e042f] focus:border-transparent outline-none transition-all font-semibold text-[#253154]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Exam Type</label>
                                            <select
                                                value={item.exam}
                                                onChange={(e) => setItem({ ...item, exam: e.target.value })}
                                                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0e042f] focus:border-transparent outline-none transition-all font-semibold text-[#253154]"
                                            >
                                                <option>IELTS Academic</option>
                                                <option>IELTS General</option>
                                                <option>PTE Core</option>
                                                <option>TOEFL iBT</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Difficulty</label>
                                            <select
                                                value={item.difficulty}
                                                onChange={(e) => setItem({ ...item, difficulty: e.target.value as any })}
                                                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0e042f] focus:border-transparent outline-none transition-all font-semibold text-[#253154]"
                                            >
                                                <option>Beginner</option>
                                                <option>Intermediate</option>
                                                <option>Advanced</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Item Status</label>
                                        <div className="flex gap-4">
                                            {['Draft', 'Published', 'Archived'].map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => setItem({ ...item, status: status as any })}
                                                    className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${item.status === status
                                                            ? 'bg-[#0e042f] border-[#0e042f] text-white shadow-lg scale-105'
                                                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                                        }`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tags & Categories */}
                            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-base font-bold text-[#253154] flex items-center gap-3">
                                        <Tag size={20} className="text-[#0e042f]" />
                                        Tags & Classification
                                    </h3>
                                    <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 tracking-wider flex items-center gap-1">
                                        <Plus size={14} /> ADD NEW TAG
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {item.tags.map(tag => (
                                        <div key={tag} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl group hover:border-[#0e042f] transition-all">
                                            <span className="text-sm font-bold text-[#253154]">{tag}</span>
                                            <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100/50">
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                                            <Globe size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-blue-900">Multilingual Availability</h4>
                                            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                                This content is currently available in **English (UK)** only. Enable other languages in the Global Settings area.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-red-50 rounded-2xl p-8 border border-red-100 shadow-sm mt-12">
                                <h3 className="text-base font-bold text-red-900 mb-2 flex items-center gap-3">
                                    <Trash2 size={20} className="text-red-600" />
                                    Danger Zone
                                </h3>
                                <p className="text-xs text-red-700 mb-6 font-medium">Deletions are permanent and cannot be undone. All student progress for this item will be lost.</p>
                                <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95">
                                    Delete Library Item
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'preview' && (
                        <div className="flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-2xl m-4 animate-in zoom-in duration-500">
                            {/* Preview UI Mockup */}
                            <div className="bg-[#0e042f] px-6 py-4 flex items-center justify-between text-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                        <GraduationCap size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold leading-none">PRACTICE MODE</h4>
                                        <p className="text-[10px] opacity-70 mt-1">Academic Reading • Part 1</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} />
                                        <span className="text-sm font-mono font-bold tracking-tighter">00:19:54</span>
                                    </div>
                                    <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors text-[10px] font-bold">SUBMIT</button>
                                </div>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                {/* Passage Side */}
                                <div className="flex-1 p-10 overflow-y-auto border-r border-gray-100 bg-[#fafbfc]">
                                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8 leading-tight">{item.title}</h2>
                                    <div className="text-base text-gray-800 leading-relaxed font-serif space-y-6">
                                        {item.content?.passage?.split('\n').map((para, i) => (
                                            <p key={i}>{para}</p>
                                        ))}
                                    </div>
                                </div>

                                {/* Questions Side */}
                                <div className="w-[450px] p-10 overflow-y-auto bg-white">
                                    <h3 className="text-sm font-bold text-[#0e042f] mb-8 pb-4 border-b border-gray-100 flex items-center justify-between">
                                        Questions 1-15
                                        <span className="text-xs text-gray-400 font-normal">Section 1</span>
                                    </h3>

                                    <div className="space-y-12">
                                        {item.content?.questions?.map((q, idx) => (
                                            <div key={q.id}>
                                                <p className="text-sm font-bold text-gray-900 mb-6 leading-tight">
                                                    <span className="text-blue-600 mr-2">{idx + 1}.</span>
                                                    {q.questionText}
                                                </p>
                                                <div className="space-y-3">
                                                    {q.options?.map((option, oIdx) => (
                                                        <label key={oIdx} className="flex items-center gap-3 p-4 border border-gray-100 rounded-2xl hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer group">
                                                            <input type="radio" name={`q-${q.id}`} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                                            <span className="text-[13px] text-gray-700 font-medium group-hover:text-blue-900">{option}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-16 pt-8 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors"><ChevronRight size={20} className="rotate-180" /></button>
                                            <div className="flex gap-2">
                                                {[1, 2, 3].map(n => (
                                                    <div key={n} className={`w-2 h-2 rounded-full ${n === 1 ? 'bg-[#0e042f]' : 'bg-gray-200'}`} />
                                                ))}
                                            </div>
                                            <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors"><ChevronRight size={20} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Panel - Desktop Sidebar */}
                <div className="w-[300px] bg-white border-l border-gray-200 p-8 overflow-y-auto sticky top-0 h-full">
                    <div className="space-y-10">
                        {/* Quick Actions */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Integrations</h4>
                            <div className="space-y-2">
                                <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                            <PenTool size={16} />
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-700">Digital Grading</span>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                            <Layout size={16} />
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-700">Mock Builder</span>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* QA Section */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quality Assurance</h4>

                            <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <CheckCircle size={18} className="text-green-600" />
                                    <span className="text-xs font-bold text-green-800">Ready to Publish</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[10px] text-green-700">
                                        <span className="flex items-center gap-1.5"><CheckCircle size={10} /> Valid questions</span>
                                        <span className="font-bold">YES</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-green-700">
                                        <span className="flex items-center gap-1.5"><CheckCircle size={10} /> Answer keys</span>
                                        <span className="font-bold">YES</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-green-700">
                                        <span className="flex items-center gap-1.5"><CheckCircle size={10} /> Scoring meta</span>
                                        <span className="font-bold">YES</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <AlertTriangle size={18} className="text-amber-600" />
                                    <span className="text-xs font-bold text-amber-800">Missing Metadata</span>
                                </div>
                                <p className="text-[10px] text-amber-700 leading-relaxed font-medium">This item is missing IELTS band descriptors. For accurate AI scoring, please add them.</p>
                                <button className="mt-3 text-[10px] font-bold text-amber-800 underline uppercase tracking-tight hover:text-amber-900 transition-colors">Add Descriptors Now</button>
                            </div>
                        </div>

                        {/* Support Info */}
                        <div className="p-6 bg-gradient-to-br from-[#0e042f] to-[#253154] rounded-2xl text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10">
                                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Need help?</p>
                                <p className="text-sm font-bold mb-4">Read Content Guide</p>
                                <div className="flex items-center gap-2 group/link cursor-pointer">
                                    <span className="text-[10px] font-bold group-hover/link:underline">LEARN MORE</span>
                                    <ExternalLink size={12} className="group-hover/link:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Drawer */}
            <GenerateContentDrawer
                isOpen={isGenerateDrawerOpen}
                onClose={() => setIsGenerateDrawerOpen(false)}
                itemType={item.type}
                currentData={{
                    exam: item.exam,
                    difficulty: item.difficulty,
                    topic: item.tags
                }}
                onApply={handleApplyAIContent}
            />
        </div>
    );
};
