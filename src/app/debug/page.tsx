export default async function DebugPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return (
    <pre style={{ padding: 24, fontSize: 14 }}>
      {JSON.stringify(sp, null, 2)}
    </pre>
  );
}
