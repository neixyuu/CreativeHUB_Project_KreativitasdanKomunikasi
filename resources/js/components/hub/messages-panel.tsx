import { Link, usePage } from '@inertiajs/react';
import { Loader2, Send } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    type ChatMessage,
    type ConversationSummary,
    pollChatMessages,
    sendChatMessage,
} from '@/lib/chat-api';
import { cn } from '@/lib/utils';

const POLL_INTERVAL_MS = 2000;

type Props = {
    conversations: ConversationSummary[];
    activeConversationId: number | null;
    activePartner: { id: number; name: string; avatar: string } | null;
    messages: ChatMessage[];
    messagesBaseUrl?: string;
};

export default function MessagesPanel() {
    const {
        conversations: initialConversations,
        activeConversationId,
        activePartner,
        messages: initialMessages,
        messagesBaseUrl = '/dashboard/messages',
    } = usePage<Props>().props;

    const [conversations, setConversations] = useState(initialConversations);
    const [messages, setMessages] = useState(initialMessages);
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesRef = useRef(initialMessages);

    messagesRef.current = messages;

    useEffect(() => {
        setConversations(initialConversations);
        setMessages(initialMessages);
        setBody('');
    }, [activeConversationId, initialConversations, initialMessages]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (!activeConversationId) {
            return;
        }

        let cancelled = false;

        const poll = async () => {
            const current = messagesRef.current;
            const lastId =
                current.length > 0 ? Math.max(...current.map((m) => m.id)) : 0;

            try {
                const data = await pollChatMessages(
                    activeConversationId,
                    lastId,
                    true,
                );

                if (cancelled) {
                    return;
                }

                if (data.messages.length > 0) {
                    setMessages((prev) => {
                        const ids = new Set(prev.map((m) => m.id));
                        const merged = [...prev];

                        for (const msg of data.messages) {
                            if (!ids.has(msg.id)) {
                                merged.push(msg);
                            }
                        }

                        return merged;
                    });
                }

                if (data.conversations) {
                    setConversations(data.conversations);
                }
            } catch {
                // Polling errors are non-fatal; next tick will retry.
            }
        };

        void poll();

        const interval = window.setInterval(() => {
            void poll();
        }, POLL_INTERVAL_MS);

        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
    }, [activeConversationId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = body.trim();

        if (!text || !activeConversationId || sending) {
            return;
        }

        setSending(true);
        setBody('');

        try {
            const message = await sendChatMessage(activeConversationId, text);
            setMessages((prev) => {
                if (prev.some((m) => m.id === message.id)) {
                    return prev;
                }

                return [...prev, message];
            });
            setConversations((prev) =>
                prev.map((c) =>
                    c.id === activeConversationId
                        ? { ...c, last_message: text, time: 'baru saja' }
                        : c,
                ),
            );
        } catch {
            setBody(text);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            <div className="w-full max-w-sm border-r border-border">
                <div className="border-b border-border p-4">
                    <h2 className="font-semibold">Pesan</h2>
                    <p className="text-sm text-muted-foreground">
                        Pembaruan otomatis setiap {POLL_INTERVAL_MS / 1000} detik
                    </p>
                </div>
                <div className="overflow-y-auto">
                    {conversations.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground">
                            Belum ada percakapan. Mulai dari profil kreator atau pesanan
                            komisi.
                        </p>
                    ) : (
                        conversations.map((conv) => (
                            <Link
                                key={conv.id}
                                href={`${messagesBaseUrl}?conversation=${conv.id}`}
                                preserveScroll
                                className={cn(
                                    'flex items-center gap-3 border-b border-border/50 p-4 hover:bg-muted/50',
                                    activeConversationId === conv.id && 'bg-muted/50',
                                )}
                            >
                                <Avatar>
                                    <AvatarImage src={conv.avatar} />
                                    <AvatarFallback>{conv.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium">{conv.name}</p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {conv.last_message}
                                    </p>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {conv.time}
                                </span>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            <div className="flex flex-1 flex-col">
                {activePartner && activeConversationId ? (
                    <div className="flex min-h-0 flex-1 flex-col">
                        <div className="flex items-center gap-3 border-b border-border p-4">
                            <Avatar>
                                <AvatarImage src={activePartner.avatar} />
                                <AvatarFallback>
                                    {activePartner.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{activePartner.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    Pembaruan otomatis setiap {POLL_INTERVAL_MS / 1000} detik
                                </p>
                            </div>
                        </div>
                        <div className="flex-1 space-y-3 overflow-y-auto p-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        'max-w-[75%] rounded-2xl px-4 py-2 text-sm',
                                        msg.is_mine
                                            ? 'ml-auto bg-gradient-to-r from-primary to-secondary text-white'
                                            : 'bg-muted',
                                    )}
                                >
                                    {!msg.is_mine && (
                                        <p className="mb-1 text-xs font-medium text-muted-foreground">
                                            {msg.sender_name}
                                        </p>
                                    )}
                                    {msg.body}
                                    <p
                                        className={cn(
                                            'mt-1 text-xs',
                                            msg.is_mine
                                                ? 'text-white/70'
                                                : 'text-muted-foreground',
                                        )}
                                    >
                                        {msg.time}
                                    </p>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form
                            onSubmit={handleSend}
                            className="flex gap-2 border-t border-border p-4"
                        >
                            <Input
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Ketik pesan..."
                                className="flex-1"
                                disabled={sending}
                            />
                            <Button type="submit" size="icon" disabled={sending || !body.trim()}>
                                {sending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="flex flex-1 items-center justify-center text-muted-foreground">
                        Pilih percakapan atau mulai chat dari profil kreator
                    </div>
                )}
            </div>
        </div>
    );
}
