import PageShell from "@/components/PageShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About us · 穿越麦地",
};

export default function AboutPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-5 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">About us</h1>

        <div className="mt-8 space-y-6 leading-relaxed text-neutral-600">
          <p>
            成立于2021年，「穿越麦地 x 乡村美育」是一个青年艺术家与乡村学生的艺术共创平台。
          </p>
          <p>
            每年夏天，我们通过将有才能、有人文关怀的青年艺术家（artists）转化为教育资源（teaching
            artists），并邀请他们驻留中国村镇学校，以艺术引导孩子，孕育对于知识与生活的热情。
          </p>
          <p>
            我们希望将乡村孩子看作具有独立意识的艺术家，成为他们平等的伙伴，以填补在当下同质化的教育模式中，乡村学生正普遍面临的精神空缺。
          </p>
          <p>
            「穿越麦地」只在做一件小事：在艺术与自然的陪伴中，让我们和孩子，都更热爱生活。
          </p>
        </div>
      </div>
    </PageShell>
  );
}
