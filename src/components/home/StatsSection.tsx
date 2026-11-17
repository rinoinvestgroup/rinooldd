import { memo } from 'react';

const StatsSection: React.FC = () => {
  const stats = [
    { number: '500+', label: 'Properties Sold', icon: '🏠' },
    { number: '15+', label: 'Years Experience', icon: '⭐' },
    { number: '50M+', label: 'Total Value', icon: '💰' },
    { number: '98%', label: 'Client Satisfaction', icon: '😊' }
  ];

  return (
    <section className="py-14 bg-gradient-to-r from-gray-100 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold mb-2 text-[#D69F3F]">{stat.number}</div>
              <div className="text-sm md:text-base font-medium text-gray-700">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;