/* eslint-disable sort-keys */
/**
 * Dont add if size is smaller than 10px.
 * Dont use `em` or `rem`. Use correct `px` instead.
 */
const sizes = {
  26: '26px',
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.{html,js,jsx,ts,tsx}',
    './src/**/*.{html,js,jsx,ts,tsx}',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  darkMode: 'class', // 'media' is the default, change to 'class' if you want to use dark mode in with class names
  theme: {
    screens: {
      xs: '321px',
      sm: '390px',
      smd: '480px',
      md: '650px',
      lmd: '768px',
      slg: '980px',
      lg: '1024px',
      xlg: '1200px',
      xl: '1300px',
      xxl: '1400px',
    },
    colors: {
      white: '#ffffff',
      black: '#000000',
      light: '#595959',
      customColor: 'rgba(196, 51, 255, 0.20)',
    },
    fontFamily: {
      Urbanist: ['var(--font-urbanist)'],
      poppins: ['var(--font-poppins)'],
      allura: ['var(--font-allura)'],
      Inter: ['var(--font-Inter)'],
    },
    fontSize: {
      h1: '60px',
      h2: '48px',
      h3: '38px',
      h4: '28px',
      title: '32px',
      subtitle: '24px',
      paragraph: '18px',
      body: '16px',
      xs: '10px',
      heading: '24px',
      small: '16px',
      sm: '12px',
      md: '14px',
      base: '16px',
      lg: '18px',
      xl: '30px',
      xxl: '32px',
    },
    lineHeight: {
      h1: '90%',
      h2: '90%',
      h3: '90%',
      h4: '90%',
      h5: '80%',
      title: '125%',
      subtitle: '120%',
      paragraph: '148%',
      body: '140%',
      caption: '120%',
      small: '100%',
      sm: '150%',
      md: '150%',
      lg: '150%',
    },
    letterSpacing: {
      h1: '-0.8px',
      h2: '-0.5px',
      h3: '-0.5px',
      h4: '-0.5px',
      title: '0.32px',
      subtitle: '-0.2px',
      paragraph: '0.18px',
      body: '-0.2px',
      caption: '0.24px',
      small: '0px',
      sm: '0px',
      md: '0px',
      lg: '0px',
    },
    extend: {
      colors: {
        transparent: 'transparent',
        neutral: {
          100: '#141414',
          200: '#292929',
          300: '#3B3B3B',
          400: '#595959',
          500: '#B4B4B4',
          600: '#E2E2E1',
          700: '#F6F6F6',
          800: '#FFFFFF',
          900: '#ffffff66',
          1000: '#989898',
        },
        brand: {
          800: '#EAFB06',
          500: '#F8FF99',
        },
        secondary: {
          800: '#0809EC',
          500: '#8A8BFF',
        },
        warning: {
          800: '#EBA013',
          500: '#FFCF76',
        },
        error: {
          800: '#F35858',
          500: '#FF9292',
        },
        orange: {
          500: '#FF2EAB',
        },
        pink: {
          400: '#9B00FF',
          500: '#C433FF',
          600: '#D368FF',
          700: '#BA5AF9',
          900: '#F1E3FF',
        },
        gray: {
          100: '#f9f2ff00',
          200: '#f9f2ff',
          300: '#232323',
        },
        green: {
          400: '#48BB78',
          500: '#38A169',
          600: '#2F855A',
          700: '#276749',
          900: '#1C4532',
        },
      },
      width: sizes,
      height: sizes,
      minWidth: sizes,
      minHeight: sizes,
      maxWidth: sizes,
      maxHeight: sizes,
      spacing: {
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
        '5xl': '48px',
        '64': '64px',
        '110': '110px',
        '133': '133px',
      },
      borderRadius: {
        'xs': '8px',
        'sm': '16px',
        'md': '24px',
        'lg': '32px',
        'xl': '40px',
        '2xl': '48px',
        '6xl': '80px',
        '20': '20px',
      },
      backgroundColor: {
        light: '#f6f6f6',
        dark: '#292929',
      },
      backgroundImage: () => ({
        defaultGradient: 'linear-gradient(180deg, #C433FF 18.71%, #9B00FF 80%)',
      }),
      dropShadow: {
        'card': ' 0px 4px 48px 0px rgba(0, 0, 0, 0.48)',
        'card-dark':
          'box-shadow: 0px 4px 64px 0px rgba(0, 0, 0, 0.06), 0px 4px 14px 0px rgba(255, 255, 255, 0.08) inset, 0px -4px 44px 0px rgba(255, 255, 255, 0.08) inset',
      },
      animation: {
        'fade-in-left': 'fadeLeft 400ms cubic-bezier(0.4, 0, 0.2, 1) both',
        'fade-in-right': 'fadeRight 400ms cubic-bezier(0.4, 0, 0.2, 1) both',
        'fade-in-up': 'fadeUp 400ms cubic-bezier(0.4, 0, 0.2, 1) both',
        'fade-in-down': 'fadeDown 400ms cubic-bezier(0.4, 0, 0.2, 1) both',
        'flashing': 'flashing 2.5s ease-in-out infinite',
      },
      boxShadow: {
        'card-shadow': `0px 4px 48px 0px rgba(0, 0, 0, 0.08)`,
        'hover-shadow': 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
      },
    },

    backgroundPosition: {
      leftCenter: 'left 24px center',
    },
  },
  plugins: [require('tw-elements/dist/plugin')],
}
