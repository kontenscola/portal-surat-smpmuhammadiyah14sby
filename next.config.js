const nextConfig = {
    experimental: {
        staleTimes: {
            dynamic: 0,
        },
    },
    async redirects() {
        return [
            { source: "/surat-saya", destination: "/my-letters", permanent: true },
            { source: "/admin/akses-surat", destination: "/admin/letter-access", permanent: true },
            { source: "/admin/akses-surat/:categoryId", destination: "/admin/letter-access/:categoryId", permanent: true },
        ];
    },
};

module.exports = nextConfig;
