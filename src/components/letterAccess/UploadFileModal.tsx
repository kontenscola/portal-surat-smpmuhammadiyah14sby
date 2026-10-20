"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import type { StudentLetter } from "@/store/types/StudentLetterType";

interface UploadFileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (file: File) => void;
    existingRecord: StudentLetter | null;
}

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE = 5 * 1024 * 1024;

export default function UploadFileModal({ isOpen, onClose, onSubmit, existingRecord }: UploadFileModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const isReplacing = Boolean(existingRecord?.file_path);
    const title = isReplacing ? "Ganti File" : "Upload File";

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setValidationError(null);
        setSelectedFile(null);

        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            setValidationError("Format file harus PDF, JPG, atau PNG");
            return;
        }
        if (file.size > MAX_SIZE) {
            setValidationError("Ukuran file maksimal 5 MB");
            return;
        }
        setSelectedFile(file);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedFile) {
            setValidationError("File wajib dipilih");
            return;
        }
        onSubmit(selectedFile);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                    {isReplacing && existingRecord?.file_name && (
                        <p className="text-sm text-gray-500">
                            File saat ini: <span className="font-medium text-gray-700">{existingRecord.file_name}</span>
                        </p>
                    )}

                    <div>
                        <label htmlFor="upload-file-akses" className="block text-sm font-medium text-gray-700 mb-1">
                            Pilih File
                        </label>
                        <input
                            id="upload-file-akses"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            aria-describedby="upload-hint"
                        />
                        <p id="upload-hint" className="mt-1 text-xs text-gray-500">
                            Format: PDF, JPG, PNG — Maks. 5 MB
                        </p>
                    </div>

                    {validationError && (
                        <p role="alert" className="text-sm text-red-600">
                            {validationError}
                        </p>
                    )}

                    {selectedFile && (
                        <p className="text-sm text-gray-500">
                            Dipilih: <span className="font-medium text-gray-700">{selectedFile.name}</span> (
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={!selectedFile}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {title}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
