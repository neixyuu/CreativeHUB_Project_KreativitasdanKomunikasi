import { Form, usePage } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
    const { auth } = usePage<{ auth: { user: { name: string } | null } }>().props;

    return (
        <div className="container mx-auto max-w-xl px-4 py-12">
            <div className="mb-8 flex items-center gap-3">
                <Mail className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold">Hubungi & Laporan</h1>
                    <p className="text-muted-foreground">
                        Kirim masukan, keluhan, atau laporan bug ke tim admin
                    </p>
                </div>
            </div>

            {!auth.user ? (
                <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                        <p className="mb-4">Login terlebih dahulu untuk mengirim laporan.</p>
                        <Button asChild>
                            <a href="/login">Login</a>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Formulir laporan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action="/reports"
                            method="post"
                            className="grid gap-4"
                            resetOnSuccess={['subject', 'message']}
                        >
                            {({ errors }) => (
                                <div className="grid gap-4">
                            <div>
                                <Label htmlFor="type">Jenis</Label>
                                <select
                                    id="type"
                                    name="type"
                                    required
                                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    defaultValue="feedback"
                                >
                                    <option value="feedback">Masukan</option>
                                    <option value="complaint">Keluhan</option>
                                    <option value="bug">Bug / error</option>
                                    <option value="other">Lainnya</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="subject">Subjek</Label>
                                <Input id="subject" name="subject" required />
                                <InputError message={errors.subject} />
                            </div>
                            <div>
                                <Label htmlFor="message">Pesan</Label>
                                <Textarea id="message" name="message" rows={5} required />
                                <InputError message={errors.message} />
                            </div>
                            <Button type="submit">Kirim laporan</Button>
                                </div>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
