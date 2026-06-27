@AGENTS.md

## UI patterns

### Disabled button với tooltip "Không có quyền"
- Button disabled do thiếu quyền → wrap bằng `<Tooltip>` của antd với message "Không có quyền"
- Không đặt tooltip trực tiếp lên disabled button — pointer events bị tắt, tooltip không trigger được
- Dùng `title` prop của antd Tooltip (không phải `content`)

```tsx
import { Button, Tooltip } from 'antd';
import type { TooltipProps } from 'antd';

const ACTION_TOOLTIP: TooltipProps = {
  title: 'Không có quyền',
};