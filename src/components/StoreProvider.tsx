"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import { store } from "@/lib/store/store";
import type { AppStore } from "@/lib/store/store";
import AuthInitializer from "@/components/AuthInitializer";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    storeRef.current = store;
  }
  const theme = {
    token: { colorPrimary: '#6366f1' },
  }

  return (
    <Provider store={storeRef.current}>
      <ConfigProvider locale={viVN} theme={theme}>
        <AuthInitializer>{children}</AuthInitializer>
      </ConfigProvider>
    </Provider>
  );
}
