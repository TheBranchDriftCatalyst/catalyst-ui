import React, { useState } from 'react';

interface JsonTreeViewProps {
  data: any;
  rootName?: string;
  className?: string;
  style?: React.CSSProperties;
  initialExpanded?: string[];
}

const JsonTreeView: React.FC<JsonTreeViewProps> = ({
  data,
  rootName,
  className,
  style,
  initialExpanded,
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    const list: string[] = initialExpanded || [];
    list.forEach((p: string) => {
      map[p] = true;
    });
    return map;
  });

  const toggle = (path: string) => {
    setExpanded((s) => ({ ...s, [path]: !s[path] }));
  };

  const renderNode = (d: any, path = ''): React.ReactNode => {
    if (d === null || d === undefined) {
      return <span className="text-muted-foreground">null</span>;
    }
    if (typeof d !== 'object') {
      return <span className="text-primary">{String(d)}</span>;
    }

    if (Array.isArray(d)) {
      return (
        <div className="ml-3">
          <span className="text-muted-foreground">[{d.length}]</span>
          {d.map((item: any, i: number) => (
            <div key={i} className="mt-1.5">
              <div className="text-cyan-400">{i}:</div>
              <div className="ml-2">{renderNode(item, `${path}.${i}`)}</div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="ml-2">
        {Object.entries(d as Record<string, any>).map(([k, v]) => {
          const childPath = path ? `${path}.${k}` : k;
          const isObject = v && typeof v === 'object';
          return (
            <div key={childPath} className="mt-1.5">
              <div
                className={`flex items-center gap-2 ${isObject ? 'cursor-pointer hover:bg-foreground/5 rounded px-1 -mx-1 transition-colors' : ''}`}
                onClick={isObject ? () => toggle(childPath) : undefined}
                role={isObject ? 'button' : undefined}
                aria-label={isObject ? (expanded[childPath] ? `collapse ${k}` : `expand ${k}`) : undefined}
              >
                {isObject ? (
                  <span className="text-cyan-400 select-none">
                    {expanded[childPath] ? '\u25be' : '\u25b8'}
                  </span>
                ) : (
                  <span className="w-3.5" />
                )}
                <strong className="text-yellow-400">{k}</strong>
                <span className="text-foreground/60">:</span>
                {!isObject && <span className="ml-1.5 text-foreground">{String(v)}</span>}
              </div>
              {isObject && expanded[childPath] && <div className="ml-4.5">{renderNode(v, childPath)}</div>}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`text-xs text-foreground ${className || ''}`} style={style}>
      {rootName && <div className="text-cyan-400 mb-1.5">{rootName}</div>}
      {renderNode(data, rootName || '')}
    </div>
  );
};

export default JsonTreeView;
