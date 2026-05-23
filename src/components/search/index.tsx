'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import Container from '../shared/container'
import SearchModal from '../shared/SearchModal'

const Search = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenModal = () => setIsOpen(true)
  const handleCloseModal = () => setIsOpen(false)

  return (
    <Container>
      <div className="mt-5 block lg:hidden">
        <div
          className="flex items-center w-full h-[56px] rounded-[12px] border border-gray-200 px-4 gap-3 bg-white cursor-pointer"
          onClick={handleOpenModal} 
        >
          <Image
            src="/images/search.svg"
            alt="search icon"
            width={24}
            height={24}
          />
          <input
            type="text"
            className="w-full h-full outline-none border-none text-gray-700 placeholder-gray-400 bg-white"
            placeholder="ابحث من هنا..."
            readOnly // يمنع الكتابة
          />
        </div>
      </div>

      {isOpen && (
        <SearchModal lang="ar" isOpen={isOpen} onClose={handleCloseModal} />
      )}
    </Container>
  )
}

export default Search
