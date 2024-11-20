import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { TimePicker12 } from "../common/time-picker";
import {
  InsertPerson,
  GetAllOccupationTypes,
  OpenMultipleFileSelectDialog,
  UpdatePerson,
} from "../../../wailsjs/go/main/App";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import FilePreview from "./FilePreview";
import { Switch } from "../ui/switch";
import { ScrollArea } from "../ui/scroll-area";
import { useLocation } from "react-router-dom";

const formSchema = z.object({
  Name: z.string().min(2).max(50),
  Sex: z.enum(["M", "F"]).default("M"),
  DateOfBirth: z.date(),
  PlaceOfBirth: z.string(),
  FatherName: z.string().min(2).max(50),
  Contact: z.string().min(2).max(256),
  OccupationType: z.string(),
  AnnualIncome: z.number(),
  Budget: z.number(),
  Biodata: z.string(),
  Pictures: z.string(),
  Notes: z.string(),
});

const ManagePersonForm = () => {
  const [occupationTypes, setOccupationTypes] = useState<string[] | null>(null);

  const location = useLocation();
  var person:
    | {
        Name: any;
        Sex: any;
        DateOfBirth: string | number | Date;
        PlaceOfBirth: any;
        FatherName: any;
        Contact: any;
        OccupationType: any;
        AnnualIncome: any;
        Budget: any;
        Biodata: any;
        Pictures: any;
        Notes: any;
        ID: number;
      }
    | undefined = undefined;
  if (location.state?.edit) {
    person = location.state.person;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: person
      ? {
          Name: person.Name,
          Sex: person.Sex,
          DateOfBirth: new Date(person.DateOfBirth), // assuming DateOfBirth is a string
          PlaceOfBirth: person.PlaceOfBirth,
          FatherName: person.FatherName,
          Contact: person.Contact,
          OccupationType: person.OccupationType,
          AnnualIncome: person.AnnualIncome,
          Budget: person.Budget,
          Biodata: person.Biodata || "",
          Pictures: person.Pictures || "",
          Notes: person.Notes,
        }
      : {
          Name: "",
          Sex: "M",
          DateOfBirth: new Date(),
          PlaceOfBirth: "",
          FatherName: "",
          Contact: "",
          OccupationType: "",
          AnnualIncome: 0,
          Budget: 0,
          Biodata: "",
          Pictures: "",
          Notes: "",
        },
  });

  useEffect(() => {
    GetAllOccupationTypes().then(setOccupationTypes);
  }, []);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (location.state?.edit && person) {
      UpdatePerson(
        person.ID,
        values.Name,
        values.Sex,
        values.DateOfBirth,
        values.FatherName,
        values.Contact,
        values.OccupationType,
        values.AnnualIncome,
        values.Budget,
        values.PlaceOfBirth,
        values.Notes
      )
        .then(() => toast(`${values.Name} updated`))
        .catch((err) => toast(err));
        console.log(person)
    } else {
      InsertPerson(
        values.Name,
        values.Sex,
        values.DateOfBirth,
        values.FatherName,
        values.Contact,
        values.OccupationType,
        values.AnnualIncome,
        values.Budget,
        values.Biodata,
        values.Pictures,
        values.PlaceOfBirth,
        values.Notes
      )
      .then(() => toast(`${values.Name} added`))
      .catch((err) => toast(err));
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-x-32 gap-y-4 text-neutral-200">
          <FormField
            control={form.control}
            name="Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    className="bg-transparent border-neutral-500"
                    placeholder="Input Person's name"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                This is display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Sex"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between px-4 ">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Sex</FormLabel>
                  <FormDescription>Select gender.</FormDescription>
                </div>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    {/* Display selected gender */}
                    <span
                      className={`text-xl ${
                        field.value === "M" ? "text-blue-500" : "text-pink-500"
                      } font-bold`}
                    >
                      {field.value}
                    </span>{" "}
                    <Switch
                      className="bg-transparent border-spacing-10"
                      checked={field.value === "M"} // Toggle between "M" (Male) and "F" (Female)
                      onCheckedChange={() =>
                        field.onChange(field.value === "M" ? "F" : "M")
                      }
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="DateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal bg-transparent border-neutral-500",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      fromYear={1960}
                      toYear={2030}
                      captionLayout="dropdown-buttons" // Enables dropdown for month and year selection
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <TimePicker12 date={field.value} setDate={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="PlaceOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Place Of Birth</FormLabel>
                <FormControl>
                  <Input
                    className="bg-transparent border-neutral-500"
                    placeholder="Input Place Of Birth"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                This is display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="FatherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Name</FormLabel>
                <FormControl>
                  <Input
                    className="bg-transparent border-neutral-500"
                    placeholder="Input Father's name"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                This is display name.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Information</FormLabel>
                <FormControl>
                  <Input
                    className="bg-transparent border-neutral-500"
                    placeholder="Input Contact Information"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                This is display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="OccupationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Occupation Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an Occupation Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {occupationTypes &&
                      occupationTypes.map((ot) => (
                        <SelectItem value={ot}>{ot}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="AnnualIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Income (in lacs)</FormLabel>
                <FormControl>
                  <Input
                    className="bg-transparent border-neutral-500"
                    type="number"
                    placeholder="Input Annual Income"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                {/* <FormDescription>
              This is display name.
            </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (in lacs)</FormLabel>
                <FormControl>
                  <Input
                    className="bg-transparent border-neutral-500"
                    type="number"
                    placeholder="Input Person's Budget"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                {/* <FormDescription>
            This is display name.
            </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Input
                    className="bg-transparent border-neutral-500"
                    {...field}
                    placeholder="Input Person's name"
                  />
                </FormControl>
                {/* <FormDescription>
                This is display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {location.state?.edit ? null : (
            <div className="flex justify-around">
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
                              const files =
                                await OpenMultipleFileSelectDialog();
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
                    {/* <FormDescription>
            This is display name.
            </FormDescription> */}
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
                              const files =
                                await OpenMultipleFileSelectDialog();
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
            </div>
          )}
        </div>
        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ManagePersonForm;
