/** @type {import("snowpack").SnowpackUserConfig } */
export default {
    mount: {
        public: { url: '/', static: true },
        src: { url: '/dist' },
    },
    plugins: [
        [
            '@snowpack/plugin-typescript',
            { ...(process.versions.pnp ? { tsc: 'yarn pnpify tsc' } : {}) },
        ],
    ],
    routes: [
        {
            match: 'routes',
            src: '/',
            dest: '/pages/home.html'
        },
        {
            match: 'routes',
            src: '/login',
            dest: '/pages/login.html'
        },
        {
            match: 'routes',
            src: '/register',
            dest: '/pages/register.html'
        },
        {
            match: 'routes',
            src: '.*',
            dest: '/pages/errors/404.html'
        },
    ],
};
