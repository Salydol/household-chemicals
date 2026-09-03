import { whatsappLink } from '@/lib/whatsapp';
import { WhatsAppIcon } from './WhatsAppIcon';

type Props = {
  title: string;
  text: string;
  whatsapp: string;
  whatsappText: string;
};

export function CtaBanner({ title, text, whatsapp, whatsappText }: Props) {
  const wa = whatsappLink({ phone: whatsapp, baseText: whatsappText });

  return (
    <section className="container-site">
      <div className="relative overflow-hidden rounded-2xl bg-brand-800 px-6 py-10 text-white sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-28 right-24 h-56 w-56 rounded-full bg-white/5" />
        <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold sm:text-[28px]">{title}</h2>
            <p className="mt-2.5 text-[15px] leading-relaxed text-white/75">{text}</p>
          </div>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-lg shrink-0">
            <WhatsAppIcon /> Написать в WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
