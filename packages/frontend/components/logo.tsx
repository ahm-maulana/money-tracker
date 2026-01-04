import { HandCoins } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center rounded-full size-10 shadow-lg shadow-primary/20">
        <HandCoins />
      </div>
      <h1 className="text-xl font-bold tracking-tight">Money Tracker</h1>
    </div>
  );
}
export default Logo;
