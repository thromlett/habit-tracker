import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";
export default function LoadIcon() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
      <Quantum size={75} speed={1.5} color={"#4c83fd"} />
    </div>
  );
}
