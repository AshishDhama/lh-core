import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div>
      <h1>Lighthouse</h1>
      <p>Dashboard — coming soon.</p>
    </div>
  );
}
