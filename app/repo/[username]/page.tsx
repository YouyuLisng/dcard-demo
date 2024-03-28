import React from 'react'
import fetchUserRepos from '@/app/actions/UserRepo/fetchUserRepos'
import fetchUser from '@/app/actions/UserRepo/fetchUser'
import UserAvatar from '@/components/UserAvatar';
import { UserRepoList } from '@/components/UserRepoList/UserRepoList';
import { IoIosLink } from "react-icons/io";
import Link from 'next/link';
import { Separator } from "@/components/ui/separator"
import type { Metadata } from "next";
import Image from "next/image";
import EmptyState from '@/components/EmptyState';
import UserInfo from '@/components/UserInfo';
interface ReposPageProps {
    params: {
        username: string;
    };
}
export async function generateMetadata( { params: { username } }: ReposPageProps): Promise<Metadata> {
    const user = await fetchUser(username);
    if (!user) {
        return {
            title: 'Not found',
        }
    }
    return {
        title: user.login,
    }
}

export default async function ReposPage({ params: { username } } : ReposPageProps) {
    const user = await fetchUser(username);
    const repo = await fetchUserRepos(username, 1, 10);
    if (!user) {
        return (
            <div className='max-w-[760px] mx-auto bg-white'>
                <UserInfo user={user} >
                    <EmptyState title={`${username} 此用戶不存在`} subtitle='Not Found' showReaet={true} />
                </UserInfo>
            </div>
        )
    }
    return (
        <>
            <UserInfo user={user}>
                {repo.length !== 0 ? (
                        <UserRepoList username={username} repo={repo} />
                ) : (
                    <EmptyState title={`${username} 目前尚未發佈倉儲`} subtitle='Not Found' showReaet={true} />
                )}
            </UserInfo>
        </>
    )
}