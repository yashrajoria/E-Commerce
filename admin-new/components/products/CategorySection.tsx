import { useCategories } from "@/hooks/useCategory";
import { motion } from "framer-motion";
import { CircleCheck, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MultiSelectCombobox } from "./MultiSelectCombobox";

const CategorySection = ({ form, isSubmitting, setUploadedImages }) => {
  const { categories = [] } = useCategories();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Category & Status Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="lg:col-span-2 space-y-6"
      >
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900/50 dark:to-blue-950/30 shadow-xl">
          {" "}
          <CardHeader className="relative">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Organization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Category Dropdown */}
            <MultiSelectCombobox
              form={form}
              name="category" // this should match the field name used in RHF
              categories={categories} // categories expected to be array of strings
            />

            {/* Status Dropdown */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <div className="flex space-x-2">
                    <CircleCheck className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <FormLabel className="text-zinc-300 w-full">
                      Status
                    </FormLabel>
                  </div>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectItem value="active" className="hover:bg-zinc-700">
                        Active
                      </SelectItem>
                      <SelectItem
                        value="inactive"
                        className="hover:bg-zinc-700"
                      >
                        Inactive
                      </SelectItem>
                      <SelectItem value="draft" className="hover:bg-zinc-700">
                        Draft
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        variants={itemVariants}
      >
        <Card className="bg-zinc-900 border border-zinc-800 shadow-sm rounded-2xl">
          <CardContent className="pt-6 space-y-3">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="mr-2"
                >
                  <Loader2 size={16} className="animate-spin" />
                </motion.div>
              ) : null}
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={() => {
                form.reset();
                // setUploadedImages([]);
              }}
            >
              Clear Form
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CategorySection;
