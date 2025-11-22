// src/hooks/useUserStatus.js
import { useState, useEffect } from 'react';
import { socket } from '@/socket/socket';

export function useUserStatus(userId) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIsOnline(false);
      return;
    }

    // Request initial status
    socket.emit('check-user-status', userId);

    const handleUserOnline = (onlineUserId) => {
      if (onlineUserId === userId) {
        console.log(`User ${userId} is online`);
        setIsOnline(true);
      }
    };

    const handleUserOffline = (offlineUserId) => {
      if (offlineUserId === userId) {
        console.log(`User ${userId} is offline`);
        setIsOnline(false);
      }
    };

    const handleUserStatus = (data) => {
      if (data.userId === userId) {
        console.log(`User ${userId} status: ${data.isOnline ? 'online' : 'offline'}`);
        setIsOnline(data.isOnline);
      }
    };

    socket.on('user-online', handleUserOnline);
    socket.on('user-offline', handleUserOffline);
    socket.on('user-status', handleUserStatus);

    return () => {
      socket.off('user-online', handleUserOnline);
      socket.off('user-offline', handleUserOffline);
      socket.off('user-status', handleUserStatus);
    };
  }, [userId]);

  return isOnline;
}