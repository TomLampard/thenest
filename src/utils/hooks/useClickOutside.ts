import { type RefObject, useRef, useEffect } from "react";

export const useClickOutside = ({
  ref,
  callback,
  enabled,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: RefObject<any>;
  callback: () => void;
  enabled: boolean;
}) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    if (!enabled) {
      return;
    }
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        callbackRef.current();
      }
    }
    // Bind the listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, enabled]);
};
