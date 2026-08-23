'use client';

import { Settings } from 'lucide-react';
import { useState } from 'react';

import HeadSection from './components/HeadSection';
import UserSettings from './components/UserSettings';

import TabList, { TabItem } from '@/components/UI/TabList';

const tabs: TabItem[] = [
  {
    label: 'General Settings',
    value: 'general_settings',
    icon: <Settings />,
  },
];

const tabComponents: Record<string, React.ReactElement> = {
  general_settings: <UserSettings />,
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<string>(tabs?.[0]?.value ?? '');

  return (
    <div className="flex w-full flex-col gap-6">
      <HeadSection />
      <TabList tabs={tabs} value={activeTab} onChange={setActiveTab} />
      {tabComponents[activeTab]}
    </div>
  );
};

export default ProfilePage;
