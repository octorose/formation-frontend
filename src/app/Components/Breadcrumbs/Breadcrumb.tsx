import Link from "next/link";
interface BreadcrumbProps {
  pageName: string;
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <div className="mb-6 p-0 flex flex-col gap-3 sm:flex-col sm:items-start sm:justify-between">

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              Dashboard /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>
    </div>
  );
};

export default Breadcrumb;
