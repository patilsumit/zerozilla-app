import { Request, Response, NextFunction } from 'express';
import httpCodes from 'http-status-codes'
import Message from '../constant/message';
import User from '../datamodels/User';
import { decode } from '../utils/jwt.utils';

export const isAuth = (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : '';
    if (!token) {
      return res
        .status(httpCodes.FORBIDDEN)
        .json({ status: httpCodes.FORBIDDEN, message: Message.TOKEN_MISSING });
    }

    decode(token)
      .then(async (payload: any) => {
        
        let userCheck = await User.findOne(
          {
            email: payload.email,
            roleName: 'User'
          },
          '-__v -password'
        )
        
        if (!userCheck) {
          return res.status(httpCodes.FORBIDDEN).send({
            status: httpCodes.FORBIDDEN,
            message: Message.TOKEN_NOT_ALLOW
          });
        }
         else {
          req.user = userCheck
        }
       next()
      })
      .catch((err) => {
        return res.status(httpCodes.FORBIDDEN).send({
          status: httpCodes.FORBIDDEN,
          message: Message.TOKEN_EXPIRE
        });
      });
  } catch (error) {
    res
      .status(httpCodes.UNAUTHORIZED)
      .json({ sessionValid: false, message: Message.TOKEN_EXPIRE });
  }
};

