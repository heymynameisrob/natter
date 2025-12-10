import * as React from "react";
import { useEventListener } from "usehooks-ts";

export function useWindowFocus(defauleValue = false): boolean {
  const [focused, setFocused] = React.useState(defauleValue);

  React.useEffect(() => {
    setFocused(window.document.hasFocus());
  }, []);

  useEventListener("blur", () => {
    setFocused(false);
  });

  useEventListener("focus", () => {
    setFocused(true);
  });

  return focused;
}
