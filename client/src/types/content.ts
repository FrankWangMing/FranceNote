/**
 * 学习单元类型定义
 * 对应 rawdata → 4 步协议 → Step 3 产出的 JSON 结构
 * 强笔记：id、level（A1/A2/B1/B2）、type（领域/内容类型）、title、summary、content、vocabulary、expressions、grammar_points
 * 弱练习：contentId 可选关联到 exercises-data；练习页为次要入口
 */

/** 难度等级（CEFR） */
export type Level = "A1" | "A2" | "B1" | "B2";

/** 领域/内容类型（首页「先选级别、再选领域」） */
export type ContentType =
  | "dialogue"
  | "lesson"
  | "reading"
  | "vocabulary"
  | "grammar"
  | "culture";

/** 对话行（用于 dialogue 类型的 content.lines） */
export interface DialogueLine {
  speaker: string;
  fr: string;
  zh: string;
}

/** 词汇项 */
export interface VocabularyItem {
  word: string;
  meaning: string;
  example: string;
}

/** 关键表达/句型 */
export interface Expression {
  phrase: string;
  meaning: string;
  example?: string;
}

/** 语法点 */
export interface GrammarPoint {
  title: string;
  explanation: string;
  examples?: string[];
}

/** 内容体：根据 type 不同使用不同结构 */
export interface Content {
  /** 对话类型：lines 数组 */
  lines?: DialogueLine[];
  /** 课文/阅读/听力/词汇/语法/文化：正文文本 */
  text?: string;
  /** 翻译（可选，若已混在 lines 或 text 中可省略） */
  translation?: string;
  /** 音频 URL（听力/对话可选） */
  audio?: string;
}

/** 学习单元（Step 3 JSON 对应结构） */
export interface ContentUnit {
  /** 唯一标识：建议规则 {type}-{level}-{序号}，如 dialogue-a1-01 */
  id: string;
  /** 难度等级：A1/A2/B1/B2（必填） */
  level: Level;
  /** 领域/内容类型（必填） */
  type: ContentType;
  /** 标题（法语或中文） */
  title: string;
  /** 内容简介 */
  summary: string;
  /** 内容体 */
  content: Content;
  /** 核心词汇列表（5–15 个） */
  vocabulary: VocabularyItem[];
  /** 关键句型/表达（3–6 个） */
  expressions: Expression[];
  /** 语法点（可为空） */
  grammar_points: GrammarPoint[];
  /** 可选：主题领域（用于按主题筛选），如 日常生活、社交礼仪、出行交通等 */
  domain?: string;
  /** 可选：标签（便于搜索与推荐） */
  tags?: string[];
}

/** 首页列表项（从 ContentUnit 扁平化而来） */
export interface ContentListItem {
  id: string;
  level: Level;
  type: ContentType;
  title: string;
  summary: string;
  domain?: string;
  tags?: string[];
}

/** content-units.json 文件结构 */
export interface ContentUnitsData {
  [key in ContentType]?: ContentUnit[];
}
