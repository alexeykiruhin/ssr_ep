'use client'
import React, { useRef } from 'react'
import { Provider } from 'react-redux'
import {store} from '../../redux/slices';
import { makeStore, AppStore } from '../../redux/slices'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  return <Provider store={store}>{children}</Provider>
}