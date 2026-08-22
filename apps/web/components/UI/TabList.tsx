import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import React from 'react';

const tabListVariants = cva('flex items-center border-b border-gray-200', {
  variants: {
    variant: {
      default: '',
      pills: 'gap-1 border-none',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const tabVariants = cva(
  'relative inline-flex items-center justify-center gap-2 font-medium transition-colors whitespace-nowrap cursor-pointer',
  {
    variants: {
      active: {
        true: 'text-primary',
        false: 'text-gray-500 hover:text-gray-900',
      },
      variant: {
        default: 'pb-3',
        pills: 'rounded-md px-3 py-2',
      },
      size: {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-2',
        lg: 'text-base px-4 py-3',
      },
    },
    defaultVariants: {
      active: false,
      variant: 'default',
      size: 'md',
    },
  },
);

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof tabListVariants> {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
}

const TabList: React.FC<TabListProps> = ({
  tabs,
  value,
  onChange,
  variant,
  size,
  className,
  ...props
}) => {
  return (
    <div role="tablist" className={clsx(tabListVariants({ variant }), className)} {...props}>
      {tabs.map((tab) => {
        const isActive = value === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`${tab.value}-panel`}
            disabled={tab.disabled}
            onClick={() => onChange(tab.value)}
            className={clsx(
              tabVariants({
                active: isActive,
                variant,
                size,
              }),
              tab.disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            {tab.icon}

            {tab.label}

            {variant !== 'pills' && isActive && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-violet-600" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TabList;
