import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

let _router: AppRouterInstance | null = null;

export function _initRouter(router: AppRouterInstance) {
  _router = router;
}

const globalRouter = {
  push: (href: string) => _router?.push(href),
  replace: (href: string) => _router?.replace(href),
};

export default globalRouter;
