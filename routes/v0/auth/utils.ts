import { Response } from 'express';
import sharp from 'sharp';
import { Socket } from 'socket.io';
import IamModel from '../../../models/iam';
import { Logger, axios } from '../../../middleware';
import { Discrord } from '../../../models/user/user.model';
import { Profile, UserDocument } from '../../../models/user/user.model';

export const withIp = async (res: Response, discord: Discrord | undefined) => {
  try {
    const iam = await IamModel.findOne({});
    const ip = iam?.ip || [];
    const ueCallbackUrl = process.env.UE_CALLBACK_URL as string;

    if (ueCallbackUrl) {
      await axios.post(ueCallbackUrl, { ip, user: discord ?? {} });
    }
    return res.redirect(process.env.REDIRECT_URL as string);
  } catch (error) {
    Logger.Instance.error((<Error>error).message);
    return res.status(400).send({ error: (<Error>error).message });
  }
};

export const getBase64AvatarFromProfile = async (user: UserDocument) => {
  try {
    const profile = user.oauth.discord?.profile as Profile;
    const { id, avatar } = profile;
    const avatarBase64 = await toBase64ByAvatar(id, avatar);

    return avatarBase64;
  } catch (error) {
    return '';
  }
};

export const toBase64ByAvatar = async (id: string, avatar: string) => {
  try {
    const avatarStr = `https://cdn.discordapp.com/avatars/${id}/${avatar}`;
    const img = await toBase64(avatarStr);
    return img;
  } catch (error) {
    Logger.Instance.error((<Error>error).message);
    return '';
  }
};

export const toBase64 = async (url: string) => {
  try {
    const response = await axios({
      url,
      responseType: 'arraybuffer',
    });

    const image = await sharp(response.data).toBuffer();
    return `data:image/jpeg;base64,${image.toString('base64')}`;
  } catch (error) {
    Logger.Instance.error((<Error>error).message);
    return '';
  }
};

export const emitUserSending = async (io: Socket, user: UserDocument, eventName = 'get-user') => {
  try {
    const avatarBase64 = await getBase64AvatarFromProfile(user);

    io?.emit(eventName, {
      user: {
        email: user.email,
        username: user.username,
        oauth: {
          ...user.oauth.discord,
          profile: {
            ...user.oauth.discord?.profile,
            avatarBase64,
          },
          refreshToken: user.refreshToken,
        },
      },
    });
  } catch (error) {
    io?.emit(eventName, { error: (<Error>error).message });
  }
  return;
};
