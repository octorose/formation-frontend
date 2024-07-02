// components/BreadcrumbsComponent.js
"use client"; // This is necessary for client-side code in Next.js 13+

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

const BreadcrumbsComponent = ({  }) => {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const asPathWithoutQuery = pathname.split("?")[0];
    const asPathNestedRoutes = asPathWithoutQuery
      .split("/")
      .filter((v) => v.length > 0);

    const breadcrumbs = asPathNestedRoutes.map((subpath, idx) => {
      const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
      return {
        href,
        label: subpath.charAt(0).toUpperCase() + subpath.slice(1),
      };
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="mb-6 p-0 flex flex-col gap-3 sm:flex-col sm:items-start sm:justify-between">
      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              Dashboard /
            </Link>
          </li>
          {breadcrumbs.map((breadcrumb, idx) => (
            <li key={idx} className="font-medium">
              <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
              {idx < breadcrumbs.length - 1 && " / "}
            </li>
          ))}
          <li className="font-medium text-primary">
            {breadcrumbs.length > 0 && pathname.split("/").pop()}
          </li>
        </ol>
      </nav>
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {breadcrumbs.length > 0 && pathname.split("/").pop()}
      </h2>
    </div>
  );
};

export default BreadcrumbsComponent;
