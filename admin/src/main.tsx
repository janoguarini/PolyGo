import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { AuthGate } from './auth/AuthGate.tsx';
import { Layout } from './components/Layout.tsx';
import { PanelProvider } from './lib/context.tsx';
import { useRoute } from './lib/router.ts';
import { AdminTools, Content, Health } from './pages/Ops.tsx';
import { Marketing, Monetization, Notifications, Social } from './pages/Business.tsx';
import { Growth } from './pages/Growth.tsx';
import { Learning } from './pages/Learning.tsx';
import { Overview } from './pages/Overview.tsx';
import { Ranked } from './pages/Ranked.tsx';
import { Retention } from './pages/Retention.tsx';
import { UserDetail } from './pages/UserDetail.tsx';
import { Users } from './pages/Users.tsx';
import './styles.css';

function Panel({ session }: { session: Parameters<typeof Layout>[0]['session'] }) {
  const route = useRoute();
  const [crumb, setCrumb] = useState<string | undefined>();
  useEffect(() => {
    setCrumb(undefined);
    window.scrollTo(0, 0);
  }, [route.section, route.param]);

  let page: React.ReactNode;
  switch (route.section) {
    case 'overview':
      page = <Overview />;
      break;
    case 'users':
      page = route.param ? <UserDetail key={route.param} userId={route.param} onTitle={setCrumb} /> : <Users />;
      break;
    case 'growth':
      page = <Growth />;
      break;
    case 'learning':
      page = <Learning />;
      break;
    case 'ranked':
      page = <Ranked />;
      break;
    case 'retention':
      page = <Retention />;
      break;
    case 'social':
      page = <Social />;
      break;
    case 'monetization':
      page = <Monetization />;
      break;
    case 'marketing':
      page = <Marketing />;
      break;
    case 'notifications':
      page = <Notifications />;
      break;
    case 'health':
      page = <Health />;
      break;
    case 'content':
      page = <Content />;
      break;
    case 'admin':
      page = <AdminTools />;
      break;
  }
  return (
    <Layout route={route} session={session} crumb={route.param ? (crumb ?? 'Ficha') : undefined}>
      {page}
    </Layout>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthGate>
      {(session) => (
        <PanelProvider>
          <Panel session={session} />
        </PanelProvider>
      )}
    </AuthGate>
  </StrictMode>,
);
