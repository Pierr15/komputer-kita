import {
  CircuitBoard,
  Cpu,
  Fan,
  Gamepad2,
  HardDrive,
  Headphones,
  Keyboard,
  MemoryStick,
  Monitor,
  Mouse,
} from "lucide-react";
import type { ProductIcon } from "@/types/catalog";

const iconMap = {
  cpu: Cpu,
  board: CircuitBoard,
  memory: MemoryStick,
  storage: HardDrive,
  gpu: Gamepad2,
  mouse: Mouse,
  keyboard: Keyboard,
  headset: Headphones,
  cooler: Fan,
  monitor: Monitor,
} satisfies Record<ProductIcon, typeof Cpu>;

export function ProductIconArt({ icon, className }: { icon: ProductIcon; className?: string }) {
  const Icon = iconMap[icon];
  return <Icon aria-hidden="true" className={className ?? "size-16 stroke-[1.25]"} />;
}
