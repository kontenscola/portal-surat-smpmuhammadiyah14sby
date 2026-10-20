import type { Metadata } from "next";
import StoreProvider from "./providers/StoreProvider";
import "./globals.css";

export const metadata: Metadata = {
    title: "Portal Surat",
    description: "Portal distribusi surat digital untuk siswa SMP Muhammadiyah 14",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="id">
            <body>
                <StoreProvider>{children}</StoreProvider>
            </body>
        </html>
    );
}
