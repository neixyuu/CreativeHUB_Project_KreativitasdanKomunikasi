import { Form, Link, usePage } from '@inertiajs/react';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type ConversationItem = {
    id: number;
    name: string;
    username: string;
    avatar: string;
    last_message: string;
    time: string;
    unread: boolean;
};

type MessageItem = {
    id: number;
    body: string;
    is_mine: boolean;
    time: string;
};

type Props = {
    conversations: ConversationItem[];
    activeConversationId: number | null;
    activePartner: { id: number; name: string; avatar: string } | null;
    messages: MessageItem[];
};

export default function MessagesPage() {
    const { conversations, activeConversationId, activePartner, messages } =
        usePage<Props>().props;
    const [body, setBody] = useState('');

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            <div className="w-full max-w-sm border-r border-border">
                <div className="border-b border-border p-4">
                    <h2 className="font-semibold">Pesan</h2>
                    <p className="text-sm text-muted-foreground">Chat dengan pembeli / penjual</p>
                </div>
                <div className="overflow-y-auto">
                    {conversations.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground">
                            Belum ada percakapan. Mulai dari profil kreator atau pesanan komisi.
                        </p>
                    ) : (
                        conversations.map((conv) => (
                            <Link
                                key={conv.id}
                                href={`/dashboard/messages?conversation=${conv.id}`}
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
                                <span className="text-xs text-muted-foreground">{conv.time}</span>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            <div className="flex flex-1 flex-col">
                {activePartner && activeConversationId ? (
                    <>
                        <div className="flex items-center gap-3 border-b border-border p-4">
                            <Avatar>
                                <AvatarImage src={activePartner.avatar} />
                                <AvatarFallback>{activePartner.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="font-semibold">{activePartner.name}</p>
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
                                    {msg.body}
                                    <p
                                        className={cn(
                                            'mt-1 text-xs',
                                            msg.is_mine ? 'text-white/70' : 'text-muted-foreground',
                                        )}
                                    >
                                        {msg.time}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <Form
                            action="/dashboard/messages"
                            method="post"
                            className="flex gap-2 border-t border-border p-4"
                            onSubmit={(e) => {
                                if (!body.trim()) e.preventDefault();
                            }}
                        >
                            <input type="hidden" name="conversation_id" value={activeConversationId} />
                            <Input
                                name="body"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Ketik pesan..."
                                className="flex-1"
                            />
                            <Button type="submit" size="icon">
                                <Send className="h-4 w-4" />
                            </Button>
                        </Form>
                    </>
                ) : (
                    <div className="flex flex-1 items-center justify-center text-muted-foreground">
                        Pilih percakapan atau mulai chat dari profil kreator
                    </div>
                )}
            </div>
        </div>
    );
}
