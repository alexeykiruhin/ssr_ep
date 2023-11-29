import type {PropsWithChildren} from 'react';

export default function DashboardLayout({children}: PropsWithChildren<unknown>) {
    return (
        <div>
            {children}
        </div>
    )
}