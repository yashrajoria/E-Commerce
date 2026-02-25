import axios from "axios";

type PresignResponse = {
  upload_url?: string;
  fields?: Record<string, string>;
  url?: string; // final file URL
};

function xhrUpload(
  url: string,
  formData: FormData | null,
  method = "POST",
  file?: File,
  onProgress?: (p: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed with status ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const percent = Math.round((evt.loaded / evt.total) * 100);
          onProgress(percent);
        }
      };
    }
    if (formData) xhr.send(formData);
    else if (file) xhr.send(file);
    else xhr.send();
  });
}

export async function uploadFiles(
  files: File[],
  sku?: string,
  onProgress?: (index: number, percent: number) => void,
): Promise<string[]> {
  const uploadedUrls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    // Request a presigned URL from our proxy
    const presignUrl = `/api/products/presign${sku ? `?sku=${encodeURIComponent(sku)}` : ""}`;
    const presignRes = await axios.get<PresignResponse>(presignUrl, {
      withCredentials: true,
    });
    const presign = presignRes.data;

    if (presign.fields && presign.upload_url) {
      // S3 POST style (form fields)
      const fd = new FormData();
      Object.entries(presign.fields).forEach(([k, v]) => fd.append(k, v));
      fd.append("file", file, file.name);
      await xhrUpload(presign.upload_url, fd, "POST", undefined, (p) =>
        onProgress?.(i, p),
      );
      if (presign.url) uploadedUrls.push(presign.url);
      else uploadedUrls.push(presign.upload_url as string);
    } else if (presign.upload_url) {
      // PUT style presign
      await xhrUpload(presign.upload_url, null, "PUT", file, (p) =>
        onProgress?.(i, p),
      );
      const cleanUrl = presign.upload_url.split("?")[0];
      uploadedUrls.push(cleanUrl);
    } else {
      throw new Error("Presign endpoint did not return upload info");
    }
  }

  return uploadedUrls;
}

export function uploadSingleFile(
  file: File,
  sku?: string,
  onProgress?: (percent: number) => void,
) {
  const xhr = new XMLHttpRequest();
  let aborted = false;

  const promise = new Promise<string>(async (resolve, reject) => {
    try {
      const presignUrl = `/api/products/presign${sku ? `?sku=${encodeURIComponent(sku)}` : ""}`;
      const presignRes = await fetch(presignUrl, { credentials: "include" });
      if (!presignRes.ok) throw new Error("Failed to get presign");
      const presign: PresignResponse = await presignRes.json();

      if (presign.fields && presign.upload_url) {
        const fd = new FormData();
        Object.entries(presign.fields).forEach(([k, v]) => fd.append(k, v));
        fd.append("file", file, file.name);

        xhr.open("POST", presign.upload_url);
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300)
            resolve(presign.url || presign.upload_url || "");
          else reject(new Error(`Upload failed with status ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        if (xhr.upload && onProgress)
          xhr.upload.onprogress = (evt) => {
            if (evt.lengthComputable)
              onProgress(Math.round((evt.loaded / evt.total) * 100));
          };
        xhr.send(fd);
      } else if (presign.upload_url) {
        xhr.open("PUT", presign.upload_url);
        xhr.setRequestHeader(
          "Content-Type",
          file.type || "application/octet-stream",
        );
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300)
            resolve((presign.upload_url as string).split("?")[0]);
          else reject(new Error(`Upload failed with status ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        if (xhr.upload && onProgress)
          xhr.upload.onprogress = (evt) => {
            if (evt.lengthComputable)
              onProgress(Math.round((evt.loaded / evt.total) * 100));
          };
        xhr.send(file);
      } else {
        reject(new Error("Presign endpoint did not return upload info"));
      }
    } catch (e) {
      if (aborted) reject(new Error("Upload aborted"));
      else reject(e);
    }
  });

  return {
    promise,
    cancel: () => {
      aborted = true;
      try {
        xhr.abort();
      } catch (e) {
        // ignore
      }
    },
  };
}

export default uploadFiles;
