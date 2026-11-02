import { LockKeyhole } from "lucide-react";
import { Container } from "@/components/ui/container";

export function PhasePlaceholder({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-shell py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white px-7 py-12 text-center shadow-sm sm:px-12">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-slate-100 text-slate-600"><LockKeyhole className="size-7" /></span>
          <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">{eyebrow}</p>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950">{title}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-500">{description}</p>
        </div>
      </Container>
    </div>
  );
}
