import { classNames } from "../utils/classStringify";
import Link from "next/link";
import { useMemo } from "react";
import { RouterOutputs } from "src/utils/api";
import { useSession } from "next-auth/react";
import { AuthorWithDate } from "./authorWithDate";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import {
  ChevronRightIcon,
  HeartIcon,
  HeartFilledIcon,
  MessageIcon,
} from "./icons";
import { summarize } from "src/utils/text";
import { Root, Trigger, Content, Arrow } from "@radix-ui/react-tooltip";
import { MAX_LIKED_BY_SHOWN } from "./like";

export type PostFeedProps = {
  post: RouterOutputs["post"]["feedPosts"][];
  hideAuthor?: boolean;
  onLike: () => void;
  onUnlike: () => void;
};

export const PostFeed = ({
  post,
  hideAuthor = false,
  onLike,
  onUnlike,
}: PostFeedProps) => {


  const { summary, hasMore } = useMemo(
    () => summarize(post.posts.content),
    [post?.posts.content]
  );
  const { data: session } = useSession();

  const isLikedByCurrentUser = Boolean(
    post?.posts.likedBy.id === session?.user?.id   
  )
  const likeCount = post?.posts.likedBy.id.length


  return (
    <div className={classNames(post?.posts.hidden ? 'opacity-50' : '')}>
        <Link href={`/post/${post?.posts}`}>
          <a>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {post?.posts.title}
            </h2>
          </a>
        </Link>

        <div className={classNames(hideAuthor ? 'mt-2' : 'mt-6')}>
          {hideAuthor ? (
            <p className="tracking-tight text-secondary">
              <time dateTime={post?.posts.createdAt.toISOString()}>
                {formatDistanceToNow(post?.posts.createdAt)}
              </time>{' '}
              ago
            </p>
          ) : (
            <AuthorWithDate author={post?.posts.author} date={post?.posts.createdAt} />
          )}
        </div>


        <div className="flex items-center gap-4 mt-4 clear-both">
          {hasMore && (
            <Link href={`/post/${post?.posts.id}`}>
              <a className="inline-flex items-center font-medium transition-colors text-blue">
                Continue reading <ChevronRightIcon className="w-4 h-4 ml-1" />
              </a>
            </Link>
          )}
          <div className="ml-auto flex gap-6">
            <Root delayDuration={300}>
              <Trigger
                asChild
                onClick={(event) => {
                  event.preventDefault()
                }}
                onMouseDown={(event) => {
                  event.preventDefault()
                }}
              >
                <div className="inline-flex items-center gap-1.5">
                  {isLikedByCurrentUser ? (
                    <HeartFilledIcon className="w-4 h-4 text-red" />
                  ) : (
                    <HeartIcon className="w-4 h-4 text-red" />
                  )}
                  <span className="text-sm font-semibold tabular-nums">
                    {likeCount}
                  </span>
                </div>
              </Trigger>
              <Content
                side="bottom"
                sideOffset={4}
                className={classNames(
                  'max-w-[260px] px-3 py-1.5 rounded shadow-lg bg-secondary-inverse text-secondary-inverse sm:max-w-sm',
                  likeCount === 0 && 'hidden'
                )}
              >
                <p className="text-sm">
                  {post?.posts.likedBy
                    .slice(0, MAX_LIKED_BY_SHOWN)
                    .map((item) =>
                      item.user.id === session?.user?.id ? 'You' : item.user.name
                    )
                    .join(', ')}
                  {likeCount > MAX_LIKED_BY_SHOWN &&
                    ` and ${likeCount - MAX_LIKED_BY_SHOWN} more`}
                </p>
                <Arrow
                  offset={22}
                  className="fill-gray-800 dark:fill-gray-50"
                />
              </Content>
            </Root>

            <div className="inline-flex items-center gap-1.5">
              <MessageIcon className="w-4 h-4 text-secondary" />
              <span className="text-sm font-semibold tabular-nums">
                {post?.posts._count.comments}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
};
