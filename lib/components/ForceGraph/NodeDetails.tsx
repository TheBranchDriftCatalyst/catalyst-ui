import React, { useState, useEffect } from 'react';
import { NodeData } from './types';
import JsonTreeView from './components/JsonTreeView';

interface NodeDetailsProps {
  node?: NodeData;
}

const NodeDetails: React.FC<NodeDetailsProps> = ({ node }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'attributes'>('details');
  const [visible, setVisible] = useState(false);
  const [delayedNode, setDelayedNode] = useState<NodeData | undefined>(undefined);

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

  return (
    <div className="absolute top-20 right-6 bg-background/95 border-2 border-primary rounded-xl backdrop-blur-md shadow-[0_8px_32px_rgba(var(--primary-rgb),0.3)] max-w-[520px] max-h-[calc(100vh-120px)] w-[min(40vw,720px)] flex flex-col pointer-events-auto z-50">
      {/* Header */}
      <div className="p-4 border-b border-primary/20">
        <h3 className="text-sm font-bold text-primary mb-2" style={{ textShadow: '0 0 8px var(--primary)' }}>
          Node Details
        </h3>
        <p className="text-lg font-semibold text-foreground truncate" title={name}>{name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">{delayedNode.kind}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{delayedNode.id}</span>
        </div>
      </div>

      {/* Tabs */}
      {hasAttributes && (
        <div className="flex border-b border-primary/20">
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
    </div>
  );
};

export default NodeDetails;
