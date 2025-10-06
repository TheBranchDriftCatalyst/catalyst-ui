import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NodeData } from './types';
import JsonTreeView from './components/JsonTreeView';
import { useFloatingPanel } from './hooks/useFloatingPanel';

interface NodeDetailsProps {
  node?: NodeData;
}

const NodeDetails: React.FC<NodeDetailsProps> = ({ node }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'attributes'>('details');
  const [visible, setVisible] = useState(false);
  const [delayedNode, setDelayedNode] = useState<NodeData | undefined>(undefined);

  const {
    panelRef,
    dragHandleRef,
    resizeHandleRef,
    isCollapsed,
    toggleCollapse,
    style,
  } = useFloatingPanel({
    initialPosition: { x: window.innerWidth - 600, y: 80 },
    positionStorageKey: 'catalyst-ui.forcegraph.nodedetails.position',
    initialSize: { width: 520, height: 500 },
    minWidth: 300,
    minHeight: 200,
    maxWidth: 800,
    maxHeight: 1000,
    sizeStorageKey: 'catalyst-ui.forcegraph.nodedetails.size',
    enableDragging: true,
    enableResizing: true,
    enableCollapse: true,
  });

  // Add delay to prevent rapid show/hide and hover loops
  useEffect(() => {
    if (node) {
      const timer = setTimeout(() => {
        setDelayedNode(node);
        setVisible(true);
      }, 150); // 150ms delay before showing

      return () => clearTimeout(timer);
    } else {
      setVisible(false);
      const timer = setTimeout(() => {
        setDelayedNode(undefined);
      }, 100); // Small delay before clearing to allow hover transfer
      return () => clearTimeout(timer);
    }
  }, [node]);

  if (!visible || !delayedNode) {
    return null;
  }

  const name = delayedNode.name || delayedNode.Name || delayedNode.id;
  const attributes = delayedNode.attributes || {};
  const hasAttributes = Object.keys(attributes).length > 0;

  return createPortal(
    <div
      ref={panelRef}
      style={style}
      className="bg-background/95 border-2 border-primary rounded-xl backdrop-blur-md shadow-[0_8px_32px_rgba(var(--primary-rgb),0.3)] flex flex-col pointer-events-auto z-50"
    >
      {/* Header with Drag Handle and Collapse Button */}
      <div className="p-4 border-b border-primary/20 flex-shrink-0">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-bold text-primary" style={{ textShadow: '0 0 8px var(--primary)' }}>
            Node Details
          </h3>
          <div className="flex items-center gap-2">
            {/* Collapse Button */}
            <button
              onClick={toggleCollapse}
              className="w-5 h-5 flex items-center justify-center cursor-pointer opacity-60 hover:opacity-100 transition-opacity text-primary"
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                {isCollapsed ? (
                  <path d="M8 4l4 4H4l4-4z" />
                ) : (
                  <path d="M4 6l4 4 4-4H4z" />
                )}
              </svg>
            </button>
            {/* Drag Handle */}
            <div
              ref={dragHandleRef}
              className="w-4 h-4 cursor-grab active:cursor-grabbing opacity-40 hover:opacity-80 transition-opacity"
              title="Drag to move"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="text-primary">
                <circle cx="4" cy="4" r="1.5" />
                <circle cx="12" cy="4" r="1.5" />
                <circle cx="4" cy="8" r="1.5" />
                <circle cx="12" cy="8" r="1.5" />
                <circle cx="4" cy="12" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
              </svg>
            </div>
          </div>
        </div>
        <p className="text-lg font-semibold text-foreground truncate" title={name}>{name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">{delayedNode.kind}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{delayedNode.id}</span>
        </div>
      </div>

      {/* Tabs */}
      {!isCollapsed && hasAttributes && (
        <div className="flex border-b border-primary/20 flex-shrink-0">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === 'details'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('attributes')}
            className={`flex-1 px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === 'attributes'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Attributes
          </button>
        </div>
      )}

      {/* Content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'details' && (
          <div className="space-y-3">
            <div className="bg-card/50 rounded-lg p-3 border border-border">
              <h4 className="text-xs font-semibold text-foreground/70 mb-2">BASIC INFO</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="text-foreground font-mono">{delayedNode.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kind:</span>
                  <span className="text-foreground capitalize">{delayedNode.kind}</span>
                </div>
                {name !== delayedNode.id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="text-foreground">{name}</span>
                  </div>
                )}
              </div>
            </div>

            {hasAttributes && (
              <div className="bg-card/50 rounded-lg p-3 border border-border">
                <h4 className="text-xs font-semibold text-foreground/70 mb-2">QUICK VIEW</h4>
                <div className="space-y-1.5 text-xs">
                  {Object.entries(attributes).slice(0, 5).map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-2">
                      <span className="text-muted-foreground truncate">{key}:</span>
                      <span className="text-foreground truncate font-mono text-right">
                        {typeof value === 'object' ? '{...}' : String(value)}
                      </span>
                    </div>
                  ))}
                  {Object.keys(attributes).length > 5 && (
                    <div className="text-xs text-primary/70 italic pt-1">
                      +{Object.keys(attributes).length - 5} more in Attributes tab
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'attributes' && hasAttributes && (
          <div className="bg-card/30 rounded-lg p-3 border border-border">
            <JsonTreeView
              data={attributes}
              rootName="attributes"
              initialExpanded={['attributes']}
            />
          </div>
        )}
        </div>
      )}

      {/* Resize Handle */}
      {!isCollapsed && (
        <div
          ref={resizeHandleRef}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize opacity-40 hover:opacity-80 transition-opacity"
          title="Drag to resize"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="text-primary">
            <path d="M14 14L10 14L14 10z" />
            <path d="M14 8L6 8L14 0z" />
          </svg>
        </div>
      )}
    </div>,
    document.body
  );
};

export default NodeDetails;
