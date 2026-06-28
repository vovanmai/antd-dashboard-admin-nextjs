'use client';

import { message } from 'antd';
import { useEffect } from 'react';
import { _initMessageApi } from '@/lib/message';

export default function MessageProvider({ children }: { children: React.ReactNode }) {
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    _initMessageApi(messageApi);
  }, [messageApi]);

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
}
