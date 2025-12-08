import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";

type FileWithPreview = {
  file: File;
  id: string;
  preview: string;
  isImage: boolean;
};

// 📎 مكون رفع الملفات
const FileUploadField = ({
  files,
  onFileChange,
  onFileRemove,
}: {
  files: FileWithPreview[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: (id: string) => void;
}) => {
  const t = useTranslations("contactForm");
  return (
    <div className="form-group" data-aos-delay="300">
    <div className="flex flex-col sm:flex-row">
       <label
        htmlFor="file-upload"
        className=" cursor-pointer flex items-center justify-between rounded-[12px] gap-5 bg-white  py-3"
      >
         <div className="cursor-pointer  border border-[#E4E4E4] w-[105px] h-[52px] rounded-[12px] flex items-center justify-center">
          {/* 📎 */}
          <Icon icon="solar:upload-broken" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-gray-500 text-[10px] lg:text-sm flex items-center gap-10">
          {files.length === 0 && t("filePlaceholder")}
          <span className="text-xs text-gray-400 mr-2">{t("fileOptional")}</span>
        </div>
         <p className=" text-[10px] lg:text-xs text-gray-400  mt-1">
        {t("fileHelp")}
      </p>
        </div>
        
        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={onFileChange}
        />
        
      </label>

     </div>
      {files.length > 0 && (
        <div className="mt-3">
          <div className="text-sm font-medium mb-2">
            {t("filesLabel", { count: files.length })}
          </div>
          <div className="flex flex-wrap gap-3">
            {files.map((f) => (
              <div key={f.id} className="relative w-24 border rounded-md p-2">
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 border"
                  onClick={() => onFileRemove(f.id)}
                  aria-label={t("removeFile")}
                >
                  ❌
                </button>
                <div className="h-16 flex items-center justify-center mb-1">
                  {f.isImage ? (
                    <img
                      src={f.preview}
                      alt={f.file.name}
                      className="h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-400 text-2xl">📄</span>
                  )}
                </div>
                <div
                  className="text-xs text-center text-gray-500 truncate"
                  title={f.file.name}
                >
                  {f.file.name.length > 12
                    ? `${f.file.name.slice(0, 9)}...${f.file.name
                        .split(".")
                        .pop()}`
                    : f.file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

     
    </div>
  );
};

export default FileUploadField;