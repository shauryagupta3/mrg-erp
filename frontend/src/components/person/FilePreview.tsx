import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GetAttachmentBase64 } from "../../../wailsjs/go/main/App";
import { useEffect, useState } from "react";

const FilePreview = ({ FileLink }: { FileLink: string }) => {
  const [fileBase64, setFileBase64] = useState<null | string>(null);

  const getExtension = (fileLink: string | null | undefined): string => {
    if (!fileLink || typeof fileLink !== "string") {
      return "";
    }
    const parts = fileLink.split(".");
    return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
  };

  useEffect(() => {
    if (FileLink != undefined) {
      const FileBase64 = async () => {
        const extension = getExtension(FileLink);
        const base64String = await GetAttachmentBase64(FileLink);

        let mimeType = "";
        switch (extension) {
          case "pdf":
            mimeType = "application/pdf";
            break;
          case "png":
            mimeType = "image/png";
            break;
          case "jpg":
          case "jpeg":
            mimeType = "image/jpeg";
            break;
          case "gif":
            mimeType = "image/gif";
            break;
          case "svg":
            mimeType = "image/svg+xml";
            break;
          case "html":
            mimeType = "text/html";
            break;
          case "txt":
            mimeType = "text/plain";
            break;
          case "mp3":
            mimeType = "audio/mpeg";
            break;
          case "mp4":
            mimeType = "video/mp4";
            break;
          default:
            console.error("Unsupported file type");
            return;
        }

        setFileBase64(`data:${mimeType};base64,${base64String}`);
      };
      FileBase64();
    }
  }, [FileLink]);

  const a = 1;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="bg-transparent text-neutral-200">{FileLink.split("/").pop()}</Button>
      </DialogTrigger>
      <DialogContent className="min-w-screen h-5/6">
        {fileBase64 ? (
          <iframe src={fileBase64} width={`100%`} height={`100%`} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default FilePreview;
