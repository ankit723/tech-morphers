import Image from "next/image";
import Link from "next/link";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function WhatsappButton() {
    const number = "++919795786303";
    const message = "Hello, I'm interested in your services, Can you please tell me more about your them?";
    const url = `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`;
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="fixed bottom-4 right-4 active:scale-90 transition-all duration-300 z-100 hover:scale-110 shadow-lg shadow-green-400 rounded-full">
                    <Link href={url} target="_blank" rel="noopener noreferrer" className="">
                        <Image src="/icons/whatsapp.svg" alt="Whatsapp" width={50} height={50} />
                    </Link>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>Chat With Us</p>
            </TooltipContent>
        </Tooltip>
    )
}