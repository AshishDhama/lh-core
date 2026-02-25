import { createFileRoute } from '@tanstack/react-router';
import { Button, Card, Space, Tag, Typography } from 'antd';

import { colors } from '@/forge/tokens';

const { Title, Text } = Typography;

export const Route = createFileRoute('/')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Title level={2}>Lighthouse — Integration Check</Title>

        <Card title="TanStack Router" variant="borderless">
          <Text>Route rendered at <code>/</code> via file-based routing.</Text>
        </Card>

        <Card title="Ant Design + Theme" variant="borderless">
          <Space wrap>
            <Button type="primary">Primary (navy)</Button>
            <Button>Default</Button>
            <Tag color={colors.teal.DEFAULT}>Teal Tag</Tag>
            <Tag color={colors.navy.DEFAULT}>Navy Tag</Tag>
          </Space>
        </Card>

        <Card title="Tailwind CSS" variant="borderless">
          <div className="flex gap-3">
            <div className="size-12 rounded-lg bg-blue-600" />
            <div className="size-12 rounded-lg bg-emerald-500" />
            <div className="size-12 rounded-lg bg-amber-400" />
            <div className="size-12 rounded-lg bg-rose-500" />
          </div>
          <Text className="mt-2 block text-sm text-slate-500">
            Colored squares rendered via Tailwind utilities.
          </Text>
        </Card>

        <Card title="Design Tokens" variant="borderless">
          <div className="flex gap-3">
            <div
              className="size-12 rounded-lg"
              style={{ backgroundColor: colors.navy.DEFAULT }}
            />
            <div
              className="size-12 rounded-lg"
              style={{ backgroundColor: colors.teal.DEFAULT }}
            />
            <div
              className="size-12 rounded-lg"
              style={{ backgroundColor: colors.purple.DEFAULT }}
            />
          </div>
          <Text className="mt-2 block text-sm text-slate-500">
            Brand colors from forge/tokens (navy, teal, purple).
          </Text>
        </Card>
      </div>
    </div>
  );
}
