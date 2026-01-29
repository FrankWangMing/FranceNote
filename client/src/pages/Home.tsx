import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, BookOpen, Sparkles, BookMarked, Lightbulb, MessageSquare, Zap } from "lucide-react";
import { Streamdown } from "streamdown";
import { AudioPlayer } from "@/components/AudioPlayer";

interface ContentItem {
  section: string;
  subsection: string;
  content: string;
}

interface NotesData {
  [level: string]: {
    vocabulary: ContentItem[];
    grammar: ContentItem[];
    reading: ContentItem[];
    others: ContentItem[];
  };
}

export default function Home() {
  const [, navigate] = useLocation();
  const [notesData, setNotesData] = useState<NotesData | null>(null);
  const [selectedLevel, setSelectedLevel] = useState("A1");
  const [selectedType, setSelectedType] = useState("vocabulary");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<ContentItem[]>([]);

  // 加载笔记数据
  useEffect(() => {
    // 优先使用从 PDF 提取的数据，如果没有则使用旧数据
    Promise.all([
      fetch("/materials-data.json").catch(() => null),
      fetch("/notes-by-type.json").catch(() => null),
    ])
      .then(([materialsRes, notesRes]) => {
        if (materialsRes && materialsRes.ok) {
          return materialsRes.json();
        } else if (notesRes && notesRes.ok) {
          // 转换旧数据格式
          return notesRes.json().then((data: any) => {
            const converted: NotesData = {};
            for (const level in data) {
              converted[level] = {
                vocabulary: data[level].vocabulary || [],
                grammar: data[level].grammar || [],
                reading: data[level].texts || [],
                others: data[level].dialogues || [],
              };
            }
            return converted;
          });
        }
        throw new Error("无法加载数据");
      })
      .then((data) => {
        setNotesData(data);
      })
      .catch((err) => console.error("Failed to load notes:", err));
  }, []);

  // 搜索和过滤逻辑
  useEffect(() => {
    if (!notesData || !selectedLevel) return;

    const levelData = notesData[selectedLevel];
    if (!levelData) return;

    const typeData = levelData[selectedType as keyof typeof levelData] || [];
    const query = searchQuery.toLowerCase();

    const results = typeData.filter((item) => {
      return (
        query === "" ||
        item.section.toLowerCase().includes(query) ||
        item.subsection.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query)
      );
    });

    setFilteredItems(results);
  }, [selectedLevel, selectedType, searchQuery, notesData]);

  const typeConfig = {
    vocabulary: { label: "词汇", icon: BookMarked, color: "from-green-500 to-green-600" },
    grammar: { label: "语法", icon: Lightbulb, color: "from-blue-500 to-blue-600" },
    reading: { label: "阅读", icon: BookOpen, color: "from-purple-500 to-purple-600" },
    others: { label: "其他", icon: MessageSquare, color: "from-orange-500 to-orange-600" },
  };

  const currentTypeConfig = typeConfig[selectedType as keyof typeof typeConfig];
  const TypeIcon = currentTypeConfig.icon;

  // 从内容中提取法语短语进行发音
  const extractFrenchPhrases = (content: string): string[] => {
    const pattern = /\*\*([^*]+)\*\*\s*[：:]/g;
    const matches = [];
    let match;
    while ((match = pattern.exec(content)) !== null) {
      matches.push(match[1].trim());
    }
    return matches.slice(0, 5); // 限制每条笔记最多5个短语
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/80 backdrop-blur-md">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  法语学习笔记
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  深度复习 A1 → B2 完整学习路径 · 含标准发音
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span className="text-sm font-medium text-amber-700">
                  随时查阅
                </span>
              </div>
              <Button
                onClick={() => navigate("/exercises")}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Zap className="w-4 h-4" />
                <span>开始练习</span>
              </Button>
            </div>
          </div>

          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="搜索内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-12">
        {!notesData ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <BookOpen className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <p className="text-gray-600">加载笔记中...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 级别选择 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">选择学习级别</h2>
              <div className="inline-flex gap-2 bg-white p-2 rounded-lg border border-gray-200">
                {["A1", "A2", "B1", "B2"].map((level) => (
                  <Button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    variant={selectedLevel === level ? "default" : "outline"}
                    className="px-6 py-2 font-semibold"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            {/* 内容类型选择 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">选择学习内容</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(typeConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  const count = notesData[selectedLevel]?.[key as keyof typeof typeConfig]?.length || 0;
                  return (
                    <Button
                      key={key}
                      onClick={() => setSelectedType(key)}
                      variant={selectedType === key ? "default" : "outline"}
                      className={`h-auto py-4 flex flex-col items-center gap-2 ${
                        selectedType === key ? `bg-gradient-to-br ${config.color} text-white` : ""
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <div className="text-center">
                        <div className="font-semibold">{config.label}</div>
                        <div className="text-xs opacity-75">{count} 个条目</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* 内容展示 */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 bg-gradient-to-br ${currentTypeConfig.color} rounded-lg`}>
                  <TypeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentTypeConfig.label}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedLevel} 级别 · {filteredItems.length} 个条目
                  </p>
                </div>
              </div>

              {filteredItems.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                  <p className="text-gray-500 text-lg">
                    {searchQuery
                      ? "未找到匹配的内容，请尝试其他关键词"
                      : "暂无笔记内容"}
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredItems.map((item, idx) => {
                    const frenchPhrases = extractFrenchPhrases(item.content);
                    return (
                      <Card
                        key={idx}
                        className={`p-6 border-l-4 hover:shadow-lg transition-shadow border-l-${
                          selectedType === "vocabulary"
                            ? "green"
                            : selectedType === "grammar"
                            ? "blue"
                            : selectedType === "reading"
                            ? "purple"
                            : "orange"
                        }-500`}
                      >
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {item.section}
                            </h3>
                            <h4 className={`text-sm font-semibold ${
                              selectedType === "vocabulary"
                                ? "text-green-600"
                                : selectedType === "grammar"
                                ? "text-blue-600"
                                : selectedType === "reading"
                                ? "text-purple-600"
                                : "text-orange-600"
                            } uppercase tracking-wide`}>
                              {item.subsection}
                            </h4>
                          </div>
                          {/* 主要内容发音按钮 */}
                          {frenchPhrases.length > 0 && (
                            <div className="ml-4 flex flex-wrap gap-2 justify-end">
                              {frenchPhrases.map((phrase, i) => (
                                <AudioPlayer
                                  key={i}
                                  text={phrase}
                                  className="text-xs"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="prose prose-sm max-w-none text-gray-700">
                          <Streamdown>{item.content}</Streamdown>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-16">
        <div className="container max-w-6xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>
            🔊 点击发音按钮听标准法语发音 · 💡 选择级别和内容类型快速定位学习材料
          </p>
          <p className="text-sm mt-2">
            最后更新：2026年1月 | 包含 A1-B2 完整学习内容 + 标准发音
          </p>
        </div>
      </footer>
    </div>
  );
}
