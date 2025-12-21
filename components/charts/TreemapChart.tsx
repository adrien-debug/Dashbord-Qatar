import React, { useState, useMemo } from 'react';

interface TreemapNode {
  name: string;
  value: number;
  color?: string;
  children?: TreemapNode[];
}

interface TreemapChartProps {
  data: TreemapNode;
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  unit?: string;
  formatValue?: (value: number) => string;
  colorScheme?: string[];
}

interface ProcessedNode extends TreemapNode {
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  parent?: string;
}

export const TreemapChart: React.FC<TreemapChartProps> = ({
  data,
  height = 400,
  showLabels = true,
  showValues = true,
  unit = '$',
  formatValue,
  colorScheme = ['#8AFD81', '#3b82f6', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899'],
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [zoomedNode, setZoomedNode] = useState<TreemapNode | null>(null);

  const width = 800;

  const defaultFormatValue = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `${unit}${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${unit}${(value / 1000).toFixed(1)}K`;
    }
    return `${unit}${value.toFixed(0)}`;
  };

  const formatter = formatValue || defaultFormatValue;

  // Treemap layout algorithm (squarified)
  const calculateTreemap = (
    node: TreemapNode,
    x: number,
    y: number,
    w: number,
    h: number,
    depth: number = 0,
    colorIndex: number = 0,
    parentName?: string
  ): ProcessedNode[] => {
    const result: ProcessedNode[] = [];
    
    if (!node.children || node.children.length === 0) {
      result.push({
        ...node,
        x,
        y,
        width: w,
        height: h,
        depth,
        color: node.color || colorScheme[colorIndex % colorScheme.length],
        parent: parentName,
      });
      return result;
    }

    // Sort children by value (descending)
    const sortedChildren = [...node.children].sort((a, b) => b.value - a.value);
    const totalValue = sortedChildren.reduce((sum, child) => sum + child.value, 0);

    // Calculate rectangles using slice-and-dice
    let currentX = x;
    let currentY = y;
    let remainingWidth = w;
    let remainingHeight = h;
    
    const isHorizontal = w >= h;

    sortedChildren.forEach((child, index) => {
      const ratio = child.value / totalValue;
      
      let childWidth: number;
      let childHeight: number;
      let childX: number;
      let childY: number;

      if (isHorizontal) {
        childWidth = remainingWidth * ratio * (sortedChildren.length / (sortedChildren.length - index));
        childWidth = Math.min(childWidth, remainingWidth);
        childHeight = h;
        childX = currentX;
        childY = y;
        currentX += childWidth;
        remainingWidth -= childWidth;
      } else {
        childWidth = w;
        childHeight = remainingHeight * ratio * (sortedChildren.length / (sortedChildren.length - index));
        childHeight = Math.min(childHeight, remainingHeight);
        childX = x;
        childY = currentY;
        currentY += childHeight;
        remainingHeight -= childHeight;
      }

      // Add some padding
      const padding = 2;
      const paddedX = childX + padding;
      const paddedY = childY + padding;
      const paddedW = Math.max(0, childWidth - padding * 2);
      const paddedH = Math.max(0, childHeight - padding * 2);

      if (child.children && child.children.length > 0) {
        // Recurse into children
        const childNodes = calculateTreemap(
          child,
          paddedX,
          paddedY,
          paddedW,
          paddedH,
          depth + 1,
          index,
          child.name
        );
        result.push(...childNodes);
      } else {
        result.push({
          ...child,
          x: paddedX,
          y: paddedY,
          width: paddedW,
          height: paddedH,
          depth,
          color: child.color || colorScheme[index % colorScheme.length],
          parent: parentName,
        });
      }
    });

    return result;
  };

  const currentData = zoomedNode || data;
  const processedNodes = useMemo(() => 
    calculateTreemap(currentData, 0, 0, width, height - 60),
    [currentData, width, height]
  );

  const totalValue = data.value;

  const handleNodeClick = (node: ProcessedNode) => {
    // Find the original node in data
    const findNode = (searchNode: TreemapNode, targetName: string): TreemapNode | null => {
      if (searchNode.name === targetName) return searchNode;
      if (searchNode.children) {
        for (const child of searchNode.children) {
          const found = findNode(child, targetName);
          if (found) return found;
        }
      }
      return null;
    };

    if (node.parent) {
      const parentNode = findNode(data, node.parent);
      if (parentNode && parentNode.children && parentNode.children.length > 1) {
        setZoomedNode(parentNode);
        setSelectedPath([...selectedPath, node.parent]);
      }
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      setZoomedNode(null);
      setSelectedPath([]);
    } else {
      const newPath = selectedPath.slice(0, index + 1);
      setSelectedPath(newPath);
      // Navigate to that node
      let targetNode = data;
      for (const name of newPath) {
        const found = targetNode.children?.find(c => c.name === name);
        if (found) targetNode = found;
      }
      setZoomedNode(targetNode);
    }
  };

  return (
    <div className="w-full relative" style={{ height: height + 40 }}>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 mb-4 px-2">
        <button
          onClick={() => handleBreadcrumbClick(-1)}
          className={`text-sm font-medium transition-colors ${
            selectedPath.length === 0 
              ? 'text-slate-900' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {data.name}
        </button>
        {selectedPath.map((name, index) => (
          <React.Fragment key={index}>
            <span className="text-slate-400">/</span>
            <button
              onClick={() => handleBreadcrumbClick(index)}
              className={`text-sm font-medium transition-colors ${
                index === selectedPath.length - 1 
                  ? 'text-slate-900' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Treemap SVG */}
      <svg 
        viewBox={`0 0 ${width} ${height - 60}`} 
        className="w-full"
        style={{ height: height - 60 }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {colorScheme.map((color, i) => (
            <linearGradient key={i} id={`treemap-gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity={0.9} />
              <stop offset="100%" stopColor={color} stopOpacity={0.7} />
            </linearGradient>
          ))}
          <filter id="treemap-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.1"/>
          </filter>
          <filter id="treemap-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {processedNodes.map((node, index) => {
          const isHovered = hoveredNode === node.name;
          const percentage = ((node.value / totalValue) * 100).toFixed(1);
          const colorIndex = colorScheme.indexOf(node.color || '') !== -1 
            ? colorScheme.indexOf(node.color || '') 
            : index % colorScheme.length;
          
          const minSizeForLabel = 60;
          const minSizeForValue = 40;
          const canShowLabel = node.width > minSizeForLabel && node.height > 30;
          const canShowValue = node.width > minSizeForValue && node.height > 50;

          return (
            <g 
              key={`${node.name}-${index}`}
              onMouseEnter={() => setHoveredNode(node.name)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => handleNodeClick(node)}
              className="cursor-pointer"
            >
              {/* Rectangle */}
              <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                rx={6}
                fill={node.color || `url(#treemap-gradient-${colorIndex})`}
                stroke={isHovered ? '#1e293b' : 'white'}
                strokeWidth={isHovered ? 2 : 1}
                filter={isHovered ? 'url(#treemap-glow)' : 'url(#treemap-shadow)'}
                className="transition-all duration-300"
                style={{
                  transform: isHovered ? 'scale(1.01)' : 'scale(1)',
                  transformOrigin: `${node.x + node.width / 2}px ${node.y + node.height / 2}px`,
                }}
              />
              
              {/* Gradient overlay for depth */}
              <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                rx={6}
                fill="url(#treemap-overlay)"
                className="pointer-events-none"
              />
              
              {/* Highlight on hover */}
              {isHovered && (
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  rx={6}
                  fill="white"
                  fillOpacity={0.15}
                  className="pointer-events-none"
                />
              )}

              {/* Label */}
              {showLabels && canShowLabel && (
                <text
                  x={node.x + node.width / 2}
                  y={node.y + node.height / 2 - (canShowValue ? 8 : 0)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold fill-white pointer-events-none"
                  style={{ 
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    fontSize: Math.min(14, node.width / 8),
                  }}
                >
                  {node.name.length > node.width / 8 
                    ? node.name.substring(0, Math.floor(node.width / 8)) + '...'
                    : node.name
                  }
                </text>
              )}

              {/* Value */}
              {showValues && canShowValue && (
                <text
                  x={node.x + node.width / 2}
                  y={node.y + node.height / 2 + 12}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[10px] font-medium fill-white/80 pointer-events-none"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                >
                  {formatter(node.value)} ({percentage}%)
                </text>
              )}
            </g>
          );
        })}

        {/* Overlay gradient definition */}
        <defs>
          <linearGradient id="treemap-overlay" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity={0.1} />
            <stop offset="50%" stopColor="white" stopOpacity={0} />
            <stop offset="100%" stopColor="black" stopOpacity={0.1} />
          </linearGradient>
        </defs>
      </svg>

      {/* Tooltip */}
      {hoveredNode && (
        <div 
          className="absolute bg-white border border-slate-200 rounded-lg shadow-xl p-4 min-w-[220px] pointer-events-none z-10"
          style={{
            left: '50%',
            top: '40%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {(() => {
            const node = processedNodes.find(n => n.name === hoveredNode);
            if (!node) return null;
            const percentage = ((node.value / totalValue) * 100).toFixed(1);
            
            return (
              <>
                <div className="flex items-center gap-3 border-b border-slate-100 pb-2 mb-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: node.color }}
                  />
                  <span className="text-sm font-semibold text-slate-900">{node.name}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-6">
                    <span className="text-sm text-slate-600">Valeur</span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {formatter(node.value)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-6">
                    <span className="text-sm text-slate-600">Part du total</span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {percentage}%
                    </span>
                  </div>
                  {node.parent && (
                    <div className="flex items-center justify-between gap-6 pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-500">Catégorie</span>
                      <span className="text-xs font-medium text-slate-700">{node.parent}</span>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4 py-2">
        {data.children?.slice(0, 6).map((child, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: child.color || colorScheme[index % colorScheme.length] }}
            />
            <span className="text-xs text-slate-600">{child.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

