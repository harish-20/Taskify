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

type Step = {
  label: string;
  Icon: React.FC;
};
