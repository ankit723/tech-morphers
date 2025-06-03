import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TalkToUsForm from "./TalkToUsForm";

export default function CtaBlock() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDialogCloseAttempt = () => {
    setIsAlertOpen(true);
  };

  const handleConfirmClose = () => {
    setIsDialogOpen(false);
    setIsAlertOpen(false);
  };

  const handleCancelClose = () => {
    setIsAlertOpen(false);
  };

  return (
    <section className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow-xl p-10 md:p-16 my-10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Let&apos;s Build Something Game-Changing Together
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          At Tech Morphers, we don&apos;t just code — we co-create premium digital experiences that fuel your growth.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/estimator">
            <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-md cursor-pointer dark:text-white">
              Get a Free Estimate <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            if (!open) {
              handleDialogCloseAttempt();
            } else {
              setIsDialogOpen(true);
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)} variant="outline" size="lg" className="bg-transparent text-lg px-8 py-6 rounded-xl  cursor-pointer">
                Talk to Us <Phone className="ml-2 w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 text-black dark:text-white dark:border-gray-700 z-100">
              <DialogHeader>
                <DialogTitle>Talk to Us</DialogTitle>
                <DialogDescription>
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </DialogDescription>
              </DialogHeader>
              <TalkToUsForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="sm:max-w-[400px] bg-white dark:bg-gray-900 text-black dark:text-white dark:border-gray-700 z-100 shadow-2xl shadow-blue-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              You have unsaved changes. Are you sure you want to close the form?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelClose} className="bg-transparent border-gray-600 hover:bg-gray-700 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose} className="bg-red-600 hover:bg-red-700 text-white">
              Yes, Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
