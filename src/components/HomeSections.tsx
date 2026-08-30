import Link from "next/link";

const SECTIONS = [
  {
    id: "practices",
    title: "美育项目实践",
    href: "/practices",
    description:
      "每年夏天，青年艺术家与乡村儿童在驻留营中共同完成的艺术课程与实践成果。",
    accent: "#334DAF",
  },
  {
    id: "children",
    title: "仲夏自己·儿童成长数据库",
    href: "/children",
    description:
      "在知情同意前提下，长期追踪乡村儿童成长轨迹的纵向质性档案。",
    accent: "#E8C4A8",
  },
  {
    id: "observations",
    title: "美育观察",
    href: "/observations",
    description:
      "来自教学一线的见闻、记录与思考，呈现乡村美育的另一面。",
    accent: "#9CAF88",
  },
] as const;

export default function HomeSections() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="divide-y divide-neutral-200 border-y border-neutral-200">
        {SECTIONS.map((section) => (
          <Link
            key={section.id}
            href={section.href}
            className="group block py-8 transition first:pt-8 sm:py-10"
          >
            <div className="flex gap-4 sm:gap-5">
              <span
                className="mt-1.5 h-10 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: section.accent }}
                aria-hidden
              />
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-neutral-900 transition group-hover:text-neutral-600 sm:text-xl">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500 sm:text-base">
                  {section.description}
                </p>
                <span className="mt-3 inline-block text-sm text-neutral-400 transition group-hover:text-neutral-600">
                  进入 →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
