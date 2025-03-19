import { TelegramUser } from "./supabase";

const position = { x: 0, y: 0 };
const edgeType = 'smoothstep';

export const constructNodes = (data: TelegramUser[]) => {
    return data.map(user => {
        return {
            id: user.id,
            type: user.invited_by === null ? 'input' : undefined,
            data: {
                label: `${user.first_name} ${user.last_name} (${user.username || 'no username'})`
            },
            position
        }
    })
};

export const constructEdges = (data: TelegramUser[]) => {
    let edges = [];
    data.forEach(node => {
        if (node.invited_by) {
            edges.push({
                id: `${node.invited_by}to${node.id}`,
                source: node.invited_by,
                target: node.id,
                type: edgeType,
                animated: true,
            });
        };
    });
    return edges;
};
