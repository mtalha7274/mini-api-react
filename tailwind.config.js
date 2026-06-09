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
        'gutter-divider': 'var(--color-gutter-divider)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
        },
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        syntax: 'var(--color-syntax-string)',
        json: {
          key: 'var(--color-json-key)',
          string: 'var(--color-json-string)',
          number: 'var(--color-json-number)',
          boolean: 'var(--color-json-boolean)',
          null: 'var(--color-json-null)',
          punctuation: 'var(--color-json-punctuation)',
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        env: {
          DEFAULT: 'var(--color-env)',
          hover: 'var(--color-env-hover)',
          muted: 'var(--color-env-muted)',
          border: 'var(--color-env-border)',
        },
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
