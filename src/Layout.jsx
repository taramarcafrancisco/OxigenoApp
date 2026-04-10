import React from 'react';
import { ThemeProvider } from 'next-themes';

export default function Layout({ children, currentPageName }) {
  // Landing page doesn't use the app layout
  const publicPages = ['Landing'];
  
  if (publicPages.includes(currentPageName)) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        {children}
      </ThemeProvider>
    );
  }

  // All other pages use the AppLayout wrapper which is handled inside each page
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}