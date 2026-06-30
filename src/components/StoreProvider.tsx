"use client";

import { useRef } from "react";
import { Provider, useSelector } from "react-redux";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import { store } from "@/store/store";
import type { AppStore } from "@/store/store";
import AuthInitializer from "@/components/AuthInitializer";
import { selectTheme } from "@/store/features/app/appSlice";

function ThemedApp({ children }: { children: React.ReactNode }) {
  const theme = useSelector(selectTheme);
  return (
    <ConfigProvider locale={viVN} theme={theme}>
      <AuthInitializer>{children}</AuthInitializer>
    </ConfigProvider>
  );
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    storeRef.current = store;
  }

  return (
    <Provider store={storeRef.current}>
      <ThemedApp>{children}</ThemedApp>
    </Provider>
  );
}
