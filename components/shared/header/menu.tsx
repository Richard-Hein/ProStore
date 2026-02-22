import { Button } from "@/components/ui/button";
import MoodToggle from "./mood-toggle";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Menu = () => {
    return ( 
        <div className="flex justify-end gap-3">
            <nav className="hidden md:flex w-full max-w-xs gap-1">
                <MoodToggle/>
                <Button asChild variant={'ghost'}>
                  <Link href={'/cart'}>
                  <ShoppingCart/> Cart
                  </Link>
                </Button>
                <Button asChild >
                  <Link href={'/sign-in'}>
                  <UserIcon/> Sign In
                  </Link>
                </Button>
            </nav>
            <nav className="md:hidden">
              <Sheet>
                <SheetTrigger className="align-middle">
                  <EllipsisVertical/>
                </SheetTrigger>
                <SheetContent className="flex flex-col items-start py-4 px-2">
                  <SheetTitle>Menu</SheetTitle>
                  <MoodToggle/>
                  <Button asChild variant={'ghost'}>
                  <Link href={'/cart'}>
                  <ShoppingCart/> Cart
                  </Link>
                </Button>
                <Button asChild >
                  <Link href={'/sign-in'}>
                  <UserIcon/> Sign In
                  </Link>
                </Button>
                  <SheetDescription></SheetDescription>

                </SheetContent>
              </Sheet>
            </nav>
        </div>
     );
}
 
export default Menu;