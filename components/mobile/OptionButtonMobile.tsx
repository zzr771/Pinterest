// this component is only for mobile devices
"use client"
import { useMemo } from "react"
import { TfiMoreAlt } from "react-icons/tfi"
import Button from "../shared/Button"
import dynamic from "next/dynamic"
const OptionListMobile = dynamic(() => import("../mobile/OptionListMobile"), { ssr: false })
import { useAppDispatch, useAppSelector } from "@/lib/store/hook"
import { handleDownloadImage } from "@/lib/utils"
import { PinInfoDeep } from "@/lib/types"

export default function OptionButtonMobile({ pin }: { pin: PinInfoDeep }) {
  if (window.innerWidth >= 820) return null

  const user = useAppSelector((store) => store.user.user)
  const { imageUrl, title, author } = pin
  const intersectionState = useAppSelector((store) => store.intersection.observers.OptionButtonMobile)
  const options = useMemo(() => {
    const arr = [
      {
        label: "Download image",
        callback: () => {
          handleDownloadImage(imageUrl, title || "Pinterest")
        },
      },
    ]
    if (user?._id === author._id) {
      arr.push(
        ...[
          {
            label: "Edit Pin",
            callback: () => {},
          },
          { label: "Delete Pin", callback: () => {} },
        ]
      )
    }
    return arr
  }, [user])

  let visibilityClass = ""
  if (intersectionState === "enter-top") {
    visibilityClass = "visible"
  } else if (intersectionState === "leave-top") {
    visibilityClass = "invisible"
  }

  return (
    <div className={visibilityClass}>
      <OptionListMobile options={options}>
        <Button bgColor="translucent" rounded>
          <TfiMoreAlt className="w-5 h-5" />
        </Button>
      </OptionListMobile>
    </div>
  )
}
