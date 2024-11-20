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
  InsertAttachments,
  InsertPerson,
  OpenMultipleFileSelectDialog,
  UpdateNoteForPerson,
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";

interface ViewAttachmentsProps {
  uuid: string;
  id: number;
}

const formSchema = z.object({
  Biodata: z.string(),
  Pictures: z.string(),
});

export function ViewAttachments({ uuid, id }: ViewAttachmentsProps) {
  const [attachments, setAttachments] = useState<undefined | data.Attachment[]>(
    undefined
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Biodata: "",
      Pictures: "",
    },
  });

  useEffect(() => {
    const FetchAttachments = async () => {
      GetAttachmentsByUUID(uuid).then((at) => setAttachments(at));
    };

    FetchAttachments();
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    InsertAttachments(id, uuid, values.Biodata, values.Pictures)
      .then(() => toast(`added attachments`))
      .catch((err) => toast(err));
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <span
          className={cn(
            "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
          )}
        >
          Attachments
        </span>
      </SheetTrigger>
      <SheetContent className="bg-neutral-800 text-neutral-200">
        <SheetHeader>
          <SheetTitle className=" text-neutral-200">Attachments</SheetTitle>
          {/* <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription> */}
        </SheetHeader>
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="">Type</TableHead>
              <TableHead className="">File</TableHead>
              {/* <TableHead>Status</TableHead> */}
              {/* <TableHead>Method</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {attachments &&
              attachments.map((attachment) => (
                <TableRow key={attachment.ID}>
                  <TableCell>{attachment.Type}</TableCell>
                  <TableCell>
                    <FilePreview FileLink={attachment.FileName} />
                  </TableCell>
                  {/* <TableCell>{invoice.paymentStatus}</TableCell> */}
                  {/* <TableCell>{invoice.paymentMethod}</TableCell> */}
                </TableRow>
              ))}
          </TableBody>
          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="Biodata"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio-Data</FormLabel>
                  <FormControl>
                    <div>
                      <Button
                        type="button"
                        onClick={async () => {
                          try {
                            const files = await OpenMultipleFileSelectDialog();
                            if (files && files.length > 0) {
                              const fileString = files.join(", "); // Convert array to string
                              field.onChange(fileString.trim()); // Store string in the form field
                            }
                          } catch (error) {
                            console.error("Error selecting files: ", error);
                          }
                        }}
                      >
                        Select Files
                      </Button>

                      <ScrollArea className="border rounded-lg min-w-24 min-h-16 border-neutral-500">
                        {field.value
                          ? field.value
                              .split(",")
                              .map((item) => <FilePreview FileLink={item} />)
                          : null}
                      </ScrollArea>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Pictures"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pictures</FormLabel>
                  <FormControl>
                    <div>
                      <Button
                        type="button"
                        onClick={async () => {
                          try {
                            const files = await OpenMultipleFileSelectDialog();
                            if (files && files.length > 0) {
                              const fileString = files.join(", "); // Convert array to string
                              field.onChange(fileString.trim()); // Store string in the form field
                            }
                          } catch (error) {
                            console.error("Error selecting files: ", error);
                          }
                        }}
                      >
                        Select Files
                      </Button>

                      <ScrollArea className="h-16 border rounded-lg border-neutral-500">
                        {field.value
                          ? field.value
                              .split(",")
                              .map((item) => <FilePreview FileLink={item} />)
                          : null}
                      </ScrollArea>
                    </div>
                  </FormControl>
                  {/* <FormDescription>
            This is display name.
            </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-4" type="submit">
              Submit
            </Button>
          </form>
        </Form>
        <SheetFooter>
          {/* <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
