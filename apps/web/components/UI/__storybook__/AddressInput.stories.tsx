// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import AddressInput from '../AddressInput';

import type { Address } from '@/lib/types';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

//👇 This default export determines where your story goes in the story list
const meta = {
  component: AddressInput,
} satisfies Meta<typeof AddressInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    value: {
      street: '',
      city: '',
      state: '',
      country: '',
      zip: '',
    },
    onChange: (value: Address) => console.log('Address changed:', value),
  },
};
