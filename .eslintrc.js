module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "ecmaFeatures": {
            "modules": false
        }
    },
    "rules": {
        "no-undef": "off",
        "no-restricted-syntax": ["error", "ImportDeclaration"]
    }
    
    
}
