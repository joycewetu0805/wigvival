export const theme = {
  colors: {
    primary: {
      50: '#FFFDF5',
      100: '#FFF9E6',
      200: '#FFEFB8',
      300: '#FFE58A',
      400: '#FFD95C',
      500: '#D4AF37', // Gold principal
      600: '#B8941F',
      700: '#9C7A0F',
      800: '#7F6100',
      900: '#664B00',
    },
    secondary: {
      50: '#FBF9F6',
      100: '#F7F3ED',
      200: '#E9E0D6',
      300: '#DBCDBF',
      400: '#CDBAA8',
      500: '#BFA791', // Beige principal
      600: '#A8917A',
      700: '#917C63',
      800: '#7A674C',
      900: '#635235',
    },
    dark: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A', // Noir principal
      950: '#020617',
    }
  },
  typography: {
    display: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      weights: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800
      }
    },
    body: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      weights: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    elegant: {
      fontFamily: '"Cormorant Garamond", "Palatino", "Georgia", serif',
      weights: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600
      }
    }
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    'gold-sm': '0 1px 2px 0 rgba(212, 175, 55, 0.1)',
    'gold-md': '0 4px 6px -1px rgba(212, 175, 55, 0.1), 0 2px 4px -1px rgba(212, 175, 55, 0.06)',
    'gold-lg': '0 10px 15px -3px rgba(212, 175, 55, 0.1), 0 4px 6px -2px rgba(212, 175, 55, 0.05)',
    'inner-gold': 'inset 0 2px 4px 0 rgba(212, 175, 55, 0.06)',
  },
  gradients: {
    gold: 'linear-gradient(135deg, #D4AF37 0%, #FFD95C 50%, #B8941F 100%)',
    darkToGold: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #D4AF37 100%)',
    goldToTransparent: 'linear-gradient(135deg, #D4AF37 0%, rgba(212, 175, 55, 0.5) 50%, transparent 100%)',
    premium: 'linear-gradient(135deg, #0F172A 0%, #1E293B 25%, #2D3748 50%, #4A5568 75%, #D4AF37 100%)',
  },
  animations: {
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      verySlow: '1000ms'
    },
    easings: {
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    }
  }
};