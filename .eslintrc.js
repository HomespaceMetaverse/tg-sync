module.exports = {
    parser: '@typescript-eslint/parser',
    // "extends": ["airbnb", "prettier", "prettier/react", "eslint:recommended"],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      // 'airbnb-typescript/base',
      'prettier',
    ],
    plugins: ['prettier', '@typescript-eslint'],
    env: {
      jest: true,
    },
    parserOptions: {
      project: './tsconfig.json',
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {},
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.ts', '.js'],
        },
      },
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/naming-convention': 0,
      'no-underscore-dangle': 0,
      'no-nested-ternary': 1,
      'no-use-before-define': 0,
      'no-unused-expressions': 0,
      'global-require': 0,
      allowTernary: 0,
      'no-multi-assign': 0,
      'no-restricted-syntax': 0,
      'no-continue': 0,
      'no-param-reassign': 0,
      'no-restricted-globals': 0,
      'class-methods-use-this': 0,
      'default-case': 0,
      'func-names': [1, 'always', { generators: 'as-needed' }],
      'prefer-const': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      // TODO it should be removed and fixed
      'import/no-named-as-default-member': 0,
      // TODO it should be removed and fixed
      'import/no-named-as-default': 0,
      'import/no-cycle': 0,
      // TODO it should be removed and fixed
      '@typescript-eslint/no-unused-expressions': 1,
      // TODO it should be removed and fixed
      'array-callback-return': 1,
      // TODO it should be removed and fixed
      'no-eval': 1,
      'no-return-assign': 1,
      '@typescript-eslint/no-loop-func': 1,
      // TODO it should be removed and fixed
      'no-undef': 0,
      'no-plusplus': 0,
      'import/no-unresolved': 0,
      'import/imports-first': 0,
      // "import/imports-first": ["error", "absolute-first"],
      // 'import/newline-after-import': ['error', { count: 2 }],
      'import/prefer-default-export': 0,
      'import/no-extraneous-dependencies': 0,
      'import/no-dynamic-require': 0,
  
      'no-extra-boolean-cast': 0,
      'max-len': ['error', { code: 120 }],
      'max-lines': ['error', { max: 180, skipBlankLines: true, skipComments: true }],
    },
    globals: {
      jest: true,
    },
  };
  