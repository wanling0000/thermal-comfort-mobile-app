const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
// 原来的配置
const customConfig = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
};

// 合并配置
const mergedConfig = mergeConfig(defaultConfig, customConfig);

// 包装给 reanimated 使用
module.exports = wrapWithReanimatedMetroConfig(mergedConfig);
