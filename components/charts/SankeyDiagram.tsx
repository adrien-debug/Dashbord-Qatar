import React, { useState } from 'react';

interface SankeyNode {
  id: string;
  name: string;
  value: number;
  color: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

interface SankeyDiagramProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  height?: number;
  nodeWidth?: number;
  nodePadding?: number;
  unit?: string;
}

export const SankeyDiagram: React.FC<SankeyDiagramProps> = ({
  nodes,
  links,
  height = 400,
  nodeWidth = 20,
  nodePadding = 20,
  unit = '',
}) => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Simple layout calculation
  const width = 800;
  const padding = 40;
  const innerWidth = width - 2 * padding;
  const innerHeight = height - 2 * padding;

  // Group nodes by column (level)
  const nodesByLevel: { [level: number]: SankeyNode[] } = {};
  const nodeLevel: { [id: string]: number } = {};

  // Determine levels based on links
  const sourceNodes = new Set(links.map(l => l.source));
  const targetNodes = new Set(links.map(l => l.target));
  
  nodes.forEach(node => {
    if (!targetNodes.has(node.id)) {
      nodeLevel[node.id] = 0;
    } else if (!sourceNodes.has(node.id)) {
      nodeLevel[node.id] = 2;
    } else {
      nodeLevel[node.id] = 1;
    }
    
    const level = nodeLevel[node.id];
    if (!nodesByLevel[level]) nodesByLevel[level] = [];
    nodesByLevel[level].push(node);
  });

  const levelCount = Object.keys(nodesByLevel).length;
  const levelWidth = (innerWidth - (levelCount - 1) * 100) / levelCount;

  // Calculate node positions
  const nodePositions: { [id: string]: { x: number; y: number; height: number } } = {};
  
  Object.entries(nodesByLevel).forEach(([level, levelNodes]) => {
    const totalValue = levelNodes.reduce((sum, n) => sum + n.value, 0);
    const availableHeight = innerHeight - (levelNodes.length - 1) * nodePadding;
    
    let currentY = padding;
    levelNodes.forEach(node => {
      const nodeHeight = (node.value / totalValue) * availableHeight;
      nodePositions[node.id] = {
        x: padding + parseInt(level) * (levelWidth + 100),
        y: currentY,
        height: Math.max(nodeHeight, 30),
      };
      currentY += nodeHeight + nodePadding;
    });
  });

  // Generate curved paths for links
  const generatePath = (link: SankeyLink) => {
    const source = nodePositions[link.source];
    const target = nodePositions[link.target];
    
    if (!source || !target) return '';

    const sourceX = source.x + nodeWidth;
    const targetX = target.x;
    const sourceY = source.y + source.height / 2;
    const targetY = target.y + target.height / 2;
    
    const midX = (sourceX + targetX) / 2;
    
    return `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX} ${targetY}`;
  };

  const totalInputValue = nodes
    .filter(n => nodeLevel[n.id] === 0)
    .reduce((sum, n) => sum + n.value, 0);

  return (
    <div className="relative w-full" style={{ height }}>
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {links.map((link, i) => {
            const sourceNode = nodes.find(n => n.id === link.source);
            const targetNode = nodes.find(n => n.id === link.target);
            return (
              <linearGradient 
                key={`gradient-${i}`} 
                id={`link-gradient-${link.source}-${link.target}`}
                x1="0%" y1="0%" x2="100%" y2="0%"
              >
                <stop offset="0%" stopColor={sourceNode?.color || '#8AFD81'} stopOpacity={0.6} />
                <stop offset="100%" stopColor={targetNode?.color || '#8AFD81'} stopOpacity={0.6} />
              </linearGradient>
            );
          })}
        </defs>
        
        {/* Links */}
        {links.map((link, i) => {
          const isHovered = hoveredLink === `${link.source}-${link.target}` ||
                           hoveredNode === link.source ||
                           hoveredNode === link.target;
          
          const source = nodePositions[link.source];
          const linkHeight = source ? (link.value / nodes.find(n => n.id === link.source)!.value) * source.height : 20;
          
          return (
            <g key={`link-${i}`}>
              <path
                d={generatePath(link)}
                fill="none"
                stroke={`url(#link-gradient-${link.source}-${link.target})`}
                strokeWidth={Math.max(linkHeight, 8)}
                strokeOpacity={isHovered ? 0.9 : 0.5}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredLink(`${link.source}-${link.target}`)}
                onMouseLeave={() => setHoveredLink(null)}
              />
            </g>
          );
        })}
        
        {/* Nodes */}
        {nodes.map((node) => {
          const pos = nodePositions[node.id];
          if (!pos) return null;
          
          const isHovered = hoveredNode === node.id;
          const percentage = ((node.value / totalInputValue) * 100).toFixed(1);
          
          return (
            <g 
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              {/* Node Rectangle */}
              <rect
                x={pos.x}
                y={pos.y}
                width={nodeWidth}
                height={pos.height}
                rx={4}
                fill={node.color}
                stroke={isHovered ? '#1e293b' : 'none'}
                strokeWidth={2}
                className="transition-all duration-300"
                style={{
                  filter: isHovered ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' : 'none',
                }}
              />
              
              {/* Node Label */}
              <text
                x={nodeLevel[node.id] === 0 ? pos.x - 8 : pos.x + nodeWidth + 8}
                y={pos.y + pos.height / 2}
                textAnchor={nodeLevel[node.id] === 0 ? 'end' : 'start'}
                dominantBaseline="middle"
                className="text-xs font-semibold fill-slate-700"
              >
                {node.name}
              </text>
              
              {/* Value Label */}
              <text
                x={nodeLevel[node.id] === 0 ? pos.x - 8 : pos.x + nodeWidth + 8}
                y={pos.y + pos.height / 2 + 14}
                textAnchor={nodeLevel[node.id] === 0 ? 'end' : 'start'}
                dominantBaseline="middle"
                className="text-[10px] fill-slate-500"
              >
                {node.value.toLocaleString('fr-FR')} {unit} ({percentage}%)
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Tooltip on hover */}
      {hoveredLink && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-lg shadow-lg px-4 py-2">
          <span className="text-sm font-medium text-slate-700">
            {links.find(l => `${l.source}-${l.target}` === hoveredLink)?.value.toLocaleString('fr-FR')} {unit}
          </span>
        </div>
      )}
    </div>
  );
};

