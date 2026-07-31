"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";

type Props = Omit<ImageProps, "src"> & {
  src: ImageProps["src"];
  fallbackSrc?: ImageProps["src"];
};

export function SafeImage({
  src,
  fallbackSrc,
  alt,
  onError,
  fill,
  className,
  style,
  ...props
}: Props) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(true);
      return;
    }

    onError?.(event);
  };

  const isPublicPath =
    typeof currentSrc === "string" && currentSrc.startsWith("/");

  if (isPublicPath) {
    return (
      <img
        {...props}
        src={currentSrc}
        alt={alt}
        onError={handleError}
        className={className}
        style={
          fill
            ? {
                ...style,
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }
            : style
        }
      />
    );
  }

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={handleError}
      unoptimized
      fill={fill}
      className={className}
      style={style}
    />
  );
}
