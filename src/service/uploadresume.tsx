import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const uploadFile = async (file: File) => {
  console.log(file);
  const formData = new FormData();
  formData.append("resume", file);
  console.log(formData);

  const res = await axios.post(
    "http://192.168.100.16:4000/resume/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / (e.total || 1));
        console.log("Upload progress:", percent);
      },
    }
  );
  console.log(res);

  return res.data;
};

export function useUploadFile() {
  return useMutation({
    mutationFn: uploadFile,
    retry: 2, // retries failed uploads automatically
  });
}
