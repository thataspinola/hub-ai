import { NextRequest, NextResponse } from 'next/server';
import { normalizeFeatureFlagDocument } from '@/lib/feature-flags/crud-storage';
import { getFeatureFlagProject, getPublicFeatureFlagUrl, saveFeatureFlagProject } from '@/lib/feature-flags/s3-storage';

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  return fallback;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectName: string }> },
) {
  try {
    const { projectName } = await params;
    const project = await getFeatureFlagProject(decodeURIComponent(projectName));
    return NextResponse.json({
      project,
      publicUrl: getPublicFeatureFlagUrl(project.name),
    });
  } catch (error) {
    console.error('Failed to get feature flag project', error);
    return NextResponse.json(
      { message: getErrorMessage(error, 'Failed to get feature flag project') },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectName: string }> },
) {
  try {
    const { projectName } = await params;
    const payload = await request.json();
    const project = normalizeFeatureFlagDocument(payload);
    const decodedProjectName = decodeURIComponent(projectName);

    if (project.name !== decodedProjectName) {
      return NextResponse.json(
        { message: 'Project name must match the route projectName' },
        { status: 400 },
      );
    }

    const savedProject = await saveFeatureFlagProject(project);
    return NextResponse.json({
      project: savedProject,
      publicUrl: getPublicFeatureFlagUrl(savedProject.name),
    });
  } catch (error) {
    console.error('Failed to save feature flag project', error);
    return NextResponse.json(
      { message: getErrorMessage(error, 'Failed to save feature flag project') },
      { status: 500 },
    );
  }
}
