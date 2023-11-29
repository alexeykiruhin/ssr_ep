import React from 'react';
import {Menu, MenuProps} from "antd";
import Link from 'next/link';
// import styles from './Menu.module.css';

const MenuComponent: React.FC = () => {

    const item: MenuProps['items'] = [
        {
            label: (
                <Link className={'item'} href="/">Home</Link>
            ),
            key: 0,
        },
        {
            label: (
                <Link className={'item'} href="/rating">Rating</Link>
            ),
            key: 1,
        },
        {
            label: (
                <Link className={'item'} href="/dashboard">Dashboard</Link>
            ),
            key: 2,
        },
    ];

    return (
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['0']}
            items={item}
        />
    )
}

export default MenuComponent;