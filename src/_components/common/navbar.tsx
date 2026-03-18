import { Flame, Menu } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";

const Navbar = () => {
  return (
    <Card className="mb-6 rounded-t-none p-6 py-5">
      <CardContent className="flex items-center justify-between gap-2 p-0">
        <h1 className="flex items-center gap-0.5 text-lg font-bold text-primary">
          <Flame size={22} strokeWidth={2.2} />
          Luminar <span className="text-foreground/90">Educa</span>
        </h1>

        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            }
          />

          <SheetContent className="p-4">
            <SheetHeader className="text-base">Menu</SheetHeader>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default Navbar;
