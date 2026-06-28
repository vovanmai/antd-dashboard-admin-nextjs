import type { MessageInstance } from 'antd/es/message/interface';

const MESSAGE_KEY = 'global-message';

let _api: MessageInstance | null = null;

export function _initMessageApi(api: MessageInstance) {
  _api = api;
}

const globalMessage = {
  success: (content: string) => {
    _api?.open({ key: MESSAGE_KEY, type: 'success', content });
  },
  error: (content: string) => {
    _api?.open({ key: MESSAGE_KEY, type: 'error', content });
  },
  warning: (content: string) => {
    _api?.open({ key: MESSAGE_KEY, type: 'warning', content });
  },
};

export default globalMessage;
