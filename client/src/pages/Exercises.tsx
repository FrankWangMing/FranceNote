import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { ExerciseCard } from "@/components/ExerciseCard";

interface Exercise {
  type: "multiple_choice" | "fill_blank" | "translation";
  question: string;
  options?: string[];
  correct?: number;
  explanation?: string;
  blanks?: string[];
  answer?: string;
  hint?: string;
}

interface TextExercises {
  textId: number;
  title: string;
  exercises: Exercise[];
}

interface ExercisesData {
  [level: string]: TextExercises[];
}

export default function Exercises() {
  const [exercisesData, setExercisesData] = useState<ExercisesData | null>(null);
  const [selectedLevel, setSelectedLevel] = useState("A1");
  const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(
    new Set()
  );

  // 加载练习题数据
  useEffect(() => {
    fetch("/exercises-data.json")
      .then((res) => res.json())
      .then((data) => {
        setExercisesData(data);
      })
      .catch((err) => console.error("Failed to load exercises:", err));
  }, []);

  const handleStartExercises = (textId: number) => {
    setSelectedTextId(textId);
    setStartTime(Date.now());
  };

  const handleBackToList = () => {
    setSelectedTextId(null);
    setStartTime(null);
  };

  const getElapsedTime = () => {
    if (!startTime) return "0分钟";
    const elapsed = Math.floor((Date.now() - startTime) / 60000);
    return `${elapsed}分钟`;
  };

  if (!exercisesData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <p className="text-gray-600">加载练习题中...</p>
        </div>
      </div>
    );
  }

  const currentLevelExercises = exercisesData[selectedLevel] || [];
  const selectedText =
    selectedTextId !== null
      ? currentLevelExercises[selectedTextId]
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/80 backdrop-blur-md">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  课文练习
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  巩固学习 · 检验理解 · 提升能力
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-12">
        {!selectedText ? (
          <div className="space-y-8">
            {/* 级别选择 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                选择学习级别
              </h2>
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

            {/* 课文列表 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                选择课文练习
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentLevelExercises.map((text, idx) => {
                  const exerciseCount = text.exercises.length;
                  return (
                    <Card
                      key={idx}
                      className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => handleStartExercises(idx)}
                    >
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                          {text.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {exerciseCount} 道练习题
                        </p>
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>包含选择题、填空题和翻译题</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span>预计需要 5-10 分钟</span>
                        </div>
                      </div>

                      <Button className="w-full" variant="default">
                        开始练习
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* 统计信息 */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-4">练习统计</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentLevelExercises.length}
                  </div>
                  <div className="text-sm text-gray-600">课文</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {currentLevelExercises.reduce(
                      (sum, text) => sum + text.exercises.length,
                      0
                    )}
                  </div>
                  <div className="text-sm text-gray-600">练习题</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedLevel}
                  </div>
                  <div className="text-sm text-gray-600">当前级别</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {completedExercises.size}
                  </div>
                  <div className="text-sm text-gray-600">已完成</div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 返回按钮和进度 */}
            <div className="flex items-center justify-between">
              <Button
                onClick={handleBackToList}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                返回课文列表
              </Button>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {selectedLevel} 级别 · {selectedText.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  用时：{getElapsedTime()}
                </p>
              </div>
            </div>

            {/* 练习题 */}
            <div className="space-y-6">
              {selectedText.exercises.map((exercise, idx) => (
                <ExerciseCard
                  key={idx}
                  exercise={exercise}
                  exerciseNumber={idx + 1}
                  totalExercises={selectedText.exercises.length}
                />
              ))}
            </div>

            {/* 完成提示 */}
            <Card className="p-6 bg-green-50 border-green-200 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                恭喜！您已完成所有练习
              </h3>
              <p className="text-gray-600 mb-6">
                总用时：{getElapsedTime()} · 继续加油！
              </p>
              <Button onClick={handleBackToList} className="w-full">
                返回课文列表
              </Button>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-16">
        <div className="container max-w-6xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>💪 通过练习巩固学习 · 📈 逐步提升法语水平</p>
          <p className="text-sm mt-2">
            最后更新：2026年1月 | 包含 A1-B2 完整练习题库
          </p>
        </div>
      </footer>
    </div>
  );
}
