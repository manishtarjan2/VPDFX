import React from 'react';

const socialMediaLinks = [
  { name: 'YouTube', icon: '🎥', href: '#' },
  { name: 'LinkedIn', icon: '💼', href: '#' },
  { name: 'Instagram', icon: '📸', href: '#' },
  { name: 'Pinterest', icon: '📌', href: '#' },
  { name: 'Facebook', icon: '👥', href: '#' },
  { name: 'Reddit', icon: '🤖', href: '#' },
  { name: 'TikTok', icon: '🎵', href: '#' },
  { name: 'Snapchat', icon: '👻', href: '#' },
  { name: 'Twitter (X)', icon: '🐦', href: '#' },
  { name: 'More Platforms', icon: '✨', href: '#' },
];

export function SocialMediaTools() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 max-w-md w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-[#f0f4fc] p-3 rounded-xl">
            <span className="text-xl">📱</span>
          </div>
          <h2 className="text-xl font-bold text-[#0f172a]">Social Media Tools</h2>
        </div>
        <a 
          href="#" 
          className="text-[#4f46e5] font-medium border border-[#e0e7ff] px-4 py-2 rounded-full hover:bg-[#f5f7ff] transition-colors flex items-center gap-1"
        >
          View All <span className="text-sm">↗</span>
        </a>
      </div>

      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
        {socialMediaLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="flex items-center gap-3 text-[#334155] hover:text-[#4f46e5] font-medium transition-colors"
          >
            <span className="text-xl">{link.icon}</span>
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
}
