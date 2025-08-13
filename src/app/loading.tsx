import LoadIcon from "@/components/LoadIcon";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <LoadIcon />
    </div>
  );
}
