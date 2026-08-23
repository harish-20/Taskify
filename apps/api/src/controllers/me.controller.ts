import { ApiResponse } from "@repo/shared/types";
import { RequestHandler } from "express";
import sharp from "sharp";

import s3 from "../configs/aws.js";
import { AWS_BUCKET_NAME } from "../configs/index.js";
import { updateUser } from "../services/user.service.js";
import { NotFound } from "../utils/CustomError.js";
import { sendResponse } from "../utils/response.js";

export const getMe: RequestHandler<{}, ApiResponse<Express.User>> = async (
  req,
  res,
  next,
) => {
  try {
    const user = req.userObj;

    if (user) {
      const payload: ApiResponse = {
        success: true,
        message: "User fetched successfully",
        data: user,
      };
      return sendResponse(res, 200, payload);
    } else {
      throw new NotFound("User not found");
    }
  } catch (error) {
    next(error);
  }
};

export const editMe: RequestHandler<{}, ApiResponse<Express.User>> = async (
  req,
  res,
  next,
) => {
  try {
    const user = req.userObj;

    if (!user) throw new NotFound("User not found");

    const { name } = req.body;
    const updatedUser = await updateUser(user._id, { name });

    const payload: ApiResponse = {
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    };
    return sendResponse(res, 200, payload);
  } catch (error) {
    next(error);
  }
};

export const updateAvatar: RequestHandler<
  {},
  ApiResponse<Express.User>,
  {}
> = async (req, res, next) => {
  try {
    const user = req.userObj;

    if (!user) throw new NotFound("User not found");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const optimizedAvatar = await sharp(req.file.buffer)
      .resize(256, 256, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 50 })
      .toBuffer();

    if (user.avatarUrl) {
      const avatarKey = user.avatarUrl.split("/").slice(-3).join("/");
      await s3
        .deleteObject({
          Bucket: AWS_BUCKET_NAME!,
          Key: avatarKey,
        })
        .promise();
    }

    const result = await s3
      .upload({
        Bucket: AWS_BUCKET_NAME!,
        Key: `avatars/${user._id}/${Date.now()}.webp`,
        Body: optimizedAvatar,
        ContentType: "image/webp",
        ACL: "public-read",
      })
      .promise();

    const updatedUser = await updateUser(user._id, {
      avatarUrl: result.Location,
    });

    const payload: ApiResponse = {
      success: true,
      message: "Avatar updated successfully",
      data: updatedUser,
    };
    return sendResponse(res, 200, payload);
  } catch (error) {
    next(error);
  }
};
