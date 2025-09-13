import { memo } from 'react';

export const BaseChallengeWorkbench = memo(() => {
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Chat Panel Placeholder */}
      <div className="flex-1 border-r border-bolt-elements-borderColor bg-bolt-elements-background-depth-1">
        <div className="flex items-center justify-center h-full">
          <div className="text-bolt-elements-textSecondary">Loading chat...</div>
        </div>
      </div>

      {/* Editor and Preview Panel */}
      <div className="flex-1 flex">
        {/* Editor Panel Placeholder */}
        <div className="flex-1 border-r border-bolt-elements-borderColor bg-bolt-elements-background-depth-1">
          <div className="flex items-center justify-center h-full">
            <div className="text-bolt-elements-textSecondary">Loading editor...</div>
          </div>
        </div>

        {/* Preview Panel Placeholder */}
        <div className="flex-1 bg-bolt-elements-background-depth-1">
          <div className="flex items-center justify-center h-full">
            <div className="text-bolt-elements-textSecondary">Loading preview...</div>
          </div>
        </div>
      </div>
    </div>
  );
});