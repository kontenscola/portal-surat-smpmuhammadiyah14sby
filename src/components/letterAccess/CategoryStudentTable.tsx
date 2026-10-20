"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import Badge from "@/components/ui/Badge";
import Toggle from "@/components/ui/Toggle";
import Loading from "@/components/Loading";
import UploadFileModal from "./UploadFileModal";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useStore";
import { usePageLoader } from "@/app/hooks/usePageLoader";
import { responseErrorMessage } from "@/app/libs/general";
import { getAllStudent } from "@/store/controllers/student.controller";
import {
    deleteStudentLetter,
    getAllStudentLetter,
    replaceStudentLetter,
    toggleStudentLetter,
    uploadStudentLetter,
    viewStudentLetter,
} from "@/store/controllers/studentLetter.controller";
import { resetStudentLetterResponse } from "@/store/slices/studentLetterSlice";
import type { Student } from "@/store/types/StudentType";
import type { StudentLetter } from "@/store/types/StudentLetterType";

interface CategoryStudentTableProps {
    categoryId: string;
    categoryName: string;
}

interface StudentRow {
    student: Student;
    studentLetter: StudentLetter | null;
}

export default function CategoryStudentTable({ categoryId, categoryName }: CategoryStudentTableProps) {
    const dispatch = useAppDispatch();
    const { students } = useAppSelector((state) => state.student);
    const { studentLetters, response } = useAppSelector((state) => state.studentLetter);
    const { isPageLoading, runWithLoader } = usePageLoader();

    const [search, setSearch] = useState("");
    const [classFilter, setClassFilter] = useState("");
    const [uploadFilter, setUploadFilter] = useState<"all" | "uploaded" | "notUploaded">("all");
    const [accessFilter, setAccessFilter] = useState<"all" | "opened" | "closed">("all");

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [selectedStudentLetter, setSelectedStudentLetter] = useState<StudentLetter | null>(null);

    const fetchStudentLetters = useCallback(() => {
        runWithLoader(() => dispatch(getAllStudentLetter({ kategori_id: categoryId })));
    }, [dispatch, runWithLoader, categoryId]);

    useEffect(() => {
        runWithLoader(() => dispatch(getAllStudent()));
    }, [dispatch, runWithLoader]);

    useEffect(() => {
        fetchStudentLetters();
    }, [fetchStudentLetters]);

    useEffect(() => {
        if (response.upload) {
            const uploadResponse = response.upload;
            dispatch(resetStudentLetterResponse());

            if (uploadResponse.status === true) {
                Swal.fire({ icon: "success", title: "Berhasil!", text: "File surat telah diunggah" }).then(() => {
                    setSelectedStudent(null);
                    setSelectedStudentLetter(null);
                    fetchStudentLetters();
                });
            } else {
                Swal.fire({ icon: "error", title: "Gagal", text: responseErrorMessage(uploadResponse) });
            }
        }

        if (response.toggle) {
            const toggleResponse = response.toggle;
            dispatch(resetStudentLetterResponse());

            if (toggleResponse.status !== true) {
                Swal.fire({ icon: "error", title: "Gagal", text: responseErrorMessage(toggleResponse) });
            }
        }

        if (response.view) {
            const viewResponse = response.view;
            dispatch(resetStudentLetterResponse());

            if (viewResponse.status !== true) {
                Swal.fire({ icon: "error", title: "Gagal", text: responseErrorMessage(viewResponse) });
            }
        }

        if (response.delete) {
            const deleteResponse = response.delete;
            dispatch(resetStudentLetterResponse());

            if (deleteResponse.status === true) {
                Swal.fire({ icon: "success", title: "Terhapus!", text: "Data surat siswa telah dihapus" });
            } else {
                Swal.fire({ icon: "error", title: "Gagal", text: responseErrorMessage(deleteResponse) });
            }
        }
    }, [response, dispatch, fetchStudentLetters]);

    const studentLetterMap = useMemo(
        () => new Map(studentLetters.map((studentLetter) => [studentLetter.siswa_id, studentLetter])),
        [studentLetters],
    );

    const classList = useMemo(() => {
        const classSet = new Set(students.map((student) => student.kelas).filter(Boolean) as string[]);
        return Array.from(classSet).sort();
    }, [students]);

    const rows: StudentRow[] = useMemo(
        () => students.map((student) => ({ student, studentLetter: studentLetterMap.get(student.id) ?? null })),
        [students, studentLetterMap],
    );

    const filteredRows = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        return rows.filter(({ student, studentLetter }) => {
            if (keyword && !student.nama_lengkap.toLowerCase().includes(keyword) && !(student.nis ?? "").toLowerCase().includes(keyword))
                return false;
            if (classFilter && student.kelas !== classFilter) return false;
            if (uploadFilter === "uploaded" && !studentLetter?.file_path) return false;
            if (uploadFilter === "notUploaded" && studentLetter?.file_path) return false;
            if (accessFilter === "opened" && !studentLetter?.akses_download) return false;
            if (accessFilter === "closed" && studentLetter?.akses_download) return false;
            return true;
        });
    }, [rows, search, classFilter, uploadFilter, accessFilter]);

    const handleToggle = (studentLetter: StudentLetter) => {
        runWithLoader(() => dispatch(toggleStudentLetter(studentLetter.id)));
    };

    const handleViewFile = (studentLetter: StudentLetter) => {
        runWithLoader(() => dispatch(viewStudentLetter(studentLetter.id)));
    };

    const handleUploadClick = (student: Student, studentLetter: StudentLetter | null) => {
        setSelectedStudent(student);
        setSelectedStudentLetter(studentLetter);
    };

    const handleUploadClose = () => {
        setSelectedStudent(null);
        setSelectedStudentLetter(null);
    };

    const handleUploadSubmit = (file: File) => {
        if (!selectedStudent) return;
        if (selectedStudentLetter?.file_path) {
            runWithLoader(() => dispatch(replaceStudentLetter({ id: selectedStudentLetter.id, file })));
            return;
        }
        runWithLoader(() => dispatch(uploadStudentLetter({ kategori_id: categoryId, siswa_id: selectedStudent.id, file })));
    };

    const handleDeleteData = (studentLetter: StudentLetter) => {
        Swal.fire({
            title: "Hapus Data Surat Siswa",
            text: `Hapus data surat untuk ${studentLetter.siswa_nama}?${studentLetter.file_path ? " File juga akan dihapus dari penyimpanan." : ""}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#dc2626",
        }).then((result) => {
            if (result.isConfirmed) {
                runWithLoader(() => dispatch(deleteStudentLetter(studentLetter.id)));
            }
        });
    };

    return (
        <div className="space-y-4">
            {isPageLoading && <Loading />}
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                    Kategori: <span className="text-blue-600">{categoryName}</span>
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                    {filteredRows.length} dari {students.length} siswa
                </p>
            </div>

            <div className="flex flex-wrap gap-3">
                <input
                    type="text"
                    placeholder="Cari nama atau NIS..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full sm:w-56 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Cari siswa"
                />
                <select
                    value={classFilter}
                    onChange={(event) => setClassFilter(event.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Semua Kelas</option>
                    {classList.map((studentClass) => (
                        <option key={studentClass} value={studentClass}>
                            {studentClass}
                        </option>
                    ))}
                </select>
                <select
                    value={uploadFilter}
                    onChange={(event) => setUploadFilter(event.target.value as "all" | "uploaded" | "notUploaded")}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Semua Status File</option>
                    <option value="uploaded">Sudah Upload</option>
                    <option value="notUploaded">Belum Upload</option>
                </select>
                <select
                    value={accessFilter}
                    onChange={(event) => setAccessFilter(event.target.value as "all" | "opened" | "closed")}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Semua Akses</option>
                    <option value="opened">Akses Dibuka</option>
                    <option value="closed">Akses Ditutup</option>
                </select>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                NIS
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kelas
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status File
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Akses Download
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRows.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                    Tidak ada siswa yang cocok dengan filter.
                                </td>
                            </tr>
                        ) : (
                            filteredRows.map(({ student, studentLetter }) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-gray-600">{student.nis ?? "-"}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{student.nama_lengkap}</td>
                                    <td className="px-4 py-3 text-gray-600">{student.kelas ?? "-"}</td>
                                    <td className="px-4 py-3">
                                        {studentLetter?.file_path ? <Badge variant="uploaded" /> : <Badge variant="not-uploaded" />}
                                    </td>
                                    <td className="px-4 py-3">
                                        {studentLetter ? (
                                            <div className="flex items-center gap-2">
                                                <Toggle
                                                    checked={studentLetter.akses_download}
                                                    onChange={() => handleToggle(studentLetter)}
                                                />
                                                {!studentLetter.akses_download && <Badge variant="blocked" />}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            {studentLetter?.file_path && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewFile(studentLetter)}
                                                    className="rounded px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
                                                >
                                                    Lihat
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleUploadClick(student, studentLetter)}
                                                className="rounded px-3 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                                            >
                                                {studentLetter?.file_path ? "Ganti" : "Upload"}
                                            </button>
                                            {studentLetter && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteData(studentLetter)}
                                                    className="rounded px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                                                >
                                                    Hapus
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedStudent && (
                <UploadFileModal isOpen onClose={handleUploadClose} onSubmit={handleUploadSubmit} existingRecord={selectedStudentLetter} />
            )}
        </div>
    );
}
