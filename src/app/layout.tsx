'use client'
import {Inter} from 'next/font/google'
import './globals.css'
import HeaderComponent from '../../components/Header/HeaderComponent';
import FooterComponent from '../../components/Footer/FooterComponent';
import StoreProvider from '@/app/StoreProvider';

const inter = Inter({subsets: ['latin']})

// export const metadata: Metadata = {
//     title: 'Project "e"',
//     description: 'Created by Aleksey Kiryukhin',
// }
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <head>
            <title>Сайт скоро откроется</title>
        </head>

        <body className={inter.className}>
        <StoreProvider>
            <HeaderComponent/>
            <div className={'Content'}>
                {children}
            </div>
            <FooterComponent/>
        </StoreProvider>
        </body>
        </html>
    )
}
