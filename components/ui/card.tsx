import * as React from "react";
import { View, Text, type ViewProps, type TextProps } from "react-native";
import { cn } from "../../lib/utils";

interface CardProps extends ViewProps {
  className?: string;
}

const Card = React.forwardRef<View, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn("bg-white rounded-lg shadow-md p-4", className)}
        {...props}
      >
        {children}
      </View>
    );
  }
);

Card.displayName = "Card";

const CardHeader = React.forwardRef<View, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <View ref={ref} className={cn("mb-4", className)} {...props}>
        {children}
      </View>
    );
  }
);

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<Text, TextProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        className={cn("text-xl font-bold text-gray-800", className)}
        {...props}
      >
        {children}
      </Text>
    );
  }
);

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<Text, TextProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        className={cn("text-sm text-gray-600", className)}
        {...props}
      >
        {children}
      </Text>
    );
  }
);

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<View, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <View ref={ref} className={cn("", className)} {...props}>
        {children}
      </View>
    );
  }
);

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<View, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <View ref={ref} className={cn("mt-4", className)} {...props}>
        {children}
      </View>
    );
  }
);

CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
};
