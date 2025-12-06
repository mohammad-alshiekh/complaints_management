declare module "next/link" {
  import { ComponentProps } from "react";
  import { UrlObject } from "url";

  type Url = string | UrlObject;

  interface LinkProps extends Omit<ComponentProps<"a">, "href"> {
    href: Url;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    prefetch?: boolean;
    locale?: string | false;
  }

  const Link: React.ForwardRefExoticComponent<
    LinkProps & React.RefAttributes<HTMLAnchorElement>
  >;

  export default Link;
}

