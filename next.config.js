const apiOrigin = new URL(process.env.NEXT_PUBLIC_API_URL).origin;
const isProduction = process.env.NODE_ENV === "production";

const contentSecurityPolicy = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self' ${apiOrigin}${isProduction ? "" : " ws:"}`,
    "object-src 'self' blob:",
    "frame-src 'self' blob:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
].join("; ");

const securityHeaders = [
    { key: "Content-Security-Policy", value: contentSecurityPolicy },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig = {
    poweredByHeader: false,
    experimental: {
        staleTimes: {
            dynamic: 0,
        },
    },
    async headers() {
        return [{ source: "/:path*", headers: securityHeaders }];
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
