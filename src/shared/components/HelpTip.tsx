import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { cn } from "@/shared/lib/utils";

interface Props {
  text: string;
  children: ReactNode;
}

// "설명 툴팁 있음" 표시 = 점선 밑줄. 트리거 children 에 자동으로 입힌다.
const HINT_UNDERLINE = "underline decoration-dotted decoration-foreground-subtle/50 underline-offset-4";

// 필드명 등에 감싸 커서를 올리면(지연 후) 설명 툴팁을 띄운다.
// 지연시간은 앱 루트 TooltipProvider 의 delayDuration 으로 제어.
export const HelpTip = ({ text, children }: Props) => {
  const trigger = isValidElement<{ className?: string }>(children)
    ? cloneElement(children as ReactElement<{ className?: string }>, {
        className: cn(children.props.className, HINT_UNDERLINE),
      })
    : children;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs leading-relaxed">{text}</TooltipContent>
    </Tooltip>
  );
};
