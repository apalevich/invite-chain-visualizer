import { TelegramUser } from "./supabase";

const position = { x: 0, y: 0 };
const edgeType = 'smoothstep';

export const constructNodes = (data: TelegramUser[]) => {
    return data.map(user => {
        return {
            id: user.telegram_id,
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
                id: `${node.invited_by}to${node.telegram_id}`,
                source: node.invited_by,
                target: node.telegram_id,
                type: edgeType,
                animated: true,
            });
        };
    });
    return edges;
};
