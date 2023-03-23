import { NextFunction, Request, Response } from 'express';
import httpCodes from 'http-status-codes'
import Joi from 'joi'
import Agency from '../datamodels/Agency';
import Client from '../datamodels/Client';
import Message from '../constant/message';

import { AgencyDocument } from '../model/Agency';
import { ClientDocument } from '../model/Client';

class onAgencyController {

    /**
       * @description Create agency with clients
       * @param  {Request} req
       * @param  {Response} res
       * @param  {NextFunction} next
       */
    public async createAgencyClients(req: Request, res: Response, next: NextFunction): Promise<any> {

        try {
            const { agencyName, address_1, address_2, state, city, phoneNumber, clients } = req.body;

            // Validations
            const AgencySchema = Joi.object().keys({
                agencyName: Joi.string().required().messages({
                    'string.empty': Message.EMAIL_REQUIRED,
                }),
                address_1: Joi.string().required().messages({
                    'string.empty': Message.PASSWORD_REQUIRED,
                }),
                address_2: Joi.string().required().messages({
                    'string.empty': Message.PASSWORD_REQUIRED,
                }).optional(),
                state: Joi.string().required().messages({
                    'string.empty': Message.PASSWORD_REQUIRED,
                }),
                city: Joi.string().required().messages({
                    'string.empty': Message.PASSWORD_REQUIRED,
                }),
                phoneNumber: Joi.number().required().messages({
                    'string.empty': Message.PHONE_NUMBER_REQUIRED
                }),
                clients: Joi.array().items(Joi.object()
                    .keys({
                        name: Joi.string().required().messages({
                            'string.empty': Message.CLIENT_NAME_REQUIRED,
                        }),
                        email: Joi.string().email().required().messages({
                            'string.empty': Message.EMAIL_FORMAT_NOT_VALID,
                        }),
                        phoneNumber: Joi.number().required().messages({
                            'number.empty': Message.PHONE_NUMBER_REQUIRED,
                        }),
                        totalBill: Joi.number().required().messages({
                            'number.empty': Message.TOTAL_BILL_REQUIRED,
                        })
                    })).optional()
            })
            const validateInp = AgencySchema.validate({ agencyName, address_1, address_2, state, city, phoneNumber, clients })
            const { value, error } = validateInp
            const isValid = error == null
            if (!isValid) {
                const { details } = error
                const message = details.map((val) => val.message).join(',')
                return res.status(httpCodes.BAD_REQUEST).json({
                    code: httpCodes.BAD_REQUEST,
                    message: message,
                })
            }
            Agency.findOne({ name: agencyName })
                .then(async (agencyData: any) => {
                    if (agencyData) {
                        // ********* Existing Agency ********
                        return res.status(httpCodes.CONFLICT).json({
                            status: httpCodes.CONFLICT,
                            message: Message.AGENCY_ALREADY_EXIST
                        })
                    } else {
                        const NEW_AGENCY = new Agency({
                            name: agencyName,
                            address_1: address_1,
                            address_2: address_2,
                            state: state,
                            city: city,
                            phoneNumber: phoneNumber
                        });
                        NEW_AGENCY
                            .save()
                            .then(async (agencyData: AgencyDocument) => {
                                // ********* Agency Created *********
                                if (agencyData) {
                                    if (clients?.length > 0 && clients) {
                                        let saveArr: any = []
                                        clients.forEach((element: ClientDocument) => {
                                            let addObj: any = {}

                                            addObj.name = element.name
                                            addObj.email = element.email
                                            addObj.agencyId = agencyData._id
                                            addObj.phoneNumber = element.phoneNumber
                                            addObj.totalBill = element.totalBill
                                            saveArr.push(addObj)
                                        })
                                        // ********* Clients Created *********
                                        let clientsData = await Client.create(saveArr)

                                        return res.status(httpCodes.OK).json({
                                            status: httpCodes.OK,
                                            data: { agencyData, clientsData },
                                            message: Message.AGENCY_CLIENTS_CREATED
                                        })
                                    } else {
                                        return res.status(httpCodes.OK).json({
                                            status: httpCodes.OK,
                                            data: agencyData,
                                            message: Message.AGENCY_CREATED
                                        })
                                    }
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
       * @description update client by ID
       * @param  {Request} req
       * @param  {Response} res
       * @param  {NextFunction} next
       */
    public async updateClient(req: Request, res: Response, next: NextFunction): Promise<any> {

        try {
            const { name, email, phoneNumber, totalBill } = req.body;
            const { clientId } = req.params
            // Validations
            const ClientSchema = Joi.object().keys({
                name: Joi.string().required().messages({
                    'string.empty': Message.CLIENT_NAME_REQUIRED,
                }),
                email: Joi.string().required().messages({
                    'string.empty': Message.EMAIL_FORMAT_NOT_VALID
                }),
                phoneNumber: Joi.number().required().messages({
                    'number.empty': Message.PHONE_NUMBER_REQUIRED
                }),
                totalBill: Joi.number().required().messages({
                    'number.empty': Message.TOTAL_BILL_REQUIRED
                }),
            })
            const validateInp = ClientSchema.validate({ name, email, phoneNumber, totalBill })
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
                let existCheck = await Client.findOne({ _id: clientId })
                if (existCheck) {
                    let updateObject = {
                        name: name,
                        email: email,
                        phoneNumber: phoneNumber,
                        totalBill: Number(totalBill)
                    }
                    let updateClient = await Client.findOneAndUpdate(
                        { _id: clientId },
                        { $set: updateObject },
                        { new: true }
                    )
                    if (updateClient) {
                        return res.status(httpCodes.OK).json({
                            code: httpCodes.OK,
                            data: updateClient,
                            message: Message.CLIENT_UPDATED
                        })
                    } else {
                        return res.status(httpCodes.BAD_REQUEST).json({
                            code: httpCodes.BAD_REQUEST,
                            message: Message.CLIENT_NOT_UPDATED
                        })
                    }
                } else {
                    return res.status(httpCodes.NOT_FOUND).json({
                        code: httpCodes.NOT_FOUND,
                        message: Message.CLIENT_NOT_FOUND
                    })
                }
            }
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
       * @description Get clients 
       * @param  {Request} req
       * @param  {Response} res
       * @param  {NextFunction} next
       */
    public async getTopBillClient(req: Request, res: Response, next: NextFunction): Promise<any> {

        try {
            let clientsData = await Client.aggregate([
                {
                    $lookup: {
                        from: 'agency',
                        localField: 'agencyId',
                        foreignField: '_id',
                        as: 'agencyInfo',
                    },
                },
                {
                    $unwind: '$agencyInfo'
                },
                {
                    $project: {
                        agencyName: '$agencyInfo.name',
                        name: 1,
                        totalBill: 1,
                        phoneNumber:1
                    }
                },
                {
                    $sort: {totalBill: -1}
                }
            ])
            if (clientsData.length) {
                return res.status(httpCodes.OK).json({
                    code: httpCodes.OK,
                    data: clientsData,
                    message: Message.CLIENT_FETCHED
                })
            } else {
                return res.status(httpCodes.OK).json({
                    code: httpCodes.OK,
                    data: [],
                    message: Message.CLIENT_FETCHED
                })
            }

        } catch (error) {
            // ********* Error Occured *********
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                status: httpCodes.INTERNAL_SERVER_ERROR,
                error: error,
                message: Message.SOMETHING_WENT_WRONG,
            })
        }
    }


}

export default new onAgencyController()