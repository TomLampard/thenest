import { SearchIcon, SpinnerIcon } from "../components/icons";
import { classNames } from "../utils/classStringify";
import { InferQueryPostOutput, api } from "../utils/api";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDebounce } from "../utils/useDebounce";
import { ItemOptions, useItemList } from "use-item-list";
import { stringifiedJson } from "aws-sdk/clients/customerprofiles";
import { Post } from "@prisma/client";
import { useRef, useState } from "react";


type SearchProps = {
  isOpen: boolean
  onClose: () => void
}

const SearchResult = ({
  useItem,
  result
}: {
  useItem: ({ ref, text, value, disabled }: ItemOptions) => {
    id: string
    index: number
    highlight: () => void
    select: () => void
    useHighlighted: () => boolean
  }
  result: InferQueryPostOutput["post"][number]
}) => {
  const ref = useRef<HTMLLIElement>(null)
  const { id, index, highlight, select, useHighlighted } = useItem({
    ref,
    value: result,
  })
  const highlighted = useHighlighted()

  return (
    <li ref={ref} id={id} onMouseEnter={highlight} onClick={select}>
      <Link href={`/post/${result.id}`}>
        <a
          className={classNames("block py-3.5 pl-10 transition-colors leading-tight",
          highlighted && "bg-blue-600 text-white"
          )}
        >
          {result.title}
        </a>
      </Link>
    </li>
  )
}

const SearchField = ({ onSelect }: { onSelect: () => void}) => {
  const [value, setValue] = useState("")
  const [debouncedValue] = useDebounce(value, 1000)
  const router = useRouter()

  const feedQuery = api.post.feedPosts.useQuery
  
  
  
  
  
  
  
  return 
}

