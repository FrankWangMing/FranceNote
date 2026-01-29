import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, AlertCircle, Volume2 } from "lucide-react";
import { AudioPlayer } from "@/components/AudioPlayer";

interface MultipleChoiceExercise {
  type: "multiple_choice";
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface FillBlankExercise {
  type: "fill_blank";
  question: string;
  blanks: string[];
  hint: string;
}

interface TranslationExercise {
  type: "translation";
  question: string;
  answer: string;
  hint: string;
}

type Exercise = MultipleChoiceExercise | FillBlankExercise | TranslationExercise;

interface ExerciseCardProps {
  exercise: any;
  exerciseNumber: number;
  totalExercises: number;
}

export function ExerciseCard({
  exercise,
  exerciseNumber,
  totalExercises,
}: ExerciseCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [userTranslation, setUserTranslation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleMultipleChoice = (index: number) => {
    if (!submitted) {
      setSelectedAnswer(index);
    }
  };

  const handleFillBlank = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setUserAnswers([]);
    setUserTranslation("");
    setSubmitted(false);
    setShowHint(false);
  };

  const isCorrect = () => {
    if (exercise.type === "multiple_choice") {
      return selectedAnswer === exercise.correct;
    } else if (exercise.type === "fill_blank") {
      return userAnswers.every(
        (answer, idx) =>
          answer.toLowerCase().trim() ===
          exercise.blanks[idx].toLowerCase().trim()
      );
    } else if (exercise.type === "translation") {
      return (
        userTranslation.toLowerCase().trim() ===
        exercise.answer.toLowerCase().trim()
      );
    }
    return false;
  };

  return (
    <Card className="p-6 border-l-4 border-l-blue-500">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">
            练习题 {exerciseNumber}/{totalExercises}
          </h3>
          <span className="text-sm font-medium text-gray-600">
            {exercise.type === "multiple_choice"
              ? "单选题"
              : exercise.type === "fill_blank"
              ? "填空题"
              : "翻译题"}
          </span>
        </div>

        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
          <p className="text-gray-800 font-medium">{exercise.question}</p>
        </div>
      </div>

      {/* 单选题 */}
      {exercise.type === "multiple_choice" && (
        <div className="space-y-3 mb-6">
          {exercise.options?.map((option: string, idx: number) => {
            const isSelected = selectedAnswer === idx;
            const isCorrectOption = idx === exercise.correct;
            const showResult = submitted && isSelected;
            const showCorrect = submitted && isCorrectOption && !isSelected;

            return (
              <button
                key={idx}
                onClick={() => handleMultipleChoice(idx)}
                disabled={submitted}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  isSelected
                    ? showResult
                      ? isCorrect()
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-blue-500 bg-blue-50"
                    : showCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${submitted ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{option}</span>
                  {showResult && isCorrect() && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  {showResult && !isCorrect() && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  {showCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 填空题 */}
      {exercise.type === "fill_blank" && (
        <div className="space-y-4 mb-6">
          <p className="text-gray-700 whitespace-pre-wrap">
            {exercise.question}
          </p>
          <div className="space-y-3">
            {exercise.blanks?.map((blank: string, idx: number) => (
              <div key={idx}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  空白 {idx + 1}
                </label>
                <Input
                  type="text"
                  placeholder={`请填写第 ${idx + 1} 个空白`}
                  value={userAnswers[idx] || ""}
                  onChange={(e) => handleFillBlank(idx, e.target.value)}
                  disabled={submitted}
                  className={
                    submitted
                      ? userAnswers[idx]?.toLowerCase().trim() ===
                        blank.toLowerCase().trim()
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : ""
                  }
                />
                {submitted && (
                  <div className="mt-1 flex items-center gap-2">
                    {userAnswers[idx]?.toLowerCase().trim() ===
                    blank.toLowerCase().trim() ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm text-gray-600">
                      {userAnswers[idx]?.toLowerCase().trim() ===
                      blank.toLowerCase().trim()
                        ? "正确"
                        : `正确答案：${blank}`}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 翻译题 */}
      {exercise.type === "translation" && (
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <Volume2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="font-medium text-gray-900 mb-2">
                {exercise.question}
              </p>
              <AudioPlayer text={exercise.question} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              请翻译为中文
            </label>
            <Input
              type="text"
              placeholder="请输入翻译..."
              value={userTranslation}
              onChange={(e) => setUserTranslation(e.target.value)}
              disabled={submitted}
              className={
                submitted
                  ? userTranslation.toLowerCase().trim() ===
                    exercise.answer.toLowerCase().trim()
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                  : ""
              }
            />
            {submitted && (
              <div className="mt-2 flex items-center gap-2">
                {userTranslation.toLowerCase().trim() ===
                exercise.answer.toLowerCase().trim() ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm text-gray-600">
                  {userTranslation.toLowerCase().trim() ===
                  exercise.answer.toLowerCase().trim()
                    ? "正确"
                    : `正确答案：${exercise.answer}`}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 提示和反馈 */}
      {submitted && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 mb-1">
                {exercise.type === "multiple_choice"
                  ? (exercise as MultipleChoiceExercise).explanation
                  : (exercise as FillBlankExercise | TranslationExercise).hint}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 按钮 */}
      <div className="flex gap-3">
        {!submitted ? (
          <>
            <Button onClick={handleSubmit} className="flex-1">
              提交答案
            </Button>
            <Button
              onClick={() => setShowHint(!showHint)}
              variant="outline"
              className="flex-1"
            >
              {showHint ? "隐藏提示" : "显示提示"}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleReset} className="flex-1">
              重新做题
            </Button>
            <div className="flex-1 flex items-center justify-center">
              {isCorrect() ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">答对了！</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">答错了，再试试</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
