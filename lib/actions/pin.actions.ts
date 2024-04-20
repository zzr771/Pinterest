"use server"

import Pin from "../models/pin.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import { getErrorMessage } from "../utils"
import { RequestError, PinDraft, PinParams } from "../types"

export async function createPins(userId: string, drafts: PinDraft[]): Promise<PinParams[] | RequestError> {
  connectToDB()
  try {
    const newPins = drafts.map((item) => ({
      author: userId,
      imageUrl: item.imageUrl,
      imageSize: item.imageSize,
      title: item.title,
      description: item.description,
      link: item.link,
      createdAt: Date.now(),
    }))
    const [res, user] = await Promise.all([Pin.insertMany(newPins), User.findById(userId)])
    const pinIds = res.map((item) => item._id)

    const draftIds = drafts.map((item) => item._id)
    user.drafts = user.drafts.filter((item: PinDraft) => !draftIds.includes(item._id))
    user.created.push([...pinIds])
    await user.save()
    return JSON.parse(JSON.stringify(res))
  } catch (error) {
    return {
      errorMessage: getErrorMessage(error),
    }
  }
}