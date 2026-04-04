'use client';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

export function useSocket({
  onCreated,
  onDeleted,
}: {
  onCreated?: (obj: any) => void;
  onDeleted?: (data: { id: string }) => void;
}) {
  useEffect(() => {
    const socket = io('http://localhost:3001');

    if (onCreated) socket.on('object:created', onCreated);
    if (onDeleted) socket.on('object:deleted', onDeleted);

    return () => {
      socket.disconnect();
    };
  }, []);
}