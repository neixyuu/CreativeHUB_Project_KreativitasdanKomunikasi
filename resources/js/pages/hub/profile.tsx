import { Form, Head, usePage } from '@inertiajs/react';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    profile: {
        name: string;
        email: string;
        username: string;
        avatar: string;
        bio: string | null;
        location: string | null;
        phone: string | null;
        member_since: string;
    };
    stats: { total_commissions: number; completed: number };
};

export default function BuyerProfilePage() {
    const { profile, stats } = usePage<Props>().props;

    return (
        <>
            <Head title="Profil Saya" />
            <div className="mx-auto max-w-2xl p-6 lg:p-8">
                <h1 className="mb-2 text-2xl font-bold">Profil Pembeli</h1>
                <p className="mb-6 text-muted-foreground">
                    Setiap akun terdaftar memiliki profil (nama, foto, bio). Tamu tidak memiliki profil.
                </p>

                <Card className="mb-6">
                    <CardContent className="flex items-center gap-4 pt-6">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={profile.avatar} />
                            <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-lg font-semibold">{profile.name}</p>
                            <p className="text-muted-foreground">@{profile.username}</p>
                            <p className="text-sm text-muted-foreground">Bergabung {profile.member_since}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Edit Profil</CardTitle></CardHeader>
                    <CardContent>
                        <Form action="/dashboard/profile" method="post" encType="multipart/form-data" className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nama</Label>
                                <Input id="name" name="name" defaultValue={profile.name} required />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input value={profile.email} disabled />
                            </div>
                            <div>
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea id="bio" name="bio" defaultValue={profile.bio ?? ''} rows={3} />
                            </div>
                            <div>
                                <Label htmlFor="location">Lokasi</Label>
                                <Input id="location" name="location" defaultValue={profile.location ?? ''} />
                            </div>
                            <div>
                                <Label htmlFor="phone">Telepon</Label>
                                <Input id="phone" name="phone" defaultValue={profile.phone ?? ''} />
                            </div>
                            <div>
                                <Label htmlFor="avatar">Foto Profil</Label>
                                <Input id="avatar" name="avatar" type="file" accept="image/*" />
                            </div>
                            <Button type="submit">Simpan</Button>
                        </Form>
                    </CardContent>
                </Card>

                <div className="mt-6 grid grid-cols-2 gap-4">
                    <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold">{stats.total_commissions}</p><p className="text-sm text-muted-foreground">Total Komisi</p></CardContent></Card>
                    <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold">{stats.completed}</p><p className="text-sm text-muted-foreground">Selesai</p></CardContent></Card>
                </div>
            </div>
        </>
    );
}
