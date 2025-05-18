import { Spinner } from "@heroui/react";

export default function Loading({
  loadingContent,
}: {
  loadingContent: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center text-lg font-medium">
      <Spinner
        classNames={{ label: "text-foreground mt-4" }}
        label={loadingContent}
        color="warning"
        variant="wave"
      />
    </div>
  );
}
