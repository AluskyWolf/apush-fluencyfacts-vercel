import React, { useEffect } from 'react';
import APUSHTerms from '../pages/apushTerms';
import WorldTerms from '../pages/worldTerms';
import EuroTerms from '../pages/euroTerms';
import HomePage from '../components/HomePage';

function changeFavicon(iconPath) {
  // Update standard favicon
  let link16 = document.querySelector("link[rel*='icon'][sizes='16x16']");
  let link32 = document.querySelector("link[rel*='icon'][sizes='32x32']");
  let linkDefault = document.querySelector("link[rel*='icon']:not([sizes])");
  
  if (!link32) {
    link32 = document.createElement('link');
    link32.rel = 'icon';
    link32.sizes = '32x32';
    document.head.appendChild(link32);
  }
  link32.href = iconPath.replace('.png', '-32x32.png'); // or just iconPath if same file
  
  // Update 192x192 favicon (for PWA/Android)
  let link192 = document.querySelector("link[rel*='icon'][sizes='192x192']");
  if (!link192) {
    link192 = document.createElement('link');
    link192.rel = 'icon';
    link192.sizes = '192x192';
    document.head.appendChild(link192);
  }
  link192.href = iconPath.replace('.png', '-192x192.png'); // or just iconPath if same file
  
  // Update default favicon
  if (!linkDefault) {
    linkDefault = document.createElement('link');
    linkDefault.rel = 'icon';
    document.head.appendChild(linkDefault);
  }
  linkDefault.href = iconPath;
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
    element: <PageWrapper title="AP Terms Quizzes" favicon="/icons/main512.png?v=2"><HomePage /></PageWrapper>, 
    name: 'AP Terms Quizzes' 
  },
  { 
    path: '/apush', 
    element: <PageWrapper title="APUSH Terms" favicon="/icons/apush512.png?v=2"><APUSHTerms /></PageWrapper>, 
    name: 'APUSH Terms' 
  },
  { 
    path: '/ap-world', 
    element: <PageWrapper title="AP World Terms" favicon="/icons/whap512.png?v=2"><WorldTerms /></PageWrapper>, 
    name: 'AP World Terms' 
  },
  { 
    path: '/ap-euro', 
    element: <PageWrapper title="AP Euro Terms" favicon="/icons/euro512.png?v=2"><EuroTerms /></PageWrapper>, 
    name: 'AP Euro Terms' 
  },
];