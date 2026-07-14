// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Address } from '@/lib/types';
import AddressInput from '../AddressInput';

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
