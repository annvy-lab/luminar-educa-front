import { Card, CardContent } from "../ui/card";

const Footer = () => {
  return (
    <footer className="mt-15 mb-0 w-full self-end">
      <Card className="rounded-none">
        <CardContent className="px-5 py-4">
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
