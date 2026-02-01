enum SubscriptionPlan {
  FREE = "free",
  PRO = "pro",
  ENTERPRISE = "enterprise",
}

interface Organization {
  name: string;
  description?: string;
  owner: string;
  members: string[];
  website: string;
  logoUrl?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  };
  contactEmail?: string;
  phoneNumber?: string;
  subscriptionPlan: SubscriptionPlan;
  teams: string[];
  profile: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrganizationProfile {
  organization: string;
  industry?: string;
  interests?: string[];
  size: CompanySize;

  metrics?: {
    activeUsers?: number;
    tasksCreated?: number;
    projectsCreated?: number;
    teamsCreated?: number;
    lastActive?: Date;
    usageFrequency?: "daily" | "weekly" | "monthly" | "rare";
    retentionScore?: number;
  };

  acquisition?: {
    source?: "referral" | "ads" | "organic" | "partnership" | "other";
    campaign?: string;
    signupDate?: Date;
  };

  demographics?: {
    primaryUserRole?: string;
    ageGroup?: string;
  };

  techStack?: string[];
  integrationsUsed?: string[];
  feedback?: {
    satisfactionScore?: number;
    featureRequests?: string[];
    issuesReported?: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

export type CompanySize =
  | "1-10"
  | "11-50"
  | "51-100"
  | "101-200"
  | "201-500"
  | "501-1000"
  | "1001-2000"
  | "2000+";

type Step = {
  label: string;
  Icon: FC<any>;
};
