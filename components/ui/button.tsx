import * as React from "react";
import { Pressable, Text, View, type PressableProps } from "react-native";
import { cn } from "../../lib/utils";

interface ButtonProps extends PressableProps {
  className?: string;
}

const Button = React.forwardRef<View, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        className={cn(
          "bg-blue-500 px-4 py-2 rounded-md active:bg-blue-600",
          className
        )}
        {...props}
      >
        {typeof children === "string" ? (
          <Text className="text-white text-center font-medium">{children}</Text>
        ) : (
          children
        )}
      </Pressable>
    );
  }
);

Button.displayName = "Button";

export { Button, type ButtonProps };
