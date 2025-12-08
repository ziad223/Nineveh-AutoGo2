'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations , useLocale } from 'next-intl';
import userr from "@/public/images/login-user.png";

import edit from '@/public/images/drop-edit.png';
import notfication from '@/public/images/drop-notifications.png';
import orders from '@/public/images/drop-orders.png';
import sells from '@/public/images/drop-selles.png';
import wallet from '@/public/images/drop-wallet.png';
import logout from '@/public/images/drop-logout.png';
import remove from '@/public/images/drop-remove.png';
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
  console.log(name);
  // const locale = useLocale();
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
          locale === 'ar' ? 'left-0  lg:left-0' : 'right-10 lg:right-0'
        } bg-white shadow-lg rounded-md w-[250px] !z-10 py-3 text-right`}
      >
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
          <Image
            src={userr}
            width={24}
            height={24}
            alt="user"
            className="inline-block"
          />
          <div>
            <p className="text-xs text-gray-500">{tn("welcome")}</p>
            <p className="text-sm font-medium text-gray-900">{name}</p>
          </div>
        </div>
        
        <ul className="flex flex-col gap-2 text-sm text-[#000] mt-2">
          <li>
            <Link onClick={closeDropdown} href={`/${locale}/edit-data`} className="hover:text-[#eb2302] text-[#080C22] px-5 py-2 flex items-center gap-3">
              <Image src={edit} alt="edit" width={19} height={19} />
              <span className="text-sm font-medium">{t('editProfile')}</span>
            </Link>
          </li>
          <li>
            <Link onClick={closeDropdown} href={`/${locale}/notifications`} className="hover:text-[#eb2302] text-[#080C22] px-5 py-2 flex items-center gap-3">
              <Image src={notfication} alt="notfication" width={25} height={24} />
              <span className="text-sm font-medium">{t('notifications')}</span>
              {unreadCount > 0 && (
                <h5 className="w-[24px] h-[24px] rounded-full bg-[#080C22] text-white flex items-center justify-center">
                  {unreadCount}
                </h5>
              )}
            </Link>
          </li>
          <li>
            <Link onClick={closeDropdown} href={`/${locale}/my-tickets`} className="hover:text-[#eb2302] text-[#080C22] px-5 py-2 flex items-center gap-3">
              <Image src={sells} alt="sells" width={23} height={18} />
              <span className="text-sm font-medium">{locale === 'ar' ? "تذاكري" : "My Tickets"}</span>
            </Link>
          </li>
          <li>
            <Link onClick={closeDropdown} href={`/${locale}/orders`} className="hover:text-[#eb2302] text-[#080C22] px-5 py-2 flex items-center gap-3">
              <Image src={orders} alt="orders" width={21.68} height={17} />
              <span className="text-sm font-medium">{t('orders')}</span>
            </Link>
          </li>
          <li>
            <Link onClick={closeDropdown} href={`/${locale}/sales`} className="hover:text-[#eb2302] text-[#080C22] px-5 py-2 flex items-center gap-3">
              <Image src={sells} alt="sells" width={23} height={18} />
              <span className="text-sm font-medium">{t('sales')}</span>
            </Link>
          </li>
         
          <li>
            <Link 
              onClick={ closeDropdown}
              href={`/${locale}/wallet`} 
              className="hover:text-[#eb2302] text-[#080C22] px-5 py-2 flex items-center gap-3 w-full"
            >
              <Image src={wallet} alt="wallet" width={23.5} height={18.8} />
              <span className="text-sm font-medium">{t('wallet')}</span>
            </Link>
          </li>
          <li>
            <button onClick={(e) => { e.stopPropagation(); setShowLogoutModal(true); }} className="hover:text-[#eb2302] text-[#080C22] px-5 py-2 flex items-center gap-3">
              <Image src={logout} alt="logout" width={28} height={27} />
              <span className="text-sm font-medium">{t('logout')}</span>
            </button>
          </li>
          <li>
            <button onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }} className="hover:text-[#080C22] text-[#EB2302] px-5 py-2 flex items-center gap-3">
              <Image src={remove} alt="remove" width={26} height={26} />
              <span className="text-sm font-medium">{t('deleteAccount')}</span>
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