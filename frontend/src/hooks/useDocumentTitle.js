import { useEffect } from 'react';

/**
 * Custom hook to set the document title
 * @param {string} title - The title of the current page
 * @param {boolean} retainOnUnmount - Whether to keep the title when unmounted
 */
const useDocumentTitle = (title, retainOnUnmount = false) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `FitForge | ${title}`;

    return () => {
      if (!retainOnUnmount) {
        document.title = originalTitle;
      }
    };
  }, [title, retainOnUnmount]);
};

export default useDocumentTitle;
