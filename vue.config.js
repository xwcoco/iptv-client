/* eslint-disable */
// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const path = require('path');

module.exports = {
    outputDir: "../iptv-server/public",
    filenameHashing: false,
    assetsDir: "",
    runtimeCompiler: true,
    configureWebpack: config => {
        config.output.filename = "[name].js";
        config.output.chunkFilename = "[name].js";
        // config.plugins.push(
        //     new AddAssetHtmlPlugin([
        //         {
        //             filepath: path.resolve(__dirname, '../public/dfvec/dfvec.js'),
        //             hash: false,
        //             includeSourcemap: true,
        //         },
        //         {
        //             filepath: path.resolve(__dirname, '../public/ui/dfvecui.js'),
        //             hash: false,
        //             includeSourcemap: true,
        //         },
        //         {
        //             filepath: path.resolve(__dirname, '../dist/distribution.js'),
        //             hash: false,
        //             includeSourcemap: true,
        //         },
        //         {
        //             filepath: path.resolve(__dirname, '../dist/styles/*.css'),
        //             hash: false,
        //             typeOfAsset: 'css',
        //             includeSourcemap: false,
        //             publicPath: './styles/'
        //         }
        //     ]),);

    },
    chainWebpack: config => {
        // config
        //     .plugin('html')
        //     .tap(args => {
        //         args[0].excludeChunks = ['chunk-libs','chunk-elementUI'];
        //         console.log("info ....");
        //         console.log(args);
        //         return args
        //     });
        // config.optimization.splitChunks({
        //     chunks: 'all',
        //     cacheGroups: {
        //         libs: {
        //             name: 'chunk-libs',
        //             test: /[\\/]node_modules[\\/]/,
        //             priority: 10,
        //             chunks: 'initial' // only package third parties that are initially dependent
        //         },
        //         // dfvec: {
        //         //     name: 'chunk-dfvec', // split elementUI into a single package
        //         //     priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
        //         //     test: /[\\/]node_modules[\\/]_?dfvec(.*)/ // in order to adapt to cnpm
        //         // },
        //         elementUI: {
        //             name: 'chunk-elementUI', // split elementUI into a single package
        //             priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
        //             test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
        //         },
        //     }
        // })
    },
    devServer : {
        contentBase: path.join(__dirname, '../iptv-server/public'),
        port: 9090,
    },
};
