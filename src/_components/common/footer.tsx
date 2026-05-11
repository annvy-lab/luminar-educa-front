import { Card, CardContent } from "../ui/card";

const Footer = () => {
  return (
    <footer className="mt-15 mb-0 w-full self-end">
      <Card className="rounded-none border-x-0 border-t-0 p-6 py-8">
        <CardContent className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2">
          <p className="text-sm text-gray-400">
            © 2026 Copyright -{" "}
            <span className="font-bold">Luminar Educa | ADS Unifacema</span>
          </p>
        </CardContent>
      </Card>
    </footer>
  );
};

export default Footer;
