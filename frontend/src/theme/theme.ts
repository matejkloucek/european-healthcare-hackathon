import { createTheme, ThemeOptions } from "@mui/material";
import { FontFamilyHeadings, FontFamilyParagraph, FontWeight } from "./utils";
import { Colors } from "./colors";
export const appTheme: ThemeOptions = createTheme({
  spacing: 10,
  typography: {
    fontFamily: FontFamilyParagraph,
    fontWeightRegular: 500,
    fontSize: 12.25,
    h1: {
      fontFamily: FontFamilyHeadings,
      fontSize: 36,
      fontWeight: FontWeight.ExtraBold,
      marginTop: 0,
      marginBottom: 20,
    },
    h2: {
      fontFamily: FontFamilyHeadings,
      fontSize: 28,
      fontWeight: FontWeight.ExtraBold,
    },
    h3: {
      fontFamily: FontFamilyParagraph,
      fontSize: 24,
      fontWeight: FontWeight.Bold,
      marginTop: 0,
      marginBottom: 10,
    },
    h4: {
      fontFamily: FontFamilyHeadings,
      fontSize: 14,
      fontWeight: FontWeight.Bold,
      marginTop: 0,
      marginBottom: 10,
    },
    caption: {
      fontSize: 12,
      marginBottom: "5px",
      color: Colors.blueGrey800,
    },
  },
  palette: {
    primary: {
      main: Colors.primary,
    },
    secondary: {
      main: Colors.white,
      contrastText: Colors.white,
    },
    success: {
      main: Colors.success,
    },
    yellow: {
      main: Colors.yellowLightBg,
      contrastText: Colors.black,
    },
    blue: {
      main: Colors.blueLightBg,
      contrastText: Colors.blue,
    },
    blueGrey800: {
      main: Colors.blueGrey600,
      contrastText: Colors.blueGrey800,
    },
    error: {
      main: Colors.error,
    },
    green: {
      main: Colors.green,
      contrastText: Colors.white,
      light: Colors.green,
      dark: Colors.green,
    },
  },
  shape: {
    borderRadius: 0,
  },
});

declare module "@mui/material/styles" {
  interface Palette {
    yellow: Palette["primary"];
    blue: Palette["primary"];
    blueGrey800: Palette["primary"];
    green: Palette["primary"];
  }

  interface PaletteOptions {
    yellow: PaletteOptions["primary"];
    blue: PaletteOptions["primary"];
    blueGrey800: PaletteOptions["primary"];
    green: Palette["primary"];
  }
}
