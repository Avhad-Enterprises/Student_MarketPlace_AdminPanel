import React, { useState, useEffect } from 'react';
import { X, FileText, User, Tag, Layout, Eye, Globe, Lock, Save, RefreshCw, Calendar } from 'lucide-react';
import { Blog, BlogFormData } from '@/services/blogService';
import { toast } from 'sonner';

interface BlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: BlogFormData) => Promise<void>;
    blog?: Blog | null;
}

export const BlogModal: React.FC<BlogModalProps> = ({ isOpen, onClose, onSave, blog }) => {
    const [formData, setFormData] = useState<BlogFormData>({
        title: '',
        author: '',
        category: 'Visa Guides',
        content: '',
        tags: [],
        status: 'draft',
        visibility: 'public',
        publish_date: null
    });

    const [tagInput, setTagInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (blog) {
            let tags: string[] = [];
            try {
                tags = typeof blog.tags === 'string' ? JSON.parse(blog.tags) : (blog.tags || []);
            } catch (e) {
                console.error('Error parsing tags', e);
            }

            setFormData({
                title: blog.title || '',
                author: blog.author || '',
                category: blog.category || 'Visa Guides',
                content: blog.content || '',
                tags: tags,
                status: blog.status || 'draft',
                visibility: blog.visibility || 'public',
                publish_date: blog.publish_date || null
            });
        } else {
            let currentUser = '';
            try {
                const userJson = localStorage.getItem('auth_user');
                if (userJson) {
                    const user = JSON.parse(userJson);
                    currentUser = user.full_name || user.email || '';
                }
            } catch (e) { }

            setFormData({
                title: '',
                author: currentUser,
                category: 'Visa Guides',
                content: '',
                tags: [],
                status: 'draft',
                visibility: 'public',
                publish_date: null
            });
        }
    }, [blog, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            toast.error('Please enter a blog title');
            return;
        }
        setIsSaving(true);
        try {
            await onSave(formData);
            toast.success(blog ? 'Blog updated successfully' : 'Blog created successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to save blog');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-[32px] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0e042f]">{blog ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
                        <p className="text-gray-500 text-sm mt-1">Publish insightful content for students.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar-light">
                    <div className="space-y-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] ml-1">Blog Title *</label>
                            <div className="relative">
                                <FileText size={18} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. 10 Tips for Student Visas"
                                    className="w-full bg-gray-50 border-none rounded-2xl h-[52px] pl-12 pr-4 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700 font-medium"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Author */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#0e042f] ml-1">Author *</label>
                                <div className="relative">
                                    <User size={18} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
                                    <input
                                        required
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleChange}
                                        placeholder="Author Name"
                                        className="w-full bg-gray-50 border-none rounded-2xl h-[52px] pl-12 pr-4 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700 font-medium"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#0e042f] ml-1">Category *</label>
                                <div className="relative">
                                    <Layout size={18} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl h-[52px] pl-12 pr-4 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700 font-medium appearance-none"
                                    >
                                        <option value="Visa Guides">Visa Guides</option>
                                        <option value="University Rankings">University Rankings</option>
                                        <option value="Application Tips">Application Tips</option>
                                        <option value="Financial Aid">Financial Aid</option>
                                        <option value="Student Stories">Student Stories</option>
                                        <option value="Internal Updates">Internal Updates</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Status */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#0e042f] ml-1">Status *</label>
                                <div className="relative">
                                    <RefreshCw size={18} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl h-[52px] pl-12 pr-10 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700 font-medium appearance-none"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="scheduled">Scheduled</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                            </div>

                            {/* Visibility */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#0e042f] ml-1">Visibility *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-4 my-auto flex items-center pointer-events-none">
                                        {formData.visibility === 'public' ? <Globe size={18} className="text-emerald-500" /> : <Lock size={18} className="text-amber-500" />}
                                    </div>
                                    <select
                                        name="visibility"
                                        value={formData.visibility}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl h-[52px] pl-12 pr-10 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700 font-medium appearance-none"
                                    >
                                        <option value="public">Public</option>
                                        <option value="restricted">Restricted (Staff Only)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Publish Date (only for scheduled) */}
                        {formData.status === 'scheduled' && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#0e042f] ml-1">Schedule Date *</label>
                                <div className="relative">
                                    <Calendar size={18} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
                                    <input
                                        type="datetime-local"
                                        name="publish_date"
                                        value={formData.publish_date ? formData.publish_date.substring(0, 16) : ''}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl h-[52px] pl-12 pr-4 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700 font-medium"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Content */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] ml-1">Content *</label>
                            <div className="relative">
                                <textarea
                                    required
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="Write your blog post content here..."
                                    rows={10}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-6 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700 font-medium resize-none shadow-inner"
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] ml-1">Tags (Press Enter)</label>
                            <div className="relative">
                                <Tag size={18} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    placeholder="Add relevant tags"
                                    className="w-full bg-gray-50 border-none rounded-2xl h-[52px] pl-12 pr-4 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700 font-medium"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.tags.map(tag => (
                                    <span key={tag} className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border border-indigo-100">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-indigo-800 transition-colors">
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 md:p-8 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 h-[52px] rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="bg-[#0e042f] text-white px-8 h-[52px] rounded-2xl font-bold shadow-lg shadow-indigo-900/20 hover:bg-[#1a0c4a] transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                        {blog ? 'Update Blog' : 'Publish Blog'}
                    </button>
                </div>
            </div>
        </div>
    );
};
