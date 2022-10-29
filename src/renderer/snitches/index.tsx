import React from "react";

import { createStitches } from "@stitches/react";
import { ThemeSupa } from "@supabase/auth-ui-react";

export const { getCssText } = createStitches();

export function ThemeSupaStyle() {
  return (
    <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
  );
}
