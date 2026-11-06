import { FeatureFlagCrud } from '@/components/portal-admin/FeatureFlagCrud';

export default async function FeatureFlagProjectPage({
  params,
}: {
  params: Promise<{ projectName: string }>;
}) {
  const { projectName } = await params;

  return <FeatureFlagCrud projectName={decodeURIComponent(projectName)} />;
}
