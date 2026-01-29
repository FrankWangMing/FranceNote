import { useState, useRef } from "react";
import { Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  text: string;
  className?: string;
}

export function AudioPlayer({ text, className = "" }: AudioPlayerProps) {
  const [isPlaying, isSetPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handlePlay = async () => {
    // 如果正在播放，停止播放
    if (isPlaying) {
      window.speechSynthesis.cancel();
      isSetPlaying(false);
      return;
    }

    setIsLoading(true);
    isSetPlaying(true);

    try {
      // 创建语音合成对象
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR";
      utterance.rate = 0.9; // 稍微放慢速度，便于学习
      utterance.pitch = 1;
      utterance.volume = 1;

      // 设置播放结束回调
      utterance.onend = () => {
        isSetPlaying(false);
      };

      utterance.onerror = () => {
        isSetPlaying(false);
      };

      utteranceRef.current = utterance;
      setIsLoading(false);

      // 播放语音
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("播放音频失败:", error);
      isSetPlaying(false);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePlay}
      variant="ghost"
      size="sm"
      className={`inline-flex items-center gap-1.5 px-2 py-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors ${className}`}
      title={isPlaying ? "停止播放" : "播放发音"}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Volume2 className={`w-4 h-4 ${isPlaying ? "text-blue-700" : ""}`} />
      )}
      <span className="text-xs font-medium">
        {isLoading ? "加载中..." : isPlaying ? "停止" : "发音"}
      </span>
    </Button>
  );
}
