import React, { useMemo } from 'react';
import ReactFlow, { 
  Node, 
  Edge,
  Background,
  Controls,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { TelegramUser } from '../lib/supabase';

type TreeViewProps = {
  users: TelegramUser[];
  onUserSelect: (user: TelegramUser) => void;
};

export function TreeView({ users, onUserSelect }: TreeViewProps) {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = users.map(user => ({
      id: user.id,
      data: { 
        label: (
          <div className="text-center">
            <div className="font-medium">{user.first_name} {user.last_name}</div>
            <div className="text-sm text-gray-500">@{user.username || 'no username'}</div>
          </div>
        )
      },
      position: { x: 0, y: 0 },
      type: 'default'
    }));

    const edges: Edge[] = users
      .filter(user => user.invited_by)
      .map(user => ({
        id: `${user.invited_by}-${user.id}`,
        source: user.invited_by!,
        target: user.id,
        type: 'smoothstep'
      }));

    return { nodes, edges };
  }, [users]);

  return (
    <div className="h-[600px] bg-gray-50 rounded-lg">
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onNodeClick={(_, node) => {
          const user = users.find(u => u.id === node.id);
          if (user) onUserSelect(user);
        }}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}