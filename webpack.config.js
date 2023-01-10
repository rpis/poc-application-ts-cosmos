const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');

const func = {
    entry: {
        internalqueue: path.resolve(__dirname, './internal-queue/index.ts'),
        businessprocess: path.resolve(__dirname, './business-process/index.ts'),
        businessprocessstart: path.resolve(__dirname, './business-process-start/index.ts'),
        checkcustomer: path.resolve(__dirname, './check-customer/index.ts'),
        getaccountno: path.resolve(__dirname, './get-account-no/index.ts'),      
        processid: path.resolve(__dirname, './process-id/index.ts'),   
        finalize: path.resolve(__dirname, './finalize/index.ts'), 
        reject: path.resolve(__dirname, './reject/index.ts'), 
        marksendtodecision: path.resolve(__dirname, './mark-send-to-decision/index.ts'), 
        rejectcustomerstatus: path.resolve(__dirname, './reject-customer-status/index.ts'), 
        main: path.resolve(__dirname, './main/index.ts'),
        shared: 'lodash',
    },
    //entry: ['./main/index.ts'],
    target: 'node',
    //externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        usedExports: 'global',
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    keep_fnames: /AbortSignal/,
                },
            }),
        ],
    },
    mode: 'production',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new webpack.IgnorePlugin({
            checkResource(resource) {
                const lazyImports = [
                    '@nestjs/microservices',
                    'cache-manager',
                    'class-validator',
                    'class-transformer',
                    '@nestjs/websockets/socket-module',
                    '@nestjs/microservices/microservices-module',
                    'fastify-swagger',
                    'class-transformer/storage',
                    '@grpc/grpc-js',
                    'redis',
                    'mqtt',
                    'nats',
                    'kafkajs',
                    '@grpc/proto-loader',


                ];
                if (!lazyImports.includes(resource)) {
                    return false;
                }
                try {
                    require.resolve(resource, {
                        paths: [process.cwd()],
                    });
                } catch (err) {
                    return true;
                }
                return false;
            },
        }),
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'commonjs2',
    },
    node: {
        __filename: false,
        __dirname: false,
    },
};

module.exports = [func]; 
module.exports.parallelism = 2;
