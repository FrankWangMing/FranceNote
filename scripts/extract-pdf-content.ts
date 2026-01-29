import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pdfParse from "pdf-parse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ContentItem {
    section: string;
    subsection: string;
    content: string;
}

interface MaterialsData {
    [level: string]: {
        vocabulary: ContentItem[];
        grammar: ContentItem[];
        reading: ContentItem[];
        others: ContentItem[];
    };
}

// PDF 文件到模块的映射
const fileMapping: Record<string, { level: string; module: "vocabulary" | "grammar" | "reading" | "others" }> = {
    "A1词汇.pdf": { level: "A1", module: "vocabulary" },
    "A2词汇.pdf": { level: "A2", module: "vocabulary" },
    "B1词汇.pdf": { level: "B1", module: "vocabulary" },
    "B2词汇.pdf": { level: "B2", module: "vocabulary" },
    "A1语法讲义.pdf": { level: "A1", module: "grammar" },
    "A2语法讲义.pdf": { level: "A2", module: "grammar" },
    "B级别语法讲义.pdf": { level: "B", module: "grammar" },
    "A1课文讲义.pdf": { level: "A1", module: "reading" },
    "A2课文讲义.pdf": { level: "A2", module: "reading" },
    "B1课文讲义.pdf": { level: "B1", module: "reading" },
    "B2课文讲义.pdf": { level: "B2", module: "reading" },
    "A1文化讲义.pdf": { level: "A1", module: "others" },
    "A2文化讲义.pdf": { level: "A2", module: "others" },
    "B1文化.pdf": { level: "B1", module: "others" },
    "B2文化.pdf": { level: "B2", module: "others" },
    "A1 情景对话讲义.pdf": { level: "A1", module: "others" },
    "A2 情景对话讲义.pdf": { level: "A2", module: "others" },
    "B1情景对话讲义.pdf": { level: "B1", module: "others" },
    "B2情景对话.pdf": { level: "B2", module: "others" },
};

// 解析文本，识别章节结构
function parseContent(text: string): ContentItem[] {
    const items: ContentItem[] = [];
    const lines = text.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);

    let currentSection = "";
    let currentSubsection = "";
    let currentContent: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // 识别章节标题（通常以数字开头，如 "1.", "1.1", "第一章" 等）
        const sectionMatch = line.match(/^(\d+[\.、]?\s*[^\d]+\s*[：:]?)/);
        const subsectionMatch = line.match(/^(\d+\.\d+[\.、]?\s*[^\d]+\s*[：:]?)/);

        if (subsectionMatch) {
            // 保存之前的内容
            if (currentSection && currentContent.length > 0) {
                items.push({
                    section: currentSection,
                    subsection: currentSubsection || currentSection,
                    content: currentContent.join("\n\n"),
                });
            }
            currentSubsection = line.replace(/^\d+\.\d+[\.、]?\s*/, "").replace(/[：:]$/, "").trim();
            currentContent = [];
        } else if (sectionMatch && !subsectionMatch) {
            // 保存之前的内容
            if (currentSection && currentContent.length > 0) {
                items.push({
                    section: currentSection,
                    subsection: currentSubsection || currentSection,
                    content: currentContent.join("\n\n"),
                });
            }
            currentSection = line.replace(/^\d+[\.、]?\s*/, "").replace(/[：:]$/, "").trim();
            currentSubsection = "";
            currentContent = [];
        } else {
            // 内容行
            if (line.length > 3) {
                // 过滤掉太短的行（可能是页码、页眉等）
                currentContent.push(line);
            }
        }
    }

    // 保存最后的内容
    if (currentSection && currentContent.length > 0) {
        items.push({
            section: currentSection,
            subsection: currentSubsection || currentSection,
            content: currentContent.join("\n\n"),
        });
    }

    // 如果没有识别到章节结构，将整个内容作为一个条目
    if (items.length === 0 && text.trim().length > 0) {
        items.push({
            section: "内容",
            subsection: "全部内容",
            content: text.trim(),
        });
    }

    return items;
}

// 提取单个 PDF 文件的内容
async function extractPdfContent(filePath: string): Promise<ContentItem[]> {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);

        console.log(`提取 ${path.basename(filePath)}: ${data.numpages} 页`);

        // 清理文本
        let text = data.text
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .replace(/\n{3,}/g, "\n\n") // 合并多个空行
            .trim();

        return parseContent(text);
    } catch (error) {
        console.error(`提取 ${filePath} 时出错:`, error);
        return [];
    }
}

// 主函数
async function main() {
    const notesDir = path.resolve(__dirname, "../notes");
    const outputPath = path.resolve(__dirname, "../client/public/materials-data.json");

    // 确保输出目录存在
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const materialsData: MaterialsData = {
        A1: { vocabulary: [], grammar: [], reading: [], others: [] },
        A2: { vocabulary: [], grammar: [], reading: [], others: [] },
        B1: { vocabulary: [], grammar: [], reading: [], others: [] },
        B2: { vocabulary: [], grammar: [], reading: [], others: [] },
        B: { vocabulary: [], grammar: [], reading: [], others: [] },
    };

    // 读取 notes 目录下的所有 PDF 文件
    const files = fs.readdirSync(notesDir).filter((file) => file.endsWith(".pdf"));

    console.log(`找到 ${files.length} 个 PDF 文件\n`);

    for (const file of files) {
        const mapping = fileMapping[file];
        if (!mapping) {
            console.warn(`跳过未映射的文件: ${file}`);
            continue;
        }

        const filePath = path.join(notesDir, file);
        console.log(`处理: ${file} -> ${mapping.level}/${mapping.module}`);

        const items = await extractPdfContent(filePath);

        // 将 B 级别的语法添加到 B1 和 B2
        if (mapping.level === "B" && mapping.module === "grammar") {
            materialsData.B1[mapping.module].push(...items);
            materialsData.B2[mapping.module].push(...items);
        } else if (mapping.level in materialsData) {
            materialsData[mapping.level][mapping.module].push(...items);
        }

        console.log(`  提取了 ${items.length} 个条目\n`);
    }

    // 移除空的 B 级别（只保留 A1, A2, B1, B2）
    delete materialsData.B;

    // 保存到 JSON 文件
    fs.writeFileSync(outputPath, JSON.stringify(materialsData, null, 2), "utf-8");
    console.log(`\n数据已保存到: ${outputPath}`);

    // 统计信息
    let totalItems = 0;
    for (const level of Object.keys(materialsData)) {
        const levelData = materialsData[level];
        for (const module of Object.keys(levelData) as Array<keyof typeof levelData>) {
            totalItems += levelData[module].length;
        }
    }
    console.log(`\n总计: ${totalItems} 个内容条目`);
}

main().catch(console.error);
