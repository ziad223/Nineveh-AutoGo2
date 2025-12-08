'use client';

import React from 'react';
import { FaCarSide, FaCrown, FaGem, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Container from '../shared/container';

const Packages = () => {
  const packages = [
    {
      id: 1,
      icon: <FaCarSide className="text-yellow-400 text-5xl mx-auto mb-4" />,
      name: 'الباقة الأساسية',
      price: '150 درهم',
      features: [
        { name: 'غسيل خارجي', available: true },
        { name: 'تنظيف داخلي', available: true },
        { name: 'تلميع خارجي', available: false },
        { name: 'تعقيم السيارة', available: false },
        { name: 'تعطير فاخر', available: false },
      ],
    },
    {
      id: 2,
      icon: <FaCrown className="text-yellow-400 text-5xl mx-auto mb-4" />,
      name: 'الباقة المميزة',
      price: '250 درهم',
      features: [
        { name: 'غسيل خارجي', available: true },
        { name: 'تنظيف داخلي شامل', available: true },
        { name: 'تلميع خارجي', available: true },
        { name: 'تعقيم السيارة', available: true },
        { name: 'تعطير فاخر', available: false },
      ],
    },
    {
      id: 3,
      icon: <FaGem className="text-yellow-400 text-5xl mx-auto mb-4" />,
      name: 'الباقة الفاخرة',
      price: '400 درهم',
      features: [
        { name: 'غسيل خارجي', available: true },
        { name: 'تنظيف داخلي شامل', available: true },
        { name: 'تلميع خارجي', available: true },
        { name: 'تعقيم السيارة', available: true },
        { name: 'تعطير فاخر', available: true },
      ],
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <Container>
       <div className="text-center mb-12">
  <h2 className="text-2xl md:text-3xl font-bold text-yellow-400">باقاتنا</h2>
  <p className="text-gray-600 text-xs md:text-sm mt-2 max-w-md mx-auto">
    اختر باقتك المثالية من خدمات الغسيل والتلميع المتنقلة، وتمتع بسيارة نظيفة ولامعة في أي وقت وأي مكان.
  </p>
</div>


        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 text-center"
            >
              {pkg.icon}
              <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
              <p className="text-yellow-500 font-semibold text-lg mb-5">{pkg.price}</p>

              <ul className="text-right space-y-2 mb-6">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center justify-between text-sm md:text-base">
                    <span className="text-gray-700">{feature.name}</span>
                    {feature.available ? (
                      <FaCheckCircle className="text-green-500 text-lg" />
                    ) : (
                      <FaTimesCircle className="text-red-500 text-lg" />
                    )}
                  </li>
                ))}
              </ul>

              <button className="w-full py-2 rounded-full bg-yellow-400 text-white font-medium hover:bg-yellow-500 transition-all">
                احجز الآن
              </button>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Packages;
