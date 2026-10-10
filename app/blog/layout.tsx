import React from 'react';
import CustomCursor from '../../components/ui/CustomCursor';
import ScrollToTop from '../../components/ui/ScrollToTop';

// The blog keeps the original site chrome (custom cursor and scroll-to-top),
// which the redesigned home page no longer uses.
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      <ScrollToTop />
      {children}
    </>
  );
}
