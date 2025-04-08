import React, { useMemo, useState } from 'react';
import ReactFlow, { 
  Node, 
  Edge,
  Background,
  Controls,
  MiniMap
} from 'reactflow';
import { FlipHorizontal as LayoutHorizontal, FlipVertical as LayoutVertical } from 'lucide-react';
import 'reactflow/dist/style.css';
import type { TelegramUser } from '../lib/supabase';

type TreeViewProps = {
  users: TelegramUser[];
  onUserSelect: (user: TelegramUser) => void;
};

const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;
const LEVEL_SPACING = 150;

export function TreeView({ users, onUserSelect }: TreeViewProps) {
  const [isHorizontal, setIsHorizontal] = useState(false);

  const { nodes, edges } = useMemo(() => {
    // Find root nodes (users with no inviter)
    const rootUsers = users.filter(user => !user.invited_by);
    
    // Create a map of users invited by each user
    const invitedByMap = new Map<string, TelegramUser[]>();
    users.forEach(user => {
      if (user.invited_by) {
        const invitedList = invitedByMap.get(user.invited_by) || [];
        invitedByMap.set(user.invited_by, [...invitedList, user]);
      }
    });

    // Calculate tree layout
    function calculateLayout(
      user: TelegramUser,
      level: number,
      offset: number,
      processed: Set<string>,
      widthMap: Map<number, number>
    ): { nodes: Node[]; width: number } {
      if (processed.has(user.telegram_id)) {
        return { nodes: [], width: 0 };
      }
      
      processed.add(user.telegram_id);
      const invitedUsers = invitedByMap.get(user.telegram_id) || [];
      
      // Process children first to calculate total width
      const childResults = invitedUsers.map(invitedUser => 
        calculateLayout(invitedUser, level + 1, 0, processed, widthMap)
      );
      
      const totalChildWidth = childResults.reduce((sum, result) => sum + result.width, 0);
      const width = Math.max(NODE_WIDTH, totalChildWidth);
      
      // Update width map for this level
      widthMap.set(level, (widthMap.get(level) || 0) + width);
      
      // Calculate position
      let childOffset = offset;
      const childNodes: Node[] = [];
      
      childResults.forEach(result => {
        childNodes.push(...result.nodes);
      });
      
      // Position current node in the center of its children
      const currentNode: Node = {
        id: user.telegram_id,
        data: { 
          label: (
            <div className="text-center p-2">
              <div className="font-medium truncate">
                {user.first_name} {user.last_name}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {user.username || 'no username'}
              </div>
              {user.comment && (
                <div className="text-xs text-gray-400 truncate">
                  {user.comment}
                </div>
              )}
            </div>
          )
        },
        position: isHorizontal 
          ? {
              x: level * LEVEL_SPACING,
              y: offset + (totalChildWidth - NODE_HEIGHT) / 2
            }
          : {
              x: offset + (totalChildWidth - NODE_WIDTH) / 2,
              y: level * LEVEL_SPACING
            },
        style: {
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '8px'
        },
        type: 'default'
      };

      // Position children
      let currentChildOffset = offset;
      invitedUsers.forEach((invitedUser, index) => {
        const childWidth = childResults[index].width;
        const childNode = childNodes.find(node => node.id === invitedUser.telegram_id);
        if (childNode) {
          if (isHorizontal) {
            childNode.position.y = currentChildOffset;
          } else {
            childNode.position.x = currentChildOffset;
          }
          currentChildOffset += childWidth;
        }
      });

      return {
        nodes: [currentNode, ...childNodes],
        width
      };
    }

    // Process all root users
    const processed = new Set<string>();
    const widthMap = new Map<number, number>();
    let allNodes: Node[] = [];
    let totalOffset = 0;

    rootUsers.forEach(rootUser => {
      const { nodes: userNodes } = calculateLayout(rootUser, 0, totalOffset, processed, widthMap);
      allNodes = [...allNodes, ...userNodes];
      totalOffset += widthMap.get(0) || 0;
    });

    // Process any remaining users
    users.forEach(user => {
      if (!processed.has(user.telegram_id)) {
        const { nodes: userNodes } = calculateLayout(user, 0, totalOffset, processed, widthMap);
        allNodes = [...allNodes, ...userNodes];
        totalOffset += widthMap.get(0) || 0;
      }
    });

    // Create edges
    const edges: Edge[] = users
      .filter(user => user.invited_by)
      .map(user => ({
        id: `${user.invited_by}-${user.telegram_id}`,
        source: user.invited_by!,
        target: user.telegram_id,
        type: 'smoothstep',
        style: { stroke: '#94a3b8' },
        animated: false
      }));

    return { nodes: allNodes, edges };
  }, [users, isHorizontal]);

  return (
    <div className="h-[600px] bg-gray-50 rounded-lg relative">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsHorizontal(!isHorizontal)}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title={isHorizontal ? "Switch to vertical layout" : "Switch to horizontal layout"}
        >
          {isHorizontal ? (
            <LayoutVertical className="h-5 w-5 text-gray-600" />
          ) : (
            <LayoutHorizontal className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onNodeClick={(_, node) => {
          const user = users.find(u => u.telegram_id === node.id);
          if (user) onUserSelect(user);
        }}
        fitView
        fitViewOptions={{
          padding: 0.2,
          minZoom: 0.1,
          maxZoom: 1.5
        }}
        minZoom={0.1}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
      >
        <Background color="#e5e7eb" gap={16} />
        <Controls />
        <MiniMap 
          nodeColor="#e5e7eb"
          maskColor="rgba(243, 244, 246, 0.7)"
        />
      </ReactFlow>
    </div>
  );
}