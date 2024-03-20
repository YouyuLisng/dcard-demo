"use client";
import React, { useState, useEffect, useRef } from 'react';
import Loader from '@/components/Loader';
import { SkeletonItem } from '@/components/Skeleton';
import fetchRepos from '@/app/actions/fetchRepos';
import { Repository } from '@/type/type';
import RepoItem from './RepoItem';

interface RepoListProps {
    repo: Repository[]
}

export function RepoList({
    repo
}: RepoListProps) {
    console.log('RepoList 重新渲染了');
    const [repos, setRepos] = useState<Repository[]>(repo);
    const [loading, setLoading] = useState(false);
    const loadingRef = useRef(false);
    const pageNumberRef = useRef(1);
    const perPageRef = useRef(20);
    const hasMoreRef = useRef(true);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const loadRepos = async () => {
        if (loadingRef.current || !hasMoreRef.current) return;
        setLoading(true);
        loadingRef.current = true;
    
        const scrollPosition = window.scrollY;
    
        try {
            const newRepos = await fetchRepos(pageNumberRef.current, perPageRef.current);
            if (newRepos) {
                const uniquePrevRepos = repos.filter((prevRepo) => !newRepos.find((newRepo: { id: number; }) => newRepo.id === prevRepo.id));
                const uniqueRepos = new Set([...uniquePrevRepos, ...newRepos]);
                setRepos(Array.from(uniqueRepos));
    
                if (perPageRef.current === 100) {
                    pageNumberRef.current += 1;
                    perPageRef.current = 10;
                } else {
                    perPageRef.current += 10;
                }
            }
        } catch (error) {
            console.error('加載資料時發生錯誤:', error);
            hasMoreRef.current = false;
        } finally {
            loadingRef.current = false;
            setLoading(false);
    
            window.scrollTo(0, scrollPosition);
        }
    };       
    
    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) 
        return;
        loadRepos();
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-3 p-4 bg-white md:rounded-e-xl">
                {repos.length > 0 ? (
                    repos.map((repo: Repository, index: number) => (
                        <div key={index}>
                            <RepoItem repo={repo} />
                        </div>
                    ))
                ) : (
                    Array.from({ length: 10 }).map((_, index) => (
                        <SkeletonItem key={index} /> // 使用 SkeletonItem 組件來顯示骨架內容
                    ))
                )}
                {loading && <Loader />}
            </div>
        </>
    );
}
