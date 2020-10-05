const ESLintPlugin = require('eslint-webpack-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')

module.exports = {
    lintOnSave: true,
    configureWebpack: {
        plugins: [
            new ESLintPlugin({
                extensions: ['js', 'vue'],
            }),
            new StyleLintPlugin({
                files: ['**/*.{vue,html,css,less,sass,scss}'],
            }),
        ],
    },
}
