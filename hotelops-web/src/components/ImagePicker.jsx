import { useEffect, useState } from "react";

/**
 * Drop-in single image picker with live preview.
 * Usage:
 *   <ImagePicker name="image" onFile={(file)=>setFile(file)} />
 */
export default function ImagePicker({ name = "image", onFile, initialUrl = "" }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialUrl);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Room image</label>

      <input
        type="file"
        accept="image/*"
        name={name}
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          setFile(f);
          onFile?.(f);
        }}
        className="block w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-white hover:file:bg-slate-800"
      />

      {preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="preview"
            className="h-36 w-56 object-cover rounded border"
          />
        </div>
      )}
    </div>
  );
}
