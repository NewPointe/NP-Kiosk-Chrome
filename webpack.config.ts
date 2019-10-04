import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
    mode: "development",
    devtool: "source-map",
    output: {
        path: path.join(__dirname, "dist", "scripts"),
        filename: "[name].js"
    },
    optimization: {
        minimize: false
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    }
};

export default config;
