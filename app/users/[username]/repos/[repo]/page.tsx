import React from 'react'
import fetchRepo from '@/app/actions/fetchRepo'
import fetchMarkdown from '@/app/actions/fetchMarkdown'
import Avatar from '@/components/Avatar';
import { IoCloseOutline } from "react-icons/io5";
import Link from 'next/link';
import Time from '@/components/Time';
import MarkdownViewer from '@/components/Markdown';

interface RepoPageProps {
    params: {
        username: string;
        repo: string;
    };
}
export default async function RepoPage({ params: { username, repo } } : RepoPageProps) {
    const RepoData = await fetchRepo(username, repo);
    const MarkdownData = await fetchMarkdown(username, repo);
    return (
        <div className='max-w-[1320px] mx-auto md:px-2 px-2 bg-white rounded-lg'>
            <div className='p-6'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center'>
                        <Avatar src={RepoData.owner.avatar_url} width={32} height={32} />
                        <p className="px-2 text-sm">{username}</p>
                    </div>
                    <div>
                        <Link href={`/users/${username}/repos`}>
                            <IoCloseOutline size={20} />
                        </Link>
                    </div>
                </div>
                <div>
                    <h1 className='text-3xl mb-4'>{RepoData.name}</h1>
                    <Time time={RepoData.created_at} />
                    <div className='mt-4'>
                        <MarkdownViewer content={MarkdownData.content} />
                    </div>
                </div>
            </div>
        </div>
    )
}