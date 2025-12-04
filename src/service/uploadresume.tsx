import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios"; // ← your axios instance (with tokens)

const uploadFile = async (file: File) => {
  console.log(file);

  const formData = new FormData();
  formData.append("resume", file);

  const res = await api.post("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (e) => {
      const percent = Math.round((e.loaded * 100) / (e.total || 1));
      console.log("Upload progress:", percent);
    },
  });

  console.log(res);
  return res.data; // { cv: { id: ... } }
};

export function useUploadFile() {
  return useMutation({
    mutationFn: uploadFile,
    retry: 2,
  });
}
