/**
 * 全局常量定义
 * 级别、领域、主题等枚举，用于首页「先选级别、再选领域」筛选
 */

/** 难度等级（CEFR）：固定顺序 A1 → A2 → B1 → B2 */
export const LEVELS = ["A1", "A2", "B1", "B2"] as const;
export type Level = (typeof LEVELS)[number];

/** 领域/内容类型（首页「先选级别、再选领域」） */
export const CONTENT_TYPES = [
  { value: "dialogue", label: "情景对话" },
  { value: "lesson", label: "课文" },
  { value: "reading", label: "阅读" },
  { value: "vocabulary", label: "词汇" },
  { value: "grammar", label: "语法" },
  { value: "culture", label: "文化" },
] as const;
export type ContentType = (typeof CONTENT_TYPES)[number]["value"];

/** 主题领域（可选）：用于按主题筛选，从 rawdata 标题归纳 */
export const DOMAINS = [
  "日常生活",
  "社交礼仪",
  "出行与交通",
  "健康与医疗",
  "居住",
  "工作与社会",
  "文化认知",
  "社会话题",
] as const;
export type Domain = typeof DOMAINS[number];

/** ID 规则辅助：type 映射到缩写 */
export const TYPE_ABBREVIATION: Record<ContentType, string> = {
  dialogue: "dlg",
  lesson: "les",
  reading: "rdg",
  vocabulary: "voc",
  grammar: "gra",
  culture: "cul",
} as const;

/** 根据 type + level + 序号生成 ID */
export function generateContentId(
  type: ContentType,
  level: Level,
  index: number
): string {
  const typeAbbr = TYPE_ABBREVIATION[type];
  const seq = String(index).padStart(2, "0");
  return `${typeAbbr}-${level}-${seq}`;
}
