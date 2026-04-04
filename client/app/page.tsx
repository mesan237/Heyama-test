'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ObjectItem = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
};

export default function Home() {
  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getObjects()
      .then(setObjects)
      .finally(() => setLoading(false));
  }, []);

  useSocket({
    onCreated: (obj) => setObjects((prev) => [obj, ...prev]),
    onDeleted: ({ id }) => setObjects((prev) => prev.filter((o) => o._id !== id)),
  });

  if (loading) return <p className="p-8">Chargement...</p>;

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Objets</h1>
        <Button asChild>
          <Link href="/objects/new">+ Créer</Link>
        </Button>
      </div>

      {objects.length === 0 && (
        <p className="text-muted-foreground">Aucun objet pour l'instant.</p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {objects.map((obj) => (
          <Link key={obj._id} href={`/objects/${obj._id}`}>
            <Card className="hover:shadow-md transition cursor-pointer">
              <img
                src={obj.imageUrl}
                alt={obj.title}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{obj.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground truncate">
                  {obj.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}