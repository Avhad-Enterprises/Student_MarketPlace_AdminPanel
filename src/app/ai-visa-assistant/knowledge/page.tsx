"use client";

import React, { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { KnowledgeBase } from '../../components/KnowledgeBase';
import { ArticleDetail } from '../../components/ArticleDetail';
import { CreateArticle } from '../../components/CreateArticle';
import { PermissionGuard } from '../../components/common/PermissionGuard';

export default function AIKnowledgePage() {
    const [view, setView] = useState<'list' | 'detail' | 'create'>('list');
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

    const handleNavigate = (page: string, articleId?: string) => {
        if (page === 'article-detail' && articleId) {
            setSelectedArticleId(articleId);
            setView('detail');
        } else if (page === 'create-article') {
            setView('create');
        } else {
            setView('list');
        }
    };

    return (
        <AdminLayout activePage="ai-knowledge">
            <PermissionGuard module="ai-visa-assistant" action="view">
                {view === 'list' && (
                    <KnowledgeBase onNavigate={handleNavigate} />
                )}

                {view === 'detail' && selectedArticleId && (
                    <ArticleDetail
                        articleId={selectedArticleId}
                        onBack={() => setView('list')}
                    />
                )}

                {view === 'create' && (
                    <CreateArticle
                        onBack={() => setView('list')}
                    />
                )}
            </PermissionGuard>
        </AdminLayout>
    );
}
