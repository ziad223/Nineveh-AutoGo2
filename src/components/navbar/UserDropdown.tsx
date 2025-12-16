'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { 
  Edit, Bell, Ticket, ShoppingCart, DollarSign, LogOut, Trash2 
} from 'lucide-react';
import LogoutModal from './LogoutModal';
import DeleteAccountModal from './DeleteAccountModal';
import apiServiceCall from '@/lib/apiServiceCall';

interface UserDropdownProps {
  isOpen: boolean;
  locale: string;
  onClose: () => void;
  token?: string;
  name?: string;
  isMobile?: boolean;
  onWalletClick?: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  isOpen,
  locale,
  onClose,
  token,
  name,
  isMobile = false,
  onWalletClick,
}) => {
  const tn = useTranslations('navbar');
  const t = useTranslations('UserDropdown');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const logoutModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setShowLogoutModal(false);
    closeDropdown();
  };

  const handleDeleteAccount = () => {
    console.log('User account deleted');
    setShowDeleteModal(false);
    closeDropdown();
  };

  const closeDropdown = () => {
    setShowLogoutModal(false);
    setShowDeleteModal(false);
    onClose();
  };

  // Fetch unread count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!token) return;
      try {
        const response = await apiServiceCall({
          method: 'get',
          url: 'notifications/unread-count',
          headers: { Authorization: `Bearer ${token}` },
        });
        const count = response?.data?.unread_count ?? 0;
        setUnreadCount(count);
      } catch (error) {
        console.error('Failed to fetch unread notifications count:', error);
      }
    };
    fetchUnreadCount();
  }, [token]);

  // Close when clicking outside dropdown and modals
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !dropdownRef.current?.contains(target) &&
        !logoutModalRef.current?.contains(target) &&
        !deleteModalRef.current?.contains(target)
      ) {
        closeDropdown();
      }
    };
    if (isOpen || showLogoutModal || showDeleteModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, showLogoutModal, showDeleteModal]);

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={dropdownRef}
        className={`absolute lg:top-full top-12 ${
          locale === 'ar' ? 'left-0 lg:left-0' : 'right-10 lg:right-0'
        } bg-white shadow-lg rounded-md w-[250px] !z-10 py-3 text-right`}
      >
        <div className="flex md:hidden items-center gap-3 px-5 py-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-primary font-bold">
            {name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-gray-500">{tn("welcome")}</p>
            <p className="text-sm font-medium hover:text-primary text-gray-900">{name}</p>
          </div>
        </div>

        <ul className="flex flex-col gap-2 text-sm text-[#000] mt-2">
          <li>
            <Link
              onClick={closeDropdown}
              href={`/${locale}/edit-data`}
              className="  px-5 py-2 flex items-center gap-3"
            >
              <Edit size={20} className='text-primary' />
              <span className="text-sm font-medium hover:text-primary">{t('editProfile')}</span>
            </Link>
          </li>
          <li>
            <Link
              onClick={closeDropdown}
              href={`/${locale}/notifications`}
              className="  px-5 py-2 flex items-center gap-3"
            >
              <Bell size={20} className='text-primary' />
              <span className="text-sm font-medium hover:text-primary ">{t('notifications')}</span>
              {unreadCount > 0 && (
                <h5 className="w-[24px] h-[24px] rounded-full bg-primary text-white flex items-center justify-center">
                  {unreadCount}
                </h5>
              )}
            </Link>
          </li>
          <li>
            <Link
              onClick={closeDropdown}
              href={`/${locale}/my-tickets`}
              className="  px-5 py-2 flex items-center gap-3"
            >
              <Ticket size={20} className='text-primary' />
              <span className="text-sm font-medium hover:text-primary">{locale === 'ar' ? "تذاكري" : "My Tickets"}</span>
            </Link>
          </li>
          <li>
            <Link
              onClick={closeDropdown}
              href={`/${locale}/orders`}
              className="  px-5 py-2 flex items-center gap-3"
            >
              <ShoppingCart size={20} className='text-primary' />
              <span className="text-sm font-medium hover:text-primary">{t('orders')}</span>
            </Link>
          </li>
          {/* <li>
            <Link
              onClick={closeDropdown}
              href={`/${locale}/sales`}
              className="  px-5 py-2 flex items-center gap-3"
            >
              <DollarSign size={20} className='text-primary'  />
              <span className="text-sm font-medium hover:text-primary">{t('sales')}</span>
            </Link>
          </li> */}
          {/* <li>
            <Link
              onClick={closeDropdown}
              href={`/${locale}/wallet`}
              className="  px-5 py-2 flex items-center gap-3 w-full"
            >
              <DollarSign size={20} className='text-primary' text-primary />
              <span className="text-sm font-medium hover:text-primary">{t('wallet')}</span>
            </Link>
          </li> */}
          <li>
            <button
              onClick={(e) => { e.stopPropagation(); setShowLogoutModal(true); }}
              className="  px-5 py-2 flex items-center gap-3"
            >
              <LogOut size={20} className='text-primary' className='text-primary' className='text-primary' />
              <span className="text-sm font-medium hover:text-primary">{t('logout')}</span>
            </button>
          </li>
          <li>
            <button
              onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }}
              className="hover:text-[#080C22]  px-5 py-2 flex items-center gap-3"
            >
              <Trash2 size={20} className='text-primary' />
              <span className="text-sm font-medium hover:text-primary">{t('deleteAccount')}</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div ref={logoutModalRef}>
          <LogoutModal
            isOpen={showLogoutModal}
            onClose={() => setShowLogoutModal(false)}
            onConfirm={handleLogout}
            token={token}
          />
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div ref={deleteModalRef}>
          <DeleteAccountModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteAccount}
            token={token}
          />
        </div>
      )}
    </>
  );
};

export default UserDropdown;
