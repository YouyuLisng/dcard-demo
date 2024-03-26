import React from 'react'
import fetchUserRepos from '@/app/actions/UserRepo/fetchUserRepos'
import fetchUser from '@/app/actions/UserRepo/fetchUser'
import UserAvatar from '@/components/UserAvatar';
import { UserRepoList } from '@/components/UserRepoList/UserRepoList';
import { IoIosLink } from "react-icons/io";
import Link from 'next/link';
import { Separator } from "@/components/ui/separator"
import type { Metadata } from "next";
import EmptyState from '@/components/EmptyState';
interface ReposPageProps {
    params: {
        username: string;
    };
}
export async function generateMetadata( { params: { username } }: ReposPageProps): Promise<Metadata> {
    const user = await fetchUser(username);
    return {
        title: user.login,
    }
}

export default async function ReposPage({ params: { username } } : ReposPageProps) {
    const user = await fetchUser(username);
    const repo = await fetchUserRepos(username, 1, 10);

    if (!repo) {
        <EmptyState />
    }
    return (
        <>
            <div className='max-w-[760px] mx-auto bg-white'>
                <div className='w-full h-full rounded-xl relative'>
                    <img className='w-full h-full rounded-xl' src="/images/1280.jpg" alt="" />
                    <div className='absolute bottom-[-25px] left-6 md:bottom-[-35px] md:left-10'>
                        <div className='hidden md:block'>
                            <UserAvatar src={user.avatar_url} width={130} height={130} />
                        </div>
                        <div className='md:hidden'>
                            <UserAvatar src={user.avatar_url} width={60} height={60} />
                        </div>
                    </div>
                </div>
                <div className='px-5 py-6 md:px-10 md:py-12'>
                    <div className='px-2 md:px-4'>
                        <p className="text-md md:text-2xl font-bold">{user.login}</p>
                        <b className='text-sm text-zinc-500'>@ {user.login}</b>
                        {user.blog && user.blog.trim() !== '' && ( // 檢查博客是否存在並且不是空的
                            <div className='flex items-center text-sm text-zinc-500'>
                                <IoIosLink size={14} />
                                <Link href={user.blog}>{user.blog}</Link>
                            </div>
                        )}
                        <Separator className='my-4' />
                    </div>
                    <UserRepoList username={username} repo={repo} />
                </div>
            </div>
        </>
    )
}
