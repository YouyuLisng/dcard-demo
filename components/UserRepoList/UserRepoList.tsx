"use client";
import React, { useState, useEffect, useRef } from 'react';
import Loader from '@/components/Loader';
import { SkeletonItem } from '@/components/Skeleton';
import fetchUserRepos from '@/app/actions/fetchUserRepos';
import { Repository } from '@/type/type';
import UserRepoItem from '@/components/UserRepoList/UserRepoItem';

interface UserRepoListProps {
    username: string;
    repo: Repository[];
}

export function UserRepoList({
    username,
    repo
}: UserRepoListProps) {
    const [repos, setRepos] = useState<Repository[]>(repo);
    const [loading, setLoading] = useState(false);
    const loadingRef = useRef(false);
    const pageNumber = useRef(1);
    const perPage = useRef(20);
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
            const newRepos = await fetchUserRepos(username, pageNumber.current, perPage.current);
            if (newRepos) {
                const uniquePrevRepos = repos.filter((prevRepo) => !newRepos.find((newRepo: { id: number; }) => newRepo.id === prevRepo.id)); 
                const uniqueRepos = new Set([...uniquePrevRepos, ...newRepos]);
                setRepos(Array.from(uniqueRepos));
                
                if (newRepos.length < perPage.current) {
                    hasMoreRef.current = false;
                }
                
                if (perPage.current === 100) {
                    pageNumber.current += 1;
                    perPage.current = 10;
                } else {
                    perPage.current += 10;
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
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        loadRepos();
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-3 p-4 bg-white md:rounded-e-xl">
                {repos.length > 0 ? (
                    repos.map((repo: Repository, index: number) => (
                        <div key={index}>
                            <UserRepoItem repo={repo} />
                        </div>
                    ))
                ) : (
                    Array.from({ length: 10 }).map((_, index) => (
                        <SkeletonItem key={index} />
                    ))
                )}
                {loading && <Loader />}
                {!hasMoreRef.current && <p className="text-center text-gray-500">沒有更多資料了</p>}
            </div>
        </>
    );
}
