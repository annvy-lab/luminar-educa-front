import { MensagensClient } from "../../../_components/dashboard/mensagens-client";

export default function MensagensPage() {
  return (
    <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center p-4">
      <MensagensClient />
    </div>
  );
}

