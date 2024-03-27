"use client"
import React, { useCallback, useEffect, useState } from 'react';
import Avatar from '../Avatar';
import Link from 'next/link';
import Time from '../Time';
import { IoCloseOutline } from 'react-icons/io5';
import { GitHubIssue } from '@/type/type';
import ReactHtmlParser from 'react-html-parser';
import fetchIssues from '@/app/actions/Issues/fetchIssues';
import { EditIssuesFormModal } from '../Modal/EditIssuesFormModal';
import { IssuesSkeleton } from '../Skeleton/IssuesSkeleton';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import MenuItem from '../Navbar/MenuItem';
import closeIssues from '@/app/actions/Issues/closeIssues'
import { useAuthContext } from '@/Context/auth';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface IssuesProps {
    username: string;
    issue_number: number;
}

export default function Issues({
    username,
    issue_number,
}: IssuesProps) {
    const router = useRouter();
    const [issue, setIssue] = useState<GitHubIssue | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { accessToken } = useAuthContext();

    useEffect(() => {
        const fetchIssueData = async () => {
            try {
                const data = await fetchIssues(username, issue_number);
                setIssue(data);
            } catch (error) {
                console.error('Error fetching issue:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchIssueData();
    }, [username, issue_number]);

    const closeIssue = async () => {
        try {
            await closeIssues(username, issue_number, accessToken);
            toast.success('成功');
            router.push(`/users/${username}`)
        } catch (error) {
            console.error('Error closing issue:', error);
        }
    };

    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = useCallback(() => {
        setIsOpen(prevState => !prevState);
    }, []);
    
    return (
        <div className='p-6'>
            {loading ? (
                <IssuesSkeleton />
            ) : (
                issue && (
                    <>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='flex items-center'>
                                <Avatar src={issue.user.avatar_url} width={32} height={32} />
                                <p className="px-2 text-sm">{username}</p>
                            </div>
                            <div className='flex items-center'>
                                <div className='relative'>
                                    <HiOutlineDotsHorizontal onClick={toggleOpen} className='me-2 cursor-pointer' size={20} />
                                    {isOpen && (
                                        <div className="absolute rounded-xl shadow-md w-[100px] bg-white overflow-hidden right-0 top-10 text-sm">
                                            <div className='flex flex-col cursor-pointer text-center'>
                                                <EditIssuesFormModal issues={issue} />
                                                <MenuItem  onClick={closeIssue} label='刪除'/>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <Link href={`/users/${username}`}>
                                    <IoCloseOutline size={20} />
                                </Link>
                            </div>
                        </div>
                        <div>
                            <h1 className='text-md md:text-3xl mb-4'>{issue.title}</h1>
                            <Time time={issue.created_at} />
                            <div className='mt-4 text-xs md:text-sm text-zinc-500'>
                                {ReactHtmlParser(issue.body.replace(/<a/g, '<span').replace(/<\/a>/g, '</span>'))}
                            </div>
                        </div>
                    </>
                )
            )}
        </div>
    );
}