import React from 'react';
import {Layout} from 'antd';
import styles from './Header.module.css';
import MenuComponent from '../Menu/MenuComponent';
// import MenuComponent from "../Menu/MenuComponent";
import {useAppDispatch, useAppSelector} from '../../hooks/hooks';
import dbConnect from '../../lib/dbConnect';

const {Header} = Layout;


const headerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
};

const HeaderComponent: React.FC = async () => {

    const status = useAppSelector(state => state.auth.status)
    console.log('status', status)
    await dbConnect()
    return (
        <Header
            style={headerStyle}
        >
            <div className={styles.Logo}>TrendTide</div>
            <a><div className={styles.Logo}>Home</div></a>
            {/*<MenuComponent/>*/}
        </Header>
    )
}

export default HeaderComponent;