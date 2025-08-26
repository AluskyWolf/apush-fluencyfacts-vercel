import React, { useEffect } from 'react';
import APUSHTerms from '../pages/apushTerms';
import WorldTerms from '../pages/worldTerms';
import EuroTerms from '../pages/euroTerms';
import HomePage from '../components/HomePage';

function PageWrapper({ title, children }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return children;
}

export const appRoutes = [
  { path: '/', element: <PageWrapper title="AP Terms Quizzes"><HomePage /></PageWrapper>, name: 'AP Terms Quizzes' },
  { path: '/apush', element: <PageWrapper title="APUSH Terms"><APUSHTerms /></PageWrapper>, name: 'APUSH Terms' },
  { path: '/ap-world', element: <PageWrapper title="AP World Terms"><WorldTerms /></PageWrapper>, name: 'AP World Terms' },
  { path: '/ap-euro', element: <PageWrapper title="AP Euro Terms"><EuroTerms /></PageWrapper>, name: 'AP Euro Terms' },
];
