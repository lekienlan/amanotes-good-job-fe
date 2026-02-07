import { createTheme } from '@mui/material/styles';
import {
  COLORS,
  FONT_SIZE,
  FONT_WEIGHT,
  SPACING,
  BORDER_RADIUS
} from './designSystem';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: COLORS.PRIMARY.MAIN,
      light: COLORS.PRIMARY.LIGHT,
      dark: COLORS.PRIMARY.DARK
    },
    secondary: {
      main: '#f44336',
      light: '#ef5350',
      dark: '#c62828'
    },
    success: {
      main: COLORS.SUCCESS
    },
    error: {
      main: COLORS.ERROR
    },
    warning: {
      main: COLORS.WARNING
    },
    info: {
      main: COLORS.INFO
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5'
    },
    text: {
      primary: COLORS.TEXT.PRIMARY,
      secondary: COLORS.TEXT.SECONDARY,
      disabled: COLORS.TEXT.DISABLED
    }
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: FONT_SIZE.BASE,
    fontWeightLight: FONT_WEIGHT.LIGHT,
    fontWeightRegular: FONT_WEIGHT.REGULAR,
    fontWeightMedium: FONT_WEIGHT.MEDIUM,
    fontWeightBold: FONT_WEIGHT.BOLD
  },
  spacing: (factor: number) => SPACING.XS * factor,
  shape: {
    borderRadius: BORDER_RADIUS.BASE
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: FONT_WEIGHT.BOLD,
          borderRadius: BORDER_RADIUS.MD
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.LG
        }
      }
    }
  }
});
