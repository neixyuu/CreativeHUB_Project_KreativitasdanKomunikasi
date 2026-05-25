export type ChatMessage = {
    id: number;
    body: string;
    is_mine: boolean;
    time: string;
    sender_name: string;
};

export type ConversationSummary = {
    id: number;
    name: string;
    username: string | null;
    avatar: string;
    last_message: string;
    time: string;
    unread: boolean;
};

function csrfToken(): string {
    const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='));

    return match ? decodeURIComponent(match.split('=')[1]) : '';
}

export async function sendChatMessage(
    conversationId: number,
    body: string,
): Promise<ChatMessage> {
    const response = await fetch('/dashboard/messages', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': csrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ conversation_id: conversationId, body }),
    });

    if (!response.ok) {
        throw new Error('Gagal mengirim pesan');
    }

    const data = (await response.json()) as { message: ChatMessage };

    return data.message;
}

export async function pollChatMessages(
    conversationId: number,
    afterId: number,
    includeConversations = false,
): Promise<{ messages: ChatMessage[]; conversations?: ConversationSummary[] }> {
    const params = new URLSearchParams({
        after: String(afterId),
    });

    if (includeConversations) {
        params.set('conversations', '1');
    }

    const response = await fetch(
        `/dashboard/messages/${conversationId}/poll?${params}`,
        {
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
        },
    );

    if (!response.ok) {
        throw new Error('Gagal memuat pesan');
    }

    return response.json() as Promise<{
        messages: ChatMessage[];
        conversations?: ConversationSummary[];
    }>;
}
