import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
} from 'unocss'
import presetTheme from 'unocss-preset-theme'
import type { Theme } from 'unocss/preset-uno'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTheme<Theme>({
      theme: {
        dark: {
          colors: {
            primary: '#409EFF',
            success: '#67C23A',
            warning: '#E6A23C',
            danger: '#F56C6C',
            info: '#909399',
            bg: {
              page: '#0a0a0a',
              card: '#1a1a1a',
              elevated: '#262626',
            },
            text: {
              primary: '#e5e5e5',
              regular: '#b3b3b3',
              secondary: '#808080',
              placeholder: '#595959',
            },
            border: {
              light: '#2d2d2d',
              lighter: '#383838',
              extraLight: '#404040',
            },
          },
        },
      },
    }) as any,
  ],
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'text-ellipsis': 'overflow-hidden text-ellipsis whitespace-nowrap',
    'card-base': 'bg-bg-card rounded-xl border border-border-light',
    'page-container': 'max-w-1440px mx-auto px-6 py-4',
  },
  rules: [
    ['scrollbar-hide', { '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }],
  ],
})
