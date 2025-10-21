import React, { useEffect } from 'react';
import APUSHTerms from '../pages/apushTerms';
import WorldTerms from '../pages/worldTerms';
import EuroTerms from '../pages/euroTerms';
import HomePage from '../components/HomePage';

function changeFavicon(iconPath) {
  // Add timestamp to force cache refresh
  const cacheBuster = `?v=${Date.now()}`;
  
  // Remove ALL existing favicon links first
  document.querySelectorAll("link[rel*='icon']").forEach(link => link.remove());
  
  // Create fresh links
  const link32 = document.createElement('link');
  link32.rel = 'icon';
  link32.type = 'image/png';
  link32.sizes = '32x32';
  link32.href = iconPath.replace('.png', '-32x32.png') + cacheBuster;
  document.head.appendChild(link32);

  const link192 = document.createElement('link');
  link192.rel = 'icon';
  link192.type = 'image/png';
  link192.sizes = '192x192';
  link192.href = iconPath.replace('.png', '-192x192.png') + cacheBuster;
  document.head.appendChild(link192);

  const linkDefault = document.createElement('link');
  linkDefault.rel = 'icon';
  linkDefault.type = 'image/png';
  linkDefault.href = iconPath + cacheBuster;
  document.head.appendChild(linkDefault);
}

function PageWrapper({ title, favicon, children }) {
  useEffect(() => {
    document.title = title;
    if (favicon) {
      changeFavicon(favicon);
    }
  }, [title, favicon]);

  return children;
}

export const appRoutes = [
  {
    path: '/',
    element: <PageWrapper title="AP Terms Quizzes" favicon="/icons/main512.png"><HomePage /></PageWrapper>,
    name: 'AP Terms Quizzes'
  },
  {
    path: '/apush',
    element: <PageWrapper title="APUSH Terms" favicon="/icons/apush512.png"><APUSHTerms /></PageWrapper>,
    name: 'APUSH Terms'
  },
  {
    path: '/ap-world',
    element: <PageWrapper title="AP World Terms" favicon="/icons/whap512.png"><WorldTerms /></PageWrapper>,
    name: 'AP World Terms'
  },
  {
    path: '/ap-euro',
    element: <PageWrapper title="AP Euro Terms" favicon="/icons/euro512.png"><EuroTerms /></PageWrapper>,
    name: 'AP Euro Terms'
  },
];