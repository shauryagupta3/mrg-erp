import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  GetAttachmentsByUUID,
  UpdateNoteForPerson,
  UpdatePerson,
} from "../../../wailsjs/go/main/App";
import { data } from "../../../wailsjs/go/models";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FilePreview from "./FilePreview";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

interface ViewAttachmentsProps {
  notes: string;
  id: number;
}

export function NotesDrawer({ notes, id }: ViewAttachmentsProps) {
  const [currentNote, setCurrentNote] = useState(notes); // To track the current value of the textarea
  const [isEdited, setIsEdited] = useState(false); // To track if the note has been edited

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedNote = e.target.value;
    setCurrentNote(updatedNote);
    setIsEdited(updatedNote !== notes); // Compare with the original note
  };

  const handleSave = () => {
    UpdateNoteForPerson(currentNote, id)
      .then(() => toast("successfully updated note"))
      .catch((err) => toast("error : ", err));
  };

  const truncatedNotes = notes.length > 16 ? `${notes.slice(0, 16)}...` : notes;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <span className="underline hover:cursor-pointer">{truncatedNotes}</span>
      </SheetTrigger>
      <SheetContent className="bg-neutral-800 text-neutral-200">
        <SheetHeader>
          <SheetTitle className=" text-neutral-200">Notes</SheetTitle>
          {/* <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription> */}
        </SheetHeader>
        <Textarea
          value={currentNote}
          onChange={handleNoteChange}
          placeholder="Type your message here."
        />
        {isEdited && (
          <Button onClick={handleSave} className="mt-4">
            Submit
          </Button>
        )}{" "}
        <SheetFooter>
          {/* <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
