import { Colors } from "./colors";

export const FontFamilyHeadings = "'Roboto Slab', sans-serif";
export const FontFamilyParagraph = "'Open Sans', sans-serif";
export const FontWeight = {
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  ExtraBold: 800,
};

export const Border = {
  Grey: {
    Thin: `1px solid ${Colors.grey150}`,
    Thick: `2px solid ${Colors.grey200}`,
  },
};

export const PagePadding = {
  px: 3,
  py: 3,
};

export const RemovePagePadding = { mx: -PagePadding.px, my: -PagePadding.py };

export const Transition = {
  Default: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
};

export const IconColors = {
  color: Colors.grey500,
  "&:hover": { color: Colors.primary },
  transition: Transition.Default,
};
