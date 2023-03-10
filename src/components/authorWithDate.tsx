import { Avatar } from "./avatar";
import type { Author } from "../utils/types";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import Link from "next/link";

type AuthorWithDateProps = {
  author: Author;
  date: Date;
};

export const AuthorWithDate = ({ author, date }: AuthorWithDateProps) => {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <Link className="relative inline-flex" href={`/profile/${author.id}`}>
        <span className="hidden sm:flex">
          <Avatar name={author.nickname} src={author.image} />
        </span>
        <span className="flex sm:hidden">
          <Avatar name={author.nickname} src={author.image} size="sm" />
        </span>
      </Link>
      <div className="flex-1 text-sm sm:text-base">
        <div>
          <Link href={`/profile/${author.id}`}>{author.nickname}</Link>
        </div>
        <p className="tracking-tight text-secondary">
          <time dateTime={date.toISOString()}>{formatDistanceToNow(date)}</time>{" "}
          ago.
        </p>
      </div>
    </div>
  );
};
