import { Form, usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Profile = {
    username: string | null;
    bio: string | null;
    location: string | null;
    specialty: string;
    starting_price: number;
    response_time: string | null;
    skills: string[];
    languages: string[];
    is_accepting_orders: boolean;
};

type Props = {
    profile: Profile;
    categories: string[];
};

export default function CreatorMarketplaceProfilePage() {
    const { profile, categories } = usePage<Props>().props;
    const skillsText = (profile.skills ?? []).join(', ');
    const languagesText = (profile.languages ?? ['Indonesian']).join(', ');

    return (
        <div className="p-6 lg:p-8">
            <h1 className="mb-2 text-2xl font-bold">Profil Marketplace</h1>
            <p className="mb-6 text-muted-foreground">
                Informasi ini ditampilkan di halaman publik Anda
                {profile.username ? ` (@${profile.username})` : ''}.
            </p>

            <Card>
                <CardHeader>
                    <CardTitle>Detail kreator</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form
                        action="/creator/marketplace-profile"
                        method="post"
                        className="grid gap-4 md:grid-cols-2"
                    >
                        <div className="md:col-span-2">
                            <Label>Spesialisasi</Label>
                            <Input
                                name="specialty"
                                required
                                defaultValue={profile.specialty}
                                placeholder="Contoh: UI/UX Design"
                                list="specialty-categories"
                            />
                            <datalist id="specialty-categories">
                                {categories.map((c) => (
                                    <option key={c} value={c} />
                                ))}
                            </datalist>
                        </div>
                        <div>
                            <Label>Harga mulai (IDR)</Label>
                            <Input
                                name="starting_price"
                                type="number"
                                min={0}
                                required
                                defaultValue={profile.starting_price}
                            />
                        </div>
                        <div>
                            <Label>Waktu respons</Label>
                            <Input
                                name="response_time"
                                defaultValue={profile.response_time ?? ''}
                                placeholder="Contoh: &lt; 2 jam"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Bio</Label>
                            <Textarea name="bio" rows={3} defaultValue={profile.bio ?? ''} />
                        </div>
                        <div>
                            <Label>Lokasi</Label>
                            <Input name="location" defaultValue={profile.location ?? ''} />
                        </div>
                        <div>
                            <Label>Keahlian (pisahkan koma)</Label>
                            <Input name="skills" defaultValue={skillsText} placeholder="Figma, Photoshop" />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Bahasa (pisahkan koma)</Label>
                            <Input name="languages" defaultValue={languagesText} />
                        </div>
                        <div className="flex items-center gap-2 md:col-span-2">
                            <input
                                type="hidden"
                                name="is_accepting_orders"
                                value="0"
                            />
                            <input
                                type="checkbox"
                                id="is_accepting_orders"
                                name="is_accepting_orders"
                                value="1"
                                defaultChecked={profile.is_accepting_orders}
                                className="h-4 w-4 rounded border"
                            />
                            <Label htmlFor="is_accepting_orders">Menerima pesanan baru</Label>
                        </div>
                        <div className="md:col-span-2">
                            <Button type="submit">Simpan profil</Button>
                        </div>
                    </Form>
                </CardContent>
            </Card>

            <p className="mt-4 text-sm text-muted-foreground">
                Nama, email, dan foto:{' '}
                <a href="/settings/profile" className="text-primary underline">
                    Pengaturan akun
                </a>
            </p>
        </div>
    );
}
