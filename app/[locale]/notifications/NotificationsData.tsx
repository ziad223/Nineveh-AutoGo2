// components/notifications/NotificationsData.tsx
'use client';

import React, { useState } from 'react';
import { Bell, Check, Trash2, Calendar, X } from 'lucide-react';
import apiServiceCall from '../../../src/lib/apiServiceCall';
import { useLocale, useTranslations } from 'next-intl';

interface Notification {
  id: string;
  data: {
    title: string;
    message: string;
    type: string;
    model_id: number;
  };
  is_read: boolean;
  created_at: string;
  token : string
}

interface NotificationsDataProps {
  data: Notification[];
}

const NotificationsData = ({ data: initialData , token }: NotificationsDataProps) => {
  const t = useTranslations('notifications');
  const [notifications, setNotifications] = useState<Notification[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [modalType, setModalType] = useState<'single' | 'all' | null>(null);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const locale = useLocale()
  const markAsRead = async (id: string) => {
    try {
      setIsLoading(true);
      await apiServiceCall({
        method: 'post',
        url: `notifications/${id}/read`,
      });
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setIsLoading(true);
      await apiServiceCall({
        method: 'post',
        url: 'notifications/mark-all-read',
       headers: {
  "Accept-Language": locale,
  "Authorization": `Bearer ${token}`,
}

      });
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedNotificationId(id);
    setModalType('single');
  };

  const handleDeleteAllClick = () => {
    setModalType('all');
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedNotificationId(null);
  };

  const confirmDeleteNotification = async () => {
    if (!selectedNotificationId) return;
    
    try {
      setIsLoading(true);
      await apiServiceCall({
        method: 'delete',
        url: `notifications/${selectedNotificationId}`,
        headers: {
  "Accept-Language": locale,
  "Authorization": `Bearer ${token}`,
}

      });
      
      setNotifications(prev => prev.filter(notif => notif.id !== selectedNotificationId));
      closeModal();
    } catch (error) {
      console.error('Error deleting notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteAllNotifications = async () => {
    try {
      setIsLoading(true);
      await apiServiceCall({
        method: 'delete',
        url: 'notifications',
        headers: {
  "Accept-Language": locale,
  "Authorization": `Bearer ${token}`,
}

      });
      
      setNotifications([]);
      closeModal();
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const hasUnread = unreadCount > 0;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {t('notifications_title', { count: notifications.length })}
              </h3>
              {hasUnread && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                    {t('unread_count', { count: unreadCount })}
                  </span>
                  <button
                    onClick={markAllAsRead}
                    disabled={isLoading}
                    className="text-sm text-primary hover:text-primary/80 font-medium disabled:opacity-50"
                  >
                    {t('mark_all_read')}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleDeleteAllClick}
            disabled={isLoading || notifications.length === 0}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {t('delete_all')}
          </button>
        </div>
      </div>

      {/* Notifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {notifications.map((notification) => {
          const isUnread = !notification.is_read;

          return (
            <div
              key={notification.id}
              className={`
                relative p-4 rounded-lg border-2 transition-all hover:shadow-md
                ${isUnread ? 'border-primary/30 bg-blue-50/50' : 'border-gray-200 bg-white'}
              `}
            >
              {/* Unread Badge */}
              {isUnread && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-primary text-white text-xs font-bold rounded-full">
                    {t('new')}
                  </span>
                </div>
              )}

              {/* Content */}
              <div>
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${isUnread ? 'bg-primary/20' : 'bg-gray-100'}`}>
                    <Bell className={`w-5 h-5 ${isUnread ? 'text-primary' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold ${isUnread ? 'text-gray-900' : 'text-gray-800'}`}>
                      {notification.data.title}
                    </h4>
                    <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {notification.created_at}
                    </span>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-3">
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {notification.data.message}
                  </p>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-end">
                    <div className="flex gap-2">
                      {isUnread && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="px-3 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          {t('mark_as_read')}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteClick(notification.id)}
                        className="px-3 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Bell className="w-10 h-10 text-gray-400" />
          </div>
          <h4 className="text-lg font-bold text-gray-700 mb-2">
            {t('no_notifications')}
          </h4>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {(modalType === 'single' || modalType === 'all') && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {modalType === 'single' ? t('delete_notification') : t('delete_all_notifications')}
                  </h3>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                {modalType === 'single' 
                  ? t('delete_confirmation_single')
                  : t('delete_confirmation_all', { count: notifications.length })
                }
              </p>

              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={modalType === 'single' ? confirmDeleteNotification : confirmDeleteAllNotifications}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                  {t('confirm_delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && !modalType && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsData;