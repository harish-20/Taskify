import { HTMLAttributes, PropsWithChildren } from 'react';

interface StopPropagationProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {}

const StopPropagation: React.FC<StopPropagationProps> = (props) => {
  const { children, onMouseDown, ...divProps } = props;

  return (
    <div
      onMouseDown={(e) => {
        e.stopPropagation();
        onMouseDown?.(e);
      }}
    >
      {children}
    </div>
  );
};

export default StopPropagation;
