export default function Loading() {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/60" role="status" aria-label="Memuat">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
    );
}
