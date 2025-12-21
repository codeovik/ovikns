import { Button } from "@/components/ui/button"
import { IoHomeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-[calc(100vh-72px)] flex flex-col gap-5 items-center justify-center">
            <p className="text-8xl">404</p>
            <h1 className="text-4xl">Page Not Found</h1>
            <p className="text-base">Sorry, we couldn’t find the page you’re looking for.</p>
            <Link to="/">
                <Button variant="outline">
                    <IoHomeOutline />  Go Home
                </Button>
            </Link>
        </div>
    )
}