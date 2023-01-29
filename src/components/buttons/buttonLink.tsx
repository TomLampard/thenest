import type { ButtonVariant } from "./button";
import type { ComponentPropsWithoutRef } from "react";
import type { LinkProps } from "next/link";
import { Button } from "./button";
import Link from "next/link";
import { forwardRef } from "react";

type ButtonLinkProps = {
  variant?: ButtonVariant;
  responsive?: boolean;
} & Omit<ComponentPropsWithoutRef<"a">, "href"> &
  LinkProps;

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      href,
      as,
      replace,
      scroll,
      shallow,
      passHref,
      prefetch,
      locale,
      className,
      variant = "primary",
      responsive,
    },
    forwardedRef
  ) => {
    return (
      <Button variant={variant} responsive={responsive} className={className}>
        <Link
          href={href}
          as={as}
          replace={replace}
          scroll={scroll}
          shallow={shallow}
          passHref={passHref}
          prefetch={prefetch}
          locale={locale}
          ref={forwardedRef}
        ></Link>
      </Button>
    );
  }
);

ButtonLink.displayName = "ButtonLink";
