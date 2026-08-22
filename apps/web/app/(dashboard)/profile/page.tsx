'use client';

import { Settings } from 'lucide-react';
import { useState } from 'react';

import HeadSection from './components/HeadSection';

import TabList, { TabItem } from '@/components/UI/TabList';

const tabs: TabItem[] = [
  {
    label: 'General Settings',
    value: 'general_settings',
    icon: <Settings />,
  },
  {
    label: 'Security Settings',
    value: 'security_settings',
    icon: <Settings />,
  },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<string>(tabs?.[0]?.value ?? '');

  return (
    <div className="flex flex-col gap-4">
      <HeadSection />
      <TabList tabs={tabs} value={activeTab} onChange={setActiveTab} />
    </div>
  );
};

export default ProfilePage;
