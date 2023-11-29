'use client'
import type {Metadata} from 'next'
import {Layout} from "antd";
import {Inter} from 'next/font/google'
import './globals.css'
import Link from 'next/link';
import {router} from 'next/client';

const inter = Inter({subsets: ['latin']})

// export const metadata: Metadata = {
//     title: 'Project "e"',
//     description: 'Created by Aleksey Kiryukhin',
// }
const navigation = [
    {name: 'Home', href: '/', current: true},
    {name: 'Dashboard', href: '/dashboard', current: false},
    {name: 'Rating', href: '/rating', current: false},
]
const {Header} = Layout;
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <div className={'Header'}>
            <Header
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                color: 'white'
            }}
            // color='light'
        >
            Header
        </Header>
        </div>
        <div className={'NavBar'}>
            {navigation.map((item) => (
                <Link
                    href={item.href}
                    key={item.name}
                >
                    {item.name}
                </Link>
            ))}
        </div>
        <div className={'Content'}>
            {children}
        </div>
        </body>
        </html>
    )
}
