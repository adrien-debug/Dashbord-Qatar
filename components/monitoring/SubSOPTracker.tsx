// ============================================================================
// SUB-SOP TRACKER - Track all sub-SOPs referenced in the Master SOP
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SubSOP, 
  DimensionId, 
  STATUS_COLORS, 
  DIMENSION_ICONS,
  DIMENSION_NAMES 
} from '../../types/sop';

interface SubSOPCardProps {
  sop: SubSOP;
  animationDelay?: number;
}

const SubSOPCard: React.FC<SubSOPCardProps> = ({ sop, animationDelay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const statusColor = STATUS_COLORS[sop.status];

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl p-4"
      style={{
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: `1px solid ${isHovered ? statusColor : '#334155'}`,
        boxShadow: isHovered ? `0 0 20px ${statusColor}30` : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: animationDelay }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{DIMENSION_ICONS[sop.dimension]}</span>
          <div>
            <code 
              className="text-xs px-2 py-0.5 rounded font-mono"
              style={{ 
                backgroundColor: `${statusColor}20`,
                color: statusColor,
              }}
            >
              {sop.code}
            </code>
          </div>
        </div>
        
        {/* Status Badge */}
        <motion.div
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${statusColor}20`,
            color: statusColor,
          }}
          animate={sop.status === 'in-progress' ? {
            boxShadow: [
              `0 0 0 0 ${statusColor}00`,
              `0 0 0 4px ${statusColor}30`,
              `0 0 0 0 ${statusColor}00`,
            ],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {sop.status === 'completed' ? '✓ Complete' :
           sop.status === 'in-progress' ? '◐ In Progress' :
           sop.status === 'not-started' ? '○ Not Started' :
           sop.status === 'blocked' ? '⛔ Blocked' : sop.status}
        </motion.div>
      </div>

      {/* Name */}
      <h4 className="text-white font-medium mb-2">{sop.name}</h4>
      
      {/* Description */}
      <p className="text-gray-400 text-sm mb-3">{sop.description}</p>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Progress</span>
          <span className="font-bold" style={{ color: statusColor }}>{sop.completionPercent}%</span>
        </div>
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: statusColor }}
            initial={{ width: 0 }}
            animate={{ width: `${sop.completionPercent}%` }}
            transition={{ duration: 0.8, delay: animationDelay }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        {sop.owner && (
          <div className="flex items-center gap-1">
            <span>👤</span>
            <span>{sop.owner}</span>
          </div>
        )}
        {sop.dueDate && (
          <div className="flex items-center gap-1">
            <span>📅</span>
            <span>{sop.dueDate}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN TRACKER COMPONENT
// ============================================================================

interface SubSOPTrackerProps {
  subSOPs: SubSOP[];
  title?: string;
}

export const SubSOPTracker: React.FC<SubSOPTrackerProps> = ({ 
  subSOPs,
  title = "Sub-SOP Documents",
}) => {
  const [filter, setFilter] = useState<DimensionId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const dimensions: (DimensionId | 'all')[] = ['all', 'business', 'administrative', 'technology', 'engineering'];
  const statuses = ['all', 'completed', 'in-progress', 'not-started', 'blocked'];

  const filteredSOPs = subSOPs.filter(sop => {
    const matchesDimension = filter === 'all' || sop.dimension === filter;
    const matchesStatus = statusFilter === 'all' || sop.status === statusFilter;
    return matchesDimension && matchesStatus;
  });

  // Stats
  const totalSOPs = subSOPs.length;
  const completedSOPs = subSOPs.filter(s => s.status === 'completed').length;
  const inProgressSOPs = subSOPs.filter(s => s.status === 'in-progress').length;
  const avgCompletion = totalSOPs > 0 
    ? Math.round(subSOPs.reduce((sum, s) => sum + s.completionPercent, 0) / totalSOPs)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>📑</span>
          <span>{title}</span>
        </h3>
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Total:</span>
            <span className="text-white font-bold">{totalSOPs}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-gray-400">{completedSOPs}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-gray-400">{inProgressSOPs}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Avg:</span>
            <span className="text-white font-bold">{avgCompletion}%</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Dimension Filter */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">Dimension:</span>
          <div className="flex gap-1">
            {dimensions.map((dim) => (
              <button
                key={dim}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  filter === dim 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                onClick={() => setFilter(dim)}
              >
                {dim === 'all' ? 'All' : (
                  <span className="flex items-center gap-1">
                    {DIMENSION_ICONS[dim as DimensionId]}
                    <span className="hidden md:inline">{DIMENSION_NAMES[dim as DimensionId]}</span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">Status:</span>
          <div className="flex gap-1">
            {statuses.map((status) => (
              <button
                key={status}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  statusFilter === status 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status === 'all' ? 'All' : 
                 status === 'completed' ? '✓' :
                 status === 'in-progress' ? '◐' :
                 status === 'not-started' ? '○' : '⛔'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SOP Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${filter}-${statusFilter}`}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {filteredSOPs.length > 0 ? (
            filteredSOPs.map((sop, index) => (
              <SubSOPCard 
                key={sop.id} 
                sop={sop} 
                animationDelay={index * 0.05}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              <span className="text-4xl mb-4 block">📭</span>
              <p>No sub-SOPs match the current filters</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {subSOPs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <span className="text-6xl mb-4 block">📋</span>
          <h4 className="text-lg font-medium text-white mb-2">No Sub-SOPs Yet</h4>
          <p>Sub-SOPs will appear here as the project progresses through its lifecycle phases.</p>
        </div>
      )}
    </div>
  );
};

export default SubSOPTracker;

