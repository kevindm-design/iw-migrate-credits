export type ApplicationStatus = 'New' | 'InReview' | 'Submitted' | 'Approved' | 'CreditsDisbursed' | 'Completed' | 'Rejected';
export type ApplicationTrack = 'Express' | 'Standard';

export interface CustomerSubmission {
  currentPlatform: string;
  workloadDescription: string;
  projectedArr: number;
  migrationStart: string;
  migrationEnd: string;
  targetAccountId: string;
  isOpenaiMigration: boolean;
  isGcpGeminiMigration: boolean;
  hasPartner: boolean;
  partnerName?: string;
  supportingDocs: string[];
  submittedAt: string;
}

export interface RepSubmission {
  projectedArr: number;
  creditAmount: number;
  firstTranchePct: number;
  migrationStart: string;
  migrationEnd: string;
  workloadClassification: string;
  notes: string;
  additionalDocs: string[];
  submittedAt?: string;
}

export interface Application {
  id: string;
  customerAccountId: string;
  customerName: string;
  status: ApplicationStatus;
  track: ApplicationTrack;
  customerSubmission: CustomerSubmission;
  repSubmission?: RepSubmission;
  assignedRep?: string;
  assignedSa?: string;
  magicLinkRef?: string;
  sfdcOpportunityId?: string;
  investmentsRequestId?: string;
  firstTrancheDisbursedAt?: string;
  attestationSubmittedAt?: string;
  secondTrancheDisbursedAt?: string;
  creditsExpireAt?: string;
  createdAt: string;
}

export interface EligibilityResult {
  eligible: boolean;
  reason?: string;
  arr?: number;
}

export interface CreditEstimate {
  minCredits: number;
  maxCredits: number;
  baseRate: number;
  kickerRate: number;
  projectedArr: number;
}
