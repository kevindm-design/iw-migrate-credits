import { Application, EligibilityResult, CreditEstimate } from '../types';

const applications: Application[] = [];
let idCounter = 1;
const genId = () => `app-${String(idCounter++).padStart(4, '0')}`;

const MIN_ARR = 24000;
const MAX_ARR = 500000;
const EXPRESS_THRESHOLD = 100000;
const BASE_RATE = 0.15;
const STANDARD_KICKER = 0.10;
const COMPETITIVE_KICKER = 0.20;

export function checkEligibility(accountId: string): EligibilityResult {
  const mockArr = 50000 + Math.random() * 400000;
  if (mockArr < MIN_ARR) return { eligible: false, reason: 'Your account ARR is below the minimum required for this program.', arr: mockArr };
  if (mockArr >= MAX_ARR) return { eligible: false, reason: 'Your account ARR exceeds the program maximum. Please contact your AWS account team.', arr: mockArr };
  const hasActive = applications.some(a => a.customerAccountId === accountId && !['Completed','Rejected'].includes(a.status));
  if (hasActive) return { eligible: false, reason: 'Your account already has an active credits application in progress.', arr: mockArr };
  return { eligible: true, arr: mockArr };
}

export function determineTrack(projectedArr: number): 'Express' | 'Standard' {
  return projectedArr < EXPRESS_THRESHOLD ? 'Express' : 'Standard';
}

export function calculateCreditEstimate(projectedArr: number, isOpenai: boolean, isGemini: boolean): CreditEstimate {
  const kickerRate = (isOpenai || isGemini) ? COMPETITIVE_KICKER : STANDARD_KICKER;
  return {
    minCredits: Math.round(projectedArr * BASE_RATE),
    maxCredits: Math.round(projectedArr * (BASE_RATE + kickerRate)),
    baseRate: BASE_RATE,
    kickerRate,
    projectedArr,
  };
}

export function submitApplication(customerAccountId: string, customerName: string, submission: Omit<Application['customerSubmission'], 'submittedAt'>, magicLinkRef?: string): Application {
  const track = determineTrack(submission.projectedArr);
  const app: Application = {
    id: genId(),
    customerAccountId,
    customerName,
    status: track === 'Express' ? 'Approved' : 'New',
    track,
    customerSubmission: { ...submission, submittedAt: new Date().toISOString() },
    magicLinkRef,
    createdAt: new Date().toISOString(),
  };
  applications.push(app);
  return app;
}

export function getApplications(filters?: { status?: string; track?: string }): Application[] {
  let results = [...applications];
  if (filters?.status) results = results.filter(a => a.status === filters.status);
  if (filters?.track) results = results.filter(a => a.track === filters.track);
  return results;
}

export function getApplication(id: string): Application | undefined {
  return applications.find(a => a.id === id);
}

export function updateApplication(id: string, updates: Partial<Application>): Application | undefined {
  const idx = applications.findIndex(a => a.id === id);
  if (idx === -1) return undefined;
  applications[idx] = { ...applications[idx], ...updates };
  return applications[idx];
}

// Seed demo data
applications.push(
  { id: genId(), customerAccountId: '123456789012', customerName: 'Acme Startup Inc.', status: 'New', track: 'Standard', customerSubmission: { currentPlatform: 'Google Cloud Platform', workloadDescription: 'Production Kubernetes workloads and ML pipelines', projectedArr: 250000, migrationStart: '2026-07-01', migrationEnd: '2026-12-31', targetAccountId: '123456789012', isOpenaiMigration: false, isGcpGeminiMigration: true, hasPartner: true, partnerName: 'CloudMigrate Partners', supportingDocs: [], submittedAt: '2026-06-08T10:30:00Z' }, assignedRep: 'rep-001', createdAt: '2026-06-08T10:30:00Z' },
  { id: genId(), customerAccountId: '987654321098', customerName: 'TechFlow AI', status: 'InReview', track: 'Standard', customerSubmission: { currentPlatform: 'Azure + OpenAI', workloadDescription: 'AI/ML training and inference, migrating to Amazon Bedrock', projectedArr: 180000, migrationStart: '2026-08-01', migrationEnd: '2027-01-31', targetAccountId: '987654321098', isOpenaiMigration: true, isGcpGeminiMigration: false, hasPartner: false, supportingDocs: [], submittedAt: '2026-06-05T14:20:00Z' }, assignedRep: 'rep-002', assignedSa: 'sa-001', createdAt: '2026-06-05T14:20:00Z' },
  { id: genId(), customerAccountId: '456789012345', customerName: 'DataScale Labs', status: 'Approved', track: 'Express', customerSubmission: { currentPlatform: 'On-premises', workloadDescription: 'Data analytics pipeline and dashboards', projectedArr: 72000, migrationStart: '2026-06-15', migrationEnd: '2026-09-15', targetAccountId: '456789012345', isOpenaiMigration: false, isGcpGeminiMigration: false, hasPartner: false, supportingDocs: [], submittedAt: '2026-06-09T08:00:00Z' }, createdAt: '2026-06-09T08:00:00Z' },
);
