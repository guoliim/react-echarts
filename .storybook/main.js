module.exports = {
    stories: ['../examples/**/*.stories.tsx'],
    addons: [
        '@storybook/addon-actions',
        '@storybook/addon-links',
        '@storybook/preset-typescript',
    ],
    webpackFinal: async config => {
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            use: [
                {
                    loader: require.resolve("ts-loader")
                },
                {
                    loader: require.resolve('react-docgen-typescript-loader'),
                },
            ]
        });
        
        config.resolve.extensions.push(".ts", ".tsx");
        return config
    }
};
