import React, { useEffect } from 'react';
import APUSHTerms from '../pages/apushTerms';
import WorldTerms from '../pages/worldTerms';
import EuroTerms from '../pages/euroTerms';
import HomePage from '../components/HomePage';

function changeFavicon(iconPath) {
  // Remove ALL existing favicon links
  document.querySelectorAll("link[rel*='icon']").forEach(link => link.remove());
  
  // Add new favicon with cache buster
  const newLink = document.createElement('link');
  newLink.rel = 'icon';
  newLink.type = 'image/png';
  newLink.href = iconPath + '?v=' + Date.now();
  document.head.appendChild(newLink);
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