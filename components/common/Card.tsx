
import React from 'react';

// FIX: Extend React.HTMLAttributes<HTMLDivElement> to allow passing standard div props like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  // FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  icon?: React.ReactElement;
}

// FIX: Destructure `...props` and spread them onto the root div element.
export const Card: React.FC<CardProps> = ({ children, className = '', title, icon, ...props }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg ${className}`} {...props}>
      {title && (
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
          {icon && <div className="mr-3 text-cyan-500 dark:text-cyan-400">{icon}</div>}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
      )}
      <div className="p-4 text-base text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </div>
  );
};
