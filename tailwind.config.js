/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        surfaceMuted: 'var(--color-surface-muted)',
        foreground: 'var(--color-foreground)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
        },
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        syntax: 'var(--color-syntax-string)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        method: {
          get: 'var(--color-method-get)',
          post: 'var(--color-method-post)',
          put: 'var(--color-method-put)',
          patch: 'var(--color-method-patch)',
          delete: 'var(--color-method-delete)',
          dotGet: 'var(--color-method-dot-get)',
          dotPost: 'var(--color-method-dot-post)',
          dotPut: 'var(--color-method-dot-put)',
          dotPatch: 'var(--color-method-dot-patch)',
          dotDelete: 'var(--color-method-dot-delete)',
        },
      },
      boxShadow: {
        card: 'var(--shadow-sm)',
      },
    },
  },
  plugins: [],
};
