module.exports = {
  env: {
    node: true,
    es2021: true,
    mocha: true
  },
  extends: [
    'eslint:recommended'
  ],
  plugins: [
    'security',
    'sonarjs'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // ===================================
    // Seguridad - Reglas críticas
    // ===================================
    'security/detect-eval-with-expression': 'error',
    'security/detect-non-literal-require': 'warn',
    'security/detect-unsafe-regex': 'warn', // Warn instead of error for complex regex
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'warn',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-object-injection': 'warn',
    'security/detect-possible-timing-attacks': 'warn',
    'security/detect-pseudoRandomBytes': 'error',

    // ===================================
    // SonarJS - Code smells y complejidad
    // ===================================
    'sonarjs/cognitive-complexity': ['error', 15],
    'sonarjs/no-identical-functions': 'error',
    'sonarjs/no-duplicate-string': ['warn', { threshold: 3 }],
    'sonarjs/no-duplicated-branches': 'error',
    'sonarjs/no-all-duplicated-branches': 'error',
    'sonarjs/no-collection-size-mischeck': 'error',
    'sonarjs/no-element-overwrite': 'error',
    'sonarjs/no-empty-collection': 'error',
    'sonarjs/no-extra-arguments': 'error',
    'sonarjs/no-identical-conditions': 'error',
    'sonarjs/no-inverted-boolean-check': 'error',
    // 'sonarjs/no-one-iteration-loop': 'error', // Removed - not available in sonarjs v3+
    'sonarjs/no-redundant-boolean': 'error',
    'sonarjs/no-redundant-jump': 'error',
    'sonarjs/no-same-line-conditional': 'error',
    'sonarjs/no-unused-collection': 'error',
    'sonarjs/no-use-of-empty-return-value': 'error',
    'sonarjs/no-useless-catch': 'error',
    'sonarjs/prefer-immediate-return': 'warn',
    'sonarjs/prefer-object-literal': 'warn',
    'sonarjs/prefer-single-boolean-return': 'warn',

    // ===================================
    // Best Practices - Generales
    // ===================================
    'no-console': 'off', // Permitir console.log para logging en servidor
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    'no-shadow': 'error',
    'no-use-before-define': ['error', { 
      functions: false,
      classes: true,
      variables: true 
    }],
    'no-return-await': 'error',
    'require-await': 'warn',
    'no-async-promise-executor': 'error',
    'no-promise-executor-return': 'error',
    'prefer-promise-reject-errors': 'error',

    // ===================================
    // Code Style - Convenciones
    // ===================================
    'indent': ['error', 2, { SwitchCase: 1 }],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'max-len': ['warn', { 
      code: 100,
      ignoreComments: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true 
    }],
    'max-lines': ['warn', { 
      max: 300,
      skipBlankLines: true,
      skipComments: true 
    }],
    'max-lines-per-function': ['warn', { 
      max: 50,
      skipBlankLines: true,
      skipComments: true 
    }],
    'max-params': ['error', 5],
    'complexity': ['error', 15],
    'max-depth': ['error', 4],
    'max-nested-callbacks': ['error', 3]
  },
  overrides: [
    {
      files: ['test/**/*.js'],
      rules: {
        'no-unused-expressions': 'off',
        'max-lines-per-function': 'off',
        'sonarjs/no-duplicate-string': 'off',
        'max-nested-callbacks': ['error', 5] // BDD tests need more nesting
      }
    }
  ]
};
