import { describe, expect, it } from "vitest";
import studentLetterReducer, { resetStudentLetterResponse } from "./studentLetterSlice";
import { deleteStudentLetter, getAllStudentLetter, toggleStudentLetter } from "../controllers/studentLetter.controller";
import { StudentLetter, StudentLetterState } from "../types/StudentLetterType";

const studentLetter: StudentLetter = {
    id             : "letter-1",
    siswa_id       : "student-1",
    kategori_id    : "category-1",
    file_path      : "category-1/student-1/file.pdf",
    file_name      : "file.pdf",
    akses_download : false,
    uploaded_by    : null,
    uploaded_at    : "2026-10-20T00:00:00.000Z",
    siswa_nis      : "1001",
    siswa_nama     : "Ahmad",
    siswa_kelas    : "9A",
};

const loadedState = (): StudentLetterState => studentLetterReducer(
    undefined,
    getAllStudentLetter.fulfilled({ status: true, message: "Successfully", data: [studentLetter] }, "request-1", { kategori_id: "category-1" }),
);

describe("studentLetterSlice", () => {
    it("stores the list and stops loading on fulfilled", () => {
        const state = loadedState();

        expect(state.studentLetters).toEqual([studentLetter]);
        expect(state.loading).toBe(false);
    });

    it("updates akses_download of the toggled letter", () => {
        const toggleAction = toggleStudentLetter.fulfilled(
            { status: true, message: "Successfully", data: { ...studentLetter, akses_download: true } },
            "request-2",
            studentLetter.id,
        );
        const state = studentLetterReducer(loadedState(), toggleAction);

        expect(state.studentLetters[0].akses_download).toBe(true);
        expect(state.response.toggle?.status).toBe(true);
    });

    it("keeps the list when delete fails and removes it when delete succeeds", () => {
        const failedState = studentLetterReducer(
            loadedState(),
            deleteStudentLetter.fulfilled({ status: false, message: "Data tidak ditemukan", data: null }, "request-3", studentLetter.id),
        );
        expect(failedState.studentLetters).toHaveLength(1);

        const deletedState = studentLetterReducer(
            loadedState(),
            deleteStudentLetter.fulfilled({ status: true, message: "Successfully", data: null }, "request-4", studentLetter.id),
        );
        expect(deletedState.studentLetters).toHaveLength(0);
        expect(studentLetterReducer(deletedState, resetStudentLetterResponse()).response.delete).toBeNull();
    });

    it("stops loading when the server cannot be reached", () => {
        const pendingState  = studentLetterReducer(undefined, getAllStudentLetter.pending("request-5", { kategori_id: "category-1" }));
        const rejectedState = studentLetterReducer(pendingState, getAllStudentLetter.rejected(new Error("Network Error"), "request-5", { kategori_id: "category-1" }));

        expect(pendingState.loading).toBe(true);
        expect(rejectedState.loading).toBe(false);
    });
});
