import PageShell from "@/components/PageShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact · 穿越麦地",
};

const XHS_MAIN =
  "https://www.xiaohongshu.com/user/profile/55572426484fb610397429c7?xsec_token=AB1y2sRXg6oYCDwoCLIpTz-rvRsyW-Fa8q2TBkgDA9ogo=&xsec_source=pc_search";

const XHS_DAILY =
  "https://www.xiaohongshu.com/user/profile/60abb8b80000000001008386?xsec_token=ABvXwE7be5CXHtJKyIHE9chiy0xWj1wx1kT47pwUQkl4I%3D&xsec_source=pc_search";

export default function ContactPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-5 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Contact</h1>
        <p className="mt-6 leading-relaxed text-neutral-600">
          如有合作或访问意向，欢迎与我们联系。
        </p>

        <ul className="mt-10 space-y-5 text-neutral-700">
          <li>
            <span className="text-neutral-500">微信公众号</span>
            <p className="mt-1">穿越麦地×美育计划</p>
          </li>
          <li>
            <span className="text-neutral-500">小红书</span>
            <p className="mt-1">
              <a
                href={XHS_MAIN}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-neutral-300 underline-offset-4 transition hover:text-neutral-900 hover:decoration-neutral-500"
              >
                穿越麦地×美育计划
              </a>
            </p>
            <p className="mt-2">
              <a
                href={XHS_DAILY}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-neutral-300 underline-offset-4 transition hover:text-neutral-900 hover:decoration-neutral-500"
              >
                阿麦与孩子们的日常
              </a>
            </p>
          </li>
          <li>
            <span className="text-neutral-500">邮箱</span>
            <p className="mt-1">
              <a
                href="mailto:letsummerbe@qq.com"
                className="underline decoration-neutral-300 underline-offset-4 transition hover:text-neutral-900 hover:decoration-neutral-500"
              >
                letsummerbe@qq.com
              </a>
            </p>
          </li>
        </ul>
      </div>
    </PageShell>
  );
}
