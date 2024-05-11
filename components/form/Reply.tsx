import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../shadcn/form" // 这些组件来自库 shadcn
import { Textarea } from "../shadcn/textarea"
import Button from "../shared/Button"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { CommentValidation } from "@/lib/validations/comment"
import { useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hook"
import { useMutation } from "@apollo/client"
import { handleApolloRequestError } from "@/lib/utils"
import { setPinComments } from "@/lib/store/features/pinInfo"
import { CommentInfo } from "@/lib/types"
import { COMMENT } from "@/lib/apolloRequests/comment.request"
import { usePathname } from "next/navigation"

interface Props {
  setShowReplyInput: React.Dispatch<React.SetStateAction<boolean>>
  replyTo: CommentInfo
  rootCommentId: string
}
export default function Reply({ setShowReplyInput, replyTo, rootCommentId }: Props) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((store) => store.user.user)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus()
    }
  }, [])
  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      comment: "",
    },
  })
  // watch user input and render the "save" button correspondingly
  const userInput: string = form.watch("comment")

  const pinId = usePathname().split("/").pop()
  const [commentMutation] = useMutation(COMMENT, {
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })

  async function onSubmit(values: z.infer<typeof CommentValidation>) {
    const isValid = await form.trigger()
    if (!isValid || !user) return

    const {
      data: { comment: res },
    } = await commentMutation({
      variables: {
        input: {
          pinId,
          userId: user._id,
          content: values.comment,
          isReply: true,
          replyToUser: replyTo.isReply ? replyTo.author._id : null,
          replyToComment: rootCommentId,
        },
      },
    })
    dispatch(setPinComments(res))
    setShowReplyInput(false)
    form.reset()
  }

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="flex gap-3 items-center w-full">
              <FormControl className="border-none bg-transparent">
                <Textarea
                  className="resize-none border-solid border-gray-bg-4 rounded-2xl no-focus"
                  rows={2}
                  placeholder="Reply"
                  {...field}
                  ref={textAreaRef}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end mt-4 gap-2">
          <Button
            text="Cancel"
            size="small"
            bgColor="gray"
            className="py-5"
            hover
            clickEffect
            click={() => {
              setShowReplyInput(false)
            }}
          />
          <Button
            text="Save"
            size="small"
            clickEffect={userInput.length > 0}
            bgColor={userInput.length > 0 ? "red" : "gray"}
            hover={userInput.length > 0}
            className={`py-5 ${userInput.length === 0 && "text-gray-font-4"}`}
            click={form.handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </Form>
  )
}
