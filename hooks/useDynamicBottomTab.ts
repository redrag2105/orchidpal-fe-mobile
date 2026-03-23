import { useCallback, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import { useUIStore } from '@/hooks/useUIStore';

export function useDynamicBottomTab() {
  const setTabBarSticky = useUIStore((s) => s.setTabBarSticky);
  const isStickyRef = useRef(false);

  const handleScroll = useCallback((event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    
    // Nếu nội dung toàn trang quá ngắn (không có thanh cuộn) thì trượt lên xuống không được làm thẻ dính
    if (contentSize.height <= layoutMeasurement.height + 50) {
       if (isStickyRef.current !== false) {
         isStickyRef.current = false;
         setTabBarSticky(false);
       }
       return;
    }

    const paddingToBottom = 15;
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    
    if (isStickyRef.current !== isAtBottom) {
      isStickyRef.current = isAtBottom;
      setTabBarSticky(isAtBottom);
    }
  }, [setTabBarSticky]);

  useFocusEffect(
    useCallback(() => {
      setTabBarSticky(isStickyRef.current);
      return () => {
        // Unfocus logic is handled by other tabs' FocusEffects overriding this
      };
    }, [setTabBarSticky])
  );

  return handleScroll;
}
