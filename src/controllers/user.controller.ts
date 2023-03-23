import { NextFunction, Request, Response } from 'express';
import httpCodes from 'http-status-codes'
import Joi from 'joi'
import * as bcrypt from 'bcrypt';
import User from '../datamodels/User';
import Message from '../constant/message';
import { sign } from '../utils/jwt.utils';
import { UserDocument } from '../model/User';

class onBoardUserController {

  /**
     * @description Signup user takes firstname,lastname, email and password
     * @param  {Request} req
     * @param  {Response} res
     * @param  {NextFunction} next
     */
  public async userSignUp(req: Request, res: Response, next: NextFunction): Promise<any> {

    try {
      const { firstName, lastName, email, address, password } = req.body;
      User.findOne({ email: email })
        .then(async (userEmail: any) => {
          if (userEmail) {
            // ********* Existing User ********
            return res.status(httpCodes.CONFLICT).json({
              status: httpCodes.CONFLICT,
              message: Message.USER_EMAIL_EXIST,
            })
          } else {
            const NEW_USER = new User({
              firstName: firstName,
              lastName: lastName,
              email: email,
              address: address,
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
            });
            NEW_USER
              .save()
              .then((data: UserDocument) => {
                // ********* User Created *********
                if (data) {
                  const responseData = {
                    _id: data._id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    address: data.address,
                    status: data.status,
                    roleName: data.roleName
                  };

                  return res.status(httpCodes.OK).json({
                    status: httpCodes.OK,
                    data: responseData,
                    message: Message.USER_SIGNUP_SUCCESS,
                  })
                }
              })
              .catch((error) => {
                // ********* Rejected while saving to DB *********
                return res.status(httpCodes.BAD_REQUEST).json({
                  status: httpCodes.BAD_REQUEST,
                  error: error,
                  message: Message.SOMETHING_WENT_WRONG,
                })
              });
          }
        })
        .catch((error: any) => {
          // ********* Rejected while findOne *********
          return res.status(httpCodes.BAD_REQUEST).json({
            status: httpCodes.BAD_REQUEST,
            error: error,
            message: Message.SOMETHING_WENT_WRONG,
          })
        });
    } catch (error) {
      // ********* Error Occured *********
      return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
        status: httpCodes.INTERNAL_SERVER_ERROR,
        error: error,
        message: Message.SOMETHING_WENT_WRONG,
      })
    }
  }

  /**
    * @description login user through email and password.
    * @param  {express.Request} req
    * @param  {Response} res
    * @param  {NextFunction} next
    */
  public async userLogin(req: Request, res: Response, next: NextFunction): Promise<any> {

    try {
      const { email, password } = req.body
      // Validations
      const loginSchema = Joi.object().keys({
        email: Joi.string().email().required().messages({
          'string.empty': Message.EMAIL_REQUIRED,
        }),
        password: Joi.string().required().messages({
          'string.empty': Message.PASSWORD_REQUIRED,
        }),
      })
      const validateInp = loginSchema.validate({ email, password })
      const { value, error } = validateInp
      const isValid = error == null
      if (!isValid) {
        const { details } = error
        const message = details.map((val) => val.message).join(',')
        return res.status(httpCodes.BAD_REQUEST).json({
          code: httpCodes.BAD_REQUEST,
          message: message,
        })
      } else {
        let fetchUser: any = await User.findOne({
          email: email,
          isDeleted: false,
          roleName: Message.ROLE,
        })

        if (fetchUser.status == 'Disabled') {
          return res.status(httpCodes.FORBIDDEN).json({
            code: httpCodes.FORBIDDEN,
            message: Message.ACCOUNT_BLOCK,
          })
        }

        if (fetchUser) {

          bcrypt.compare(password, fetchUser.password, async (err: any, isMatch: any) => {

            if (isMatch) {
              let jwtToken = await sign(fetchUser.email, fetchUser.roleName);
              const userResult = {
                _id: fetchUser.id,
                firstName: fetchUser.firstName,
                lastName: fetchUser.lastName,
                role: fetchUser.roleName,
                token: jwtToken,
              }

              return res.status(httpCodes.OK).json({
                code: httpCodes.OK,
                data: userResult,
                message: Message.AUTH_SUCCESS,
              })

            } else {
              return res.status(httpCodes.BAD_REQUEST).json({
                code: httpCodes.BAD_REQUEST,
                message: Message.PASSWORD_INVALID
              })
            }
          });

        }
      }
    } catch (e) {
      return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
        code: httpCodes.INTERNAL_SERVER_ERROR,
        message: Message.SOMETHING_WENT_WRONG,
      })
    }
  }



  // static updateUser(requestObject: any) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       const { userId } = requestObject.params;
  //       const imageFile = requestObject.file;
  //       const { firstName, lastName, address } = requestObject.body;
  //       User.findOne({ _id: userId })
  //         .then(async (userEmail: any) => {
  //           if (userEmail) {
  //             const updateObject = {
  //               firstName: firstName,
  //               lastName: lastName,
  //               address: address,
  //               profilePic: imageFile ? imageFile.path : '',
  //             };
  //             User.updateOne(
  //               { _id: userId },
  //               { $set: updateObject },
  //               { new: true }
  //             )
  //               .then((data: any) => {
  //                 if (data) {
  //                   return resolve({
  //                     status: 200,
  //                     data: data,
  //                     success: true,
  //                     message: Message.USER_UPDATE_SUCCESS,
  //                   });
  //                 }
  //               })
  //               .catch((error: any) => {
  //                 return reject({
  //                   status: 400,
  //                   success: false,
  //                   error: error,
  //                   message: Message.UNABLE_UPDATE_USER,
  //                 });
  //               });
  //           } else {
  //             return resolve({
  //               status: 409,
  //               success: false,
  //               message: Message.USER_EMAIL_EXIST,
  //             });
  //           }
  //         })
  //         .catch((error: any) => {
  //           return reject({
  //             // ********* Rejected while findOne *********
  //             status: 400,
  //             success: false,
  //             error: error,
  //             message: Message.SOMETHING_WENT_WRONG,
  //           });
  //         });
  //     } catch (error) {
  //       return reject({
  //         // ********* Error Occured *********
  //         status: 500,
  //         success: false,
  //         message: Message.SOMETHING_WENT_WRONG,
  //       });
  //     }
  //   });
  // }


  // static updateUserStatus(requestObject: any) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       const { userId } = requestObject.params;
  //       const { status } = requestObject.body;
  //       User.findOne({ _id: userId })
  //         .then(async (userExists: any) => {
  //           if (userExists) {
  //             userExists.status = status;
  //             userExists.save().then((disableUser: any) => {
  //               if (disableUser) {
  //                 return resolve({
  //                   status: 200,
  //                   success: true,
  //                   message: `User ${status == 'Enable' ? 'Enable' : 'Disabled'
  //                     } Successfully`,
  //                 });
  //               }
  //             });
  //           } else {
  //             return reject({
  //               status: 404,
  //               success: false,
  //               message: Message.USER_NOT_FOUND,
  //             });
  //           }
  //         })
  //         .catch((error: any) => {
  //           return reject({
  //             status: 400,
  //             success: false,
  //             error: error,
  //             message: Message.SOMETHING_WENT_WRONG,
  //           });
  //         });
  //     } catch (error) {
  //       return reject({
  //         // ********* Error Occured *********
  //         status: 500,
  //         success: false,
  //         message: Message.SOMETHING_WENT_WRONG,
  //       });
  //     }
  //   });
  // }

  // static getAllUserList(request: any) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       const { page, size } = request.query;
  //       const { LIMIT, SKIP } = getPaginationDetails(request);
  //       User.aggregate([
  //         {
  //           $match: { roleName: { $in: ['User'] } },
  //         },
  //         {
  //           $project: {
  //             __v: 0,
  //             password: 0,
  //           },
  //         },
  //         { $sort: { createdAt: -1 } },
  //         {
  //           $facet: {
  //             stage1: [
  //               {
  //                 $group: {
  //                   _id: null,
  //                   count: { $sum: 1 },
  //                 },
  //               },
  //             ],
  //             stage2: [{ $skip: SKIP }, { $limit: LIMIT }],
  //           },
  //         },
  //         { $unwind: '$stage1' },
  //         {
  //           $project: {
  //             count: '$stage1.count',
  //             data: '$stage2',
  //           },
  //         },
  //       ])
  //         .then(async (user) => {
  //           if (user) {
  //             let data: any;
  //             let count: number = 0;
  //             user.map((response) => {
  //               (data = response.data), (count = response.count);
  //             });
  //             return resolve({
  //               status: 200,
  //               success: true,
  //               facets: {
  //                 page: parseInt(page) || 1,
  //                 size: parseInt(size) || 10,
  //                 count: count,
  //               },
  //               data: data,
  //               message: Message.USER_FETCH_SUCCESS,
  //             });
  //           }
  //         })
  //         .catch((error) => {
  //           return reject({
  //             status: 404,
  //             success: false,
  //             message: Message.UNABLE_FETCH_USERS,
  //           });
  //         });
  //     } catch (error) {
  //       return reject({
  //         status: 500,
  //         success: false,
  //         error: error,
  //         message: Message.SOMETHING_WENT_WRONG,
  //       });
  //     }
  //   });
  // }

}

export default new onBoardUserController()