import PageShell from "@/components/PageShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "仲夏自己 · 穿越麦地",
};

export default function ChildrenPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-5 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">
          仲夏自己·儿童成长数据库
        </h1>

        <div className="mt-8 space-y-6 leading-relaxed text-neutral-600">
          <p>
            「仲夏自己」乡村美育数字档案库，是「穿越麦地」美育团队为云南乡村儿童撰写的纵向质性报告（QLR:
            qualitative longitudinal studies）。在唯成绩论的教育评价体制下，「仲夏自己」致力于关注乡村儿童被忽视的成长轨迹。
          </p>
          <p>
            在受访者知情同意的前提下，向孩子本人、家长、学校以及公众展现受访儿童在 a)
            兴趣爱好、b) 性格特征与心理健康、c) 社会行为、d)
            外部环境（侧重于学校、家庭的教育方式与社会的教育政策）这四个维度的发展轨迹。通过整理「穿越麦地」在云南高黎贡山与乡村儿童接触的珍贵一手信息，我们在微观层面上进行质性观察和量化数据分析，尝试看清中国乡村教育短缺的宏观问题。在严格遵守人类学调研伦理守则与法律规定的基础上，「仲夏自己」开源档案库将抛砖引玉，为关注中国乡村教育的公益组织和研究者提供一个比较资源。
          </p>
        </div>
      </div>
    </PageShell>
  );
}
