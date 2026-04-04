'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ObjectItem = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
};

export default function ObjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [object, setObject] = useState<ObjectItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getObject(id as string)
      .then(setObject)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!confirm('Supprimer cet objet ?')) return;
    await api.deleteObject(id as string);
    router.push('/');
  }

  if (loading) return <p className="p-8">Chargement...</p>;
  if (!object) return <p className="p-8">Objet introuvable.</p>;

  return (
    <main className="p-8 max-w-xl mx-auto">
      <Button
        variant="ghost"
        className="mb-4 text-muted-foreground"
        onClick={() => router.push('/')}
      >
        ← Retour
      </Button>

      <Card>
        <img
          src={object.imageUrl}
          alt={object.title}
          className="w-full h-64 object-cover rounded-t-lg"
        />
        <CardHeader>
          <CardTitle>{object.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground">{object.description}</p>
          <p className="text-xs text-muted-foreground">
            Créé le {new Date(object.createdAt).toLocaleDateString()}
          </p>
          <Button variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}