/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config, { isServer }) {
        // Add custom rule to handle SVG files
        config.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: '@svgr/webpack',
                    options: {
                        svgo: true,
                    },
                },
            ],
        });

        return config;
    },
};

export default nextConfig;
