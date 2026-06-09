import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import nextDynamic from 'next/dynamic';

const HistoryClient = nextDynamic(() => import('@/components/history-client'), {
  ssr: true,
});

export const dynamic = 'force-dynamic';

interface HistoryPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1', 10);
  const search = resolvedParams.search || '';

  // 1. Authenticate user on the server
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Setup server-side pagination range
  const pageSize = 10;
  const from = (page - 1) * pageSize;
  const to = page * pageSize - 1;

  // 3. Query optimizations table with search filter and pagination
  let dbQuery = supabase
    .from('optimizations')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id);

  if (search) {
    dbQuery = dbQuery.ilike('input_title', `%${search}%`);
  }

  const { data, count, error } = await dbQuery
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching server-side history:', error);
  }

  const history = data || [];
  const totalCount = count || 0;
  const pageCount = Math.ceil(totalCount / pageSize);

  return (
    <HistoryClient
      initialHistory={history}
      search={search}
      page={page}
      pageCount={pageCount}
      totalCount={totalCount}
    />
  );
}
