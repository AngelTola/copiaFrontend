export function getUserId(): string {
    // Check if running in browser environment
    if (typeof window !== 'undefined') {
      // Now it's safe to use localStorage
      let userId = localStorage.getItem('userId');
      
      if (!userId) {
        userId = '24fdafde-3838-475c-90b5-d4c56dba5f5a';
        localStorage.setItem('userId', userId);
      }
      
      return userId;
    }
    
    // Return a default value or empty string during server-side rendering
    return '24fdafde-3838-475c-90b5-d4c56dba5f5a';
  }